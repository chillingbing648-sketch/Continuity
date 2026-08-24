import React from "react";
import { Icons } from "../common/Icons";
import { useApp } from "../../context/AppContext";

export function TrustedPersonReadinessCard({ person, onEditPermissions, onEditPerson }) {
  const { openModal } = useApp();
  const profile = person.readinessProfile || {};

  const checks = [
    { label: "Identity & KYC", passed: Boolean(profile.identityVerified) },
    { label: "Invitation Accepted", passed: Boolean(profile.invitationAccepted || person.status === "Verified") },
    { label: "Permissions Configured", passed: Boolean(person.permissions && person.permissions.length > 0) },
    { label: "Vault Documents Viewed", passed: Boolean(profile.documentsViewed) },
    { label: "Emergency Guide Read", passed: Boolean(profile.emergencyGuideRead) },
    { label: "Continuity Drill Completed", passed: Boolean(profile.drillCompleted) },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const readinessPct = Math.round((passedCount / checks.length) * 100);

  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="avatar avatar-lg">{person.avatar || "TP"}</div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {person.name}
              </h3>
              {person.isPrimaryTrustee && (
                <span className="badge badge-success">Primary Trustee</span>
              )}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
              {person.relationship} • {person.role} • {person.phone}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.25rem", fontWeight: 800, color: readinessPct >= 80 ? "var(--accent)" : "var(--warn)" }}>
            {readinessPct}% READY
          </div>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            Level: {person.permissionLevel || "Full Trustee"}
          </span>
        </div>
      </div>

      {/* READINESS CHECKPOINTS LIST */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 8,
          background: "var(--surface-alt)",
          padding: "12px 14px",
          borderRadius: "var(--radius-sm)",
          marginBottom: 14,
        }}
      >
        {checks.map((chk, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem" }}>
            <span
              style={{
                color: chk.passed ? "var(--success)" : "var(--text-muted)",
                display: "flex",
                fontWeight: 700,
              }}
            >
              {chk.passed ? <Icons.check size={14} /> : "✗"}
            </span>
            <span style={{ color: chk.passed ? "var(--text-primary)" : "var(--text-muted)" }}>
              {chk.label}
            </span>
          </div>
        ))}
      </div>

      {/* FOOTER ACTIONS */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          Last confirmation: {profile.lastConfirmationDaysAgo ? `${profile.lastConfirmationDaysAgo} days ago` : "Recent"}
        </span>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onEditPermissions(person)}
          >
            <Icons.key size={13} />
            Permissions
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onEditPerson(person)}
          >
            <Icons.edit size={13} />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
