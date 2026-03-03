import { useState, useEffect } from "react";
import { initialListings } from "../data/initialListings";

const STORAGE_KEY = "llms_directory_listings";
const STORAGE_VERSION_KEY = "llms_directory_version";
const STORAGE_VERSION = "3"; // bumped: removed AI MODELS/TECHNICAL tags

export function useListings() {
  const [listings, setListings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const version = localStorage.getItem(STORAGE_VERSION_KEY);
      if (stored && version === STORAGE_VERSION) return JSON.parse(stored);
    } catch (_) {}
    return initialListings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
  }, [listings]);

  const addListing = async (entry) => {
    const id = Date.now();
    const fullUrl = entry.url.startsWith("http")
      ? entry.url
      : `https://${entry.url}`;

    // Add immediately with checking: true
    const newEntry = {
      id,
      name: entry.name,
      url: entry.url.replace(/^https?:\/\//, ""),
      fullUrl,
      icon: "globe",
      tags: [],
      checking: true,
    };
    setListings((prev) => [newEntry, ...prev]);

    // Verify in background — no-cors resolves if server exists, throws on network failure
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      await fetch(fullUrl, { mode: "no-cors", signal: controller.signal });
      clearTimeout(timeout);
      // Server responded → VERIFIED
      setListings((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, tags: ["VERIFIED"], checking: false } : l
        )
      );
    } catch {
      // Timed out or unreachable → no tag, just stop checking
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, checking: false } : l))
      );
    }
  };

  return { listings, addListing };
}
