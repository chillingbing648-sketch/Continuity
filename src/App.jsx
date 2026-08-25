import React, { useState } from "react";
import "./styles/main.css";
import { AppProvider, useApp } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Auth Components
import { AuthContainer } from "./components/auth/AuthContainer";
import { AuthLoadingScreen } from "./components/auth/AuthLoadingScreen";

// Common Components
import { Icons, LogoIcon } from "./components/common/Icons";
import { Sidebar } from "./components/common/Sidebar";
import { MobileNav } from "./components/common/MobileNav";
import { Toast } from "./components/common/Toast";
import { CommandPalette } from "./components/common/CommandPalette";
import { GlobalSearchModal } from "./components/common/GlobalSearchModal";
import { QuickAddModal } from "./components/common/QuickAddModal";
import { ContextualAIAssistant } from "./components/common/ContextualAIAssistant";
import { OnboardingModal } from "./components/common/OnboardingModal";
import { ViewModeSwitcher } from "./components/common/ViewModeSwitcher";
import { ConfirmModal } from "./components/common/ConfirmModal";

// Views
import { DashboardView } from "./components/dashboard/DashboardView";
import { AssetsView } from "./components/assets/AssetsView";
import { FinancialLifeMapView } from "./components/lifemap/FinancialLifeMapView";
import { PeopleView } from "./components/people/PeopleView";
import { DocumentsView } from "./components/documents/DocumentsView";
import { FinancialCalendarView } from "./components/calendar/FinancialCalendarView";
import { ContinuitySettingsView } from "./components/continuity/ContinuitySettingsView";
import { ActivityView } from "./components/activity/ActivityView";
import { SettingsView } from "./components/settings/SettingsView";
import { TrustedPersonView } from "./components/trusted/TrustedPersonView";
import { EmergencyGuideView } from "./components/trusted/EmergencyGuideView";
import { LibraryPlaybookView } from "./components/library/LibraryPlaybookView";

// Modals
import { AssetDetailModal } from "./components/assets/AssetDetailModal";
import { AddAssetModal } from "./components/assets/AddAssetModal";
import { DocDetailModal } from "./components/documents/DocDetailModal";
import { UploadDocModal } from "./components/documents/UploadDocModal";
import { AddPersonModal } from "./components/people/AddPersonModal";
import { PermissionModal } from "./components/people/PermissionModal";
import { AddObligationModal } from "./components/calendar/AddObligationModal";
import { CheckinModal } from "./components/continuity/CheckinModal";
import { EditContinuityModal } from "./components/continuity/EditContinuityModal";
import { ContinuityScoreBreakdownModal } from "./components/continuity/ContinuityScoreBreakdownModal";
import { ContinuitySimulationModal } from "./components/continuity/ContinuitySimulationModal";
import { ContinuityDrillModal } from "./components/continuity/ContinuityDrillModal";

/* =========================================================================
   AppShell — Existing Continuity application
   ========================================================================= */
function AppShell() {
  const {
    viewMode,
    toast,
    activeModal,
    closeModal,
    isAiAssistantOpen,
    setAiAssistantOpen,
    setGlobalSearchOpen,
    isOnboardingOpen,
    setOnboardingOpen,
    isDemoMode,
    exitDemoMode,
    handleResetDemo,
  } = useApp();

  const [currentTab, setCurrentTab] = useState("dashboard");

  const renderActiveView = () => {
    if (viewMode === "trusted") {
      return <TrustedPersonView onNav={setCurrentTab} />;
    }
    if (viewMode === "emergency") {
      return <EmergencyGuideView />;
    }

    switch (currentTab) {
      case "dashboard":
        return <DashboardView onNav={setCurrentTab} />;
      case "library":
        return <LibraryPlaybookView onNav={setCurrentTab} />;
      case "assets":
        return <AssetsView />;
      case "lifemap":
        return <FinancialLifeMapView />;
      case "people":
        return <PeopleView />;
      case "documents":
        return <DocumentsView />;
      case "calendar":
        return <FinancialCalendarView />;
      case "continuity":
        return <ContinuitySettingsView />;
      case "activity":
        return <ActivityView />;
      case "settings":
        return <SettingsView onNav={setCurrentTab} />;
      default:
        return <DashboardView onNav={setCurrentTab} />;
    }
  };

  const getTopBarTitle = () => {
    if (viewMode === "trusted") return "Trusted Person Action Guide";
    if (viewMode === "emergency") return "Emergency Playbook — If I Become Unavailable";

    switch (currentTab) {
      case "dashboard":
        return "Financial Continuity Command Center";
      case "library":
        return "Library & System Playbook";
      case "assets":
        return "Assets & Liabilities Inventory";
      case "lifemap":
        return "Financial Life Relationship Map";
      case "people":
        return "Trusted Persons & Nominee Network";
      case "documents":
        return "Digital Evidence & Document Vault";
      case "calendar":
        return "Financial Calendar & Obligations";
      case "continuity":
        return "Continuity Protocols & Check-in";
      case "activity":
        return "Audit Timeline & Event Log";
      case "settings":
        return "System Settings & Security";
      default:
        return "Continuity";
    }
  };

  return (
    <div className="app">
      {/* SIDEBAR NAVIGATION (Desktop) */}
      <Sidebar currentTab={currentTab} onNav={setCurrentTab} />

      {/* MAIN VIEWPORT */}
      <main className="main">
        {/* DEMO MODE TOP BANNER */}
        {isDemoMode && (
          <div
            style={{
              background: "linear-gradient(90deg, #FFF3CD 0%, #FFEAA7 100%)",
              borderBottom: "1px solid #FFEEBA",
              color: "#856404",
              padding: "10px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
              fontSize: "0.85rem",
              fontWeight: 600,
              zIndex: 30,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icons.alertTriangle size={16} style={{ color: "#856404" }} />
              <span>
                <strong>DEMO MODE:</strong> Reference Workspace — sample financial records loaded for demonstration. Changes will not affect your personal workspace.
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ background: "white", color: "#856404", border: "1px solid #FFEEBA", fontSize: "0.78rem" }}
                onClick={handleResetDemo}
              >
                <Icons.refresh size={13} />
                Reset Demo Data
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ fontSize: "0.78rem" }}
                onClick={exitDemoMode}
              >
                <Icons.user size={13} />
                Exit Demo Mode
              </button>
            </div>
          </div>
        )}

        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="topbar-title">{getTopBarTitle()}</h1>
          </div>

          <div className="topbar-right">
            {/* VIEW MODE SWITCHER */}
            <ViewModeSwitcher />

            {/* SEARCH BUTTON */}
            <button
              type="button"
              className="btn-icon"
              onClick={() => setGlobalSearchOpen(true)}
              title="Global Search (Ctrl+S)"
            >
              <Icons.search size={18} />
            </button>

            {/* AI ASSISTANT BUTTON */}
            <button
              type="button"
              className="btn-icon"
              style={{ color: "var(--accent)" }}
              onClick={() => setAiAssistantOpen(true)}
              title="Continuity AI Intelligence"
            >
              <Icons.sparkles size={18} />
            </button>
          </div>
        </header>

        {/* CONTENT CONTAINER */}
        <div className="content-wrap">{renderActiveView()}</div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <MobileNav currentTab={currentTab} onNav={setCurrentTab} />

      {/* GLOBAL MODALS & OVERLAYS */}
      <CommandPalette onNav={setCurrentTab} />
      <GlobalSearchModal onNav={setCurrentTab} />

      {isAiAssistantOpen && (
        <ContextualAIAssistant onClose={() => setAiAssistantOpen(false)} />
      )}

      {isOnboardingOpen && (
        <OnboardingModal
          onClose={() => setOnboardingOpen(false)}
          onOpenPlaybook={() => {
            setOnboardingOpen(false);
            setCurrentTab("library");
          }}
        />
      )}

      {/* DYNAMIC MODAL ROUTER */}
      {activeModal?.type === "assetDetail" && (
        <AssetDetailModal
          asset={activeModal.props.asset}
          onClose={closeModal}
        />
      )}

      {activeModal?.type === "addAsset" && (
        <AddAssetModal
          defaultType={activeModal.props.defaultType || "Banking"}
          onClose={closeModal}
        />
      )}

      {activeModal?.type === "editAsset" && (
        <AddAssetModal
          initialData={activeModal.props.asset}
          onClose={closeModal}
        />
      )}

      {activeModal?.type === "docDetail" && (
        <DocDetailModal
          doc={activeModal.props.doc}
          onClose={closeModal}
        />
      )}

      {activeModal?.type === "uploadDoc" && (
        <UploadDocModal
          defaultAssetId={activeModal.props.defaultAssetId}
          onClose={closeModal}
        />
      )}

      {activeModal?.type === "addPerson" && (
        <AddPersonModal onClose={closeModal} />
      )}

      {activeModal?.type === "editPerson" && (
        <AddPersonModal
          initialData={activeModal.props.person}
          onClose={closeModal}
        />
      )}

      {activeModal?.type === "editPermissions" && (
        <PermissionModal
          person={activeModal.props.person}
          onClose={closeModal}
        />
      )}

      {activeModal?.type === "addObligation" && (
        <AddObligationModal onClose={closeModal} />
      )}

      {activeModal?.type === "checkinModal" && (
        <CheckinModal onClose={closeModal} />
      )}

      {activeModal?.type === "editContinuity" && (
        <EditContinuityModal onClose={closeModal} />
      )}

      {activeModal?.type === "scoreBreakdown" && (
        <ContinuityScoreBreakdownModal onClose={closeModal} />
      )}

      {activeModal?.type === "simulateContinuity" && (
        <ContinuitySimulationModal onClose={closeModal} />
      )}

      {activeModal?.type === "runDrill" && (
        <ContinuityDrillModal onClose={closeModal} />
      )}

      {activeModal?.type === "quickAdd" && (
        <QuickAddModal onClose={closeModal} />
      )}

      {activeModal?.type === "confirm" && (
        <ConfirmModal
          title={activeModal.props.title}
          desc={activeModal.props.desc}
          isDanger={activeModal.props.isDanger}
          onConfirm={() => {
            activeModal.props.onConfirm?.();
            closeModal();
          }}
          onCancel={closeModal}
        />
      )}

      {/* TOAST NOTIFICATION */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}

/* =========================================================================
   AuthGate — Decides whether to show Auth UI or the protected application
   ========================================================================= */
function AuthGate() {
  const { isAuthenticated, loading } = useAuth();

  // 1. While determining session, show branded loading screen (no flicker)
  if (loading) {
    return <AuthLoadingScreen />;
  }

  // 2. Unauthenticated → Show Login / Signup / Forgot / Reset
  if (!isAuthenticated) {
    return <AuthContainer />;
  }

  // 3. Authenticated → Mount Continuity application
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

/* =========================================================================
   App Root — AuthProvider wraps everything; AppProvider only mounts when
   the user is authenticated (inside AuthGate)
   ========================================================================= */
export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}