import React from "react";
import { Icons } from "../common/Icons";
import { fmt, fmtDate } from "../../utils/formatting";
import { useApp } from "../../context/AppContext";

export function UpcomingObligationsCard({ onNav }) {
  const { obligations, assets } = useApp();

  // Sort upcoming obligations by due date
  const sortedObligations = [...obligations].sort((a, b) => {
    return new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime();
  });

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Icons.calendar size={18} style={{ color: "var(--accent)" }} />
          Upcoming Financial Obligations
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => onNav("calendar")}
        >
          View Full Calendar
          <Icons.arrowRight size={14} />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sortedObligations.slice(0, 3).map((obl) => {
          const sourceBank = assets.find((a) => a.id === obl.paymentSourceAssetId);

          return (
            <div
              key={obl.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                background: "var(--surface-alt)",
                border: "1px solid var(--border-light)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: obl.criticality === "Critical" ? "var(--error-light)" : "var(--warn-light)",
                    color: obl.criticality === "Critical" ? "var(--error)" : "var(--warn)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icons.clock size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>
                    {obl.title}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Due: <strong>{fmtDate(obl.nextDueDate)}</strong> • {obl.frequency}
                    {sourceBank ? ` • Debits: ${sourceBank.name}` : ""}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                  {fmt(obl.amount)}
                </div>
                <span className={`badge ${obl.autoDebit ? "badge-success" : "badge-warn"}`}>
                  {obl.autoDebit ? "Auto-Debit" : "Manual Pay"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
