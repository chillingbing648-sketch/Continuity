import React from "react";
import { Icons } from "../common/Icons";
import { useApp } from "../../context/AppContext";

export function CriticalGapsCard({ onNav }) {
  const { criticalGaps, openModal, assets, verifyAsset } = useApp();

  if (criticalGaps.length === 0) {
    return (
      <div className="card" style={{ background: "var(--surface)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--success-light)",
              color: "var(--success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icons.checkCircle size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
              No Critical Gaps Detected
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              All registered assets, nominees, and documents meet active continuity standards.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleFixAction = (gap) => {
    const target = gap.actionTarget;
    if (!target) return;

    if (target.modal === "editAsset") {
      const asset = assets.find((a) => a.id === target.assetId);
      if (asset) openModal("editAsset", { asset });
    } else if (target.modal === "uploadDoc") {
      openModal("uploadDoc", { defaultAssetId: target.assetId });
    } else if (target.modal === "addPerson") {
      openModal("addPerson");
    } else if (target.modal === "runDrill") {
      openModal("runDrill");
    } else if (target.modal === "verifyAsset") {
      verifyAsset(target.assetId);
    } else if (target.view) {
      onNav(target.view);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Icons.alertTriangle size={18} style={{ color: "var(--warn)" }} />
          Critical Continuity Gaps ({criticalGaps.length})
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          Prioritized by legal & claim impact
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {criticalGaps.slice(0, 4).map((gap) => {
          const isCrit = gap.severity === "critical";
          const isWarn = gap.severity === "warning";

          return (
            <div
              key={gap.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: "var(--radius-sm)",
                background: isCrit
                  ? "var(--error-light)"
                  : isWarn
                  ? "var(--warn-light)"
                  : "var(--surface-alt)",
                border: `1px solid ${
                  isCrit
                    ? "var(--error-border)"
                    : isWarn
                    ? "var(--warn-border)"
                    : "var(--border)"
                }`,
                gap: 14,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span
                    className={`badge ${
                      isCrit ? "badge-error" : isWarn ? "badge-warn" : "badge-info"
                    }`}
                  >
                    {gap.severity.toUpperCase()}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)" }}>
                    {gap.title}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.45,
                    marginBottom: 4,
                  }}
                >
                  {gap.explanation}
                </p>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  <strong>Affected:</strong> {gap.affectedEntity} • <em>{gap.recommendedAction}</em>
                </div>
              </div>

              <button
                type="button"
                className={`btn btn-sm ${isCrit ? "btn-danger" : "btn-warn"}`}
                style={{ flexShrink: 0, marginTop: 4 }}
                onClick={() => handleFixAction(gap)}
              >
                {gap.actionLabel || "Fix Now"}
                <Icons.arrowRight size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
