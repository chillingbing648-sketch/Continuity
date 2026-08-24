import React, { useMemo } from "react";
import { Modal } from "../common/Modal";
import { Icons } from "../common/Icons";
import { useApp } from "../../context/AppContext";
import { runContinuitySimulation } from "../../services/continuityEngine";
import { fmt } from "../../utils/formatting";

export function ContinuitySimulationModal({ onClose }) {
  const { assets, people, documents, continuity, obligations, changeViewMode } = useApp();

  const simResult = useMemo(() => {
    return runContinuitySimulation(assets, people, documents, continuity, obligations);
  }, [assets, people, documents, continuity, obligations]);

  const { readinessPercent, checkpoints, immediateActionGuide, summary } = simResult;

  const scoreColor =
    readinessPercent >= 80 ? "var(--accent)" : readinessPercent >= 60 ? "var(--warn)" : "var(--error)";

  return (
    <Modal
      title="Continuity Readiness Simulation"
      subtitle="Hypothetical analysis: 'What would happen if I became unavailable today?'"
      onClose={onClose}
      size="xlarge"
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              onClose();
              changeViewMode("emergency");
            }}
          >
            <Icons.guide size={16} />
            View Full Emergency Playbook
          </button>
          <button className="btn btn-primary" onClick={onClose} type="button">
            Done
          </button>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* SIMULATION READINESS BANNER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
            color: "white",
            borderRadius: "var(--radius-md)",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.85, fontWeight: 700 }}>
              Continuity Simulation Report
            </div>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginTop: 4, letterSpacing: "-0.02em" }}>
              {readinessPercent}% Immediate Family Readiness
            </h3>
            <p style={{ fontSize: "0.85rem", opacity: 0.9, marginTop: 4, maxWidth: 460 }}>
              Based on your current {assets.length} financial holdings, {people.length} contacts, and {documents.length} verified documents.
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, lineHeight: 1 }}>{readinessPercent}%</div>
            <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: 4 }}>
              {checkpoints.filter((c) => c.passed).length} of {checkpoints.length} pathways ready
            </div>
          </div>
        </div>

        {/* FINANCIAL SUMMARY HIGHLIGHTS */}
        <div className="grid-3">
          <div className="card" style={{ padding: "12px 16px" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Immediate Liquid Funds
            </div>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", marginTop: 2 }}>
              {fmt(summary.totalEmergencyValue)}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              Accessible for urgent family expenses
            </div>
          </div>

          <div className="card" style={{ padding: "12px 16px" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Life Insurance Cover
            </div>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--accent)", marginTop: 2 }}>
              {fmt(summary.totalInsuranceCover)}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              Claimable by designated nominee
            </div>
          </div>

          <div className="card" style={{ padding: "12px 16px" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Debt Obligations
            </div>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--error)", marginTop: 2 }}>
              {fmt(summary.totalDebt)}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              Requires active EMI protection
            </div>
          </div>
        </div>

        {/* CHECKPOINTS EVALUATION */}
        <div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>
            Pathways & Checkpoint Results
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {checkpoints.map((cp, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  background: cp.passed ? "var(--surface-alt)" : "var(--warn-light)",
                  border: `1px solid ${cp.passed ? "var(--border-light)" : "var(--warn-border)"}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: cp.passed ? "var(--success-light)" : "var(--warn-light)",
                      color: cp.passed ? "var(--success)" : "var(--warn)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {cp.passed ? <Icons.check size={14} /> : <Icons.alertTriangle size={14} />}
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>
                      {cp.title}
                    </span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      {cp.detail}
                    </div>
                  </div>
                </div>

                <span className={`badge ${cp.passed ? "badge-success" : "badge-warn"}`}>
                  {cp.passed ? "Verified" : "Action Needed"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* IMMEDIATE ACTION GUIDE FOR TRUSTED PERSON */}
        <div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>
            Generated Emergency Action Sequence (For Your Trustee)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {immediateActionGuide.map((ag) => (
              <div
                key={ag.step}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {ag.step}
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>
                    {ag.category}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                    {ag.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
