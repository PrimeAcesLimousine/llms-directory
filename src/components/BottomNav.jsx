import { HomeIcon, DirectoryIcon, SubmitNavIcon } from "./Icon";

export function BottomNav({ page, onNavigate }) {
  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      maxWidth: 480,
      margin: "0 auto",
      background: "#fff",
      borderTop: "1px solid #E5E7EB",
      display: "flex",
      justifyContent: "space-around",
      padding: "10px 0 20px",
      zIndex: 100,
    }}>
      <button onClick={() => onNavigate("home")} style={navBtnStyle}>
        <HomeIcon active={page === "home"} />
        <span style={{ ...navLabelStyle, color: page === "home" ? "#2563EB" : "#9CA3AF" }}>Home</span>
      </button>
      <button onClick={() => onNavigate("directory")} style={navBtnStyle}>
        <DirectoryIcon active={page === "directory"} />
        <span style={{ ...navLabelStyle, color: page === "directory" ? "#2563EB" : "#9CA3AF" }}>Directory</span>
      </button>
      <button onClick={() => onNavigate("submit")} style={navBtnStyle}>
        <SubmitNavIcon active={page === "submit"} />
        <span style={{ ...navLabelStyle, color: page === "submit" ? "#2563EB" : "#9CA3AF" }}>Submit</span>
      </button>
    </nav>
  );
}

const navBtnStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 3,
  padding: "0 16px",
};

const navLabelStyle = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.03em",
  textTransform: "uppercase",
};
