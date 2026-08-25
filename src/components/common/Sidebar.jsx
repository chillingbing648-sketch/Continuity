import React, { useState } from "react";
import { Icons, LogoIcon } from "./Icons";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

export function Sidebar({ currentTab, onNav }) {
  const { criticalGaps, openModal, setCommandPaletteOpen, setAiAssistantOpen } = useApp();
  const { user: authUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const displayName =
    authUser?.user_metadata?.full_name ||
    authUser?.email?.split("@")[0] ||
    "Harsh Dubey";

  const displayEmail = authUser?.email || "harshdubey.works@gmail.com";

  const userInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "HD";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <Icons.home size={18} /> },
    { id: "assets", label: "Assets & Liabilities", icon: <Icons.bank size={18} /> },
    { id: "lifemap", label: "Financial Life Map", icon: <Icons.lifeMap size={18} /> },
    { id: "people", label: "Trusted Persons", icon: <Icons.people size={18} /> },
    { id: "documents", label: "Documents", icon: <Icons.docs size={18} /> },
    { id: "calendar", label: "Financial Calendar", icon: <Icons.calendar size={18} /> },
    {
      id: "continuity",
      label: "Continuity Protocols",
      icon: <Icons.continuity size={18} />,
      badge: criticalGaps.length > 0 ? criticalGaps.length : null,
      badgeType: "warn",
    },
    { id: "activity", label: "Audit Timeline", icon: <Icons.activity size={18} /> },
    { id: "settings", label: "Settings", icon: <Icons.settings size={18} /> },
  ];

  const handleLogout = async () => {
    openModal("confirm", {
      title: "Sign Out",
      desc: "Are you sure you want to end your current session?",
      isDanger: false,
      confirmLabel: "Sign Out",
      onConfirm: async () => {
        await logout();
      },
    });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">
            <LogoIcon size={18} />
          </div>
          <div>
            <div className="logo-text">Continuity</div>
            <div className="logo-sub">Financial Continuity</div>
          </div>
        </div>
      </div>

      <div className="sidebar-nav">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          style={{ width: "100%", marginBottom: 12, justifyContent: "center" }}
          onClick={() => openModal("quickAdd")}
        >
          <Icons.plus size={16} />
          Quick Add
        </button>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ width: "100%", marginBottom: 12, justifyContent: "space-between", fontSize: "0.78rem" }}
          onClick={() => setCommandPaletteOpen(true)}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icons.search size={14} />
            Command Menu
          </span>
          <span className="cmd-shortcut">Ctrl+K</span>
        </button>

        <div className="sidebar-section-title">Navigation</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${currentTab === item.id ? "active" : ""}`}
            onClick={() => {
              setShowUserMenu(false);
              onNav(item.id);
            }}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge && (
              <span className={`nav-badge ${item.badgeType}`}>{item.badge}</span>
            )}
          </button>
        ))}

        <div className="sidebar-section-title">Intelligence</div>
        <button
          type="button"
          className="nav-item"
          onClick={() => {
            setShowUserMenu(false);
            setAiAssistantOpen(true);
          }}
        >
          <Icons.sparkles size={18} style={{ color: "var(--accent)" }} />
          <span>Ask Continuity AI</span>
        </button>
      </div>

      {/* FOOTER USER CARD & ACCOUNT DROPDOWN */}
      <div className="sidebar-footer" style={{ position: "relative" }}>
        {showUserMenu && (
          <div
            className="card"
            style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: 10,
              right: 10,
              padding: "10px",
              boxShadow: "var(--shadow-lg)",
              zIndex: 50,
              animation: "modalPopIn 0.15s ease",
            }}
          >
            <div style={{ padding: "6px 8px 10px", borderBottom: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {displayName}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", wordBreak: "break-all" }}>
                {displayEmail}
              </div>
              <div style={{ marginTop: 6 }}>
                <span className="badge badge-success" style={{ fontSize: "0.68rem" }}>
                  Supabase Verified
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 6 }}>
              <button
                type="button"
                className="nav-item"
                style={{ padding: "7px 8px", fontSize: "0.8rem" }}
                onClick={() => {
                  setShowUserMenu(false);
                  onNav("settings");
                }}
              >
                <Icons.settings size={15} />
                <span>Account Settings</span>
              </button>

              <button
                type="button"
                className="nav-item"
                style={{ padding: "7px 8px", fontSize: "0.8rem", color: "var(--error)" }}
                onClick={() => {
                  setShowUserMenu(false);
                  handleLogout();
                }}
              >
                <Icons.logOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        <div
          className="user-card"
          onClick={() => setShowUserMenu((prev) => !prev)}
          title="Account Menu"
        >
          <div className="avatar">{userInitials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {displayName}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {displayEmail}
            </div>
          </div>
          <Icons.chevronDown size={14} style={{ color: "var(--text-muted)", transform: showUserMenu ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }} />
        </div>
      </div>
    </aside>
  );
}
