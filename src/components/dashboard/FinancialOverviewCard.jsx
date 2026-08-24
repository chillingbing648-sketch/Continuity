import React from "react";
import { Icons } from "../common/Icons";
import { fmt } from "../../utils/formatting";
import { catColor, catBg } from "../../utils/colorHelpers";
import { useApp } from "../../context/AppContext";

export function FinancialOverviewCard({ onNav }) {
  const { assets } = useApp();

  const positiveAssets = assets.filter((a) => (a.approxValue || 0) > 0);
  const totalAssets = positiveAssets.reduce((sum, a) => sum + a.approxValue, 0);

  const liabilities = assets.filter((a) => (a.approxValue || 0) < 0 || a.type === "Loans");
  const totalLiabilities = liabilities.reduce((sum, a) => sum + Math.abs(a.approxValue || 0), 0);

  const netPosition = totalAssets - totalLiabilities;

  // Protected assets (Nominee verified)
  const protectedValue = positiveAssets
    .filter((a) => a.nomineeVerified)
    .reduce((sum, a) => sum + a.approxValue, 0);

  const protectedPct = totalAssets > 0 ? Math.round((protectedValue / totalAssets) * 100) : 0;

  // Group by category
  const categories = ["Banking", "Investments", "Insurance", "Property", "Retirement", "Loans"];
  const categoryTotals = categories.map((cat) => {
    const items = assets.filter((a) => a.type === cat);
    const total = items.reduce((sum, a) => sum + Math.abs(a.approxValue || 0), 0);
    return { category: cat, total, count: items.length };
  }).filter((c) => c.count > 0);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Icons.trending size={18} style={{ color: "var(--accent)" }} />
          Financial Continuity Overview
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => onNav("assets")}
        >
          View All Inventory
          <Icons.arrowRight size={14} />
        </button>
      </div>

      {/* TOP SUMMARY STATS */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div
          style={{
            padding: "12px 14px",
            borderRadius: "var(--radius-sm)",
            background: "var(--surface-alt)",
            border: "1px solid var(--border-light)",
          }}
        >
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Total Assets
          </div>
          <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginTop: 2 }}>
            {fmt(totalAssets)}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>
            {positiveAssets.length} registered holdings
          </div>
        </div>

        <div
          style={{
            padding: "12px 14px",
            borderRadius: "var(--radius-sm)",
            background: "var(--surface-alt)",
            border: "1px solid var(--border-light)",
          }}
        >
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Outstanding Liabilities
          </div>
          <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--error)", marginTop: 2 }}>
            {fmt(totalLiabilities)}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>
            {liabilities.length} active obligations
          </div>
        </div>

        <div
          style={{
            padding: "12px 14px",
            borderRadius: "var(--radius-sm)",
            background: "var(--surface-alt)",
            border: "1px solid var(--border-light)",
          }}
        >
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Net Protected Position
          </div>
          <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--accent)", marginTop: 2 }}>
            {fmt(netPosition)}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>
            {protectedPct}% nominee-verified
          </div>
        </div>
      </div>

      {/* PROTECTED VS UNPROTECTED BAR */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 6 }}>
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
            Nominee Protection Coverage
          </span>
          <span style={{ color: "var(--text-secondary)" }}>
            <strong>{fmt(protectedValue)}</strong> protected ({protectedPct}%)
          </span>
        </div>
        <div
          style={{
            height: 8,
            width: "100%",
            borderRadius: 9999,
            background: "var(--surface-alt)",
            overflow: "hidden",
            display: "flex",
          }}
        >
          <div
            style={{
              width: `${protectedPct}%`,
              background: "var(--accent)",
              transition: "width 0.5s ease",
            }}
          />
          <div
            style={{
              width: `${100 - protectedPct}%`,
              background: "var(--warn)",
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 6, fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }} />
            Nominee Verified ({protectedPct}%)
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--warn)" }} />
            Pending Verification / Unassigned ({100 - protectedPct}%)
          </span>
        </div>
      </div>

      {/* CATEGORY PILLS */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {categoryTotals.map((c) => (
          <div
            key={c.category}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: "var(--radius-sm)",
              background: catBg(c.category),
              color: catColor(c.category),
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            <span>{c.category}: {fmt(c.total)}</span>
            <span style={{ fontSize: "0.72rem", opacity: 0.8 }}>({c.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
