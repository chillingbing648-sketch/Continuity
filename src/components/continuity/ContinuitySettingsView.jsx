import React from "react";
import { Icons } from "../common/Icons";
import { useApp } from "../../context/AppContext";
import { fmtDate } from "../../utils/formatting";

export function ContinuitySettingsView() {
  const { continuity, people, openModal } = useApp();

  const primaryTrustee = people.find((p) => p.id === continuity?.notifyPersonId || p.isPrimaryTrustee);

  const lifecycleStages = [
    { id: "ACTIVE", label: "Active", desc: "User verified safe and healthy" },
    { id: "CHECK_IN_DUE", label: "Check-in Due", desc: "Scheduled interval reached" },
    { id: "REMINDER", label: "Reminder Sent", desc: "Digital reminder dispatched" },
    { id: "OVERDUE", label: "Overdue", desc: "Pending confirmation" },
    { id: "GRACE_PERIOD", label: "Grace Period", desc: `${continuity?.gracePeriod || 15} day buffer window` },
    { id: "ESCALATION", label: "Escalation", desc: "Secondary alert to owner" },
    { id: "TRUSTED_NOTIFICATION", label: "Trustee Alert", desc: "Primary trustee notified" },
    { id: "CONTINUITY_ACTIVATION", label: "Activation", desc: "Emergency handoff accessible" },
  ];

  const currentStage = continuity?.protocolState || "ACTIVE";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. CHECK-IN LIFECYCLE MONITOR */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Icons.clock size={18} style={{ color: "var(--accent)" }} />
            Automated Check-in Lifecycle State
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => openModal("checkinModal")}
          >
            <Icons.checkCircle size={14} />
            Check In Now
          </button>
        </div>

        {/* TIMELINE PROGRESSION BAR */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
            gap: 8,
            marginBottom: 20,
          }}
        >
          {lifecycleStages.map((stage, idx) => {
            const isCurrent = stage.id === currentStage;
            const isPassed = idx === 0 && currentStage === "ACTIVE";

            return (
              <div
                key={stage.id}
                style={{
                  padding: "10px 10px",
                  borderRadius: "var(--radius-sm)",
                  background: isCurrent ? "var(--accent-light)" : "var(--surface-alt)",
                  border: `1px solid ${isCurrent ? "var(--accent)" : "var(--border-light)"}`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: isCurrent ? "var(--accent)" : "var(--text-muted)",
                    marginBottom: 2,
                  }}
                >
                  Step {idx + 1}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: isCurrent ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  {stage.label}
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 2 }}>
                  {stage.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* STATUS METRICS */}
        <div className="grid-3">
          <div style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "var(--surface-alt)" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Last Verified Check-in
            </span>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginTop: 2 }}>
              {fmtDate(continuity?.lastCheckin)}
            </div>
            <span className="badge badge-success" style={{ marginTop: 4 }}>
              Confirmed Safe
            </span>
          </div>

          <div style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "var(--surface-alt)" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Next Scheduled Check-in
            </span>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginTop: 2 }}>
              {fmtDate(continuity?.nextCheckin)}
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4, display: "block" }}>
              Interval: Every {continuity?.frequency || 30} days
            </span>
          </div>

          <div style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "var(--surface-alt)" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Escalation Contact
            </span>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginTop: 2 }}>
              {primaryTrustee?.name || "Priya Mehta"}
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 4, display: "block" }}>
              Grace period: {continuity?.gracePeriod || 15} days
            </span>
          </div>
        </div>
      </div>

      {/* 2. CONTINUITY SIMULATION & DRILL CONTROLS */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Icons.play size={18} style={{ color: "var(--accent)" }} />
              Continuity Simulation
            </div>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 16 }}>
            Run an end-to-end simulation of what happens if you become unavailable today. Analyzes emergency fund discovery, debt protection, and legal document completeness.
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => openModal("simulateContinuity")}
          >
            Launch Simulation
            <Icons.arrowRight size={14} />
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Icons.flag size={18} style={{ color: "var(--purple)" }} />
              Continuity Drill Scenario
            </div>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 16 }}>
            Test whether {primaryTrustee?.name || "your primary trustee"} can navigate emergency accounts, locate insurance claim forms, and find advisor phone numbers.
          </p>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => openModal("runDrill")}
            >
              Run Continuity Drill
              <Icons.arrowRight size={14} />
            </button>
            {continuity?.lastDrillScore && (
              <span className="badge badge-success">
                Last Score: {continuity.lastDrillScore}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. PROTOCOL CONFIGURATION */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Icons.settings size={18} style={{ color: "var(--text-secondary)" }} />
            Protocol Parameters & Safeguards
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => openModal("editContinuity")}
          >
            <Icons.edit size={14} />
            Edit Protocol
          </button>
        </div>

        <div className="grid-2">
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: 6 }}>
              <span style={{ color: "var(--text-secondary)" }}>Protocol Status:</span>
              <span className="badge badge-success">Active & Monitored</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: 6 }}>
              <span style={{ color: "var(--text-secondary)" }}>Check-in Frequency:</span>
              <strong>Every {continuity?.frequency || 30} Days</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: 6 }}>
              <span style={{ color: "var(--text-secondary)" }}>Grace Period Buffer:</span>
              <strong>{continuity?.gracePeriod || 15} Days</strong>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: 6 }}>
              <span style={{ color: "var(--text-secondary)" }}>Advance Reminder:</span>
              <strong>{continuity?.reminderDays || 3} Days prior</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: 6 }}>
              <span style={{ color: "var(--text-secondary)" }}>Primary Trustee:</span>
              <strong>{primaryTrustee?.name || "Priya Mehta"}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: 6 }}>
              <span style={{ color: "var(--text-secondary)" }}>Handoff Access Mode:</span>
              <strong>{continuity?.initialAccess === "full" ? "Full Access" : "Limited Emergency Access"}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
