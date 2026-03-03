import { Icon } from "./Icon";

export function ListingCard({ listing, showIcon = false }) {
  const hasVerified = listing.tags && listing.tags.includes("VERIFIED");

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
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, minHeight: 22 }}>
            {listing.checking ? (
              <div style={spinnerWrapStyle}>
                <div style={spinnerStyle} />
                <span style={checkingTextStyle}>Checking…</span>
              </div>
            ) : hasVerified ? (
              <span style={verifiedTagStyle}>✓ VERIFIED</span>
            ) : null}
          </div>
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

const verifiedTagStyle = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.05em",
  borderRadius: 6,
  padding: "3px 8px",
  background: "#DCFCE7",
  color: "#16A34A",
};

const spinnerWrapStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const spinnerStyle = {
  width: 12,
  height: 12,
  borderRadius: "50%",
  borderWidth: 2,
  borderStyle: "solid",
  borderColor: "#D1D5DB",
  borderTopColor: "#6B7280",
  animation: "spin 0.7s linear infinite",
};

const checkingTextStyle = {
  fontSize: 11,
  color: "#9CA3AF",
  fontWeight: 500,
};
