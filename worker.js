const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

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
        const row = await env.DB.prepare(
          "INSERT INTO listings (name, url, full_url, verified) VALUES (?, ?, ?, 0) RETURNING *"
        ).bind(name, listingUrl, full_url).first();
        return Response.json(row, { status: 201, headers: CORS });
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500, headers: CORS });
      }
    }

    // PATCH /api/listings/:id — mark a listing as verified
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
