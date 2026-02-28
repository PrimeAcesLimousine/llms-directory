export function TopNav({ page, onNavigate }) {
  return (
    <header style={headerStyle}>
      <div style={innerStyle}>
        {/* Logo */}
        <button onClick={() => onNavigate("home")} style={logoStyle}>
          LLM Directory
        </button>

        {/* Links */}
        <nav style={linksStyle}>
          <button
            onClick={() => onNavigate("home")}
            style={{ ...linkStyle, ...(page === "home" ? activeLinkStyle : {}) }}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate("directory")}
            style={{ ...linkStyle, ...(page === "directory" ? activeLinkStyle : {}) }}
          >
            Directory
          </button>
        </nav>

        {/* Submit CTA */}
        <button onClick={() => onNavigate("submit")} style={submitBtnStyle}>
          + Submit Website
        </button>
      </div>
    </header>
  );
}

const headerStyle = {
  position: "sticky",
  top: 0,
  zIndex: 100,
  background: "#fff",
  borderBottom: "1px solid #E5E7EB",
};

const innerStyle = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 32px",
  height: 64,
  display: "flex",
  alignItems: "center",
  gap: 32,
};

const logoStyle = {
  background: "none",
  border: "none",
  fontSize: 18,
  fontWeight: 800,
  color: "#111827",
  cursor: "pointer",
  padding: 0,
  whiteSpace: "nowrap",
};

const linksStyle = {
  display: "flex",
  gap: 4,
  flex: 1,
};

const linkStyle = {
  background: "none",
  border: "none",
  fontSize: 14,
  fontWeight: 600,
  color: "#6B7280",
  cursor: "pointer",
  padding: "6px 12px",
  borderRadius: 8,
};

const activeLinkStyle = {
  color: "#2563EB",
  background: "#EFF6FF",
};

const submitBtnStyle = {
  background: "#2563EB",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "10px 18px",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
  whiteSpace: "nowrap",
};
