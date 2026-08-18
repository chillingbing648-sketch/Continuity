import { Modal } from "../ui";

export function ConfirmModal({ title, desc, onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p
        style={{
          fontSize: "0.875rem",
          color: "#6B6860",
          lineHeight: 1.6,
        }}
      >
        {desc}
      </p>
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 12,
          justifyContent: "flex-end",
        }}
      >
        <button
          className="btn btn-ghost"
          onClick={onCancel}
          style={{ padding: "6px 12px" }}
        >
          Cancel
        </button>
        <button
          className="btn btn-danger"
          onClick={onConfirm}
          style={{ padding: "6px 12px" }}
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
}