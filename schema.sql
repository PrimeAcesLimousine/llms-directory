-- Run this in your Cloudflare D1 console to set up the database

CREATE TABLE IF NOT EXISTS listings (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  name     TEXT NOT NULL,
  url      TEXT NOT NULL,
  full_url TEXT NOT NULL,
  verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed the 5 initial listings
INSERT INTO listings (name, url, full_url, verified) VALUES
  ('Anthropic Documentation', 'anthropic.com/llms.txt',      'https://anthropic.com/llms.txt',      1),
  ('OpenAI Help Center',      'openai.com/llms.txt',         'https://openai.com/llms.txt',         1),
  ('Mistral AI Labs',         'mistral.ai/llms.txt',         'https://mistral.ai/llms.txt',         1),
  ('DeepMind Research',       'deepmind.google/llms.txt',    'https://deepmind.google/llms.txt',    1),
  ('Cohere Platform',         'cohere.com/llms.txt',         'https://cohere.com/llms.txt',         1);
