import React from "react";
import { Modal } from "./Modal";
import { Icons } from "./Icons";
import { useApp } from "../../context/AppContext";

export function QuickAddModal({ onClose }) {
  const { openModal } = useApp();

  const options = [
    {
      id: "asset_bank",
      title: "Bank Account / Fixed Deposit",
      desc: "Checking, savings, or fixed deposit account with nominee",
      icon: <Icons.bank size={20} />,
      color: "#1D4ED8",
      bg: "#EFF6FF",
      action: () => {
        onClose();
        openModal("addAsset", { defaultType: "Banking" });
      },
    },
    {
      id: "asset_invest",
      title: "Investment Portfolio / Demat",
      desc: "Stocks, mutual funds, EPF/NPS, crypto, or bonds",
      icon: <Icons.trending size={20} />,
      color: "#6D28D9",
      bg: "#F5F3FF",
      action: () => {
        onClose();
        openModal("addAsset", { defaultType: "Investments" });
      },
    },
    {
      id: "asset_insurance",
      title: "Life / Health Insurance",
      desc: "Term life, health, or critical illness protection policy",
      icon: <Icons.umbrella size={20} />,
      color: "#B45309",
      bg: "#FFFBEB",
      action: () => {
        onClose();
        openModal("addAsset", { defaultType: "Insurance" });
      },
    },
    {
      id: "asset_liability",
      title: "Loan / Debt Liability",
      desc: "Home loan, car loan, or debt with auto-debit account",
      icon: <Icons.dollar size={20} />,
      color: "#DC2626",
      bg: "#FEF2F2",
      action: () => {
        onClose();
        openModal("addAsset", { defaultType: "Loans" });
      },
    },
    {
      id: "asset_property",
      title: "Real Estate Property",
      desc: "Residential flat, commercial plot, or land title",
      icon: <Icons.building size={20} />,
      color: "#BE185D",
      bg: "#FDF2F8",
      action: () => {
        onClose();
        openModal("addAsset", { defaultType: "Property" });
      },
    },
    {
      id: "person",
      title: "Trusted Person / Nominee",
      desc: "Spouse, family member, executor, or advisor",
      icon: <Icons.user size={20} />,
      color: "#0F766E",
      bg: "#F0FDFA",
      action: () => {
        onClose();
        openModal("addPerson");
      },
    },
    {
      id: "document",
      title: "Important Document",
      desc: "Will, deed, statement, policy bond, or identity card",
      icon: <Icons.upload size={20} />,
      color: "#2D6A4F",
      bg: "#EAF2EE",
      action: () => {
        onClose();
        openModal("uploadDoc");
      },
    },
    {
      id: "obligation",
      title: "Recurring Obligation / EMI",
      desc: "Monthly EMI, premium, SIP, or tax deadline",
      icon: <Icons.calendar size={20} />,
      color: "#D97706",
      bg: "#FEF3C7",
      action: () => {
        onClose();
        openModal("addObligation");
      },
    },
  ];

  return (
    <Modal
      title="Quick Add to Continuity"
      subtitle="Select what you'd like to protect and connect"
      onClose={onClose}
      size="large"
    >
      <div className="grid-2">
        {options.map((opt) => (
          <div
            key={opt.id}
            onClick={opt.action}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              padding: "14px 16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            className="card-clickable"
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: opt.bg,
                color: opt.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {opt.icon}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                {opt.title}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 2, lineHeight: 1.4 }}>
                {opt.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
