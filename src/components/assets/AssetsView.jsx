import React, { useState } from "react";
import { AssetCard } from "./AssetCard";
import { Icons } from "../common/Icons";
import { EmptyState } from "../common/EmptyState";
import { useApp } from "../../context/AppContext";
import { fmt } from "../../utils/formatting";

export function AssetsView() {
  const { assets, openModal } = useApp();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [nomineeFilter, setNomineeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewLayout, setViewLayout] = useState("grid"); // "grid" | "list"

  const categories = ["All", "Banking", "Investments", "Insurance", "Property", "Retirement", "Loans"];

  const filteredAssets = assets.filter((a) => {
    // Category match
    if (selectedCategory !== "All" && a.type !== selectedCategory) return false;

    // Nominee filter
    if (nomineeFilter === "verified" && !a.nomineeVerified) return false;
    if (nomineeFilter === "unverified" && (!a.nominee || a.nomineeVerified)) return false;
    if (nomineeFilter === "missing" && a.nominee) return false;

    // Search query
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = a.name?.toLowerCase().includes(q);
      const matchInst = a.institution?.toLowerCase().includes(q);
      const matchNominee = a.nominee?.toLowerCase().includes(q);
      if (!matchName && !matchInst && !matchNominee) return false;
    }

    return true;
  });

  const totalPositive = filteredAssets
    .filter((a) => (a.approxValue || 0) > 0)
    .reduce((sum, a) => sum + a.approxValue, 0);

  const totalDebt = filteredAssets
    .filter((a) => (a.approxValue || 0) < 0 || a.type === "Loans")
    .reduce((sum, a) => sum + Math.abs(a.approxValue || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* HEADER CONTROLS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Assets & Liabilities Inventory
          </h2>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
            Showing {filteredAssets.length} of {assets.length} entities • Assets: <strong>{fmt(totalPositive)}</strong>
            {totalDebt > 0 && <span> • Debt: <strong style={{ color: "var(--error)" }}>{fmt(totalDebt)}</strong></span>}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setViewLayout((prev) => (prev === "grid" ? "list" : "grid"))}
          >
            {viewLayout === "grid" ? <Icons.layers size={14} /> : <Icons.map size={14} />}
            {viewLayout === "grid" ? "List View" : "Grid View"}
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => openModal("addAsset")}
          >
            <Icons.plus size={15} />
            Add Asset
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div
        className="card"
        style={{
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {/* SEARCH INPUT */}
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Icons.search
              size={16}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 32 }}
              placeholder="Filter by name, institution, or nominee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* NOMINEE STATUS FILTER */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <select
              className="form-select"
              style={{ width: "auto", fontSize: "0.8rem", padding: "8px 10px" }}
              value={nomineeFilter}
              onChange={(e) => setNomineeFilter(e.target.value)}
            >
              <option value="all">All Nominee Statuses</option>
              <option value="verified">Nominee Verified</option>
              <option value="unverified">Nominee Unverified</option>
              <option value="missing">Missing Nominee</option>
            </select>
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
          {categories.map((cat) => {
            const count = cat === "All" ? assets.length : assets.filter((a) => a.type === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-secondary"}`}
                style={{
                  fontSize: "0.78rem",
                  padding: "4px 10px",
                  borderRadius: 20,
                  whiteSpace: "nowrap",
                }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
                <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ASSET LIST / GRID */}
      {filteredAssets.length === 0 ? (
        <EmptyState
          icon={<Icons.bank size={24} />}
          title="No financial assets found"
          desc="No assets match your search or filter criteria. Add a new account, investment, or insurance policy."
          action={
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => openModal("addAsset")}
            >
              <Icons.plus size={14} />
              Add Financial Asset
            </button>
          }
        />
      ) : viewLayout === "grid" ? (
        <div className="grid-3">
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onClick={() => openModal("assetDetail", { asset })}
            />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="card card-clickable"
              onClick={() => openModal("assetDetail", { asset })}
              style={{
                padding: "12px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="avatar" style={{ width: 36, height: 36, borderRadius: 8 }}>
                  <Icons.bank size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                    {asset.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {asset.institution} • {asset.subtype || asset.type}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{fmt(asset.approxValue)}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    {asset.nominee ? `Nominee: ${asset.nominee}` : "No nominee"}
                  </div>
                </div>

                <span
                  className={`badge ${
                    asset.nomineeVerified
                      ? "badge-success"
                      : asset.nominee
                      ? "badge-warn"
                      : "badge-error"
                  }`}
                >
                  {asset.nomineeVerified ? "Verified" : asset.nominee ? "Unverified" : "Missing"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
