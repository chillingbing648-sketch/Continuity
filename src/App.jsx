import React, { useState } from "react";
import "./styles/main.css";
import { AppProvider, useApp } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AuthContainer } from "./components/auth/AuthContainer";
import { AuthLoadingScreen } from "./components/auth/AuthLoadingScreen";
import { Icons } from "./components/common/Icons";
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
import { CommandCenterView } from "./components/dashboard/CommandCenterView";
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

function AppShell() {
  const { viewMode, toast, activeModal, closeModal, isAiAssistantOpen, setAiAssistantOpen, setGlobalSearchOpen, isOnboardingOpen, setOnboardingOpen, isDemoMode, exitDemoMode, handleResetDemo } = useApp();
  const [currentTab, setCurrentTab] = useState("dashboard");

  const renderActiveView = () => {
    if (viewMode === "trusted") return <TrustedPersonView onNav={setCurrentTab} />;
    if (viewMode === "emergency") return <EmergencyGuideView />;
    switch (currentTab) {
      case "dashboard": return <CommandCenterView onNav={setCurrentTab} />;
      case "library": return <LibraryPlaybookView onNav={setCurrentTab} />;
      case "assets": return <AssetsView />;
      case "lifemap": return <FinancialLifeMapView />;
      case "people": return <PeopleView />;
      case "documents": return <DocumentsView />;
      case "calendar": return <FinancialCalendarView />;
      case "continuity": return <ContinuitySettingsView />;
      case "activity": return <ActivityView />;
      case "settings": return <SettingsView onNav={setCurrentTab} />;
      default: return <CommandCenterView onNav={setCurrentTab} />;
    }
  };

  const getTopBarTitle = () => {
    if (viewMode === "trusted") return "Trusted Person Action Guide";
    if (viewMode === "emergency") return "Emergency Playbook";
    const titles = { dashboard: "Command Center", library: "Library & Playbook", assets: "Assets & Liabilities", lifemap: "Financial Life Map", people: "Trusted Persons", documents: "Document Vault", calendar: "Financial Calendar", continuity: "Continuity Protocols", activity: "Audit Timeline", settings: "Settings" };
    return titles[currentTab] || "Continuity";
  };

  return (
    <div className="app">
      <Sidebar currentTab={currentTab} onNav={setCurrentTab} />
      <main className="main">
        {isDemoMode && <div style={{ background: "linear-gradient(90deg,#FFF3CD,#FFEAA7)", borderBottom: "1px solid #FFEEBA", color: "#856404", padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, fontSize: ".78rem", fontWeight: 600, zIndex: 30 }}><span><strong>DEMO MODE</strong> · Sample records are isolated from your workspace.</span><div style={{ display: "flex", gap: 6 }}><button type="button" className="btn btn-secondary btn-sm" onClick={handleResetDemo}>Reset</button><button type="button" className="btn btn-primary btn-sm" onClick={exitDemoMode}>Exit</button></div></div>}
        <header className="topbar">
          <div className="topbar-left"><h1 className="topbar-title">{getTopBarTitle()}</h1></div>
          <div className="topbar-right"><ViewModeSwitcher /><button type="button" className="btn-icon" onClick={() => setGlobalSearchOpen(true)} title="Search"><Icons.search size={18} /></button><button type="button" className="btn-icon" style={{ color: "var(--accent)" }} onClick={() => setAiAssistantOpen(true)} title="Continuity AI"><Icons.sparkles size={18} /></button></div>
        </header>
        <div className="content-wrap">{renderActiveView()}</div>
      </main>
      <MobileNav currentTab={currentTab} onNav={setCurrentTab} />
      <CommandPalette onNav={setCurrentTab} />
      <GlobalSearchModal onNav={setCurrentTab} />
      {isAiAssistantOpen && <ContextualAIAssistant onClose={() => setAiAssistantOpen(false)} />}
      {isOnboardingOpen && <OnboardingModal onClose={() => setOnboardingOpen(false)} onOpenPlaybook={() => { setOnboardingOpen(false); setCurrentTab("library"); }} />}
      {activeModal?.type === "assetDetail" && <AssetDetailModal asset={activeModal.props.asset} onClose={closeModal} />}
      {activeModal?.type === "addAsset" && <AddAssetModal defaultType={activeModal.props.defaultType || "Banking"} onClose={closeModal} />}
      {activeModal?.type === "editAsset" && <AddAssetModal initialData={activeModal.props.asset} onClose={closeModal} />}
      {activeModal?.type === "docDetail" && <DocDetailModal doc={activeModal.props.doc} onClose={closeModal} />}
      {activeModal?.type === "uploadDoc" && <UploadDocModal defaultAssetId={activeModal.props.defaultAssetId} onClose={closeModal} />}
      {activeModal?.type === "addPerson" && <AddPersonModal onClose={closeModal} />}
      {activeModal?.type === "editPerson" && <AddPersonModal initialData={activeModal.props.person} onClose={closeModal} />}
      {activeModal?.type === "editPermissions" && <PermissionModal person={activeModal.props.person} onClose={closeModal} />}
      {activeModal?.type === "addObligation" && <AddObligationModal onClose={closeModal} />}
      {activeModal?.type === "checkinModal" && <CheckinModal onClose={closeModal} />}
      {activeModal?.type === "editContinuity" && <EditContinuityModal onClose={closeModal} />}
      {activeModal?.type === "scoreBreakdown" && <ContinuityScoreBreakdownModal onClose={closeModal} />}
      {activeModal?.type === "simulateContinuity" && <ContinuitySimulationModal onClose={closeModal} />}
      {activeModal?.type === "runDrill" && <ContinuityDrillModal onClose={closeModal} />}
      {activeModal?.type === "quickAdd" && <QuickAddModal onClose={closeModal} />}
      {activeModal?.type === "confirm" && <ConfirmModal title={activeModal.props.title} desc={activeModal.props.desc} isDanger={activeModal.props.isDanger} onConfirm={() => { activeModal.props.onConfirm?.(); closeModal(); }} onCancel={closeModal} />}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}

function AuthGate() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <AuthLoadingScreen />;
  if (!isAuthenticated) return <AuthContainer />;
  return <AppProvider><AppShell /></AppProvider>;
}

export default function App() {
  return <AuthProvider><AuthGate /></AuthProvider>;
}
