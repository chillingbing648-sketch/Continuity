import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Switch } from "../common/Switch";
import { useApp } from "../../context/AppContext";
import { validateEmail, validatePhone, validateRequired } from "../../utils/validation";

export function AddPersonModal({ onClose, initialData = null }) {
  const { addPerson, updatePerson } = useApp();
  const isEditing = Boolean(initialData);

  const [form, setForm] = useState({
    name: initialData?.name || "",
    relationship: initialData?.relationship || "Spouse",
    role: initialData?.role || "Trusted Person",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    status: initialData?.status || "Active",
    isPrimaryTrustee: initialData?.isPrimaryTrustee ?? false,
    permissionLevel: initialData?.permissionLevel || "Full Trustee",
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    const nameErr = validateRequired(form.name, "Full Name");
    if (nameErr) errs.name = nameErr;

    const emailErr = validateEmail(form.email);
    if (emailErr) errs.email = emailErr;

    const phoneErr = validatePhone(form.phone);
    if (phoneErr) errs.phone = phoneErr;

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (isEditing) {
      updatePerson(initialData.id, form);
    } else {
      addPerson(form);
    }
    onClose();
  };

  return (
    <Modal
      title={isEditing ? `Edit ${initialData.name}` : "Add Trusted Person or Advisor"}
      subtitle="Designate nominees, trustees, or financial advisors"
      onClose={onClose}
      size="large"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} type="button">
            {isEditing ? "Save Contact" : "Add to Network"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Priya Mehta"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
            {errors.name && <div style={{ color: "var(--error)", fontSize: "0.75rem", marginTop: 4 }}>{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Relationship</label>
            <select
              className="form-select"
              value={form.relationship}
              onChange={(e) => setForm((prev) => ({ ...prev, relationship: e.target.value }))}
            >
              <option value="Spouse">Spouse</option>
              <option value="Child">Child / Dependent</option>
              <option value="Parent">Parent</option>
              <option value="Sibling">Sibling</option>
              <option value="Financial Advisor">Financial Advisor</option>
              <option value="Legal Counsel">Legal Counsel</option>
              <option value="Executor">Will Executor</option>
              <option value="Close Friend">Close Friend</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. priya@example.com"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
            {errors.email && <div style={{ color: "var(--error)", fontSize: "0.75rem", marginTop: 4 }}>{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              placeholder="e.g. +91 98000 11111"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              required
            />
            {errors.phone && <div style={{ color: "var(--error)", fontSize: "0.75rem", marginTop: 4 }}>{errors.phone}</div>}
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Role in Continuity</label>
            <select
              className="form-select"
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
            >
              <option value="Primary Trustee">Primary Trustee (Universal Continuity Access)</option>
              <option value="Trusted Person">Trusted Person (Nominee & Preparedness)</option>
              <option value="Advisor">Advisor (Financial / Legal Counsel)</option>
              <option value="Secondary Contact">Secondary Emergency Contact</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Verification Status</label>
            <select
              className="form-select"
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="Verified">Verified (Full Access Activated)</option>
              <option value="Active">Active (Invitation Accepted)</option>
              <option value="Invited">Invited (Pending Confirmation)</option>
            </select>
          </div>
        </div>

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
            <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>
              Designate as Primary Trustee
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              Primary contact for escalation notifications and emergency guide delivery
            </div>
          </div>
          <Switch
            checked={form.isPrimaryTrustee}
            onChange={(checked) => setForm((prev) => ({ ...prev, isPrimaryTrustee: checked }))}
          />
        </div>
      </form>
    </Modal>
  );
}
