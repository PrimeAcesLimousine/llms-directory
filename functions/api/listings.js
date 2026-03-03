const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

// GET /api/listings — return all listings ordered newest first
export async function onRequestGet({ env }) {
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
export async function onRequestPost({ env, request }) {
  try {
    const { name, url, full_url } = await request.json();
    if (!name || !url || !full_url) {
      return Response.json({ error: "Missing fields" }, { status: 400, headers: CORS });
    }
    const row = await env.DB.prepare(
      "INSERT INTO listings (name, url, full_url, verified) VALUES (?, ?, ?, 0) RETURNING *"
    ).bind(name, url, full_url).first();
    return Response.json(row, { status: 201, headers: CORS });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500, headers: CORS });
  }
}
