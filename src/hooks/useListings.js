import { useState, useEffect } from "react";
import { initialListings } from "../data/initialListings";

const API = "/api/listings";

function rowToListing(row) {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    fullUrl: row.full_url,
    icon: "globe",
    tags: row.verified ? ["VERIFIED"] : [],
    checking: false,
  };
}

export function useListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from API on mount; fall back to seed data if API unavailable (local dev)
  useEffect(() => {
    fetch(API)
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then((rows) => setListings(rows.map(rowToListing)))
      .catch(() => setListings(initialListings)) // local dev fallback
      .finally(() => setLoading(false));
  }, []);

  const addListing = async (entry) => {
    const fullUrl = entry.url.startsWith("http")
      ? entry.url
      : `https://${entry.url}`;
    const displayUrl = entry.url.replace(/^https?:\/\//, "");

    // 1. Save to DB
    let newId = null;
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: entry.name, url: displayUrl, full_url: fullUrl }),
      });
      const row = await res.json();
      newId = row.id;

      // Add to local state immediately (unverified, checking)
      setListings((prev) => [
        {
          id: newId,
          name: row.name,
          url: row.url,
          fullUrl: row.full_url,
          icon: "globe",
          tags: [],
          checking: true,
        },
        ...prev,
      ]);
    } catch {
      // API unavailable (local dev) — add optimistically with a temp id
      newId = Date.now();
      setListings((prev) => [
        { id: newId, name: entry.name, url: displayUrl, fullUrl: fullUrl, icon: "globe", tags: [], checking: true },
        ...prev,
      ]);
    }

    // 2. Verify URL in background
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      await fetch(fullUrl, { mode: "no-cors", signal: controller.signal });
      clearTimeout(timeout);

      // 3. Mark verified in DB
      try {
        await fetch(`${API}/${newId}`, { method: "PATCH" });
      } catch { /* local dev — ignore */ }

      setListings((prev) =>
        prev.map((l) =>
          l.id === newId ? { ...l, tags: ["VERIFIED"], checking: false } : l
        )
      );
    } catch {
      setListings((prev) =>
        prev.map((l) => (l.id === newId ? { ...l, checking: false } : l))
      );
    }
  };

  return { listings, loading, addListing };
}
