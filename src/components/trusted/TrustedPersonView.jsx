import React from "react";
import { Icons } from "../common/Icons";
import { useApp } from "../../context/AppContext";
import { fmt, fmtDate } from "../../utils/formatting";

export function TrustedPersonView({ onNav }) {
  const { user, assets, people, documents, obligations, changeViewMode, openModal } = useApp();

  const primaryTrustee = people.find((p) => p.isPrimaryTrustee || p.role?.toLowerCase().includes("trustee")) || people[0];
  const emergencyFunds = assets.filter((a) => a.isEmergencyFund || a.type === "Banking");
  const insurancePolicies = assets.filter((a) => a.type === "Insurance");
  const loans = assets.filter((a) => a.type === "Loans" || (a.approxValue || 0) < 0);
  const advisors = people.filter((p) => p.role?.toLowerCase().includes("advisor"));
  const criticalDocs = documents.filter((d) => d.verified || d.category === "Legal" || d.category === "Property");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* HEADER BANNER */}
      <div
        style={{
          padding: "20px 24px",
          borderRadius: "var(--radius-md)",
          background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.85, fontWeight: 700 }}>
            {primaryTrustee?.name?.toUpperCase() || "TRUSTEE"}'S CONTINUITY ACTION GUIDE
          </span>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em", marginTop: 4 }}>
            {user?.name || "Harsh"}'s Continuity Access
          </h2>
          <p style={{ fontSize: "0.85rem", opacity: 0.9, marginTop: 4, maxWidth: 520, lineHeight: 1.45 }}>
            You are authorized as the designated Primary Trustee. This view is structured as a clear, prioritized action guide if the account owner becomes unavailable.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => changeViewMode("emergency")}
          >
            <Icons.guide size={14} />
            Emergency Playbook
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => changeViewMode("owner")}
          >
            <Icons.user size={14} />
            Return to Owner View
          </button>
        </div>
      </div>

      {/* IMMEDIATE PRIORITIES CHECKLIST */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Icons.checkCircle size={18} style={{ color: "var(--accent)" }} />
            Immediate Action Sequence
          </div>
          <span className="badge badge-info">Step-by-Step Priority</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 14px",
              borderRadius: "var(--radius-sm)",
              background: "var(--surface-alt)",
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "var(--accent)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.78rem",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              1
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                Secure Emergency Family Liquidity
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                Primary household bank account ({emergencyFunds[0]?.name || "HDFC Savings"} - {emergencyFunds[0]?.accountNumber || "****4521"}). Maintain minimum balance for ongoing household expenses.
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 14px",
              borderRadius: "var(--radius-sm)",
              background: "var(--surface-alt)",
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "var(--accent)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.78rem",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              2
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                Initiate Life Insurance Claim
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                Policy: {insurancePolicies[0]?.name || "LIC Term Plan"} (#{insurancePolicies[0]?.policyNumber || "LIC-781234"}). Sum Assured: {fmt(insurancePolicies[0]?.approxValue || 5000000)}. Submit death certificate and nominee KYC.
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 14px",
              borderRadius: "var(--radius-sm)",
              background: "var(--surface-alt)",
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "var(--accent)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.78rem",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              3
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                Monitor Loan EMI & Auto-Debits
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                Loan: {loans[0]?.name || "Home Loan"}. EMI of ₹28,000 debits on 5th of every month. Ensure linked account remains funded to prevent penal interest.
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 14px",
              borderRadius: "var(--radius-sm)",
              background: "var(--surface-alt)",
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "var(--accent)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.78rem",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              4
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                Consult Designated Financial Advisor
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                Contact {advisors[0]?.name || "Rahul Mehta"} ({advisors[0]?.phone || "+91 98000 22222"}) before liquidating equity portfolios or executing property deeds.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EMERGENCY CONTACTS & ADVISORS */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Icons.users size={18} style={{ color: "var(--accent)" }} />
              Key Advisors & Contacts
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {people.map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--surface-alt)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="avatar">{p.avatar || "P"}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{p.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {p.relationship} • {p.phone}
                    </div>
                  </div>
                </div>
                <span className="badge badge-neutral">{p.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* VAULTED EMERGENCY DOCUMENTS */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Icons.docs size={18} style={{ color: "var(--accent)" }} />
              Critical Legal & Proof Documents
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {criticalDocs.slice(0, 4).map((d) => (
              <div
                key={d.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--surface-alt)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icons.file size={16} style={{ color: "var(--accent)" }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{d.title}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {d.docType} • {d.institution || "Vaulted"}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => openModal("docDetail", { doc: d })}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
