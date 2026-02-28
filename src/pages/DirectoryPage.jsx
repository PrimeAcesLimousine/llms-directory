import { useState } from "react";
import { ListingCard } from "../components/ListingCard";
import { SearchIcon, InfoIcon } from "../components/Icon";
import { useBreakpoint } from "../context/BreakpointContext";

export function DirectoryPage({ listings, onNavigate }) {
  const [query, setQuery] = useState("");
  const { isDesktop } = useBreakpoint();

  const q = query.toLowerCase();
  const filtered = listings.filter((l) =>
    l.name.toLowerCase().includes(q) ||
    l.url.toLowerCase().includes(q)
  );

  const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  if (isDesktop) {
    return (
      <div>
        {/* Desktop toolbar */}
        <div style={desktopToolbarStyle}>
          <div style={desktopSearchWrapStyle}>
            <SearchIcon />
            <input
              style={desktopSearchInputStyle}
              placeholder="Search websites with llms.txt"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <span style={countBadgeStyle}>{sorted.length} listing{sorted.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Desktop 2-col grid */}
        {sorted.length === 0 ? (
          <p style={{ textAlign: "center", color: "#9CA3AF", marginTop: 40 }}>No results found.</p>
        ) : (
          <div style={desktopGridStyle}>
            {sorted.map((listing) => (
              <ListingCard key={listing.id} listing={listing} showIcon={true} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Mobile layout
  return (
    <div style={mobilePageStyle}>
      <div style={mobileHeaderStyle}>
        <div style={mobileHeaderRowStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={infoBubbleStyle}>
              <InfoIcon color="#2563EB" />
            </div>
            <h1 style={mobileTitleStyle}>LLM Directory</h1>
          </div>
          <button onClick={() => onNavigate("submit")} style={mobileSubmitBtnStyle}>
            + SUBMIT
          </button>
        </div>
      </div>

      <div style={mobileSearchWrapStyle}>
        <SearchIcon />
        <input
          style={mobileSearchInputStyle}
          placeholder="Search websites with llms.txt"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div style={{ padding: "0 16px 8px" }}>
        <p style={mobileCountStyle}>{sorted.length} listing{sorted.length !== 1 ? "s" : ""}</p>
      </div>

      <div style={{ padding: "0 16px 100px" }}>
        {sorted.length === 0 ? (
          <p style={{ textAlign: "center", color: "#9CA3AF", marginTop: 40 }}>No results found.</p>
        ) : (
          sorted.map((listing) => (
            <ListingCard key={listing.id} listing={listing} showIcon={true} />
          ))
        )}
      </div>
    </div>
  );
}

/* ── Desktop styles ── */
const desktopToolbarStyle = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  margin: "28px 0 20px",
};

const desktopSearchWrapStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  background: "#fff",
  borderRadius: 12,
  padding: "12px 16px",
  flex: 1,
  border: "1.5px solid #E5E7EB",
};

const desktopSearchInputStyle = {
  border: "none",
  outline: "none",
  fontSize: 15,
  color: "#374151",
  width: "100%",
  background: "transparent",
};

const countBadgeStyle = {
  fontSize: 13,
  fontWeight: 600,
  color: "#6B7280",
  whiteSpace: "nowrap",
};

const desktopGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 16,
};

/* ── Mobile styles ── */
const mobilePageStyle = {
  background: "#F3F4F6",
  minHeight: "100vh",
};

const mobileHeaderStyle = {
  background: "#fff",
  padding: "20px 16px 16px",
  borderBottom: "1px solid #F3F4F6",
};

const mobileHeaderRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const infoBubbleStyle = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  background: "#EFF6FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const mobileTitleStyle = {
  fontSize: 20,
  fontWeight: 800,
  color: "#111827",
  margin: 0,
};

const mobileSubmitBtnStyle = {
  background: "#EFF6FF",
  color: "#2563EB",
  border: "none",
  borderRadius: 12,
  padding: "10px 16px",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
  letterSpacing: "0.04em",
};

const mobileSearchWrapStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  background: "#fff",
  borderRadius: 12,
  padding: "12px 16px",
  margin: "16px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const mobileSearchInputStyle = {
  border: "none",
  outline: "none",
  fontSize: 15,
  color: "#374151",
  width: "100%",
  background: "transparent",
};

const mobileCountStyle = {
  fontSize: 13,
  color: "#9CA3AF",
  margin: 0,
};
