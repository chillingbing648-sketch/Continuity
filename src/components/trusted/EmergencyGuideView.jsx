import React from "react";
import { Icons } from "../common/Icons";
import { useApp } from "../../context/AppContext";
import { fmt, fmtDate } from "../../utils/formatting";

export function EmergencyGuideView() {
  const { user, assets, people, documents, obligations, changeViewMode } = useApp();

  const primaryTrustee = people.find((p) => p.isPrimaryTrustee || p.role?.toLowerCase().includes("trustee")) || people[0];
  const bankAccounts = assets.filter((a) => a.type === "Banking");
  const insurancePolicies = assets.filter((a) => a.type === "Insurance");
  const liabilities = assets.filter((a) => a.type === "Loans" || (a.approxValue || 0) < 0);
  const properties = assets.filter((a) => a.type === "Property");
  const investments = assets.filter((a) => a.type === "Investments" || a.type === "Retirement");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900, margin: "0 auto" }}>
      {/* ACTION BAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => changeViewMode("owner")}
        >
          <Icons.arrowLeft size={16} />
          Back to Owner Command Center
        </button>

        <button type="button" className="btn btn-primary btn-sm" onClick={handlePrint}>
          <Icons.download size={16} />
          Print / Save Emergency Guide
        </button>
      </div>

      {/* DOCUMENT HEADER */}
      <div
        className="card"
        style={{
          padding: 28,
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAF9F6 100%)",
          border: "2px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "var(--accent)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icons.guide size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              If I Become Unavailable — Emergency Continuity Guide
            </h1>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
              Owner: <strong>{user?.name || "Harsh Dubey"}</strong> • Generated: {fmtDate(new Date().toISOString())}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--surface-alt)",
            padding: "14px 18px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            lineHeight: 1.55,
          }}
        >
          <strong>Notice to Primary Trustee ({primaryTrustee?.name || "Priya Mehta"}):</strong>
          <p style={{ marginTop: 4 }}>
            This document contains an actionable overview of {user?.name || "Harsh"}'s financial assets, insurance policies, obligations, and step-by-step claim instructions. Please proceed with the immediate actions below in sequence.
          </p>
        </div>
      </div>

      {/* SECTION 1: PRIMARY TRUSTEES & ADVISORS */}
      <div className="card">
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 14, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
          <Icons.people size={18} style={{ color: "var(--accent)" }} />
          1. Key Contacts & Advisors
        </h3>
        <div className="grid-2">
          {people.map((p) => (
            <div
              key={p.id}
              style={{
                padding: "12px 14px",
                borderRadius: "var(--radius-sm)",
                background: "var(--surface-alt)",
                border: "1px solid var(--border-light)",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                {p.name} ({p.relationship})
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 600, marginTop: 2 }}>
                Role: {p.role}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 4 }}>
                Phone: <strong>{p.phone}</strong> • Email: {p.email}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: IMMEDIATE EMERGENCY ACCOUNTS */}
      <div className="card">
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 14, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
          <Icons.bank size={18} style={{ color: "var(--accent)" }} />
          2. Primary Bank Accounts & Emergency Liquidity
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {bankAccounts.map((b) => (
            <div
              key={b.id}
              style={{
                padding: "12px 16px",
                borderRadius: "var(--radius-sm)",
                background: "var(--surface-alt)",
                border: "1px solid var(--border-light)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                  {b.name} — {b.institution}
                </span>
                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{fmt(b.approxValue)}</span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 4 }}>
                Account: <strong>{b.accountNumber || "****"}</strong> • Nominee: <strong>{b.nominee || "None"}</strong> ({b.nomineeVerified ? "Verified" : "Unverified"})
              </div>
              {b.instructions && (
                <div style={{ fontSize: "0.78rem", color: "var(--accent)", marginTop: 6, fontStyle: "italic" }}>
                  Note: {b.instructions}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: LIFE & HEALTH INSURANCE */}
      <div className="card">
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 14, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
          <Icons.umbrella size={18} style={{ color: "var(--warn)" }} />
          3. Life & Term Insurance Claim Procedures
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {insurancePolicies.map((ins) => (
            <div
              key={ins.id}
              style={{
                padding: "14px 16px",
                borderRadius: "var(--radius-sm)",
                background: "var(--warn-light)",
                border: "1px solid var(--warn-border)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                  {ins.name} ({ins.institution})
                </span>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--warn)" }}>
                  Sum Assured: {fmt(ins.approxValue)}
                </span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 4 }}>
                Policy Number: <strong>{ins.policyNumber || "N/A"}</strong> • Nominee: <strong>{ins.nominee || "Priya Mehta"}</strong>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-primary)", marginTop: 8, background: "white", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--warn-border)" }}>
                <strong>Claim Steps:</strong> {ins.instructions || "Contact insurer helpline with Death Certificate, Original Policy Document, and Nominee Bank Details."}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: LOANS & CRITICAL OBLIGATIONS */}
      <div className="card">
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 14, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
          <Icons.dollar size={18} style={{ color: "var(--error)" }} />
          4. Outstanding Liabilities & Monthly Auto-Debits
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {liabilities.map((loan) => (
            <div
              key={loan.id}
              style={{
                padding: "12px 16px",
                borderRadius: "var(--radius-sm)",
                background: "var(--surface-alt)",
                border: "1px solid var(--border-light)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{loan.name}</span>
                <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--error)" }}>
                  Outstanding: {fmt(Math.abs(loan.approxValue))}
                </span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 4 }}>
                Institution: <strong>{loan.institution}</strong> • Account/Loan ID: <strong>{loan.accountNumber || "N/A"}</strong>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-primary)", marginTop: 4 }}>
                Schedule: {loan.instructions || "Ensure linked bank account has sufficient balance for monthly EMI auto-debit."}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: REAL ESTATE PROPERTIES & INVESTMENTS */}
      <div className="card">
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 14, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
          <Icons.building size={18} style={{ color: "var(--purple)" }} />
          5. Properties & Investment Portfolios
        </h3>
        <div className="grid-2">
          {properties.map((prop) => (
            <div
              key={prop.id}
              style={{
                padding: "12px 14px",
                borderRadius: "var(--radius-sm)",
                background: "var(--surface-alt)",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>{prop.name}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                Valuation: {fmt(prop.approxValue)}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 4 }}>
                Address: {prop.address || "See legal deed"}
              </div>
            </div>
          ))}

          {investments.map((inv) => (
            <div
              key={inv.id}
              style={{
                padding: "12px 14px",
                borderRadius: "var(--radius-sm)",
                background: "var(--surface-alt)",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>{inv.name}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                {inv.subtype} • Approx: {fmt(inv.approxValue)}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 4 }}>
                Nominee: {inv.nominee || "Priya Mehta"} ({inv.nomineeVerified ? "Verified" : "Pending"})
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: VAULTED DOCUMENTS INVENTORY */}
      <div className="card">
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 14, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
          <Icons.docs size={18} style={{ color: "var(--accent)" }} />
          6. Vaulted Document Records
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {documents.map((doc) => (
            <div
              key={doc.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                background: "var(--surface-alt)",
                fontSize: "0.8rem",
              }}
            >
              <div>
                <strong>{doc.title}</strong> ({doc.docType})
                <span style={{ color: "var(--text-muted)", marginLeft: 8 }}>
                  Ref: {doc.identifier || "VAULT"}
                </span>
              </div>
              <span className={`badge ${doc.verified ? "badge-success" : "badge-neutral"}`}>
                {doc.verified ? "Verified" : "Unverified"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
