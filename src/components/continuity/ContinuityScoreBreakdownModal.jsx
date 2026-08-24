import React from "react";
import { Modal } from "../common/Modal";
import { Icons } from "../common/Icons";
import { ProgressRing } from "../common/ProgressRing";
import { useApp } from "../../context/AppContext";

export function ContinuityScoreBreakdownModal({ onClose }) {
  const { continuityScoreData, openModal } = useApp();
  const { score, summary, breakdowns } = continuityScoreData;

  const scoreColor =
    score >= 80 ? "var(--accent)" : score >= 60 ? "var(--warn)" : "var(--error)";

  return (
    <Modal
      title="Continuity Score Breakdown"
      subtitle="Deterministic evaluation across 10 vital financial readiness dimensions"
      onClose={onClose}
      size="large"
      footer={
        <button className="btn btn-primary" onClick={onClose} type="button">
          Done
        </button>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* SUMMARY HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "16px 20px",
            background: "var(--surface-alt)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
          }}
        >
          <ProgressRing
            value={score}
            max={100}
            size={80}
            stroke={8}
            fillColor={scoreColor}
          >
            <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {score}
            </span>
          </ProgressRing>

          <div>
            <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-primary)" }}>
              {summary}
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
              Score is calculated dynamically based on registered nominees, document vault verification, debt linkage, and trustee readiness.
            </p>
          </div>
        </div>

        {/* DIMENSIONS LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {breakdowns.map((dim) => {
            const isReady = dim.status === "ready";
            const isWarn = dim.status === "warning";

            return (
              <div
                key={dim.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: isReady
                        ? "var(--success-light)"
                        : isWarn
                        ? "var(--warn-light)"
                        : "var(--error-light)",
                      color: isReady
                        ? "var(--success)"
                        : isWarn
                        ? "var(--warn)"
                        : "var(--error)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isReady ? (
                      <Icons.check size={16} />
                    ) : isWarn ? (
                      <Icons.clock size={16} />
                    ) : (
                      <Icons.alertTriangle size={16} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>
                      {dim.title}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 1 }}>
                      {dim.detail}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                    {dim.score} / {dim.maxScore}
                  </div>
                  <span
                    className={`badge ${
                      isReady ? "badge-success" : isWarn ? "badge-warn" : "badge-error"
                    }`}
                  >
                    {isReady ? "Optimal" : isWarn ? "Needs Review" : "Critical Gap"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
