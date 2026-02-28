import { Icon } from "./Icon";

const TAG_COLORS = {
  VERIFIED: { bg: "#DCFCE7", color: "#16A34A" },
  TECHNICAL: { bg: "#EFF6FF", color: "#2563EB" },
  EDUCATION: { bg: "#EFF6FF", color: "#2563EB" },
  DOCUMENTATION: { bg: "#EFF6FF", color: "#2563EB" },
  "AI MODELS": { bg: "#EFF6FF", color: "#2563EB" },
  PUBLIC: { bg: "#EFF6FF", color: "#2563EB" },
};

export function ListingCard({ listing, showIcon = false }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {showIcon && (
          <div style={iconWrapStyle}>
            <Icon type={listing.icon} size={22} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={nameStyle}>{listing.name}</span>
          <a
            href={listing.fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={urlStyle}
            onClick={(e) => e.stopPropagation()}
          >
            {listing.url}
          </a>
          {listing.tags && listing.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {listing.tags.map((tag) => {
                const style = TAG_COLORS[tag] || { bg: "#F3F4F6", color: "#6B7280" };
                return (
                  <span key={tag} style={{ ...tagStyle, background: style.bg, color: style.color }}>
                    {tag}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  borderRadius: 16,
  padding: "16px",
  marginBottom: 12,
  boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
};

const iconWrapStyle = {
  width: 48,
  height: 48,
  borderRadius: 12,
  background: "#EFF6FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const nameStyle = {
  display: "block",
  fontWeight: 700,
  fontSize: 15,
  color: "#111827",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const urlStyle = {
  fontSize: 13,
  color: "#2563EB",
  textDecoration: "none",
  display: "block",
  marginTop: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const tagStyle = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.05em",
  borderRadius: 6,
  padding: "3px 8px",
};
