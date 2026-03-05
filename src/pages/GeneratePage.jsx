import { useState } from "react";
import { useBreakpoint } from "../context/BreakpointContext";

export function GeneratePage() {
  const { isDesktop } = useBreakpoint();
  const [url, setUrl] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    const raw = url.trim();
    if (!raw) return;
    const full = raw.startsWith("http") ? raw : `https://${raw}`;
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await fetch(`/api/generate?url=${encodeURIComponent(full)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      setOutput(data.text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "llms.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (isDesktop) {
    return (
      <div style={{ paddingTop: 40 }}>
        {/* Hero */}
        <div style={heroStyle}>
          <h1 style={heroTitleStyle}>Generate llms.txt</h1>
          <p style={heroSubStyle}>
            Automatically create an <code style={codeStyle}>llms.txt</code> file for any website — a standard
            that helps AI assistants understand your site's content and structure.
          </p>
        </div>

        {/* Input card */}
        <div style={cardStyle}>
          <label style={labelStyle}>Website URL</label>
          <div style={inputRowStyle}>
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              style={inputStyle}
              disabled={loading}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !url.trim()}
              style={{
                ...generateBtnStyle,
                opacity: loading || !url.trim() ? 0.6 : 1,
                cursor: loading || !url.trim() ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Generating…" : "Generate"}
            </button>
          </div>
          {error && <p style={errorStyle}>⚠ {error}</p>}
        </div>

        {/* Output */}
        {output && (
          <div style={cardStyle}>
            <div style={outputHeaderStyle}>
              <label style={labelStyle}>Your llms.txt</label>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleCopy} style={secondaryBtnStyle}>
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
                <button onClick={handleDownload} style={primaryBtnStyle}>
                  ↓ Download llms.txt
                </button>
              </div>
            </div>
            <textarea readOnly value={output} style={textareaStyle} rows={20} />
          </div>
        )}

        {/* What is llms.txt */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>What is llms.txt?</h2>
          <p style={aboutTextStyle}>
            <code style={codeStyle}>llms.txt</code> is a simple text file placed at the root of your website
            (e.g., <code style={codeStyle}>yoursite.com/llms.txt</code>) that helps AI language models
            understand your site's purpose, structure, and key pages — similar to how{" "}
            <code style={codeStyle}>robots.txt</code> guides search engines.
          </p>
          <div style={stepsStyle}>
            {steps.map((s, i) => (
              <div key={i} style={stepStyle}>
                <div style={stepNumStyle}>{i + 1}</div>
                <div>
                  <div style={stepTitleStyle}>{s.title}</div>
                  <div style={stepDescStyle}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Mobile ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={mobileHeroStyle}>
        <h1 style={mobileHeroTitleStyle}>Generate llms.txt</h1>
        <p style={mobileHeroSubStyle}>
          Create an <code style={codeStyle}>llms.txt</code> file for any website to help AI assistants
          understand your content.
        </p>
      </div>

      <div style={mobilePadStyle}>
        <div style={mobileCardStyle}>
          <label style={labelStyle}>Website URL</label>
          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ ...inputStyle, marginBottom: 12 }}
            disabled={loading}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !url.trim()}
            style={{
              ...generateBtnStyle,
              width: "100%",
              opacity: loading || !url.trim() ? 0.6 : 1,
              cursor: loading || !url.trim() ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Generating…" : "Generate"}
          </button>
          {error && <p style={errorStyle}>⚠ {error}</p>}
        </div>

        {output && (
          <div style={mobileCardStyle}>
            <label style={{ ...labelStyle, marginBottom: 10 }}>Your llms.txt</label>
            <textarea readOnly value={output} style={{ ...textareaStyle, fontSize: 12 }} rows={14} />
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={handleCopy} style={{ ...secondaryBtnStyle, flex: 1 }}>
                {copied ? "✓ Copied!" : "Copy"}
              </button>
              <button onClick={handleDownload} style={{ ...primaryBtnStyle, flex: 1 }}>
                ↓ Download
              </button>
            </div>
          </div>
        )}

        <div style={mobileCardStyle}>
          <h2 style={{ ...sectionTitleStyle, fontSize: 16 }}>What is llms.txt?</h2>
          <p style={{ ...aboutTextStyle, fontSize: 13 }}>
            A text file at <code style={codeStyle}>yoursite.com/llms.txt</code> that helps AI understand
            your site's structure and key pages.
          </p>
          {steps.map((s, i) => (
            <div key={i} style={{ ...stepStyle, marginBottom: 12 }}>
              <div style={stepNumStyle}>{i + 1}</div>
              <div>
                <div style={stepTitleStyle}>{s.title}</div>
                <div style={stepDescStyle}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    title: "Enter your URL",
    desc: "Paste any website URL into the field above and click Generate.",
  },
  {
    title: "Auto-generate",
    desc: "We fetch your site and extract the title, description, and key pages automatically.",
  },
  {
    title: "Download & publish",
    desc: "Download the llms.txt file and upload it to your site's root directory.",
  },
];

// ── Styles ───────────────────────────────────────────────────────────────────

const heroStyle = {
  textAlign: "center",
  padding: "40px 20px 32px",
};
const heroTitleStyle = {
  fontSize: 36,
  fontWeight: 800,
  color: "#111827",
  marginBottom: 14,
};
const heroSubStyle = {
  fontSize: 16,
  color: "#6B7280",
  maxWidth: 600,
  margin: "0 auto",
  lineHeight: 1.7,
};
const codeStyle = {
  background: "#F3F4F6",
  padding: "2px 6px",
  borderRadius: 4,
  fontSize: "0.88em",
  fontFamily: "monospace",
  color: "#374151",
};
const cardStyle = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #E5E7EB",
  padding: "28px 32px",
  marginBottom: 20,
};
const labelStyle = {
  display: "block",
  fontWeight: 700,
  fontSize: 14,
  color: "#374151",
  marginBottom: 10,
};
const inputRowStyle = {
  display: "flex",
  gap: 10,
};
const inputStyle = {
  flex: 1,
  padding: "11px 14px",
  border: "1.5px solid #E5E7EB",
  borderRadius: 10,
  fontSize: 14,
  color: "#111827",
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
};
const generateBtnStyle = {
  background: "#2563EB",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "11px 24px",
  fontSize: 14,
  fontWeight: 700,
  whiteSpace: "nowrap",
};
const errorStyle = {
  color: "#DC2626",
  fontSize: 13,
  marginTop: 10,
  background: "#FEF2F2",
  padding: "8px 12px",
  borderRadius: 8,
};
const outputHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
};
const textareaStyle = {
  width: "100%",
  border: "1.5px solid #E5E7EB",
  borderRadius: 10,
  padding: "12px 14px",
  fontSize: 13,
  fontFamily: "monospace",
  color: "#111827",
  resize: "vertical",
  outline: "none",
  lineHeight: 1.6,
  background: "#FAFAFA",
};
const secondaryBtnStyle = {
  background: "#F3F4F6",
  color: "#374151",
  border: "1px solid #E5E7EB",
  borderRadius: 8,
  padding: "8px 16px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};
const primaryBtnStyle = {
  background: "#2563EB",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "8px 16px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};
const sectionTitleStyle = {
  fontSize: 18,
  fontWeight: 800,
  color: "#111827",
  marginBottom: 12,
};
const aboutTextStyle = {
  color: "#6B7280",
  fontSize: 14,
  lineHeight: 1.6,
  marginBottom: 20,
};
const stepsStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
};
const stepStyle = {
  display: "flex",
  gap: 14,
  alignItems: "flex-start",
};
const stepNumStyle = {
  background: "#EFF6FF",
  color: "#2563EB",
  borderRadius: "50%",
  width: 28,
  height: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: 13,
  flexShrink: 0,
};
const stepTitleStyle = {
  fontWeight: 700,
  fontSize: 14,
  color: "#111827",
  marginBottom: 2,
};
const stepDescStyle = {
  fontSize: 13,
  color: "#6B7280",
  lineHeight: 1.5,
};
// Mobile
const mobileHeroStyle = {
  background: "#fff",
  padding: "24px 20px 20px",
  borderBottom: "1px solid #E5E7EB",
};
const mobileHeroTitleStyle = {
  fontSize: 22,
  fontWeight: 800,
  color: "#111827",
  marginBottom: 8,
};
const mobileHeroSubStyle = {
  fontSize: 13,
  color: "#6B7280",
  lineHeight: 1.6,
};
const mobilePadStyle = {
  padding: "16px 16px 0",
};
const mobileCardStyle = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #E5E7EB",
  padding: "18px 16px",
  marginBottom: 14,
};
