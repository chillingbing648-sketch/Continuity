import React, { useState } from "react";
import { Icons } from "../common/Icons";
import { EmptyState } from "../common/EmptyState";
import { useApp } from "../../context/AppContext";
import { fmtDate } from "../../utils/formatting";

export function DocumentsView() {
  const { documents, assets, openModal } = useApp();

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");

  const categories = ["All", "Banking", "Investments", "Insurance", "Property", "Retirement", "Legal"];

  const filteredDocs = documents.filter((doc) => {
    if (categoryFilter !== "All" && doc.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = doc.title?.toLowerCase().includes(q);
      const matchType = doc.docType?.toLowerCase().includes(q);
      const matchInst = doc.institution?.toLowerCase().includes(q);
      if (!matchTitle && !matchType && !matchInst) return false;
    }
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Continuity Document Vault
          </h2>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
            Secure digital repository for statements, property title deeds, wills, and insurance bonds.
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => openModal("uploadDoc")}
        >
          <Icons.upload size={15} />
          Upload Document
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="card" style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ position: "relative" }}>
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
            placeholder="Search documents by title, classification, or institution..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
          {categories.map((cat) => {
            const count = cat === "All" ? documents.length : documents.filter((d) => d.category === cat).length;
            const isSelected = categoryFilter === cat;

            return (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-secondary"}`}
                style={{ fontSize: "0.78rem", padding: "4px 10px", borderRadius: 20 }}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* DOCUMENT LIST */}
      {filteredDocs.length === 0 ? (
        <EmptyState
          icon={<Icons.docs size={24} />}
          title="No documents vaulted"
          desc="Upload your statements, title deeds, insurance bonds, or Will to ensure proof is immediately accessible."
          action={
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => openModal("uploadDoc")}
            >
              <Icons.upload size={14} />
              Vault First Document
            </button>
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredDocs.map((doc) => {
            const linkedAsset = assets.find((a) => a.id === doc.linkedAssetId);

            return (
              <div
                key={doc.id}
                className="card card-clickable"
                onClick={() => openModal("docDetail", { doc })}
                style={{
                  padding: "12px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: "var(--surface-alt)",
                      color: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icons.file size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                      {doc.title}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {doc.docType} • {doc.institution || doc.category}
                      {linkedAsset ? ` • Linked: ${linkedAsset.name}` : ""}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ textAlign: "right", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    <div>{fmtDate(doc.uploadDate)}</div>
                    <div>{doc.size || "PDF"}</div>
                  </div>

                  <span className={`badge ${doc.verified ? "badge-success" : "badge-warn"}`}>
                    {doc.verified ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
