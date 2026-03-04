const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// ── Basic Auth helpers ──────────────────────────────────────────────────────
function checkAuth(request, env) {
  if (!env.ADMIN_PASSWORD) return false; // secret not set → block access
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Basic ")) return false;
  try {
    const decoded = atob(auth.slice(6));
    const colonIdx = decoded.indexOf(":");
    const user = decoded.slice(0, colonIdx);
    const pass = decoded.slice(colonIdx + 1);
    return user === "admin" && pass === env.ADMIN_PASSWORD;
  } catch {
    return false;
  }
}

function unauthorized() {
  return new Response("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="LLM Directory Admin", charset="UTF-8"' },
  });
}

// ── Admin HTML page (server-rendered) ──────────────────────────────────────
function adminPage() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LLM Directory — Admin</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
           background: #F3F4F6; min-height: 100vh; color: #111827; }
    header { background: #fff; border-bottom: 1.5px solid #E5E7EB;
             padding: 0 32px; height: 60px; display: flex; align-items: center;
             justify-content: space-between; position: sticky; top: 0; z-index: 10; }
    header h1 { font-size: 17px; font-weight: 800; color: #111827; }
    header span { font-size: 13px; color: #6B7280; }
    .main { max-width: 1100px; margin: 0 auto; padding: 28px 24px 60px; }
    .stats { display: flex; gap: 14px; margin-bottom: 22px; flex-wrap: wrap; }
    .stat { background: #fff; border: 1.5px solid #E5E7EB; border-radius: 12px;
            padding: 14px 22px; min-width: 120px; }
    .stat-value { font-size: 26px; font-weight: 800; color: #111827; }
    .stat-label { font-size: 12px; color: #9CA3AF; font-weight: 600;
                  text-transform: uppercase; letter-spacing: .05em; margin-top: 2px; }
    .toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }
    .search { display: flex; align-items: center; gap: 8px; background: #fff;
              border: 1.5px solid #E5E7EB; border-radius: 9px; padding: 9px 14px; flex: 1; min-width: 180px; }
    .search input { border: none; outline: none; font-size: 14px; color: #374151; width: 100%; }
    .filter-btns { display: flex; gap: 6px; }
    .filter-btn { background: #F3F4F6; border: 1.5px solid #E5E7EB; border-radius: 8px;
                  padding: 7px 14px; font-size: 13px; font-weight: 600; color: #6B7280;
                  cursor: pointer; }
    .filter-btn.active { background: #EFF6FF; border-color: #2563EB; color: #2563EB; }
    .count { font-size: 13px; font-weight: 600; color: #9CA3AF; white-space: nowrap; }
    .table-wrap { background: #fff; border: 1.5px solid #E5E7EB; border-radius: 14px; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    col.col-num    { width: 48px; }
    col.col-name   { width: 200px; }
    col.col-url    { width: auto; }
    col.col-status { width: 120px; }
    col.col-added  { width: 110px; }
    col.col-actions{ width: 230px; }
    th { padding: 11px 16px; text-align: left; font-size: 11px; font-weight: 700;
         color: #6B7280; text-transform: uppercase; letter-spacing: .05em;
         background: #F9FAFB; border-bottom: 1.5px solid #E5E7EB;
         cursor: pointer; user-select: none; white-space: nowrap; overflow: hidden; }
    th:hover { background: #F3F4F6; }
    th .arrow { margin-left: 4px; color: #D1D5DB; }
    th .arrow.active { color: #2563EB; }
    td { padding: 11px 16px; font-size: 14px; border-bottom: 1px solid #F3F4F6;
         vertical-align: middle; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #F9FAFB; }
    tr.editing td { background: #F0F9FF !important; }
    .name { font-weight: 600; color: #111827; }
    .url-link { color: #2563EB; text-decoration: none; font-size: 13px; }
    .url-link:hover { text-decoration: underline; }
    .badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px;
             font-weight: 700; letter-spacing: .04em; border-radius: 6px;
             padding: 3px 9px; white-space: nowrap; }
    .badge-verified   { background: #DCFCE7; color: #16A34A; }
    .badge-unverified { background: #F3F4F6; color: #9CA3AF; }
    .actions { display: flex; gap: 6px; align-items: center; flex-wrap: nowrap; }
    .btn { border: none; border-radius: 7px; padding: 5px 10px; font-size: 12px;
           font-weight: 700; cursor: pointer; transition: opacity .15s; white-space: nowrap; }
    .btn:hover { opacity: .8; }
    .btn-edit     { background: #EFF6FF; color: #2563EB; }
    .btn-verify   { background: #DCFCE7; color: #16A34A; }
    .btn-unverify { background: #FEF9C3; color: #854D0E; }
    .btn-delete   { background: #FEE2E2; color: #DC2626; }
    .btn-save     { background: #2563EB; color: #fff; }
    .btn-cancel   { background: #F3F4F6; color: #6B7280; }
    .edit-input { border: 1.5px solid #2563EB; border-radius: 6px; padding: 4px 8px;
                  font-size: 13px; width: 100%; outline: none; font-family: inherit; }
    .num { color: #9CA3AF; font-size: 12px; font-weight: 600; text-align: center; }
    .date { color: #9CA3AF; font-size: 13px; }
    .empty { text-align: center; color: #9CA3AF; padding: 48px; }
    .toast { position: fixed; bottom: 24px; right: 24px; background: #111827;
             color: #fff; border-radius: 10px; padding: 12px 20px; font-size: 14px;
             font-weight: 600; opacity: 0; transition: opacity .2s; pointer-events: none; z-index: 99; }
    .toast.show { opacity: 1; }
  </style>
</head>
<body>
<header>
  <h1>🛠 LLM Directory Admin</h1>
  <span id="headerCount">Loading…</span>
</header>

<div class="main">
  <!-- Stats -->
  <div class="stats">
    <div class="stat"><div class="stat-value" id="sTotal">—</div><div class="stat-label">Total</div></div>
    <div class="stat"><div class="stat-value" id="sVerified">—</div><div class="stat-label">Verified</div></div>
    <div class="stat"><div class="stat-value" id="sUnverified">—</div><div class="stat-label">Unverified</div></div>
  </div>

  <!-- Toolbar -->
  <div class="toolbar">
    <div class="search">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="#9CA3AF" stroke-width="2"/>
        <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <input id="searchInput" placeholder="Search by name or URL…" oninput="renderTable()" />
    </div>
    <div class="filter-btns">
      <button class="filter-btn active" onclick="setFilter('all', this)">All</button>
      <button class="filter-btn" onclick="setFilter('verified', this)">✓ Verified</button>
      <button class="filter-btn" onclick="setFilter('unverified', this)">Unverified</button>
    </div>
    <span class="count" id="rowCount"></span>
  </div>

  <!-- Table -->
  <div class="table-wrap">
    <table>
      <colgroup>
        <col class="col-num"/>
        <col class="col-name"/>
        <col class="col-url"/>
        <col class="col-status"/>
        <col class="col-added"/>
        <col class="col-actions"/>
      </colgroup>
      <thead>
        <tr>
          <th style="text-align:center">#</th>
          <th onclick="setSort('name')">Name <span class="arrow" id="arr-name">⇅</span></th>
          <th onclick="setSort('url')">URL <span class="arrow" id="arr-url">⇅</span></th>
          <th onclick="setSort('status')">Status <span class="arrow" id="arr-status">⇅</span></th>
          <th onclick="setSort('added')">Added <span class="arrow" id="arr-added">⇅</span></th>
          <th style="cursor:default">Actions</th>
        </tr>
      </thead>
      <tbody id="tbody"><tr><td colspan="6" class="empty">Loading…</td></tr></tbody>
    </table>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
  let allListings = [];
  let sortKey = 'added';
  let sortDir = 'desc';
  let filterStatus = 'all';

  function fmt(d) {
    if (!d) return '—';
    const dt = new Date(d);
    if (isNaN(dt)) return '—';
    return dt.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }

  function setFilter(f, btn) {
    filterStatus = f;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTable();
  }

  function setSort(key) {
    if (sortKey === key) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else { sortKey = key; sortDir = 'asc'; }
    document.querySelectorAll('.arrow').forEach(a => { a.textContent = '⇅'; a.classList.remove('active'); });
    const arr = document.getElementById('arr-' + key);
    if (arr) { arr.textContent = sortDir === 'asc' ? '↑' : '↓'; arr.classList.add('active'); }
    renderTable();
  }

  function renderTable() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    let rows = allListings.filter(l => {
      const matchQ = l.name.toLowerCase().includes(q) || l.url.toLowerCase().includes(q);
      const isV = l.verified === 1;
      const matchF = filterStatus === 'all' || (filterStatus === 'verified' && isV) || (filterStatus === 'unverified' && !isV);
      return matchQ && matchF;
    });

    rows.sort((a, b) => {
      let av, bv;
      if (sortKey === 'name')   { av = a.name.toLowerCase(); bv = b.name.toLowerCase(); }
      else if (sortKey === 'url')    { av = a.url.toLowerCase();  bv = b.url.toLowerCase(); }
      else if (sortKey === 'status') { av = a.verified; bv = b.verified; }
      else { av = a.created_at || ''; bv = b.created_at || ''; }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    document.getElementById('rowCount').textContent = rows.length + ' listing' + (rows.length !== 1 ? 's' : '');

    const tbody = document.getElementById('tbody');
    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty">No results found.</td></tr>';
      return;
    }

    tbody.innerHTML = rows.map((l, i) => normalRow(l, i + 1)).join('');
  }

  function normalRow(l, num) {
    return \`
      <tr id="row-\${l.id}">
        <td class="num">\${num}</td>
        <td title="\${escHtml(l.name)}"><span class="name">\${escHtml(l.name)}</span></td>
        <td title="\${escHtml(l.full_url)}"><a class="url-link" href="\${escHtml(l.full_url)}" target="_blank" rel="noopener">\${escHtml(l.url)}</a></td>
        <td>\${l.verified
          ? '<span class="badge badge-verified">✓ Verified</span>'
          : '<span class="badge badge-unverified">Unverified</span>'}</td>
        <td class="date">\${fmt(l.created_at)}</td>
        <td>
          <div class="actions">
            <button class="btn btn-edit" onclick="startEdit(\${l.id})">Edit</button>
            \${l.verified
              ? \`<button class="btn btn-unverify" onclick="toggleVerify(\${l.id}, 0)">Unverify</button>\`
              : \`<button class="btn btn-verify"   onclick="toggleVerify(\${l.id}, 1)">Verify</button>\`}
            <button class="btn btn-delete" onclick="deleteListing(\${l.id}, '\${escHtml(l.name)}')">Delete</button>
          </div>
        </td>
      </tr>\`;
  }

  function startEdit(id) {
    const l = allListings.find(x => x.id === id);
    if (!l) return;
    const row = document.getElementById('row-' + id);
    if (!row) return;
    row.classList.add('editing');
    row.innerHTML = \`
      <td class="num">\${row.querySelector('.num') ? row.querySelector('.num').textContent : ''}</td>
      <td><input class="edit-input" id="edit-name-\${id}" value="\${escHtml(l.name)}" placeholder="Name" /></td>
      <td colspan="3"><input class="edit-input" id="edit-url-\${id}" value="\${escHtml(l.full_url)}" placeholder="https://example.com/llms.txt" /></td>
      <td>
        <div class="actions">
          <button class="btn btn-save"   onclick="saveEdit(\${id})">Save</button>
          <button class="btn btn-cancel" onclick="cancelEdit(\${id})">Cancel</button>
        </div>
      </td>\`;
    document.getElementById('edit-name-' + id).focus();
  }

  function cancelEdit(id) {
    const l = allListings.find(x => x.id === id);
    if (!l) return;
    const rows = document.querySelectorAll('#tbody tr');
    let num = 1;
    rows.forEach(r => { if (r.id === 'row-' + id) {} else num++; });
    // just re-render whole table to restore
    renderTable();
  }

  async function saveEdit(id) {
    const nameEl = document.getElementById('edit-name-' + id);
    const urlEl  = document.getElementById('edit-url-'  + id);
    if (!nameEl || !urlEl) return;
    const newName    = nameEl.value.trim();
    const newFullUrl = urlEl.value.trim();
    if (!newName || !newFullUrl) { showToast('Name and URL are required'); return; }
    const newUrl = newFullUrl.replace(/^https?:\\/\\//, '');
    try {
      const res = await fetch('/api/admin/listings/' + id + '/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, url: newUrl, full_url: newFullUrl }),
      });
      if (!res.ok) throw new Error('Save failed');
      const l = allListings.find(x => x.id === id);
      if (l) { l.name = newName; l.url = newUrl; l.full_url = newFullUrl; }
      renderTable();
      showToast('✏️ Saved changes');
    } catch { showToast('Error saving changes'); }
  }

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  async function loadListings() {
    try {
      const res = await fetch('/api/admin/listings');
      if (!res.ok) throw new Error('Failed');
      allListings = await res.json();
      const total = allListings.length;
      const verified = allListings.filter(l => l.verified === 1).length;
      document.getElementById('sTotal').textContent = total;
      document.getElementById('sVerified').textContent = verified;
      document.getElementById('sUnverified').textContent = total - verified;
      document.getElementById('headerCount').textContent = total + ' listings';
      // default sort arrow
      const arr = document.getElementById('arr-added');
      if (arr) { arr.textContent = '↓'; arr.classList.add('active'); }
      renderTable();
    } catch (e) {
      document.getElementById('tbody').innerHTML = '<tr><td colspan="6" class="empty">Failed to load listings.</td></tr>';
    }
  }

  async function toggleVerify(id, newVal) {
    try {
      await fetch('/api/admin/listings/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: newVal }),
      });
      const l = allListings.find(x => x.id === id);
      if (l) l.verified = newVal;
      renderTable();
      showToast(newVal ? '✓ Marked as verified' : 'Marked as unverified');
    } catch { showToast('Error updating listing'); }
  }

  async function deleteListing(id, name) {
    if (!confirm('Delete "' + name + '"?\\nThis cannot be undone.')) return;
    try {
      await fetch('/api/admin/listings/' + id, { method: 'DELETE' });
      allListings = allListings.filter(x => x.id !== id);
      const total = allListings.length;
      const verified = allListings.filter(l => l.verified === 1).length;
      document.getElementById('sTotal').textContent = total;
      document.getElementById('sVerified').textContent = verified;
      document.getElementById('sUnverified').textContent = total - verified;
      document.getElementById('headerCount').textContent = total + ' listings';
      renderTable();
      showToast('🗑 Deleted "' + name + '"');
    } catch { showToast('Error deleting listing'); }
  }

  loadListings();
</script>
</body>
</html>`;
  return new Response(html, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
}

// ── Main fetch handler ──────────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    // ── Admin routes (all require Basic Auth) ───────────────────────────────
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      if (!checkAuth(request, env)) return unauthorized();

      // GET /admin — serve the admin HTML page
      if (pathname === "/admin" && request.method === "GET") {
        return adminPage();
      }

      // GET /api/admin/listings — all listings
      if (pathname === "/api/admin/listings" && request.method === "GET") {
        try {
          const { results } = await env.DB.prepare(
            "SELECT * FROM listings ORDER BY created_at DESC"
          ).all();
          return Response.json(results, { headers: CORS });
        } catch (err) {
          return Response.json({ error: err.message }, { status: 500, headers: CORS });
        }
      }

      // PATCH /api/admin/listings/:id — set verified to 0 or 1
      const adminPatch = pathname.match(/^\/api\/admin\/listings\/(\d+)$/);
      if (adminPatch && request.method === "PATCH") {
        try {
          const id = adminPatch[1];
          const { verified } = await request.json();
          await env.DB.prepare(
            "UPDATE listings SET verified = ? WHERE id = ?"
          ).bind(verified ? 1 : 0, id).run();
          return Response.json({ success: true }, { headers: CORS });
        } catch (err) {
          return Response.json({ error: err.message }, { status: 500, headers: CORS });
        }
      }

      // PUT /api/admin/listings/:id/edit — update name, url, full_url
      const adminEdit = pathname.match(/^\/api\/admin\/listings\/(\d+)\/edit$/);
      if (adminEdit && request.method === "PUT") {
        try {
          const id = adminEdit[1];
          const { name, url: listingUrl, full_url } = await request.json();
          if (!name || !listingUrl || !full_url) {
            return Response.json({ error: "Missing fields" }, { status: 400, headers: CORS });
          }
          await env.DB.prepare(
            "UPDATE listings SET name = ?, url = ?, full_url = ? WHERE id = ?"
          ).bind(name, listingUrl, full_url, id).run();
          return Response.json({ success: true }, { headers: CORS });
        } catch (err) {
          return Response.json({ error: err.message }, { status: 500, headers: CORS });
        }
      }

      // DELETE /api/admin/listings/:id — permanently delete a listing
      const adminDelete = pathname.match(/^\/api\/admin\/listings\/(\d+)$/);
      if (adminDelete && request.method === "DELETE") {
        try {
          const id = adminDelete[1];
          await env.DB.prepare(
            "DELETE FROM listings WHERE id = ?"
          ).bind(id).run();
          return Response.json({ success: true }, { headers: CORS });
        } catch (err) {
          return Response.json({ error: err.message }, { status: 500, headers: CORS });
        }
      }

      return new Response("Not Found", { status: 404 });
    }

    // ── Public routes ───────────────────────────────────────────────────────

    // GET /api/listings — return all listings
    if (pathname === "/api/listings" && request.method === "GET") {
      try {
        const { results } = await env.DB.prepare(
          "SELECT * FROM listings ORDER BY created_at DESC"
        ).all();
        return Response.json(results, { headers: CORS });
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500, headers: CORS });
      }
    }

    // POST /api/listings — insert a new listing
    if (pathname === "/api/listings" && request.method === "POST") {
      try {
        const { name, url: listingUrl, full_url } = await request.json();
        if (!name || !listingUrl || !full_url) {
          return Response.json({ error: "Missing fields" }, { status: 400, headers: CORS });
        }
        // INSERT OR IGNORE prevents duplicate full_url entries
        await env.DB.prepare(
          "INSERT OR IGNORE INTO listings (name, url, full_url, verified) VALUES (?, ?, ?, 0)"
        ).bind(name, listingUrl, full_url).run();
        const row = await env.DB.prepare(
          "SELECT * FROM listings WHERE full_url = ?"
        ).bind(full_url).first();
        if (!row) {
          return Response.json({ error: "Insert failed" }, { status: 500, headers: CORS });
        }
        return Response.json(row, { status: 201, headers: CORS });
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500, headers: CORS });
      }
    }

    // PATCH /api/listings/:id — mark a listing as verified (used by frontend auto-verify)
    const patchMatch = pathname.match(/^\/api\/listings\/(\d+)$/);
    if (patchMatch && request.method === "PATCH") {
      try {
        const id = patchMatch[1];
        await env.DB.prepare(
          "UPDATE listings SET verified = 1 WHERE id = ?"
        ).bind(id).run();
        return Response.json({ success: true }, { headers: CORS });
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500, headers: CORS });
      }
    }

    // Everything else — serve static assets (React app)
    return env.ASSETS.fetch(request);
  },
};
