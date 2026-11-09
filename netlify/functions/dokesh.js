// Dokesh chat endpoint for watch.dokesh.store (Netlify Function).
// Needs the environment variable ANTHROPIC_API_KEY set in Netlify (Project configuration > Environment variables).
const { DOKESH_PERSONA } = require("../../dokesh-persona.js");

const MODEL = process.env.DOKESH_MODEL || "claude-haiku-5-5";
const hits = new Map(); // ip -> [timestamps]  (best effort, per warm instance)

function limited(ip) {
  const now = Date.now(), win = 60 * 60 * 1000;
  const arr = (hits.get(ip) || []).filter(t => now - t < win);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 40; // 40 messages per hour per visitor
}

const json = (status, body) => ({
  statusCode: status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "method" });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return json(503, { error: "not_configured" });
  const ip = event.headers["x-nf-client-connection-ip"] || event.headers["x-forwarded-for"] || "anon";
  if (limited(ip)) return json(429, { error: "rate_limited" });

  let msgs;
  try { msgs = JSON.parse(event.body || "{}").messages; } catch { return json(400, { error: "bad_json" }); }
  if (!Array.isArray(msgs) || !msgs.length) return json(400, { error: "no_messages" });
  msgs = msgs.slice(-12)
    .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map(m => ({ role: m.role, content: m.content.slice(0, 800) }));
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== "user") return json(400, { error: "last_not_user" });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: MODEL, max_tokens: 400, system: DOKESH_PERSONA, messages: msgs }),
    });
    const data = await r.json();
    if (!r.ok) return json(502, { error: "upstream", detail: data?.error?.type || r.status });
    const text = (data.content || []).filter(c => c.type === "text").map(c => c.text).join("").trim();
    return json(200, { text });
  } catch (e) {
    return json(502, { error: "upstream_unreachable" });
  }
};
