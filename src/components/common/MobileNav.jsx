import React from "react";
import { Icons } from "./Icons";
import { useApp } from "../../context/AppContext";

export function MobileNav({ currentTab, onNav }) {
  const { openModal } = useApp();

  return (
    <nav className="mobile-nav" aria-label="Mobile Navigation">
      <button
        type="button"
        className={`mobile-nav-item ${currentTab === "dashboard" ? "active" : ""}`}
        onClick={() => onNav("dashboard")}
      >
        <Icons.home size={20} />
        <span>Home</span>
      </button>

      <button
        type="button"
        className={`mobile-nav-item ${currentTab === "assets" ? "active" : ""}`}
        onClick={() => onNav("assets")}
      >
        <Icons.bank size={20} />
        <span>Assets</span>
      </button>

      <button
        type="button"
        className="mobile-nav-item"
        style={{ color: "var(--accent)" }}
        onClick={() => openModal("quickAdd")}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "var(--accent)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: -14,
            boxShadow: "0 2px 8px rgba(45,106,79,0.3)",
          }}
        >
          <Icons.plus size={20} />
        </div>
        <span>Add</span>
      </button>

      <button
        type="button"
        className={`mobile-nav-item ${currentTab === "people" ? "active" : ""}`}
        onClick={() => onNav("people")}
      >
        <Icons.people size={20} />
        <span>People</span>
      </button>

      <button
        type="button"
        className={`mobile-nav-item ${currentTab === "continuity" ? "active" : ""}`}
        onClick={() => onNav("continuity")}
      >
        <Icons.continuity size={20} />
        <span>Continuity</span>
      </button>
    </nav>
  );
}
