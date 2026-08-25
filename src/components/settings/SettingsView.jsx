import React, { useState, useRef, useEffect } from "react";
import { Icons } from "../common/Icons";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { exportContinuityData, importContinuityData } from "../../services/exportImport.service";
import { fmtDate } from "../../utils/formatting";

export function SettingsView({ onNav }) {
  const {
    user,
    updateUserProfile,
    isDemoMode,
    enterDemoMode,
    exitDemoMode,
    handleResetDemo,
    handleClearAllData,
    openModal,
    showToast,
    addActivity,
    setOnboardingOpen,
  } = useApp();

  const { user: authUser, logout, resetPassword } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || authUser?.user_metadata?.full_name || authUser?.email?.split("@")[0] || "Account Owner",
    email: user?.email || authUser?.email || "owner@example.com",
    phone: user?.phone || "+91 98000 00000",
    city: user?.city || "Mumbai, India",
  });

  const [isSendingReset, setIsSendingReset] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user || authUser) {
      setForm((prev) => ({
        ...prev,
        name: user?.name || authUser?.user_metadata?.full_name || authUser?.email?.split("@")[0] || prev.name,
        email: user?.email || authUser?.email || prev.email,
        phone: user?.phone || prev.phone,
        city: user?.city || prev.city,
      }));
    }
  }, [user, authUser]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile(form);
    addActivity({
      type: "settings",
      action: "Profile details updated",
      affectedEntity: form.name,
      detail: "Updated personal contact details.",
    });
    showToast("Profile updated successfully.");
  };

  const handleSendPasswordReset = async () => {
    if (!authUser?.email) {
      showToast("No authenticated email found.", "error");
      return;
    }
    setIsSendingReset(true);
    const res = await resetPassword(authUser.email);
    setIsSendingReset(false);
    if (res.success) {
      showToast(`Password recovery link dispatched to ${authUser.email}.`);
    } else {
      showToast(res.error || "Failed to send reset email.", "error");
    }
  };

  const handleLogout = () => {
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

  const handleExport = () => {
    if (!authUser?.id) {
      showToast("Authentication required for export.", "error");
      return;
    }
    try {
      exportContinuityData(authUser.id);
      showToast("Continuity backup file downloaded.");
    } catch (err) {
      showToast("Failed to generate export.", "error");
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || !authUser?.id) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        const res = importContinuityData(authUser.id, content);
        if (res.success) {
          showToast("Data restored to your workspace! Reloading...");
          setTimeout(() => window.location.reload(), 600);
        } else {
          showToast(`Import failed: ${res.error}`, "error");
        }
      }
    };
    reader.readAsText(file);
  };

  const confirmResetDemo = () => {
    openModal("confirm", {
      title: "Reset Demo Dataset",
      desc: "This will reset the in-memory sample reference holdings, nominees, documents, and obligations back to default baseline data.",
      isDanger: true,
      onConfirm: handleResetDemo,
    });
  };

  const confirmClearAll = () => {
    openModal("confirm", {
      title: "Reset My Personal Workspace",
      desc: "This will delete all local records associated with your account and start with a clean, empty continuity workspace.",
      isDanger: true,
      confirmLabel: "Reset My Workspace",
      onConfirm: handleClearAllData,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 880 }}>
      <div>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          Settings & Continuity System Controls
        </h2>
        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
          Account profile, Supabase authentication, data backups, demo workspace controls, and system guides.
        </div>
      </div>

      {/* 1. AUTHENTICATION & SECURITY BADGE */}
      {authUser && (
        <div className="card" style={{ padding: "18px 20px" }}>
          <div className="card-header" style={{ marginBottom: 12 }}>
            <div className="card-title">
              <Icons.shield size={18} style={{ color: "var(--accent)" }} />
              Supabase Authentication & Security
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {isDemoMode && <span className="badge badge-warn">Demo Mode Active</span>}
              <span className="badge badge-success">Authenticated</span>
            </div>
          </div>

          <div className="grid-3" style={{ gap: 10, marginBottom: 14 }}>
            <div style={{ background: "var(--surface-alt)", padding: "10px 14px", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Account Email
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginTop: 2, wordBreak: "break-all" }}>
                {authUser.email}
              </div>
            </div>

            <div style={{ background: "var(--surface-alt)", padding: "10px 14px", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                User Identifier
              </div>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)", marginTop: 2, fontFamily: "monospace" }}>
                {authUser.id ? `${authUser.id.slice(0, 12)}...` : "Session User"}
              </div>
            </div>

            <div style={{ background: "var(--surface-alt)", padding: "10px 14px", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Last Sign-In
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginTop: 2 }}>
                {authUser.last_sign_in_at ? fmtDate(authUser.last_sign_in_at) : "Active Session"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border-light)", paddingTop: 12 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleSendPasswordReset}
              disabled={isSendingReset}
            >
              <Icons.key size={14} />
              {isSendingReset ? "Sending recovery link..." : "Send Password Reset Email"}
            </button>

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ color: "var(--error)" }}
              onClick={handleLogout}
            >
              <Icons.logOut size={14} />
              Sign Out of Continuity
            </button>
          </div>
        </div>
      )}

      {/* 2. USER PROFILE CARD */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Icons.user size={18} style={{ color: "var(--accent)" }} />
            Account Owner Profile
          </div>
        </div>

        <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Legal Name</label>
              <input
                type="text"
                className="form-input"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Email</label>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Residential City / Jurisdiction</label>
              <input
                type="text"
                className="form-input"
                value={form.city}
                onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn btn-primary btn-sm">
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* 3. DATA MANAGEMENT & BACKUPS */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Icons.layers size={18} style={{ color: "var(--accent)" }} />
            Data Backup & Restore
          </div>
        </div>

        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.5 }}>
          Export a user-scoped JSON backup of your personal continuity vault, holdings, contacts, and obligations to save on your local drive or offline media.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleExport}>
            <Icons.download size={15} />
            Export Vault Backup (.json)
          </button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".json"
            onChange={handleImportFile}
          />

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Icons.upload size={15} />
            Restore From Backup File
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setOnboardingOpen(true)}
          >
            <Icons.guide size={15} />
            Replay Onboarding Guide
          </button>
        </div>
      </div>

      {/* 4. DEMO CONTROLS & WORKSPACE RESET */}
      <div className="card" style={{ borderColor: "var(--warn-border)" }}>
        <div className="card-header">
          <div className="card-title">
            <Icons.refresh size={18} style={{ color: "var(--warn)" }} />
            Demo Mode & Workspace Controls
          </div>
        </div>

        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.5 }}>
          Toggle the sample Reference Workspace to explore how features work without modifying your real financial data, or reset your personal workspace to start clean.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {!isDemoMode ? (
            <button type="button" className="btn btn-secondary btn-sm" onClick={enterDemoMode}>
              <Icons.sparkles size={14} />
              Explore Demo Mode (Reference Data)
            </button>
          ) : (
            <button type="button" className="btn btn-secondary btn-sm" onClick={exitDemoMode}>
              <Icons.user size={14} />
              Exit Demo Mode (Return to My Data)
            </button>
          )}

          <button type="button" className="btn btn-warn btn-sm" onClick={confirmResetDemo}>
            <Icons.refresh size={14} />
            Reset Demo Data Baseline
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ color: "var(--error)" }}
            onClick={confirmClearAll}
          >
            <Icons.trash size={14} />
            Reset My Personal Workspace
          </button>
        </div>
      </div>

      {/* 5. SECURITY FOUNDATION NOTICE */}
      <div className="card" style={{ background: "var(--surface-alt)", padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Icons.lock size={16} style={{ color: "var(--accent)" }} />
          <strong style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>
            User Isolation & Storage Architecture
          </strong>
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          Your Continuity workspace is isolated to your authenticated Supabase User ID (<code>{authUser?.id || "user"}</code>). All records are strictly partitioned under user-scoped keys. In future database migration, records seamlessly map to Supabase PostgreSQL tables with Row-Level Security (RLS) policies.
        </p>
      </div>
    </div>
  );
}
