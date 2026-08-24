import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Switch } from "../common/Switch";
import { useApp } from "../../context/AppContext";

export function UploadDocModal({ onClose, defaultAssetId = null }) {
  const { addDocument, assets, people } = useApp();

  const [form, setForm] = useState({
    title: "",
    docType: "Bank Statement",
    category: "Banking",
    linkedAssetId: defaultAssetId || "",
    linkedPersonId: "",
    institution: "",
    identifier: "",
    expiryDate: "",
    size: "240 KB",
    format: "PDF",
    verified: true,
    notes: "",
    requiredAction: "",
  });

  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Document Title is required.");
      return;
    }

    addDocument(form);
    onClose();
  };

  return (
    <Modal
      title="Upload Important Document"
      subtitle="Vault statements, deeds, wills, and identification records"
      onClose={onClose}
      size="large"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} type="button">
            Vault Document
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

        <div className="form-group">
          <label className="form-label">Document Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. HDFC Statement Q1 2026, Registered Sale Deed, Term Life Policy Bond"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Document Classification</label>
            <select
              className="form-select"
              value={form.docType}
              onChange={(e) => setForm((prev) => ({ ...prev, docType: e.target.value }))}
            >
              <option value="Bank Statement">Bank Statement</option>
              <option value="Passbook">Passbook / Mandate</option>
              <option value="Portfolio Report">Portfolio / Holding Report</option>
              <option value="CAS Statement">CAS Mutual Fund Statement</option>
              <option value="Insurance Policy Bond">Insurance Policy Bond</option>
              <option value="Pension Statement">NPS / Pension Statement</option>
              <option value="Title Deed">Property Title Deed / Sale Deed</option>
              <option value="Will & Testament">Will & Testament</option>
              <option value="Identity Document">PAN / Aadhaar / Passport</option>
              <option value="Other">Other Legal / Financial Record</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            >
              <option value="Banking">Banking</option>
              <option value="Investments">Investments</option>
              <option value="Insurance">Insurance</option>
              <option value="Property">Property</option>
              <option value="Retirement">Retirement</option>
              <option value="Legal">Legal & Identity</option>
            </select>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Linked Financial Asset (Optional)</label>
            <select
              className="form-select"
              value={form.linkedAssetId}
              onChange={(e) => setForm((prev) => ({ ...prev, linkedAssetId: e.target.value }))}
            >
              <option value="">-- None (General Record) --</option>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.institution})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Linked Person / Trustee (Optional)</label>
            <select
              className="form-select"
              value={form.linkedPersonId}
              onChange={(e) => setForm((prev) => ({ ...prev, linkedPersonId: e.target.value }))}
            >
              <option value="">-- None (Owner Record) --</option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.relationship})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Issuing Institution</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. HDFC Bank, LIC of India, Sub-Registrar"
              value={form.institution}
              onChange={(e) => setForm((prev) => ({ ...prev, institution: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Document / Policy Reference ID</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. STMT-2026, LIC-781234"
              value={form.identifier}
              onChange={(e) => setForm((prev) => ({ ...prev, identifier: e.target.value }))}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes & Physical Storage Location</label>
          <textarea
            className="form-textarea"
            rows="2"
            placeholder="e.g. Original physical bond stored in bank locker #402 at Bandra branch."
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          />
        </div>
      </form>
    </Modal>
  );
}
