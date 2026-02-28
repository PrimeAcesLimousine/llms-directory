export function Icon({ type, size = 24, color = "#3B82F6" }) {
  if (type === "globe") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
        <ellipse cx="12" cy="12" rx="4" ry="9" stroke={color} strokeWidth="1.8" />
        <line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="1.8" />
        <line x1="4.5" y1="7" x2="19.5" y2="7" stroke={color} strokeWidth="1.5" />
        <line x1="4.5" y1="17" x2="19.5" y2="17" stroke={color} strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === "code") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <polyline points="8,9 3,14 8,19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="16,9 21,14 16,19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="13" y1="6" x2="11" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  // doc (default)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth="1.8" />
      <line x1="8" y1="8" x2="16" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="16" x2="12" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function HomeIcon({ active }) {
  const color = active ? "#2563EB" : "#9CA3AF";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 11L12 3L21 11V20C21 20.55 20.55 21 20 21H15V16H9V21H4C3.45 21 3 20.55 3 20V11Z"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        fill={active ? "#DBEAFE" : "none"} />
    </svg>
  );
}

export function DirectoryIcon({ active }) {
  const color = active ? "#2563EB" : "#9CA3AF";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke={color} strokeWidth="2"
        fill={active ? "#DBEAFE" : "none"} />
      <line x1="7" y1="9" x2="17" y2="9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="7" y1="13" x2="17" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="7" y1="17" x2="13" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function SubmitNavIcon({ active }) {
  const color = active ? "#2563EB" : "#9CA3AF";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"
        fill={active ? "#2563EB" : "none"} />
      <line x1="12" y1="8" x2="12" y2="16" stroke={active ? "white" : color} strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="12" x2="16" y2="12" stroke={active ? "white" : color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="#9CA3AF" strokeWidth="2" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 6L5 12L11 18" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InfoIcon({ color = "#2563EB" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <line x1="12" y1="11" x2="12" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill={color} />
    </svg>
  );
}
