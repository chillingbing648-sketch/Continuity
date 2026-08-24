import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Switch } from "../common/Switch";
import { useApp } from "../../context/AppContext";

export function AddAssetModal({ onClose, initialData = null, defaultType = "Banking" }) {
  const { addAsset, updateAsset, people, assets } = useApp();
  const isEditing = Boolean(initialData);

  const bankAccounts = assets.filter((a) => a.type === "Banking" && (a.approxValue || 0) > 0);

  const [form, setForm] = useState({
    type: initialData?.type || defaultType,
    subtype: initialData?.subtype || "",
    institution: initialData?.institution || "",
    name: initialData?.name || "",
    approxValue: initialData?.approxValue !== undefined ? Math.abs(initialData.approxValue) : "",
    currency: initialData?.currency || "INR",
    nomineeId: initialData?.nomineeId || "",
    nominee: initialData?.nominee || "",
    nomineeVerified: initialData?.nomineeVerified ?? false,
    accountNumber: initialData?.accountNumber || initialData?.folio || initialData?.policyNumber || initialData?.pran || "",
    instructions: initialData?.instructions || "",
    linkedPaymentAssetId: initialData?.linkedPaymentAssetId || "",
    isEmergencyFund: initialData?.isEmergencyFund ?? false,
  });

  const [error, setError] = useState(null);

  const handleNomineeSelect = (e) => {
    const pId = e.target.value;
    const person = people.find((p) => p.id === pId);
    setForm((prev) => ({
      ...prev,
      nomineeId: pId,
      nominee: person ? person.name : "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Asset Name is required.");
      return;
    }
    if (!form.institution.trim()) {
      setError("Institution is required.");
      return;
    }

    let val = Number(form.approxValue) || 0;
    if (form.type === "Loans" || form.type === "Liabilities") {
      val = -Math.abs(val);
    }

    const payload = {
      ...form,
      approxValue: val,
    };

    if (isEditing) {
      updateAsset(initialData.id, payload);
    } else {
      addAsset(payload);
    }
    onClose();
  };

  return (
    <Modal
      title={isEditing ? `Edit ${initialData.name}` : "Add Financial Asset or Liability"}
      subtitle="Connect financial holdings, nominees, and emergency instructions"
      onClose={onClose}
      size="large"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} type="button">
            {isEditing ? "Save Changes" : "Create Asset"}
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
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
            >
              <option value="Banking">Banking & Savings</option>
              <option value="Investments">Investments & Stocks</option>
              <option value="Insurance">Life / Health Insurance</option>
              <option value="Retirement">Retirement / Pension / NPS</option>
              <option value="Property">Real Estate & Property</option>
              <option value="Loans">Loans & Liabilities (Debt)</option>
              <option value="Other">Other Asset</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Subtype / Account Type</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Savings Account, Mutual Fund, Term Life, Home Loan"
              value={form.subtype}
              onChange={(e) => setForm((prev) => ({ ...prev, subtype: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Institution / Issuer</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. HDFC Bank, Zerodha, LIC of India, SBI"
              value={form.institution}
              onChange={(e) => setForm((prev) => ({ ...prev, institution: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Asset Title / Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Primary HDFC Checking, Zerodha Equity"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">
              {form.type === "Insurance"
                ? "Sum Assured (₹)"
                : form.type === "Loans"
                ? "Outstanding Loan Balance (₹)"
                : "Approximate Valuation (₹)"}
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 500000"
              value={form.approxValue}
              onChange={(e) => setForm((prev) => ({ ...prev, approxValue: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account / Folio / Policy Number</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. ****4521, ZD4892, LIC-781234"
              value={form.accountNumber}
              onChange={(e) => setForm((prev) => ({ ...prev, accountNumber: e.target.value }))}
            />
          </div>
        </div>

        {/* NOMINEE SELECTION */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Assigned Nominee</label>
            <select
              className="form-select"
              value={form.nomineeId}
              onChange={handleNomineeSelect}
            >
              <option value="">-- Select Nominee --</option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.relationship})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <label className="form-label">Nominee Verification Status</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Switch
                checked={form.nomineeVerified}
                onChange={(checked) => setForm((prev) => ({ ...prev, nomineeVerified: checked }))}
              />
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {form.nomineeVerified ? "Nominee is digitally verified" : "Nominee is pending verification"}
              </span>
            </div>
          </div>
        </div>

        {/* LIABILITY LINKED PAYMENT SOURCE */}
        {(form.type === "Loans" || form.type === "Liabilities") && (
          <div className="form-group">
            <label className="form-label">Linked Auto-Debit Bank Account</label>
            <select
              className="form-select"
              value={form.linkedPaymentAssetId}
              onChange={(e) => setForm((prev) => ({ ...prev, linkedPaymentAssetId: e.target.value }))}
            >
              <option value="">-- Select Primary Payment Account --</option>
              {bankAccounts.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.institution})
                </option>
              ))}
            </select>
            <div className="form-hint">Links this debt to a bank account for continuity dependency mapping</div>
          </div>
        )}

        {/* EMERGENCY FUND FLAG (FOR BANKING) */}
        {form.type === "Banking" && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
            <Switch
              checked={form.isEmergencyFund}
              onChange={(checked) => setForm((prev) => ({ ...prev, isEmergencyFund: checked }))}
            />
            <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600 }}>
              Designate as Immediate Emergency Fund for Trustee
            </span>
          </div>
        )}

        {/* CONTINUITY INSTRUCTIONS */}
        <div className="form-group">
          <label className="form-label">Continuity & Claim Instructions</label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="Important advice for your trusted person: e.g. Claim instructions, advisor to consult, joint mandate details..."
            value={form.instructions}
            onChange={(e) => setForm((prev) => ({ ...prev, instructions: e.target.value }))}
          />
        </div>
      </form>
    </Modal>
  );
}
