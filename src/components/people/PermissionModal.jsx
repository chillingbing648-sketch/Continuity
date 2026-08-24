import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Icons } from "../common/Icons";
import { Switch } from "../common/Switch";
import { useApp } from "../../context/AppContext";

export function PermissionModal({ person, onClose }) {
  const { updatePerson, showToast, addActivity } = useApp();

  const [permissionLevel, setPermissionLevel] = useState(person?.permissionLevel || "Full Trustee");
  const [permissions, setPermissions] = useState(person?.permissions || [
    "financial_inventory",
    "documents",
    "insurance",
    "investments",
    "instructions",
    "contacts",
    "continuity_alerts",
  ]);

  const permissionDefinitions = [
    {
      id: "financial_inventory",
      title: "Discover — Financial Inventory",
      desc: "View list of bank accounts, investments, properties, and total valuations.",
      tier: "Discover",
    },
    {
      id: "documents",
      title: "Prepare — Vaulted Documents",
      desc: "Access uploaded statements, certificates, and legal deeds.",
      tier: "Prepare",
    },
    {
      id: "insurance",
      title: "Prepare — Insurance & Policy Details",
      desc: "View policy numbers, insurer helplines, and premium schedules.",
      tier: "Prepare",
    },
    {
      id: "instructions",
      title: "Act — Continuity & Emergency Instructions",
      desc: "Access step-by-step guidance, claim instructions, and advisor protocols.",
      tier: "Act",
    },
    {
      id: "contacts",
      title: "Prepare — Key Advisor & Emergency Contacts",
      desc: "View contact information for lawyers, tax consultants, and financial advisors.",
      tier: "Prepare",
    },
    {
      id: "continuity_alerts",
      title: "Act — Escalation & Protocol Alerts",
      desc: "Receive urgent notifications if owner fails periodic check-ins.",
      tier: "Act",
    },
    {
      id: "emergency_act",
      title: "Full Trustee — Emergency Handoff Activation",
      desc: "Full authorized access to execute claims and emergency continuity playbook.",
      tier: "Full Trustee",
    },
  ];

  const handleToggle = (id) => {
    setPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleLevelPreset = (lvl) => {
    setPermissionLevel(lvl);
    if (lvl === "Discover") {
      setPermissions(["financial_inventory"]);
    } else if (lvl === "Prepare") {
      setPermissions(["financial_inventory", "documents", "insurance", "contacts"]);
    } else if (lvl === "Act") {
      setPermissions(["financial_inventory", "documents", "insurance", "instructions", "contacts", "continuity_alerts"]);
    } else if (lvl === "Full Trustee") {
      setPermissions([
        "financial_inventory",
        "documents",
        "insurance",
        "investments",
        "instructions",
        "contacts",
        "continuity_alerts",
        "emergency_act",
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePerson(person.id, {
      permissionLevel,
      permissions,
    });
    addActivity({
      type: "person",
      action: "Permissions updated",
      affectedEntity: person.name,
      detail: `Assigned level: ${permissionLevel} (${permissions.length} active permissions).`,
    });
    showToast(`Permissions updated for ${person.name}.`);
    onClose();
  };

  return (
    <Modal
      title={`Continuity Permissions — ${person.name}`}
      subtitle="Define what this person can discover, prepare, or act upon"
      onClose={onClose}
      size="large"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} type="button">
            Save Permissions
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* PRESET LEVEL BUTTONS */}
        <div>
          <label className="form-label">Permission Level Tier</label>
          <div className="grid-4" style={{ gap: 8 }}>
            {["Discover", "Prepare", "Act", "Full Trustee"].map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`btn btn-sm ${permissionLevel === lvl ? "btn-primary" : "btn-secondary"}`}
                onClick={() => handleLevelPreset(lvl)}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* GRANULAR PERMISSIONS LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {permissionDefinitions.map((perm) => {
            const isChecked = permissions.includes(perm.id);

            return (
              <div
                key={perm.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderRadius: "var(--radius-sm)",
                  background: isChecked ? "var(--surface)" : "var(--surface-alt)",
                  border: `1px solid ${isChecked ? "var(--accent)" : "var(--border)"}`,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>
                    {perm.title}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 2 }}>
                    {perm.desc}
                  </div>
                </div>

                <Switch
                  checked={isChecked}
                  onChange={() => handleToggle(perm.id)}
                />
              </div>
            );
          })}
        </div>
      </form>
    </Modal>
  );
}
