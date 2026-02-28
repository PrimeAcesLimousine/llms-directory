import { useState } from "react";
import { ListingCard } from "../components/ListingCard";
import { SearchIcon } from "../components/Icon";
import { useBreakpoint } from "../context/BreakpointContext";

export function HomePage({ listings, onNavigate }) {
  const [query, setQuery] = useState("");
  const { isDesktop } = useBreakpoint();

  const filtered = listings.filter((l) =>
    l.name.toLowerCase().includes(query.toLowerCase()) ||
    l.url.toLowerCase().includes(query.toLowerCase())
  );

  if (isDesktop) {
    return (
      <div>
        {/* Desktop Hero */}
        <div style={desktopHeroStyle}>
          <div style={heroTextStyle}>
            <h1 style={desktopTitleStyle}>Machine-Readable Docs for AI</h1>
            <p style={desktopSubtitleStyle}>
              A global registry of llms.txt files — helping AI agents discover and understand website content.
            </p>
            <p style={desktopStatsStyle}>{listings.length} sites listed</p>
          </div>
          <div style={heroSearchStyle}>
            <div style={desktopSearchWrapStyle}>
              <SearchIcon />
              <input
                style={desktopSearchInputStyle}
                placeholder="Search llms.txt files..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button onClick={() => onNavigate("submit")} style={desktopSubmitBtnStyle}>
              + Submit Website
            </button>
          </div>
        </div>

        {/* Desktop Grid */}
        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", color: "#9CA3AF", marginTop: 40 }}>No results found.</p>
        ) : (
          <div style={desktopGridStyle}>
            {filtered.map((listing) => (
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
        <h1 style={mobileTitleStyle}>LLM Directory</h1>
        <p style={mobileSubtitleStyle}>
          High-utility discovery for LLMs and automated agents through llms.txt files.
        </p>
        <button onClick={() => onNavigate("submit")} style={mobileSubmitBtnStyle}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
          Submit Website
        </button>
      </div>

      <div style={mobileSearchWrapStyle}>
        <SearchIcon />
        <input
          style={mobileSearchInputStyle}
          placeholder="Search llms.txt files..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div style={{ padding: "0 16px 100px" }}>
        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", color: "#9CA3AF", marginTop: 40 }}>No results found.</p>
        ) : (
          filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} showIcon={false} />
          ))
        )}
      </div>
    </div>
  );
}

/* ── Desktop styles ── */
const desktopHeroStyle = {
  background: "#fff",
  borderRadius: 20,
  padding: "48px",
  margin: "32px 0 28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 48,
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

const heroTextStyle = {
  flex: 1,
};

const desktopTitleStyle = {
  fontSize: 36,
  fontWeight: 800,
  color: "#111827",
  margin: "0 0 12px",
  lineHeight: 1.2,
};

const desktopSubtitleStyle = {
  fontSize: 16,
  color: "#6B7280",
  margin: "0 0 16px",
  lineHeight: 1.6,
  maxWidth: 480,
};

const desktopStatsStyle = {
  fontSize: 13,
  fontWeight: 700,
  color: "#2563EB",
  margin: 0,
  background: "#EFF6FF",
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: 20,
};

const heroSearchStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 12,
  maxWidth: 420,
};

const desktopSearchWrapStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  background: "#F9FAFB",
  borderRadius: 12,
  padding: "14px 16px",
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

const desktopSubmitBtnStyle = {
  background: "#2563EB",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  padding: "14px 20px",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
};

const desktopGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 16,
};

/* ── Mobile styles ── */
const mobilePageStyle = {
  background: "#F3F4F6",
  minHeight: "100vh",
};

const mobileHeaderStyle = {
  background: "#fff",
  padding: "28px 20px 24px",
  borderBottom: "1px solid #F3F4F6",
};

const mobileTitleStyle = {
  fontSize: 26,
  fontWeight: 800,
  color: "#111827",
  margin: 0,
};

const mobileSubtitleStyle = {
  fontSize: 14,
  color: "#6B7280",
  marginTop: 6,
  marginBottom: 20,
  lineHeight: 1.5,
};

const mobileSubmitBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  background: "#2563EB",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  padding: "12px 20px",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
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
