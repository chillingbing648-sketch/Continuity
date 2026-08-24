import React from "react";
import { Icons } from "../common/Icons";
import { EmptyState } from "../common/EmptyState";
import { useApp } from "../../context/AppContext";
import { fmt, fmtDate } from "../../utils/formatting";

export function FinancialCalendarView() {
  const { obligations, assets, openModal, deleteObligation } = useApp();

  const totalMonthly = obligations.reduce((sum, o) => {
    if (o.frequency === "Monthly") return sum + (o.amount || 0);
    if (o.frequency === "Quarterly") return sum + (o.amount || 0) / 3;
    if (o.frequency === "Annual") return sum + (o.amount || 0) / 12;
    return sum;
  }, 0);

  const handleDelete = (obl) => {
    openModal("confirm", {
      title: "Delete Obligation",
      desc: `Remove ${obl.title} from recurring calendar schedule?`,
      isDanger: true,
      onConfirm: () => deleteObligation(obl.id),
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Financial Calendar & Recurring Obligations
          </h2>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
            Track recurring EMIs, insurance premiums, SIP auto-debits, and maturity milestones.
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => openModal("addObligation")}
        >
          <Icons.plus size={15} />
          Add Obligation
        </button>
      </div>

      {/* MONTHLY SUMMARY METRICS */}
      <div className="grid-3">
        <div className="card" style={{ padding: "14px 18px" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Estimated Monthly Outflow
          </div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", marginTop: 2 }}>
            {fmt(totalMonthly)} / mo
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>
            Across {obligations.length} recurring obligations
          </div>
        </div>

        <div className="card" style={{ padding: "14px 18px" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Auto-Debit Protected
          </div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--accent)", marginTop: 2 }}>
            {obligations.filter((o) => o.autoDebit).length} of {obligations.length}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>
            Automated mandate active
          </div>
        </div>

        <div className="card" style={{ padding: "14px 18px" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Critical Obligations
          </div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--warn)", marginTop: 2 }}>
            {obligations.filter((o) => o.criticality === "Critical" || o.criticality === "High").length}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>
            Home loans & insurance premiums
          </div>
        </div>
      </div>

      {/* OBLIGATIONS LIST */}
      {obligations.length === 0 ? (
        <EmptyState
          icon={<Icons.calendar size={24} />}
          title="No recurring obligations scheduled"
          desc="Add loan EMIs, life insurance premium dates, or SIP debits to prevent accidental default."
          action={
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => openModal("addObligation")}
            >
              <Icons.plus size={14} />
              Add First Obligation
            </button>
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {obligations.map((obl) => {
            const sourceBank = assets.find((a) => a.id === obl.paymentSourceAssetId);

            return (
              <div
                key={obl.id}
                className="card"
                style={{
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: obl.autoDebit ? "var(--accent-light)" : "var(--warn-light)",
                      color: obl.autoDebit ? "var(--accent)" : "var(--warn)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icons.calendar size={20} />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        {obl.title}
                      </h3>
                      <span className="badge badge-neutral">{obl.type}</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 3 }}>
                      Next Due: <strong>{fmtDate(obl.nextDueDate)}</strong> • Frequency: {obl.frequency}
                      {sourceBank && (
                        <span> • Auto-Debits from: <strong>{sourceBank.name}</strong></span>
                      )}
                    </div>
                    {obl.instructions && (
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>
                        Instruction: {obl.instructions}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-primary)" }}>
                      {fmt(obl.amount)}
                    </div>
                    <span className={`badge ${obl.autoDebit ? "badge-success" : "badge-warn"}`} style={{ marginTop: 2 }}>
                      {obl.autoDebit ? "Auto-Debit" : "Manual Pay"}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn-icon"
                    style={{ color: "var(--error)" }}
                    onClick={() => handleDelete(obl)}
                    title="Delete Obligation"
                  >
                    <Icons.trash size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
