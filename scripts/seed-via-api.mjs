/**
 * seed-via-api.mjs
 * Reads import.sql's data and POSTs each listing to the live API.
 * No authentication required.
 *
 * Usage:  node scripts/seed-via-api.mjs
 */

const API = "https://llms-directory.lawrence-lim.workers.dev/api/listings";
const DELAY_MS = 150; // be polite — don't hammer the API

const GITHUB_URL =
  "https://raw.githubusercontent.com/SecretiveShell/Awesome-llms-txt/master/json/llms-txt.json";

const EXTRA_URLS = [
  "https://claude.com/llms.txt",
  "https://cursor.com/llms.txt",
  "https://svelte.dev/llms.txt",
  "https://modelcontextprotocol.io/llms.txt",
  "https://bun.sh/llms.txt",
  "https://nextjs.org/docs/llms.txt",
  "https://orm.drizzle.team/llms.txt",
];

const PRIORITY_KEYWORDS = [
  "anthropic", "openai", "claude", "mistral", "cohere", "perplexity",
  "groq", "openrouter", "elevenlabs", "huggingface", "deepmind",
  "cloudflare", "stripe", "docker", "github", "vercel", "netlify",
  "supabase", "planetscale", "neon", "turso", "pinecone", "weaviate",
  "nextjs", "svelte", "vuejs", "react", "angular", "vite", "bun",
  "deno", "nodejs", "python", "tailwindcss", "shadcn", "drizzle",
  "langchain", "llamaindex", "cursor", "replit", "mintlify",
  "axiom", "modelcontextprotocol", "zapier", "resend", "upstash",
  "pydantic", "fastapi", "pytorch", "tensorflow", "fireworks",
];

const NAME_MAP = {
  "anthropic": "Anthropic", "openai": "OpenAI", "claude": "Claude (Anthropic)",
  "mistral": "Mistral AI", "cohere": "Cohere", "perplexity": "Perplexity AI",
  "groq": "Groq", "openrouter": "OpenRouter", "elevenlabs": "ElevenLabs",
  "huggingface": "Hugging Face", "cloudflare": "Cloudflare", "stripe": "Stripe",
  "docker": "Docker", "github": "GitHub", "vercel": "Vercel", "netlify": "Netlify",
  "supabase": "Supabase", "planetscale": "PlanetScale", "neon": "Neon",
  "turso": "Turso", "pinecone": "Pinecone", "weaviate": "Weaviate",
  "nextjs": "Next.js", "svelte": "Svelte", "vuejs": "Vue.js", "vite": "Vite",
  "tailwindcss": "Tailwind CSS", "shadcn": "shadcn/ui", "drizzle": "Drizzle ORM",
  "langchain": "LangChain", "llamaindex": "LlamaIndex", "cursor": "Cursor",
  "replit": "Replit", "mintlify": "Mintlify", "axiom": "Axiom",
  "modelcontextprotocol": "Model Context Protocol", "zapier": "Zapier",
  "resend": "Resend", "upstash": "Upstash", "pydantic": "Pydantic",
  "fastapi": "FastAPI", "pytorch": "PyTorch", "tensorflow": "TensorFlow",
  "deno": "Deno", "bun": "Bun", "fireworks": "Fireworks AI",
};

function extractName(url) {
  try {
    const { hostname } = new URL(url);
    const sub = hostname.replace(
      /^(docs|developers?|dev|api|help|support|learn|www|console|platform|cloud|sdk|build)\./,
      ""
    );
    const brand = sub.split(".")[0].toLowerCase();
    return NAME_MAP[brand] || (brand.charAt(0).toUpperCase() + brand.slice(1));
  } catch { return url; }
}

function displayUrl(url) {
  return url.replace(/^https?:\/\//, "");
}

function isPriority(url) {
  const lower = url.toLowerCase();
  return PRIORITY_KEYWORDS.some((kw) => lower.includes(kw));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("📥  Fetching GitHub Awesome-llms-txt …");
  const res = await fetch(GITHUB_URL);
  const githubUrls = await res.json();
  console.log(`    ${githubUrls.length} URLs from GitHub`);

  const all = [...new Set([...githubUrls, ...EXTRA_URLS])];
  const seen = new Set();
  const unique = [];
  for (const url of all) {
    const key = url.trim().toLowerCase().replace(/\/$/, "");
    if (!seen.has(key)) { seen.add(key); unique.push(url.trim()); }
  }
  console.log(`    ${unique.length} unique URLs after deduplication`);

  const priority = unique.filter(isPriority).sort();
  const rest     = unique.filter((u) => !isPriority(u)).sort();
  const top500   = [...priority, ...rest].slice(0, 500);
  console.log(`    ${priority.length} priority + ${Math.min(rest.length, 500 - priority.length)} others = ${top500.length} total\n`);

  let inserted = 0, skipped = 0, failed = 0;

  for (let i = 0; i < top500.length; i++) {
    const url = top500[i];
    const name = extractName(url);
    const dUrl = displayUrl(url);

    try {
      const r = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url: dUrl, full_url: url }),
      });
      const data = await r.json();
      if (r.status === 201) {
        inserted++;
        if (inserted <= 5 || inserted % 50 === 0) {
          console.log(`  ✅ [${i + 1}/500] ${name}`);
        }
      } else if (data.error?.includes("UNIQUE") || r.status === 200) {
        skipped++;
      } else {
        failed++;
        console.log(`  ⚠️  [${i + 1}] ${name} — ${data.error || r.status}`);
      }
    } catch (err) {
      failed++;
      console.log(`  ❌ [${i + 1}] ${name} — ${err.message}`);
    }

    await sleep(DELAY_MS);
  }

  console.log(`\n🎉  Done!`);
  console.log(`    Inserted : ${inserted}`);
  console.log(`    Skipped  : ${skipped} (already existed)`);
  console.log(`    Failed   : ${failed}`);
}

main().catch((err) => { console.error("Error:", err.message); process.exit(1); });
