import React from "react";
import { ProgressRing } from "../common/ProgressRing";
import { Icons } from "../common/Icons";
import { useApp } from "../../context/AppContext";

export function ContinuityScoreCard() {
  const { continuityScoreData, openModal } = useApp();
  const { score, summary, criticalCount, warningCount, readyCount } = continuityScoreData;

  const scoreColor =
    score >= 80 ? "var(--accent)" : score >= 60 ? "var(--warn)" : "var(--error)";

  return (
    <div
      className="card"
      style={{
        background: "linear-gradient(180deg, var(--surface) 0%, #FAF9F6 100%)",
        border: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <ProgressRing
            value={score}
            max={100}
            size={110}
            stroke={10}
            fillColor={scoreColor}
          >
            <span
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "var(--text-primary)",
                lineHeight: 1,
              }}
            >
              {score}
            </span>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                marginTop: 2,
                textTransform: "uppercase",
              }}
            >
              / 100
            </span>
          </ProgressRing>

          <div>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "var(--text-muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Continuity Score
            </div>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
                marginBottom: 6,
              }}
            >
              {summary}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span className="badge badge-error">
                <Icons.alertTriangle size={12} />
                {criticalCount} Critical Gaps
              </span>
              <span className="badge badge-warn">
                <Icons.clock size={12} />
                {warningCount} Warnings
              </span>
              <span className="badge badge-success">
                <Icons.checkCircle size={12} />
                {readyCount} Ready
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => openModal("simulateContinuity")}
          >
            <Icons.play size={14} style={{ color: "var(--accent)" }} />
            Simulate Continuity
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => openModal("scoreBreakdown")}
          >
            View Breakdown
            <Icons.arrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
