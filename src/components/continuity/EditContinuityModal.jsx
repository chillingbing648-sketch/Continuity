import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Switch } from "../common/Switch";
import { useApp } from "../../context/AppContext";

export function EditContinuityModal({ onClose }) {
  const { continuity, saveContinuity, people, showToast, addActivity } = useApp();

  const [form, setForm] = useState({
    active: continuity?.active ?? true,
    frequency: continuity?.frequency || 30,
    gracePeriod: continuity?.gracePeriod || 15,
    reminderDays: continuity?.reminderDays || 3,
    notifyPersonId: continuity?.notifyPersonId || people[0]?.id || "",
    initialAccess: continuity?.initialAccess || "limited",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...continuity,
      ...form,
      frequency: Number(form.frequency),
      gracePeriod: Number(form.gracePeriod),
      reminderDays: Number(form.reminderDays),
    };
    saveContinuity(updated);
    addActivity({
      type: "settings",
      action: "Continuity protocol parameters updated",
      affectedEntity: "Continuity Settings",
      detail: `Check-in interval: ${form.frequency} days, Grace period: ${form.gracePeriod} days.`,
    });
    showToast("Continuity protocols updated successfully.");
    onClose();
  };

  return (
    <Modal
      title="Edit Continuity Protocols"
      subtitle="Configure check-in intervals, grace periods, and escalation routing"
      onClose={onClose}
      size="large"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} type="button">
            Save Protocols
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 14px",
            borderRadius: "var(--radius-sm)",
            background: "var(--surface-alt)",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>
              Automated Continuity Protocol
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              Enable recurring check-in reminders and escalation monitors
            </div>
          </div>
          <Switch
            checked={form.active}
            onChange={(checked) => setForm((prev) => ({ ...prev, active: checked }))}
          />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Check-in Interval (Days)</label>
            <select
              className="form-select"
              value={form.frequency}
              onChange={(e) => setForm((prev) => ({ ...prev, frequency: e.target.value }))}
            >
              <option value="15">Every 15 days</option>
              <option value="30">Every 30 days (Standard)</option>
              <option value="60">Every 60 days</option>
              <option value="90">Every 90 days (Quarterly)</option>
              <option value="180">Every 180 days (Semi-annual)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Grace Period (Days)</label>
            <select
              className="form-select"
              value={form.gracePeriod}
              onChange={(e) => setForm((prev) => ({ ...prev, gracePeriod: e.target.value }))}
            >
              <option value="7">7 days</option>
              <option value="15">15 days (Recommended)</option>
              <option value="30">30 days</option>
            </select>
            <div className="form-hint">Time allowed before escalating to trusted person</div>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Primary Notification Contact</label>
            <select
              className="form-select"
              value={form.notifyPersonId}
              onChange={(e) => setForm((prev) => ({ ...prev, notifyPersonId: e.target.value }))}
            >
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.relationship})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Initial Handoff Access</label>
            <select
              className="form-select"
              value={form.initialAccess}
              onChange={(e) => setForm((prev) => ({ ...prev, initialAccess: e.target.value }))}
            >
              <option value="limited">Limited Emergency Access (Contacts, Insurance, Loans)</option>
              <option value="full">Full Continuity Access (All Vaults & Instructions)</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
}
