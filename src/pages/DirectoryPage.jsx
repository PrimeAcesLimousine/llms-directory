import { useState, useEffect } from "react";
import { SearchIcon } from "../components/Icon";
import { useBreakpoint } from "../context/BreakpointContext";

const PAGE_SIZE = 25;

const COLUMNS = [
  { key: "name",     label: "Name",    sortable: true },
  { key: "url",      label: "URL",     sortable: true },
  { key: "status",   label: "Status",  sortable: true },
  { key: "added",    label: "Added",   sortable: true },
];

function SortArrow({ dir }) {
  if (!dir) return <span style={arrowStyle}>⇅</span>;
  return <span style={{ ...arrowStyle, color: "#2563EB" }}>{dir === "asc" ? "↑" : "↓"}</span>;
}

function StatusBadge({ listing }) {
  if (listing.checking) {
    return (
      <span style={checkingBadgeStyle}>
        <span style={spinnerStyle} /> Checking…
      </span>
    );
  }
  if (listing.tags && listing.tags.includes("VERIFIED")) {
    return <span style={verifiedBadgeStyle}>✓ Verified</span>;
  }
  return <span style={unverifiedBadgeStyle}>Unverified</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function DirectoryPage({ listings, loading, onNavigate }) {
  const [query, setQuery]         = useState("");
  const [sortKey, setSortKey]     = useState("name");
  const [sortDir, setSortDir]     = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all"); // all | verified | unverified
  const [page, setPage]           = useState(1);
  const { isDesktop } = useBreakpoint();

  // Reset to page 1 when filters/sort change
  useEffect(() => { setPage(1); }, [query, statusFilter, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const q = query.toLowerCase();
  const filtered = listings.filter((l) => {
    const matchesQuery =
      l.name.toLowerCase().includes(q) || l.url.toLowerCase().includes(q);
    const isVerified = l.tags && l.tags.includes("VERIFIED");
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && isVerified) ||
      (statusFilter === "unverified" && !isVerified);
    return matchesQuery && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    let aVal, bVal;
    if (sortKey === "name")   { aVal = a.name.toLowerCase(); bVal = b.name.toLowerCase(); }
    else if (sortKey === "url")    { aVal = a.url.toLowerCase();  bVal = b.url.toLowerCase(); }
    else if (sortKey === "status") {
      aVal = a.tags && a.tags.includes("VERIFIED") ? 0 : 1;
      bVal = b.tags && b.tags.includes("VERIFIED") ? 0 : 1;
    }
    else if (sortKey === "added") {
      aVal = a.created_at || "";
      bVal = b.created_at || "";
    }
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const startItem  = sorted.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endItem    = Math.min(page * PAGE_SIZE, sorted.length);

  const toolbar = (
    <div style={toolbarStyle}>
      {/* Search */}
      <div style={searchWrapStyle}>
        <SearchIcon />
        <input
          style={searchInputStyle}
          placeholder="Search by name or URL…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Status filter */}
      <div style={filterGroupStyle}>
        {["all", "verified", "unverified"].map((f) => (
          <button
            key={f}
            style={{ ...filterBtnStyle, ...(statusFilter === f ? filterBtnActiveStyle : {}) }}
            onClick={() => setStatusFilter(f)}
          >
            {f === "all" ? "All" : f === "verified" ? "✓ Verified" : "Unverified"}
          </button>
        ))}
      </div>

      {/* Count */}
      <span style={countStyle}>{sorted.length} listing{sorted.length !== 1 ? "s" : ""}</span>
    </div>
  );

  // ── Desktop table ──
  if (isDesktop) {
    return (
      <div>
        {toolbar}

        {loading ? (
          <p style={emptyStyle}>Loading listings…</p>
        ) : sorted.length === 0 ? (
          <p style={emptyStyle}>No results found.</p>
        ) : (
          <div style={tableWrapStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thNumStyle}>#</th>
                  {COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      style={{ ...thStyle, ...(col.key === "added" ? thNarrowStyle : {}) }}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      <span style={thInnerStyle}>
                        {col.label}
                        {col.sortable && (
                          <SortArrow dir={sortKey === col.key ? sortDir : null} />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((listing, i) => {
                  const rowNum = (page - 1) * PAGE_SIZE + i + 1;
                  return (
                    <tr key={listing.id} style={i % 2 === 0 ? trEvenStyle : trOddStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#EFF6FF"}
                      onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#F9FAFB"}
                    >
                      <td style={tdNumStyle}>{rowNum}</td>
                      <td style={tdStyle}>
                        <span style={nameCellStyle}>{listing.name}</span>
                      </td>
                      <td style={tdStyle}>
                        <a
                          href={listing.fullUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={linkStyle}
                        >
                          {listing.url}
                        </a>
                      </td>
                      <td style={tdStyle}>
                        <StatusBadge listing={listing} />
                      </td>
                      <td style={{ ...tdStyle, ...tdNarrowStyle }}>
                        {formatDate(listing.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination footer */}
            {totalPages > 1 && (
              <div style={paginationStyle}>
                <button
                  style={{ ...pageNavBtnStyle, ...(page === 1 ? pageNavDisabledStyle : {}) }}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Prev
                </button>

                <span style={pageInfoStyle}>
                  {startItem}–{endItem} of {sorted.length}
                </span>

                <button
                  style={{ ...pageNavBtnStyle, ...(page === totalPages ? pageNavDisabledStyle : {}) }}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Mobile table ──
  return (
    <div style={mobilePageStyle}>
      {/* Mobile header */}
      <div style={mobileHeaderStyle}>
        <div style={mobileHeaderRowStyle}>
          <h1 style={mobileTitleStyle}>Directory</h1>
          <button onClick={() => onNavigate("submit")} style={mobileSubmitBtnStyle}>
            + Submit
          </button>
        </div>
      </div>

      <div style={{ padding: "12px 16px 0" }}>
        <div style={{ ...searchWrapStyle, margin: 0 }}>
          <SearchIcon />
          <input
            style={searchInputStyle}
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Mobile status filter */}
        <div style={{ ...filterGroupStyle, marginTop: 10 }}>
          {["all", "verified", "unverified"].map((f) => (
            <button
              key={f}
              style={{ ...filterBtnStyle, ...(statusFilter === f ? filterBtnActiveStyle : {}) }}
              onClick={() => setStatusFilter(f)}
            >
              {f === "all" ? "All" : f === "verified" ? "✓ Verified" : "Unverified"}
            </button>
          ))}
        </div>

        <p style={mobileCountStyle}>{sorted.length} listing{sorted.length !== 1 ? "s" : ""}</p>
      </div>

      {loading ? (
        <p style={emptyStyle}>Loading listings…</p>
      ) : sorted.length === 0 ? (
        <p style={emptyStyle}>No results found.</p>
      ) : (
        <div style={{ padding: "0 16px 100px", overflowX: "auto" }}>
          <table style={{ ...tableStyle, fontSize: 13 }}>
            <thead>
              <tr>
                <th style={thStyle} onClick={() => handleSort("name")}>
                  <span style={thInnerStyle}>Name <SortArrow dir={sortKey === "name" ? sortDir : null} /></span>
                </th>
                <th style={thStyle} onClick={() => handleSort("status")}>
                  <span style={thInnerStyle}>Status <SortArrow dir={sortKey === "status" ? sortDir : null} /></span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((listing, i) => (
                <tr key={listing.id} style={i % 2 === 0 ? trEvenStyle : trOddStyle}>
                  <td style={tdStyle}>
                    <span style={nameCellStyle}>{listing.name}</span>
                    <a
                      href={listing.fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ ...linkStyle, display: "block", marginTop: 2 }}
                    >
                      {listing.url}
                    </a>
                  </td>
                  <td style={{ ...tdStyle, verticalAlign: "middle" }}>
                    <StatusBadge listing={listing} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile pagination */}
          {totalPages > 1 && (
            <div style={{ ...paginationStyle, margin: "16px 0 0" }}>
              <button
                style={{ ...pageNavBtnStyle, ...(page === 1 ? pageNavDisabledStyle : {}) }}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Prev
              </button>
              <span style={pageInfoStyle}>{startItem}–{endItem} of {sorted.length}</span>
              <button
                style={{ ...pageNavBtnStyle, ...(page === totalPages ? pageNavDisabledStyle : {}) }}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Shared ── */
const toolbarStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  margin: "28px 0 16px",
  flexWrap: "wrap",
};

const searchWrapStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  background: "#fff",
  borderRadius: 10,
  padding: "10px 14px",
  border: "1.5px solid #E5E7EB",
  flex: 1,
  minWidth: 180,
};

const searchInputStyle = {
  border: "none",
  outline: "none",
  fontSize: 14,
  color: "#374151",
  width: "100%",
  background: "transparent",
};

const filterGroupStyle = {
  display: "flex",
  gap: 6,
};

const filterBtnStyle = {
  background: "#F3F4F6",
  border: "1.5px solid #E5E7EB",
  borderRadius: 8,
  padding: "7px 14px",
  fontSize: 13,
  fontWeight: 600,
  color: "#6B7280",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const filterBtnActiveStyle = {
  background: "#EFF6FF",
  borderColor: "#2563EB",
  color: "#2563EB",
};

const countStyle = {
  fontSize: 13,
  fontWeight: 600,
  color: "#9CA3AF",
  whiteSpace: "nowrap",
};

const emptyStyle = {
  textAlign: "center",
  color: "#9CA3AF",
  marginTop: 48,
};

/* ── Table ── */
const tableWrapStyle = {
  background: "#fff",
  borderRadius: 14,
  border: "1.5px solid #E5E7EB",
  overflow: "hidden",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  tableLayout: "auto",
};

const thStyle = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: 12,
  fontWeight: 700,
  color: "#6B7280",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  background: "#F9FAFB",
  borderBottom: "1.5px solid #E5E7EB",
  cursor: "pointer",
  userSelect: "none",
  whiteSpace: "nowrap",
};

const thNarrowStyle = {
  width: 120,
};

const thNumStyle = {
  ...thStyle,
  width: 48,
  textAlign: "center",
  cursor: "default",
};

const thInnerStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const arrowStyle = {
  fontSize: 12,
  color: "#D1D5DB",
};

const trEvenStyle = { background: "#fff" };
const trOddStyle  = { background: "#F9FAFB" };

const tdStyle = {
  padding: "13px 16px",
  fontSize: 14,
  color: "#374151",
  borderBottom: "1px solid #F3F4F6",
  verticalAlign: "middle",
};

const tdNumStyle = {
  ...tdStyle,
  textAlign: "center",
  color: "#9CA3AF",
  fontSize: 12,
  fontWeight: 600,
};

const tdNarrowStyle = {
  color: "#9CA3AF",
  fontSize: 13,
};

const nameCellStyle = {
  fontWeight: 600,
  color: "#111827",
  display: "block",
};

const linkStyle = {
  color: "#2563EB",
  textDecoration: "none",
  fontSize: 13,
};

/* ── Status badges ── */
const verifiedBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.04em",
  background: "#DCFCE7",
  color: "#16A34A",
  borderRadius: 6,
  padding: "3px 9px",
  whiteSpace: "nowrap",
};

const unverifiedBadgeStyle = {
  ...verifiedBadgeStyle,
  background: "#F3F4F6",
  color: "#9CA3AF",
};

const checkingBadgeStyle = {
  ...verifiedBadgeStyle,
  background: "#FEF9C3",
  color: "#854D0E",
};

const spinnerStyle = {
  display: "inline-block",
  width: 10,
  height: 10,
  borderRadius: "50%",
  borderWidth: 2,
  borderStyle: "solid",
  borderColor: "#D1D5DB",
  borderTopColor: "#6B7280",
  animation: "spin 0.7s linear infinite",
};

/* ── Mobile ── */
const mobilePageStyle = { background: "#F3F4F6", minHeight: "100vh" };

const mobileHeaderStyle = {
  background: "#fff",
  padding: "20px 16px 14px",
  borderBottom: "1px solid #F3F4F6",
};

const mobileHeaderRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const mobileTitleStyle = {
  fontSize: 20,
  fontWeight: 800,
  color: "#111827",
  margin: 0,
};

const mobileSubmitBtnStyle = {
  background: "#EFF6FF",
  color: "#2563EB",
  border: "none",
  borderRadius: 10,
  padding: "9px 14px",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};

const mobileCountStyle = {
  fontSize: 12,
  color: "#9CA3AF",
  margin: "8px 0 4px",
};

/* ── Pagination ── */
const paginationStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  padding: "14px 20px",
  borderTop: "1.5px solid #E5E7EB",
  background: "#F9FAFB",
};

const pageNavBtnStyle = {
  background: "#fff",
  border: "1.5px solid #E5E7EB",
  borderRadius: 8,
  padding: "7px 16px",
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  cursor: "pointer",
};

const pageNavDisabledStyle = {
  opacity: 0.35,
  cursor: "default",
};

const pageInfoStyle = {
  fontSize: 13,
  color: "#6B7280",
  fontWeight: 500,
};
