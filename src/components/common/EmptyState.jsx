import React from "react";

export function EmptyState({
  icon: Ic,
  title = "No information found",
  desc = "Start by adding your first record to ensure complete continuity.",
  action,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "48px 24px",
        background: "var(--surface)",
        borderRadius: "var(--radius-md)",
        border: "1px dashed var(--border)",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: "var(--surface-alt)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-secondary)",
          marginBottom: 14,
        }}
      >
        {Ic}
      </div>
      <h3
        style={{
          fontSize: "0.95rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: 6,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "0.85rem",
          marginBottom: action ? 20 : 0,
          maxWidth: 360,
          lineHeight: 1.45,
        }}
      >
        {desc}
      </p>
      {action}
    </div>
  );
}
