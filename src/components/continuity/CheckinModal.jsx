import React from "react";
import { Modal } from "../common/Modal";
import { Icons } from "../common/Icons";
import { useApp } from "../../context/AppContext";
import { fmtDate } from "../../utils/formatting";

export function CheckinModal({ onClose }) {
  const { completeCheckin, continuity, user } = useApp();

  const handleConfirm = () => {
    completeCheckin();
    onClose();
  };

  const nextDate = new Date(Date.now() + (continuity?.frequency || 30) * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  return (
    <Modal
      title="Safety Check-in Confirmation"
      subtitle="Periodic proof-of-life confirmation"
      onClose={onClose}
      size="small"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleConfirm} type="button">
            <Icons.check size={16} />
            Confirm I am Safe & Well
          </button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "center", alignItems: "center" }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: "var(--success-light)",
            color: "var(--success)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icons.checkCircle size={28} />
        </div>

        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Hello, {user?.name || "Harsh"}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.5 }}>
            By confirming this check-in, you certify that you are safe. Your continuity timer will reset, and your next scheduled check-in will be on <strong>{fmtDate(nextDate)}</strong>.
          </p>
        </div>

        <div
          style={{
            width: "100%",
            background: "var(--surface-alt)",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            textAlign: "left",
          }}
        >
          <strong>Protocol:</strong> If unconfirmed after {continuity?.gracePeriod || 15} days past due date, an escalation alert will be dispatched to your Primary Trustee.
        </div>
      </div>
    </Modal>
  );
}
