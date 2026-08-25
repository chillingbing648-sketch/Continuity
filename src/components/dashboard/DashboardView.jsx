import React from "react";
import { ContinuityScoreCard } from "./ContinuityScoreCard";
import { CriticalGapsCard } from "./CriticalGapsCard";
import { UpcomingObligationsCard } from "./UpcomingObligationsCard";
import { FinancialOverviewCard } from "./FinancialOverviewCard";
import { Icons } from "../common/Icons";
import { useApp } from "../../context/AppContext";
import { timeAgo } from "../../utils/formatting";

export function DashboardView({ onNav }) {
  const {
    user,
    assets,
    people,
    activity,
    continuity,
    openModal,
    isDemoMode,
    enterDemoMode,
    setOnboardingOpen,
  } = useApp();

  const primaryTrustee = people.find((p) => p.isPrimaryTrustee || p.role?.toLowerCase().includes("trustee"));
  const hasAssets = assets.length > 0;
  const displayName = user?.name || "there";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 0. CLEAN WORKSPACE WELCOME BANNER (for new users without assets) */}
      {!hasAssets && !isDemoMode && (
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #40916C 100%)",
            color: "white",
            padding: "26px 30px",
            border: "none",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div style={{ maxWidth: 640 }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.85, fontWeight: 700 }}>
                Clean Workspace Active
              </div>
              <h2 style={{ fontSize: "1.45rem", fontWeight: 800, letterSpacing: "-0.02em", marginTop: 4 }}>
                Welcome to Continuity, {displayName}
              </h2>
              <p style={{ fontSize: "0.9rem", opacity: 0.92, marginTop: 8, lineHeight: 1.55 }}>
                Your financial continuity workspace is ready. Protect your loved ones by registering your assets, assigning verified nominees, and designating your trusted person.
              </p>

              <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ background: "white", color: "var(--accent)", border: "none", fontWeight: 700 }}
                  onClick={() => openModal("addAsset")}
                >
                  <Icons.plus size={15} />
                  Add Your First Asset
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}
                  onClick={() => openModal("addPerson")}
                >
                  <Icons.user size={15} />
                  Add Trusted Person
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}
                  onClick={enterDemoMode}
                >
                  <Icons.sparkles size={15} />
                  Explore Demo Mode
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}
                  onClick={() => onNav("library")}
                >
                  <Icons.guide size={15} />
                  Open Library Playbook
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

        {activity.length === 0 ? (
          <div style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            No audit events recorded yet. Actions like adding assets or updating nominees will appear in this timeline.
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
