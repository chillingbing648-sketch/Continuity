export function ProgressRing({ value, max = 100, size = 120, stroke = 9 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const offset = circ * (1 - pct);
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="progress-ring"
    >
      <circle
        className="progress-ring-track"
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
      />
      <circle
        className="progress-ring-fill"
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

export function Switch({ checked, onChange }) {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="switch-slider" />
    </label>
  );
}

export function Modal({ title, subtitle, onClose, children, footer, size = "" }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);
  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal ${size}`} role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <h2
              style={{
                fontSize: "1.05rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  marginTop: 3,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <button
            className="btn-icon"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div
      className={`toast toast-${type}`}
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        background: type === "success" ? "#166534" : "#B91C1C",
        color: "white",
        padding: 12 + 18,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        fontSize: "0.875rem",
        fontWeight: 500,
        zIndex: 999,
        animation: "fadeIn 0.25s ease",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {type === "success"
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11L11 22L1 12"/></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>`}
    
      {msg}
    </div>
  );
}

export function EmptyState({ icon: Ic, title, desc, action }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 60 + "px 20px",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 50,
          background: "#F2F1EE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6B6860",
          marginBottom: 16,
        }}
      >
        {Ic}
      </div>
      <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 6 }}>{title}</h3>
      <p
        style={{
          color: "#6B6860",
          fontSize: "0.875rem",
          marginBottom: 20,
          maxWidth: 320,
        }}
      >
        {desc}
      </p>
      {action}
    </div>
  );
}

export function LogoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path
        d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9"
        strokeWidth="2.5"
      />
      <path
        d="M17 6l5-3M17 6l-3 5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2" fill="white" />
    </svg>
  );
}