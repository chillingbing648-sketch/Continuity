import React from "react";
import { Modal } from "../common/Modal";
import { Icons } from "../common/Icons";
import { fmt, fmtDate } from "../../utils/formatting";
import { catColor, catBg } from "../../utils/colorHelpers";
import { useApp } from "../../context/AppContext";

export function AssetDetailModal({ asset, onClose }) {
  const { deleteAsset, verifyAsset, openModal, documents, obligations } = useApp();

  if (!asset) return null;

  const linkedDocs = documents.filter((d) => d.linkedAssetId === asset.id);
  const supportedObligations = obligations.filter(
    (o) => o.paymentSourceAssetId === asset.id || o.linkedAssetId === asset.id
  );

  const handleDelete = () => {
    openModal("confirm", {
      title: "Delete Asset",
      desc: `Are you sure you want to remove ${asset.name}? This will permanently remove its continuity records.`,
      isDanger: true,
      onConfirm: () => {
        deleteAsset(asset.id);
        onClose();
      },
    });
  };

  return (
    <Modal
      title={asset.name}
      subtitle={`${asset.institution} • ${asset.subtype || asset.type}`}
      onClose={onClose}
      size="large"
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <button className="btn btn-ghost btn-sm" style={{ color: "var(--error)" }} onClick={handleDelete} type="button">
            <Icons.trash size={15} />
            Delete
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                onClose();
                openModal("editAsset", { asset });
              }}
              type="button"
            >
              <Icons.edit size={15} />
              Edit Asset
            </button>
            <button className="btn btn-primary btn-sm" onClick={onClose} type="button">
              Done
            </button>
          </div>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* TOP SUMMARY STRIP */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            background: catBg(asset.type),
            border: `1px solid var(--border)`,
            borderRadius: "var(--radius-md)",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: catColor(asset.type), textTransform: "uppercase" }}>
              Approximate Valuation
            </span>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", marginTop: 2 }}>
              {fmt(asset.approxValue)}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span
              className={`badge ${
                asset.nomineeVerified
                  ? "badge-success"
                  : asset.nominee
                  ? "badge-warn"
                  : "badge-error"
              }`}
            >
              {asset.nomineeVerified ? "Nominee Verified" : asset.nominee ? "Nominee Unverified" : "Missing Nominee"}
            </span>

            {!asset.nomineeVerified && asset.nominee && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => verifyAsset(asset.id)}
              >
                <Icons.check size={14} />
                Mark Verified
              </button>
            )}
          </div>
        </div>

        {/* IDENTIFIER METADATA */}
        <div className="grid-2">
          <div style={{ padding: "12px 14px", borderRadius: "var(--radius-sm)", background: "var(--surface-alt)", fontSize: "0.85rem" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block", textTransform: "uppercase", fontWeight: 700 }}>
              Account / Folio / Policy Number
            </span>
            <strong style={{ color: "var(--text-primary)", fontSize: "0.95rem" }}>
              {asset.accountNumber || asset.folio || asset.policyNumber || asset.pran || "—"}
            </strong>
          </div>

          <div style={{ padding: "12px 14px", borderRadius: "var(--radius-sm)", background: "var(--surface-alt)", fontSize: "0.85rem" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block", textTransform: "uppercase", fontWeight: 700 }}>
              Designated Nominee
            </span>
            <strong style={{ color: "var(--text-primary)", fontSize: "0.95rem" }}>
              {asset.nominee || "None assigned"}
            </strong>
          </div>
        </div>

        {/* INSTRUCTIONS */}
        <div className="card" style={{ padding: "14px 16px" }}>
          <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
            <Icons.continuity size={16} style={{ color: "var(--accent)" }} />
            Continuity & Emergency Instructions
          </div>
          {asset.instructions ? (
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {asset.instructions}
            </p>
          ) : (
            <div style={{ fontSize: "0.8rem", color: "var(--warn)" }}>
              No instructions provided yet. Add steps on passwords, advisor consultations, or claim procedures.
            </div>
          )}
        </div>

        {/* SUPPORTED FINANCIAL DEPENDENCIES */}
        {supportedObligations.length > 0 && (
          <div className="card" style={{ padding: "14px 16px" }}>
            <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <Icons.calendar size={16} style={{ color: "var(--warn)" }} />
              Supported Financial Obligations ({supportedObligations.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {supportedObligations.map((o) => (
                <div
                  key={o.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.8rem",
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: "var(--surface-alt)",
                  }}
                >
                  <span>{o.title} ({o.frequency})</span>
                  <strong>{fmt(o.amount)}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LINKED DOCUMENTS */}
        <div className="card" style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 6 }}>
              <Icons.docs size={16} style={{ color: "var(--accent)" }} />
              Vaulted Documents ({linkedDocs.length})
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => openModal("uploadDoc", { defaultAssetId: asset.id })}
            >
              <Icons.plus size={14} />
              Attach Document
            </button>
          </div>

          {linkedDocs.length === 0 ? (
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              No documents linked. Upload statement or certificate for verification proof.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {linkedDocs.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: "var(--surface-alt)",
                    fontSize: "0.8rem",
                  }}
                >
                  <span>{doc.title}</span>
                  <span className={`badge ${doc.verified ? "badge-success" : "badge-neutral"}`}>
                    {doc.verified ? "Verified" : "Unverified"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
