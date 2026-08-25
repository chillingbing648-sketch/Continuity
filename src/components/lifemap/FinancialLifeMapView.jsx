import React, { useState } from "react";
import { Icons } from "../common/Icons";
import { useApp } from "../../context/AppContext";
import { fmt } from "../../utils/formatting";
import { catColor, catBg } from "../../utils/colorHelpers";

export function FinancialLifeMapView() {
  const { user, assets, people, documents, obligations, financialDependencies, openModal } = useApp();
  const [selectedNode, setSelectedNode] = useState(null);

  const primaryTrustee = people.find((p) => p.isPrimaryTrustee || p.role?.toLowerCase().includes("trustee"));
  const positiveAssets = assets.filter((a) => (a.approxValue || 0) > 0);
  const liabilities = assets.filter((a) => (a.approxValue || 0) < 0 || a.type === "Loans");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Financial Life Relationship Map
          </h2>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
            Connected graph of people, institutions, assets, obligations, and continuity instructions.
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => openModal("simulateContinuity")}
        >
          <Icons.play size={14} style={{ color: "var(--accent)" }} />
          Simulate Impact Pathways
        </button>
      </div>

      {/* CORE MAP GRAPH CONTAINER */}
      <div
        className="card"
        style={{
          padding: 24,
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAF9F6 100%)",
          border: "1px solid var(--border)",
          overflowX: "auto",
        }}
      >
        <div style={{ minWidth: 800, display: "flex", flexDirection: "column", gap: 28 }}>
          {/* LEVEL 1: YOU (ROOT NODE) */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                padding: "12px 24px",
                borderRadius: "var(--radius-md)",
                background: "var(--accent)",
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: 12,
                boxShadow: "0 4px 14px rgba(45, 106, 79, 0.25)",
              }}
            >
              <div className="avatar" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
                {user?.avatar || "HD"}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "1rem" }}>{user?.name || "Harsh Dubey"} (You)</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.85 }}>Primary Financial Architect</div>
              </div>
            </div>
          </div>

          {/* CONNECTOR LINE */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: -16, marginBottom: -16 }}>
            <div style={{ width: 2, height: 28, background: "var(--border)" }} />
          </div>

          {/* LEVEL 2: TRUSTED NETWORK (PEOPLE) */}
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center", marginBottom: 8 }}>
              Level 1 — Trusted Network & Trustees
            </div>
            {people.length === 0 ? (
              <div style={{ textAlign: "center", padding: "10px", color: "var(--text-muted)", fontSize: "0.82rem" }}>
                No trusted persons designated yet.{" "}
                <button type="button" className="btn btn-ghost btn-sm" style={{ color: "var(--accent)" }} onClick={() => openModal("addPerson")}>
                  + Add Trustee
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                {people.map((p) => (
                  <div
                    key={p.id}
                    className="card card-clickable"
                    onClick={() => openModal("editPerson", { person: p })}
                    style={{
                      padding: "10px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      borderRadius: "var(--radius-sm)",
                      background: p.isPrimaryTrustee ? "var(--accent-light)" : "var(--surface)",
                      borderColor: p.isPrimaryTrustee ? "var(--accent)" : "var(--border)",
                    }}
                  >
                    <div className="avatar" style={{ width: 28, height: 28, fontSize: "0.72rem" }}>
                      {p.avatar || "P"}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                        {p.relationship} • {p.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CONNECTOR LINE */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: -16, marginBottom: -16 }}>
            <div style={{ width: 2, height: 28, background: "var(--border)" }} />
          </div>

          {/* LEVEL 3: FINANCIAL HOLDINGS & INSTITUTIONS */}
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center", marginBottom: 8 }}>
              Level 2 — Financial Assets & Institutions
            </div>
            {positiveAssets.length === 0 ? (
              <div style={{ textAlign: "center", padding: "10px", color: "var(--text-muted)", fontSize: "0.82rem" }}>
                No financial holdings registered yet.{" "}
                <button type="button" className="btn btn-ghost btn-sm" style={{ color: "var(--accent)" }} onClick={() => openModal("addAsset")}>
                  + Add Asset
                </button>
              </div>
            ) : (
              <div className="grid-3">
                {positiveAssets.map((asset) => {
                  return (
                    <div
                      key={asset.id}
                      className="card card-clickable"
                      onClick={() => openModal("assetDetail", { asset })}
                      style={{
                        padding: "12px 14px",
                        background: catBg(asset.type),
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: catColor(asset.type), textTransform: "uppercase" }}>
                          {asset.type}
                        </span>
                        <strong style={{ fontSize: "0.85rem" }}>{fmt(asset.approxValue)}</strong>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}>
                        {asset.name}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>
                        Institution: {asset.institution}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: 6, borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 4 }}>
                        Nominee: <strong>{asset.nominee || "Unassigned"}</strong> ({asset.nomineeVerified ? "✓ Verified" : "⚠ Pending"})
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CONNECTOR LINE */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: -16, marginBottom: -16 }}>
            <div style={{ width: 2, height: 28, background: "var(--border)" }} />
          </div>

          {/* LEVEL 4: OBLIGATIONS & LIABILITIES DEPENDENCIES */}
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center", marginBottom: 8 }}>
              Level 3 — Obligations, Debts & Document Dependencies
            </div>
            <div className="grid-2">
              {/* LIABILITIES & OBLIGATIONS */}
              <div className="card" style={{ padding: "14px 16px" }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--error)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icons.dollar size={16} />
                  Debts & Auto-Debit Dependents
                </div>
                {obligations.length === 0 ? (
                  <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", padding: "8px 0" }}>
                    No recurring obligations or debts registered.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {obligations.map((obl) => {
                      const sourceBank = assets.find((a) => a.id === obl.paymentSourceAssetId);

                      return (
                        <div
                          key={obl.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.8rem",
                            padding: "6px 10px",
                            borderRadius: 6,
                            background: "var(--surface-alt)",
                          }}
                        >
                          <div>
                            <strong>{obl.title}</strong>
                            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                              Debits from: {sourceBank ? sourceBank.name : "Unlinked"}
                            </div>
                          </div>
                          <strong style={{ color: "var(--error)" }}>{fmt(obl.amount)}</strong>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* VAULTED DOCUMENTS */}
              <div className="card" style={{ padding: "14px 16px" }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--accent)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icons.docs size={16} />
                  Verified Evidence Vault
                </div>
                {documents.length === 0 ? (
                  <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", padding: "8px 0" }}>
                    No documents uploaded to vault yet.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {documents.slice(0, 4).map((d) => (
                      <div
                        key={d.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.8rem",
                          padding: "6px 10px",
                          borderRadius: 6,
                          background: "var(--surface-alt)",
                        }}
                      >
                        <div>
                          <strong>{d.title}</strong>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            Type: {d.docType}
                          </div>
                        </div>
                        <span className={`badge ${d.verified ? "badge-success" : "badge-neutral"}`}>
                          {d.verified ? "Verified" : "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FINANCIAL DEPENDENCIES INSIGHT */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Icons.link size={18} style={{ color: "var(--accent)" }} />
            Account Liquidity & Obligation Dependencies
          </div>
        </div>

        {financialDependencies.length === 0 ? (
          <div style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Add liquid bank accounts and recurring obligations to analyze auto-debit runway and payment dependencies.
          </div>
        ) : (
          <div className="grid-2">
            {financialDependencies.map((dep) => (
              <div
                key={dep.bankAccount.id}
                style={{
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--surface-alt)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>
                    {dep.bankAccount.name}
                  </strong>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    {fmt(dep.bankAccount.approxValue)}
                  </span>
                </div>

                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 4 }}>
                  Supports <strong>{dep.obligationCount} financial obligations</strong> totaling{" "}
                  <strong>{fmt(dep.monthlyBurden)} / mo</strong>.
                </div>

                <div style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: 600, marginTop: 4 }}>
                  Estimated liquidity runway: {dep.runwayMonths} months
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
