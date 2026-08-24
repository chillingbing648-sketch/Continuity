import React, { useEffect } from "react";
import { Icons } from "./Icons";

export function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  size = "", // "" | "large" | "xlarge" | "small"
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div className={`modal ${size}`} role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <h2
              style={{
                fontSize: "1.05rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
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
            aria-label="Close Modal"
            type="button"
          >
            <Icons.x size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
