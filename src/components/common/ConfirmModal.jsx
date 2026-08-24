import React from "react";
import { Modal } from "./Modal";
import { Icons } from "./Icons";

export function ConfirmModal({
  title = "Confirm Action",
  desc = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDanger = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      size="small"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onCancel} type="button">
            {cancelLabel}
          </button>
          <button
            className={`btn ${isDanger ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: isDanger ? "var(--error-light)" : "var(--warn-light)",
            color: isDanger ? "var(--error)" : "var(--warn)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {isDanger ? <Icons.trash size={20} /> : <Icons.alertTriangle size={20} />}
        </div>
        <div>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {desc}
          </p>
        </div>
      </div>
    </Modal>
  );
}
