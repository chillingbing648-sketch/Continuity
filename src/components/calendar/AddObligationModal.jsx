import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Switch } from "../common/Switch";
import { useApp } from "../../context/AppContext";

export function AddObligationModal({ onClose }) {
  const { addObligation, assets } = useApp();

  const bankAccounts = assets.filter((a) => a.type === "Banking" && (a.approxValue || 0) > 0);

  const [form, setForm] = useState({
    title: "",
    type: "EMI",
    amount: "",
    frequency: "Monthly",
    dueDay: 5,
    nextDueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    paymentSourceAssetId: bankAccounts[0]?.id || "",
    linkedAssetId: "",
    autoDebit: true,
    criticality: "High",
    beneficiary: "",
    instructions: "",
  });

  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Obligation title is required.");
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    addObligation(form);
    onClose();
  };

  return (
    <Modal
      title="Add Recurring Financial Obligation"
      subtitle="Schedule EMIs, insurance premiums, SIPs, or renewals"
      onClose={onClose}
      size="large"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} type="button">
            Save Obligation
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {error && (
          <div style={{ background: "var(--error-light)", color: "var(--error)", padding: "8px 12px", borderRadius: "var(--radius-sm)", fontSize: "0.85rem" }}>
            {error}
          </div>
        )}

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Obligation Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Home Loan EMI, LIC Premium, Nifty SIP"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
            >
              <option value="EMI">Loan EMI</option>
              <option value="Insurance Premium">Insurance Premium</option>
              <option value="SIP">Investment SIP</option>
              <option value="FD Maturity">FD / Deposit Maturity</option>
              <option value="Policy Renewal">Policy / Sub Renewal</option>
              <option value="Maintenance">Society / Maintenance</option>
              <option value="Tax Deadline">Tax Filing Deadline</option>
            </select>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 28000"
              value={form.amount}
              onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Frequency</label>
            <select
              className="form-select"
              value={form.frequency}
              onChange={(e) => setForm((prev) => ({ ...prev, frequency: e.target.value }))}
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Annual">Annual</option>
              <option value="One-time">One-time Event</option>
            </select>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Next Due Date</label>
            <input
              type="date"
              className="form-input"
              value={form.nextDueDate}
              onChange={(e) => setForm((prev) => ({ ...prev, nextDueDate: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Source Bank Account</label>
            <select
              className="form-select"
              value={form.paymentSourceAssetId}
              onChange={(e) => setForm((prev) => ({ ...prev, paymentSourceAssetId: e.target.value }))}
            >
              <option value="">-- None (Direct / Credit) --</option>
              {bankAccounts.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.institution})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Beneficiary / Lender Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. HDFC Ltd, LIC of India, Zerodha"
              value={form.beneficiary}
              onChange={(e) => setForm((prev) => ({ ...prev, beneficiary: e.target.value }))}
            />
          </div>

          <div className="form-group" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <label className="form-label">Auto-Debit Setup</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Switch
                checked={form.autoDebit}
                onChange={(checked) => setForm((prev) => ({ ...prev, autoDebit: checked }))}
              />
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {form.autoDebit ? "Auto-debits from linked bank" : "Requires manual payment"}
              </span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Payment Instructions for Trustee</label>
          <textarea
            className="form-textarea"
            rows="2"
            placeholder="e.g. Ensure minimum ₹35,000 balance in HDFC savings before 5th of each month to avoid EMI bounce."
            value={form.instructions}
            onChange={(e) => setForm((prev) => ({ ...prev, instructions: e.target.value }))}
          />
        </div>
      </form>
    </Modal>
  );
}
