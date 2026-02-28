import { useState } from "react";
import { BackIcon, InfoIcon } from "../components/Icon";
import { useBreakpoint } from "../context/BreakpointContext";

export function SubmitPage({ onNavigate, onSubmit }) {
  const [form, setForm] = useState({ name: "", url: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { isDesktop } = useBreakpoint();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Website name is required.";
    if (!form.url.trim()) {
      errs.url = "LLMs.txt URL is required.";
    } else if (
      !/^https?:\/\/.+\..+/.test(form.url) &&
      !/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(form.url)
    ) {
      errs.url = "Please enter a valid URL (e.g. https://site.com/llms.txt).";
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({
      name: form.name.trim(),
      url: form.url.trim().startsWith("http") ? form.url.trim() : `https://${form.url.trim()}`,
    });
    setSubmitted(true);
  };

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ── Shared pieces ──────────────────────────────────────────────────────────
  const formContent = (
    <form onSubmit={handleSubmit} noValidate>
      <div style={fieldGroupStyle}>
        <label htmlFor="site-name" style={labelStyle}>Website Name</label>
        <input
          id="site-name"
          style={{ ...inputStyle, ...(errors.name ? errorInputStyle : {}) }}
          placeholder="e.g. Acme Corporation"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
        />
        {errors.name && <span style={errorTextStyle}>{errors.name}</span>}
      </div>
      <div style={fieldGroupStyle}>
        <label htmlFor="site-url" style={labelStyle}>LLMs.txt URL</label>
        <input
          id="site-url"
          style={{ ...inputStyle, ...(errors.url ? errorInputStyle : {}) }}
          placeholder="https://site.com/llms.txt"
          type="url"
          value={form.url}
          onChange={(e) => setField("url", e.target.value)}
        />
        <span style={hintStyle}>Example: https://yourdomain.com/llms.txt</span>
        {errors.url && <span style={errorTextStyle}>{errors.url}</span>}
      </div>
      <button type="submit" style={primaryBtnStyle}>
        <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
        Add to Directory
      </button>
    </form>
  );

  const infoBox = (
    <div style={infoBoxStyle}>
      <div style={{ flexShrink: 0, marginTop: 2 }}><InfoIcon color="#2563EB" /></div>
      <div>
        <p style={infoTitleStyle}>What is LLMs.txt?</p>
        <p style={infoBodyStyle}>
          LLMs.txt is a standard for providing machine-readable summaries of your website content,
          making it easier for Large Language Models to index and understand your site.
        </p>
      </div>
    </div>
  );

  // ── Success screen ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: isDesktop ? "60vh" : "80vh" }}>
        <div style={successCardStyle}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Listed!</h2>
          <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24, textAlign: "center", lineHeight: 1.6 }}>
            <strong>{form.name}</strong> has been added to the LLM Directory.
          </p>
          <button onClick={() => onNavigate("directory")} style={primaryBtnStyle}>
            View Directory
          </button>
          <button
            onClick={() => { setForm({ name: "", url: "" }); setErrors({}); setSubmitted(false); }}
            style={{ ...ghostBtnStyle, marginTop: 10 }}
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  // ── Desktop: two-column ────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div style={desktopWrapStyle}>
        {/* Left: form */}
        <div style={desktopFormColStyle}>
          <h2 style={pageTitleStyle}>Join the Directory</h2>
          <p style={pageSubStyle}>
            Help AI agents discover your content by adding your site&apos;s LLMs.txt file to our global registry.
          </p>
          {formContent}
        </div>
        {/* Right: info */}
        <div style={desktopInfoColStyle}>
          {infoBox}
          <div style={tipsBoxStyle}>
            <p style={infoTitleStyle}>Tips</p>
            <ul style={tipListStyle}>
              <li>Make sure your llms.txt is publicly accessible</li>
              <li>Use the full URL including https://</li>
              <li>Listings appear instantly after submission</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // ── Mobile ─────────────────────────────────────────────────────────────────
  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <button onClick={() => onNavigate("directory")} style={backBtnStyle}>
          <BackIcon />
        </button>
        <h1 style={headerTitleStyle}>Submit a Website</h1>
      </div>
      <div style={{ padding: "28px 20px 100px" }}>
        <h2 style={pageTitleStyle}>Join the Directory</h2>
        <p style={pageSubStyle}>
          Help AI agents discover your content by adding your site&apos;s LLMs.txt file to our global registry.
        </p>
        {formContent}
        {infoBox}
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const desktopWrapStyle = {
  display: "flex",
  gap: 40,
  alignItems: "flex-start",
  padding: "40px 0",
};

const desktopFormColStyle = {
  flex: "0 0 520px",
  background: "#fff",
  borderRadius: 16,
  padding: "36px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

const desktopInfoColStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const tipsBoxStyle = {
  background: "#fff",
  borderRadius: 14,
  padding: "20px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

const tipListStyle = {
  margin: "8px 0 0",
  paddingLeft: 20,
  fontSize: 13,
  color: "#6B7280",
  lineHeight: 1.8,
};

const pageStyle = {
  background: "#F3F4F6",
  minHeight: "100vh",
};

const headerStyle = {
  background: "#fff",
  padding: "18px 16px",
  display: "flex",
  alignItems: "center",
  gap: 12,
  borderBottom: "1px solid #F3F4F6",
};

const backBtnStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  display: "flex",
  alignItems: "center",
};

const headerTitleStyle = {
  fontSize: 18,
  fontWeight: 700,
  color: "#111827",
  margin: 0,
};

const pageTitleStyle = {
  fontSize: 24,
  fontWeight: 800,
  color: "#111827",
  margin: "0 0 8px",
};

const pageSubStyle = {
  fontSize: 14,
  color: "#6B7280",
  marginBottom: 28,
  lineHeight: 1.6,
};

const fieldGroupStyle = { marginBottom: 20 };

const labelStyle = {
  display: "block",
  fontSize: 14,
  fontWeight: 700,
  color: "#111827",
  marginBottom: 8,
};

const inputStyle = {
  width: "100%",
  borderWidth: "1.5px",
  borderStyle: "solid",
  borderColor: "#E5E7EB",
  borderRadius: 12,
  padding: "14px 16px",
  fontSize: 15,
  color: "#374151",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const errorInputStyle = { borderColor: "#EF4444" };

const errorTextStyle = {
  display: "block",
  fontSize: 12,
  color: "#EF4444",
  marginTop: 4,
};

const hintStyle = {
  display: "block",
  fontSize: 12,
  color: "#9CA3AF",
  marginTop: 5,
  fontStyle: "italic",
};

const primaryBtnStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  width: "100%",
  background: "#2563EB",
  color: "#fff",
  border: "none",
  borderRadius: 14,
  padding: "16px",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  marginTop: 8,
};

const ghostBtnStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  background: "#F3F4F6",
  color: "#374151",
  border: "none",
  borderRadius: 14,
  padding: "14px",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
};

const infoBoxStyle = {
  background: "#EFF6FF",
  borderRadius: 14,
  padding: "16px",
  marginTop: 24,
  display: "flex",
  gap: 12,
  alignItems: "flex-start",
};

const infoTitleStyle = {
  fontSize: 14,
  fontWeight: 700,
  color: "#2563EB",
  margin: "0 0 6px",
};

const infoBodyStyle = {
  fontSize: 13,
  color: "#374151",
  margin: 0,
  lineHeight: 1.6,
};

const successCardStyle = {
  background: "#fff",
  borderRadius: 20,
  padding: "32px 24px",
  width: "100%",
  maxWidth: 400,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
};
