/**
 * import-listings.mjs
 * Fetches llms.txt URLs from GitHub Awesome-llms-txt, deduplicates,
 * prioritises prominent tech brands, and outputs import.sql (top 500).
 *
 * Usage:
 *   node scripts/import-listings.mjs
 *
 * Then execute the SQL:
 *   PATH=/usr/local/bin:$PATH npx wrangler d1 execute llm-directory-db \
 *     --file=scripts/import.sql --remote
 */

import { writeFileSync } from "node:fs";

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
  "https://platform.openai.com/docs/llms.txt",
];

// Well-known tech brands — listed first in the output
const PRIORITY_KEYWORDS = [
  "anthropic", "openai", "claude", "mistral", "cohere", "perplexity",
  "groq", "openrouter", "elevenlabs", "huggingface", "deepmind",
  "cloudflare", "stripe", "docker", "github", "vercel", "netlify",
  "supabase", "planetscale", "neon", "turso", "pinecone", "weaviate",
  "nextjs", "svelte", "vuejs", "react", "angular", "vite", "bun",
  "deno", "nodejs", "python", "tailwindcss", "shadcn", "drizzle",
  "langchain", "llamaindex", "cursor", "replit", "mintlify",
  "axiom", "modelcontextprotocol", "zapier", "resend", "upstash",
  "pydantic", "fastapi", "pytorch", "tensorflow", "keras",
];

// Friendly display names for known domains
const NAME_MAP = {
  "anthropic":          "Anthropic",
  "openai":             "OpenAI",
  "claude":             "Claude (Anthropic)",
  "mistral":            "Mistral AI",
  "cohere":             "Cohere",
  "perplexity":         "Perplexity AI",
  "groq":               "Groq",
  "openrouter":         "OpenRouter",
  "elevenlabs":         "ElevenLabs",
  "huggingface":        "Hugging Face",
  "cloudflare":         "Cloudflare",
  "stripe":             "Stripe",
  "docker":             "Docker",
  "github":             "GitHub",
  "vercel":             "Vercel",
  "netlify":            "Netlify",
  "supabase":           "Supabase",
  "planetscale":        "PlanetScale",
  "neon":               "Neon",
  "turso":              "Turso",
  "pinecone":           "Pinecone",
  "weaviate":           "Weaviate",
  "nextjs":             "Next.js",
  "svelte":             "Svelte",
  "vuejs":              "Vue.js",
  "vite":               "Vite",
  "tailwindcss":        "Tailwind CSS",
  "shadcn":             "shadcn/ui",
  "drizzle":            "Drizzle ORM",
  "langchain":          "LangChain",
  "llamaindex":         "LlamaIndex",
  "cursor":             "Cursor",
  "replit":             "Replit",
  "mintlify":           "Mintlify",
  "axiom":              "Axiom",
  "modelcontextprotocol": "Model Context Protocol",
  "zapier":             "Zapier",
  "resend":             "Resend",
  "upstash":            "Upstash",
  "pydantic":           "Pydantic",
  "fastapi":            "FastAPI",
  "pytorch":            "PyTorch",
  "tensorflow":         "TensorFlow",
  "deno":               "Deno",
  "bun":                "Bun",
  "fireworks":          "Fireworks AI",
};

function extractName(url) {
  try {
    const { hostname } = new URL(url);
    // Strip common doc subdomains to get the brand
    const sub = hostname.replace(
      /^(docs|developers?|dev|api|help|support|learn|www|console|platform|cloud|sdk|build)\./,
      ""
    );
    const brand = sub.split(".")[0].toLowerCase();
    if (NAME_MAP[brand]) return NAME_MAP[brand];
    // Title-case the brand slug
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  } catch {
    return url;
  }
}

function displayUrl(url) {
  return url.replace(/^https?:\/\//, "");
}

function escape(s) {
  return String(s).replace(/'/g, "''");
}

function isPriority(url) {
  const lower = url.toLowerCase();
  return PRIORITY_KEYWORDS.some((kw) => lower.includes(kw));
}

async function main() {
  console.log("📥  Fetching GitHub Awesome-llms-txt …");
  const res = await fetch(GITHUB_URL);
  if (!res.ok) throw new Error(`GitHub fetch failed: ${res.status}`);
  const githubUrls = await res.json(); // string[]
  console.log(`    ${githubUrls.length} URLs from GitHub`);

  // Merge with extra curated URLs
  const all = [...new Set([...githubUrls, ...EXTRA_URLS])];
  console.log(`    ${all.length} URLs after merging extras`);

  // Deduplicate by normalised full_url
  const seen = new Set();
  const unique = [];
  for (const url of all) {
    const key = url.trim().toLowerCase().replace(/\/$/, "");
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(url.trim());
    }
  }
  console.log(`    ${unique.length} unique URLs after deduplication`);

  // Sort: priority brands first, then alphabetical
  const priority = unique.filter(isPriority).sort();
  const rest     = unique.filter((u) => !isPriority(u)).sort();
  const sorted   = [...priority, ...rest];
  console.log(`    ${priority.length} priority (well-known) + ${rest.length} others`);

  // Cap at 500
  const top500 = sorted.slice(0, 500);
  console.log(`\n✅  Selected ${top500.length} listings\n`);

  // Show preview
  console.log("Top 20 listings:");
  top500.slice(0, 20).forEach((u, i) =>
    console.log(`  ${String(i + 1).padStart(2)}. ${extractName(u).padEnd(28)} ${displayUrl(u)}`)
  );
  console.log("  …\n");

  // Build SQL
  const values = top500
    .map((url) => {
      const name = extractName(url);
      const dUrl = displayUrl(url);
      return `  ('${escape(name)}', '${escape(dUrl)}', '${escape(url)}', 1)`;
    })
    .join(",\n");

  const sql = `-- ============================================================
-- LLM Directory — bulk import (${top500.length} listings)
-- Generated: ${new Date().toISOString()}
-- Source: github.com/SecretiveShell/Awesome-llms-txt
-- ============================================================
-- Run with:
--   PATH=/usr/local/bin:$PATH npx wrangler d1 execute llm-directory-db \\
--     --file=scripts/import.sql --remote
-- ============================================================

INSERT OR IGNORE INTO listings (name, url, full_url, verified)
VALUES
${values};
`;

  const outPath = "/Users/LawrenceLim/Claude Project - LLMs Directory/scripts/import.sql";
  writeFileSync(outPath, sql, "utf8");
  console.log(`📄  SQL written to scripts/import.sql`);
  console.log(`\n▶️   Now run:`);
  console.log(
    `    PATH=/usr/local/bin:$PATH npx wrangler d1 execute llm-directory-db --file=scripts/import.sql --remote\n`
  );
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
