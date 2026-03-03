const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

// PATCH /api/listings/:id — mark a listing as verified
export async function onRequestPatch({ env, params }) {
  try {
    const { id } = params;
    await env.DB.prepare(
      "UPDATE listings SET verified = 1 WHERE id = ?"
    ).bind(id).run();
    return Response.json({ success: true }, { headers: CORS });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500, headers: CORS });
  }
}
