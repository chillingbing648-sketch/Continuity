import React from "react";
import { ContinuityScoreCard } from "./ContinuityScoreCard";
import { CriticalGapsCard } from "./CriticalGapsCard";
import { UpcomingObligationsCard } from "./UpcomingObligationsCard";
import { FinancialOverviewCard } from "./FinancialOverviewCard";
import { Icons } from "../common/Icons";
import { useApp } from "../../context/AppContext";
import { timeAgo } from "../../utils/formatting";

export function DashboardView({ onNav }) {
  const { people, activity, continuity, openModal } = useApp();

  const primaryTrustee = people.find((p) => p.isPrimaryTrustee || p.role?.toLowerCase().includes("trustee"));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. CONTINUITY SCORE (Hero Card) */}
      <ContinuityScoreCard />

      {/* 2. CRITICAL GAPS SECTION */}
      <CriticalGapsCard onNav={onNav} />

      {/* 3. UPCOMING OBLIGATIONS & FINANCIAL OVERVIEW GRID */}
      <div className="grid-2">
        <UpcomingObligationsCard onNav={onNav} />
        <FinancialOverviewCard onNav={onNav} />
      </div>

      {/* 4. QUICK CONTINUITY SIMULATION & DRILL LAUNCHER */}
      <div className="grid-2">
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="card-title" style={{ marginBottom: 6 }}>
              <Icons.play size={18} style={{ color: "var(--accent)" }} />
              Continuity Simulation Engine
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 16 }}>
              Test what happens if you become unavailable today. Evaluates liquidity discovery, debt coverage, and nominee readiness against live data.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ alignSelf: "flex-start" }}
            onClick={() => openModal("simulateContinuity")}
          >
            Run Full Simulation
            <Icons.arrowRight size={14} />
          </button>
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="card-title" style={{ marginBottom: 6 }}>
              <Icons.flag size={18} style={{ color: "var(--purple)" }} />
              Trustee Continuity Drill
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 16 }}>
              Test whether {primaryTrustee?.name || "your trustee"} can locate emergency accounts, find insurance bonds, and contact key advisors.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ alignSelf: "flex-start" }}
            onClick={() => openModal("runDrill")}
          >
            Launch Drill Scenario
            <Icons.arrowRight size={14} />
          </button>
        </div>
      </div>

      {/* 5. AUDIT ACTIVITY TIMELINE PREVIEW */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Icons.activity size={18} style={{ color: "var(--text-secondary)" }} />
            Recent Continuity Audit Events
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onNav("activity")}
          >
            View Full Audit Trail
            <Icons.arrowRight size={14} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {activity.slice(0, 3).map((act) => (
            <div
              key={act.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                background: "var(--surface-alt)",
                fontSize: "0.85rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{act.action}</span>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>({act.affectedEntity})</span>
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {timeAgo(act.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
