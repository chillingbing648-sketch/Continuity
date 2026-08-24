import React from "react";
import { useApp } from "../../context/AppContext";
import { Icons } from "./Icons";

export function ViewModeSwitcher() {
  const { viewMode, changeViewMode, people } = useApp();
  const primaryTrustee = people.find((p) => p.isPrimaryTrustee || p.role?.toLowerCase().includes("trustee"));

  return (
    <div
      style={{
        display: "inline-flex",
        background: "var(--surface-alt)",
        padding: 3,
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border)",
      }}
    >
      <button
        type="button"
        className={`btn btn-sm ${viewMode === "owner" ? "btn-primary" : "btn-ghost"}`}
        style={{
          padding: "4px 10px",
          fontSize: "0.78rem",
          fontWeight: 600,
          background: viewMode === "owner" ? "var(--accent)" : "transparent",
          color: viewMode === "owner" ? "white" : "var(--text-secondary)",
          borderRadius: 6,
          boxShadow: viewMode === "owner" ? "var(--shadow-xs)" : "none",
        }}
        onClick={() => changeViewMode("owner")}
      >
        <Icons.user size={14} />
        Owner View
      </button>

      <button
        type="button"
        className={`btn btn-sm ${viewMode === "trusted" ? "btn-primary" : "btn-ghost"}`}
        style={{
          padding: "4px 10px",
          fontSize: "0.78rem",
          fontWeight: 600,
          background: viewMode === "trusted" ? "var(--accent)" : "transparent",
          color: viewMode === "trusted" ? "white" : "var(--text-secondary)",
          borderRadius: 6,
          boxShadow: viewMode === "trusted" ? "var(--shadow-xs)" : "none",
        }}
        onClick={() => changeViewMode("trusted")}
        title="Simulate how the primary trustee (Priya) sees your financial continuity"
      >
        <Icons.shield size={14} />
        {primaryTrustee ? `${primaryTrustee.name.split(" ")[0]}'s View` : "Trustee View"}
      </button>

      <button
        type="button"
        className={`btn btn-sm ${viewMode === "emergency" ? "btn-primary" : "btn-ghost"}`}
        style={{
          padding: "4px 10px",
          fontSize: "0.78rem",
          fontWeight: 600,
          background: viewMode === "emergency" ? "var(--warn)" : "transparent",
          color: viewMode === "emergency" ? "white" : "var(--text-secondary)",
          borderRadius: 6,
          boxShadow: viewMode === "emergency" ? "var(--shadow-xs)" : "none",
        }}
        onClick={() => changeViewMode("emergency")}
        title="If I Become Unavailable - Emergency Action Guide"
      >
        <Icons.guide size={14} />
        Emergency Guide
      </button>
    </div>
  );
}
