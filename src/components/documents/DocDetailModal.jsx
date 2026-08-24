import React from "react";
import { Modal } from "../common/Modal";
import { Icons } from "../common/Icons";
import { fmtDate } from "../../utils/formatting";
import { useApp } from "../../context/AppContext";

export function DocDetailModal({ doc, onClose }) {
  const { deleteDocument, verifyDocument, openModal, assets, people } = useApp();

  if (!doc) return null;

  const linkedAsset = assets.find((a) => a.id === doc.linkedAssetId);
  const linkedPerson = people.find((p) => p.id === doc.linkedPersonId);

  const handleDelete = () => {
    openModal("confirm", {
      title: "Delete Document",
      desc: `Are you sure you want to remove ${doc.title} from the vault?`,
      isDanger: true,
      onConfirm: () => {
        deleteDocument(doc.id);
        onClose();
      },
    });
  };

  return (
    <Modal
      title={doc.title}
      subtitle={`${doc.docType || "Document"} • ${doc.category || "General"}`}
      onClose={onClose}
      size="large"
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <button className="btn btn-ghost btn-sm" style={{ color: "var(--error)" }} onClick={handleDelete} type="button">
            <Icons.trash size={15} />
            Delete
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            {!doc.verified && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  verifyDocument(doc.id);
                  onClose();
                }}
                type="button"
              >
                <Icons.check size={14} />
                Mark Verified
              </button>
            )}
            <button className="btn btn-secondary btn-sm" onClick={onClose} type="button">
              Close
            </button>
          </div>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* DOCUMENT HEADER BANNER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
            background: "var(--surface-alt)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "var(--accent-light)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icons.file size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                {doc.title}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Format: {doc.format || "PDF"} • Size: {doc.size || "180 KB"} • Uploaded: {fmtDate(doc.uploadDate)}
              </div>
            </div>
          </div>

          <span className={`badge ${doc.verified ? "badge-success" : "badge-warn"}`}>
            {doc.verified ? "Verified Authenticity" : "Pending Verification"}
          </span>
        </div>

        {/* METADATA FIELDS */}
        <div className="grid-2">
          <div style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "var(--surface-alt)", fontSize: "0.85rem" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, display: "block" }}>
              Institution / Issuing Body
            </span>
            <strong>{doc.institution || "Self-Uploaded"}</strong>
          </div>

          <div style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "var(--surface-alt)", fontSize: "0.85rem" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, display: "block" }}>
              Document Identifier / Ref
            </span>
            <strong>{doc.identifier || "VAULT-DOC-2026"}</strong>
          </div>

          <div style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "var(--surface-alt)", fontSize: "0.85rem" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, display: "block" }}>
              Linked Financial Asset
            </span>
            <strong>{linkedAsset ? linkedAsset.name : "None (General Legal/Identity)"}</strong>
          </div>

          <div style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "var(--surface-alt)", fontSize: "0.85rem" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, display: "block" }}>
              Linked Person / Beneficiary
            </span>
            <strong>{linkedPerson ? linkedPerson.name : "Primary Owner"}</strong>
          </div>
        </div>

        {/* NOTES & REQUIRED ACTIONS */}
        {doc.notes && (
          <div className="card" style={{ padding: "12px 14px" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4 }}>
              Document Notes
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
              {doc.notes}
            </p>
          </div>
        )}

        {doc.requiredAction && (
          <div className="card" style={{ padding: "12px 14px", background: "var(--warn-light)", borderColor: "var(--warn-border)" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--warn)", textTransform: "uppercase", marginBottom: 2 }}>
              Required Continuity Action
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 500 }}>
              {doc.requiredAction}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
