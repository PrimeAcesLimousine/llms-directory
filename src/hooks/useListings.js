import { useState, useEffect } from "react";
import { initialListings } from "../data/initialListings";

const STORAGE_KEY = "llms_directory_listings";

export function useListings() {
  const [listings, setListings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return initialListings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  }, [listings]);

  const addListing = (entry) => {
    const newEntry = {
      id: Date.now(),
      name: entry.name,
      url: entry.url.replace(/^https?:\/\//, ""),
      fullUrl: entry.url.startsWith("http") ? entry.url : `https://${entry.url}`,
      icon: "globe",
      tags: [],
    };
    setListings((prev) => [newEntry, ...prev]);
    return newEntry;
  };

  return { listings, addListing };
}
