import { useBreakpoint } from "../context/BreakpointContext";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function StatusBadge({ verified }) {
  return verified
    ? <span style={verifiedBadgeStyle}>✓ Verified</span>
    : <span style={unverifiedBadgeStyle}>Unverified</span>;
}

export function HomePage({ listings, loading, onNavigate }) {
  const { isDesktop } = useBreakpoint();

  // API returns newest first, so slice(0,10) = latest 10
  const latest = listings.slice(0, 10);

  if (isDesktop) {
    return (
      <div>
        {/* ── Hero ── */}
        <div style={heroStyle}>
          <div style={heroTextStyle}>
            <h1 style={titleStyle}>Machine-Readable Docs for AI</h1>
            <p style={subtitleStyle}>
              A global registry of llms.txt files — helping AI agents discover and understand website content.
            </p>
            <span style={statsStyle}>{listings.length} sites listed</span>
          </div>
          <div style={heroActionsStyle}>
            <p style={heroActionDescStyle}>
              List your llms.txt file and help AI agents find and understand your content.
            </p>
            <button onClick={() => onNavigate("submit")} style={submitBtnStyle}>
              + Submit Website
            </button>
            <button onClick={() => onNavigate("directory")} style={browseBtnStyle}>
              Browse Directory →
            </button>
          </div>
        </div>

        {/* ── Latest Additions ── */}
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Latest Additions</h2>
          <button onClick={() => onNavigate("directory")} style={viewAllBtnStyle}>
            View All {listings.length} Sites →
          </button>
        </div>

        {loading ? (
          <p style={emptyStyle}>Loading…</p>
        ) : latest.length === 0 ? (
          <p style={emptyStyle}>No listings yet.</p>
        ) : (
          <div style={tableWrapStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thNumStyle}>#</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>URL</th>
                  <th style={{ ...thStyle, width: 110 }}>Status</th>
                  <th style={{ ...thStyle, width: 120 }}>Added</th>
                </tr>
              </thead>
              <tbody>
                {latest.map((listing, i) => {
                  const verified = listing.tags && listing.tags.includes("VERIFIED");
                  return (
                    <tr
                      key={listing.id}
                      style={i % 2 === 0 ? trEvenStyle : trOddStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#EFF6FF"}
                      onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#F9FAFB"}
                    >
                      <td style={tdNumStyle}>{i + 1}</td>
                      <td style={tdStyle}>
                        <span style={nameCellStyle}>{listing.name}</span>
                      </td>
                      <td style={tdStyle}>
                        <a
                          href={listing.fullUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={linkStyle}
                        >
                          {listing.url}
                        </a>
                      </td>
                      <td style={tdStyle}>
                        <StatusBadge verified={verified} />
                      </td>
                      <td style={{ ...tdStyle, color: "#9CA3AF", fontSize: 13 }}>
                        {formatDate(listing.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* View All footer row */}
            <div style={tableFooterStyle}>
              <button onClick={() => onNavigate("directory")} style={tableFooterBtnStyle}>
                View All {listings.length} Sites →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Mobile ──
  return (
    <div style={mobilePageStyle}>
      <div style={mobileHeaderStyle}>
        <h1 style={mobileTitleStyle}>LLM Directory</h1>
        <p style={mobileSubtitleStyle}>
          A global registry of llms.txt files — helping AI agents discover website content.
        </p>
        <button onClick={() => onNavigate("submit")} style={mobileSubmitBtnStyle}>
          + Submit Website
        </button>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        <div style={mobileSectionHeaderStyle}>
          <span style={mobileSectionTitleStyle}>Latest Additions</span>
          <button onClick={() => onNavigate("directory")} style={mobileViewAllBtnStyle}>
            View All →
          </button>
        </div>
      </div>

      {loading ? (
        <p style={emptyStyle}>Loading…</p>
      ) : (
        <div style={{ padding: "8px 16px 100px", overflowX: "auto" }}>
          <table style={{ ...tableStyle, fontSize: 13 }}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={{ ...thStyle, width: 90 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {latest.map((listing, i) => {
                const verified = listing.tags && listing.tags.includes("VERIFIED");
                return (
                  <tr key={listing.id} style={i % 2 === 0 ? trEvenStyle : trOddStyle}>
                    <td style={tdStyle}>
                      <span style={nameCellStyle}>{listing.name}</span>
                      <a
                        href={listing.fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ ...linkStyle, display: "block", marginTop: 2 }}
                      >
                        {listing.url}
                      </a>
                    </td>
                    <td style={{ ...tdStyle, verticalAlign: "middle" }}>
                      <StatusBadge verified={verified} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button onClick={() => onNavigate("directory")} style={mobileViewAllFullBtnStyle}>
              View All {listings.length} Sites →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Hero ── */
const heroStyle = {
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

const titleStyle = {
  fontSize: 36,
  fontWeight: 800,
  color: "#111827",
  margin: "0 0 12px",
  lineHeight: 1.2,
};

const subtitleStyle = {
  fontSize: 16,
  color: "#6B7280",
  margin: "0 0 16px",
  lineHeight: 1.6,
  maxWidth: 480,
};

const statsStyle = {
  fontSize: 13,
  fontWeight: 700,
  color: "#2563EB",
  background: "#EFF6FF",
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: 20,
};

const heroActionsStyle = {
  flex: "0 0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  maxWidth: 300,
};

const heroActionDescStyle = {
  fontSize: 14,
  color: "#6B7280",
  margin: "0 0 4px",
  lineHeight: 1.5,
};

const submitBtnStyle = {
  background: "#2563EB",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  padding: "13px 20px",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  textAlign: "center",
};

const browseBtnStyle = {
  background: "#F3F4F6",
  color: "#374151",
  border: "1.5px solid #E5E7EB",
  borderRadius: 12,
  padding: "12px 20px",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  textAlign: "center",
};

/* ── Section header ── */
const sectionHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  margin: "0 0 14px",
};

const sectionTitleStyle = {
  fontSize: 20,
  fontWeight: 800,
  color: "#111827",
  margin: 0,
};

const viewAllBtnStyle = {
  background: "none",
  border: "none",
  color: "#2563EB",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  padding: 0,
};

/* ── Table ── */
const tableWrapStyle = {
  background: "#fff",
  borderRadius: 14,
  border: "1.5px solid #E5E7EB",
  overflow: "hidden",
  marginBottom: 40,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  tableLayout: "auto",
};

const thStyle = {
  padding: "11px 16px",
  textAlign: "left",
  fontSize: 11,
  fontWeight: 700,
  color: "#6B7280",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  background: "#F9FAFB",
  borderBottom: "1.5px solid #E5E7EB",
  whiteSpace: "nowrap",
};

const thNumStyle = {
  ...thStyle,
  width: 48,
  textAlign: "center",
};

const trEvenStyle = { background: "#fff" };
const trOddStyle = { background: "#F9FAFB" };

const tdStyle = {
  padding: "13px 16px",
  fontSize: 14,
  color: "#374151",
  borderBottom: "1px solid #F3F4F6",
  verticalAlign: "middle",
};

const tdNumStyle = {
  ...tdStyle,
  textAlign: "center",
  color: "#9CA3AF",
  fontSize: 12,
  fontWeight: 600,
};

const nameCellStyle = {
  fontWeight: 600,
  color: "#111827",
  display: "block",
};

const linkStyle = {
  color: "#2563EB",
  textDecoration: "none",
  fontSize: 13,
};

const tableFooterStyle = {
  padding: "14px 20px",
  textAlign: "center",
  borderTop: "1.5px solid #E5E7EB",
  background: "#F9FAFB",
};

const tableFooterBtnStyle = {
  background: "none",
  border: "none",
  color: "#2563EB",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

/* ── Status badges ── */
const verifiedBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.04em",
  background: "#DCFCE7",
  color: "#16A34A",
  borderRadius: 6,
  padding: "3px 9px",
  whiteSpace: "nowrap",
};

const unverifiedBadgeStyle = {
  ...verifiedBadgeStyle,
  background: "#F3F4F6",
  color: "#9CA3AF",
};

const emptyStyle = {
  textAlign: "center",
  color: "#9CA3AF",
  marginTop: 48,
};

/* ── Mobile ── */
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
  margin: "0 0 6px",
};

const mobileSubtitleStyle = {
  fontSize: 14,
  color: "#6B7280",
  marginTop: 0,
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

const mobileSectionHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 8,
};

const mobileSectionTitleStyle = {
  fontSize: 16,
  fontWeight: 800,
  color: "#111827",
};

const mobileViewAllBtnStyle = {
  background: "none",
  border: "none",
  color: "#2563EB",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  padding: 0,
};

const mobileViewAllFullBtnStyle = {
  background: "#EFF6FF",
  color: "#2563EB",
  border: "1.5px solid #BFDBFE",
  borderRadius: 12,
  padding: "12px 24px",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};
