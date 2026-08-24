import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { storageService, STORAGE_KEYS } from "../services/storage.service";
import { INITIAL_DEMO_DATA } from "../data/demoData";
import {
  calculateContinuityScore,
  detectCriticalGaps,
  calculateFinancialDependencies,
} from "../services/continuityEngine";

const AppContext = createContext(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [assets, setAssets] = useState([]);
  const [people, setPeople] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [obligations, setObligations] = useState([]);
  const [continuity, setContinuity] = useState(null);
  const [activity, setActivity] = useState([]);
  const [viewMode, setViewMode] = useState("owner"); // owner | trusted | emergency
  const [toast, setToast] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isGlobalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [isAiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [isOnboardingOpen, setOnboardingOpen] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const existingUser = storageService.get(STORAGE_KEYS.USER);
    if (!existingUser) {
      // First time loading - load Demo Data
      storageService.set(STORAGE_KEYS.USER, INITIAL_DEMO_DATA.user);
      storageService.set(STORAGE_KEYS.ASSETS, INITIAL_DEMO_DATA.assets);
      storageService.set(STORAGE_KEYS.PEOPLE, INITIAL_DEMO_DATA.people);
      storageService.set(STORAGE_KEYS.DOCUMENTS, INITIAL_DEMO_DATA.documents);
      storageService.set(STORAGE_KEYS.OBLIGATIONS, INITIAL_DEMO_DATA.obligations);
      storageService.set(STORAGE_KEYS.CONTINUITY, INITIAL_DEMO_DATA.continuity);
      storageService.set(STORAGE_KEYS.ACTIVITY, INITIAL_DEMO_DATA.activity);
      storageService.set(STORAGE_KEYS.VIEW_MODE, "owner");
    }

    setUser(storageService.get(STORAGE_KEYS.USER) || INITIAL_DEMO_DATA.user);
    setAssets(storageService.get(STORAGE_KEYS.ASSETS) || INITIAL_DEMO_DATA.assets);
    setPeople(storageService.get(STORAGE_KEYS.PEOPLE) || INITIAL_DEMO_DATA.people);
    setDocuments(storageService.get(STORAGE_KEYS.DOCUMENTS) || INITIAL_DEMO_DATA.documents);
    setObligations(storageService.get(STORAGE_KEYS.OBLIGATIONS) || INITIAL_DEMO_DATA.obligations);
    setContinuity(storageService.get(STORAGE_KEYS.CONTINUITY) || INITIAL_DEMO_DATA.continuity);
    setActivity(storageService.get(STORAGE_KEYS.ACTIVITY) || INITIAL_DEMO_DATA.activity);
    setViewMode(storageService.get(STORAGE_KEYS.VIEW_MODE) || "owner");
  }, []);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3400);
  }, []);

  const openModal = useCallback((type, props = {}) => {
    setActiveModal({ type, props });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const addActivity = useCallback((entry) => {
    setActivity((prev) => {
      const newEntry = {
        ...entry,
        id: `act_${Date.now()}`,
        timestamp: entry.timestamp || new Date().toISOString(),
        actor: entry.actor || "Harsh Dubey",
      };
      const updated = [newEntry, ...(prev || [])];
      storageService.set(STORAGE_KEYS.ACTIVITY, updated);
      return updated;
    });
  }, []);

  // CRUD ASSETS
  const saveAssets = useCallback((newAssets) => {
    setAssets(newAssets);
    storageService.set(STORAGE_KEYS.ASSETS, newAssets);
  }, []);

  const addAsset = useCallback((assetData) => {
    try {
      const newAsset = {
        ...assetData,
        id: `a_${Date.now()}`,
        createdAt: new Date().toISOString().slice(0, 10),
        lastVerified: new Date().toISOString().slice(0, 10),
        approxValue: Number(assetData.approxValue) || 0,
      };
      setAssets((prev) => {
        const updated = [...prev, newAsset];
        storageService.set(STORAGE_KEYS.ASSETS, updated);
        return updated;
      });
      addActivity({
        type: "asset",
        action: "Financial asset registered",
        affectedEntity: newAsset.name,
        detail: `Added ${newAsset.type} asset valued at ₹${Math.abs(newAsset.approxValue).toLocaleString("en-IN")}.`,
      });
      showToast(`${newAsset.name} added successfully.`);
      return newAsset;
    } catch {
      showToast("Unable to save asset. Please verify input fields.", "error");
      return null;
    }
  }, [addActivity, showToast]);

  const updateAsset = useCallback((id, updates) => {
    setAssets((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, ...updates, lastVerified: updates.lastVerified || new Date().toISOString().slice(0, 10) } : a));
      storageService.set(STORAGE_KEYS.ASSETS, updated);
      return updated;
    });
    const item = assets.find((a) => a.id === id);
    addActivity({
      type: "asset",
      action: "Asset updated",
      affectedEntity: updates.name || item?.name || "Asset",
      detail: "Updated financial parameters & continuity properties.",
    });
    showToast("Asset updated successfully.");
  }, [assets, addActivity, showToast]);

  const deleteAsset = useCallback((id) => {
    const item = assets.find((a) => a.id === id);
    setAssets((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      storageService.set(STORAGE_KEYS.ASSETS, updated);
      return updated;
    });
    addActivity({
      type: "asset",
      action: "Asset removed",
      affectedEntity: item?.name || "Asset",
      detail: "Removed from active financial inventory.",
    });
    showToast("Asset removed.", "info");
  }, [assets, addActivity, showToast]);

  const verifyAsset = useCallback((id) => {
    const today = new Date().toISOString().slice(0, 10);
    setAssets((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, lastVerified: today, nomineeVerified: true } : a));
      storageService.set(STORAGE_KEYS.ASSETS, updated);
      return updated;
    });
    const item = assets.find((a) => a.id === id);
    addActivity({
      type: "asset",
      action: "Asset verified",
      affectedEntity: item?.name || "Asset",
      detail: "Freshness and nominee designation verified.",
    });
    showToast("Asset marked as verified.");
  }, [assets, addActivity, showToast]);

  // CRUD PEOPLE
  const savePeople = useCallback((newPeople) => {
    setPeople(newPeople);
    storageService.set(STORAGE_KEYS.PEOPLE, newPeople);
  }, []);

  const addPerson = useCallback((personData) => {
    try {
      const initials = (personData.name || "TP")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      const newPerson = {
        ...personData,
        id: `p_${Date.now()}`,
        avatar: initials,
        status: personData.status || "Active",
        joinedAt: new Date().toISOString().slice(0, 10),
        permissions: personData.permissions || ["financial_inventory", "documents", "instructions"],
        readinessProfile: {
          identityVerified: true,
          invitationAccepted: true,
          permissionsAssigned: true,
          documentsViewed: false,
          emergencyGuideRead: false,
          drillCompleted: false,
          lastConfirmationDaysAgo: 0,
        },
      };
      setPeople((prev) => {
        const updated = [...prev, newPerson];
        storageService.set(STORAGE_KEYS.PEOPLE, updated);
        return updated;
      });
      addActivity({
        type: "person",
        action: "Trusted person added",
        affectedEntity: newPerson.name,
        detail: `Assigned role: ${newPerson.role} (${newPerson.relationship}).`,
      });
      showToast(`${newPerson.name} added to trusted network.`);
      return newPerson;
    } catch {
      showToast("Unable to save trusted person.", "error");
      return null;
    }
  }, [addActivity, showToast]);

  const updatePerson = useCallback((id, updates) => {
    setPeople((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      storageService.set(STORAGE_KEYS.PEOPLE, updated);
      return updated;
    });
    const p = people.find((item) => item.id === id);
    addActivity({
      type: "person",
      action: "Contact profile updated",
      affectedEntity: updates.name || p?.name || "Person",
      detail: "Updated access credentials and roles.",
    });
    showToast("Person details updated.");
  }, [people, addActivity, showToast]);

  const deletePerson = useCallback((id) => {
    const p = people.find((item) => item.id === id);
    setPeople((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      storageService.set(STORAGE_KEYS.PEOPLE, updated);
      return updated;
    });
    addActivity({
      type: "person",
      action: "Trusted person removed",
      affectedEntity: p?.name || "Person",
      detail: "Revoked continuity permissions.",
    });
    showToast("Contact removed.", "info");
  }, [people, addActivity, showToast]);

  // CRUD DOCUMENTS
  const saveDocuments = useCallback((newDocs) => {
    setDocuments(newDocs);
    storageService.set(STORAGE_KEYS.DOCUMENTS, newDocs);
  }, []);

  const addDocument = useCallback((docData) => {
    try {
      const newDoc = {
        ...docData,
        id: `d_${Date.now()}`,
        uploadDate: new Date().toISOString().slice(0, 10),
        size: docData.size || "180 KB",
        format: docData.format || "PDF",
        verified: docData.verified ?? true,
      };
      setDocuments((prev) => {
        const updated = [...prev, newDoc];
        storageService.set(STORAGE_KEYS.DOCUMENTS, updated);
        return updated;
      });
      addActivity({
        type: "document",
        action: "Document securely vaulted",
        affectedEntity: newDoc.title,
        detail: `Category: ${newDoc.category} | ${newDoc.docType || "General Document"}.`,
      });
      showToast(`${newDoc.title} uploaded successfully.`);
      return newDoc;
    } catch {
      showToast("Unable to save document.", "error");
      return null;
    }
  }, [addActivity, showToast]);

  const deleteDocument = useCallback((id) => {
    const doc = documents.find((d) => d.id === id);
    setDocuments((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      storageService.set(STORAGE_KEYS.DOCUMENTS, updated);
      return updated;
    });
    addActivity({
      type: "document",
      action: "Document removed",
      affectedEntity: doc?.title || "Document",
      detail: "Removed from vault.",
    });
    showToast("Document deleted.", "info");
  }, [documents, addActivity, showToast]);

  const verifyDocument = useCallback((id) => {
    setDocuments((prev) => {
      const updated = prev.map((d) => (d.id === id ? { ...d, verified: true } : d));
      storageService.set(STORAGE_KEYS.DOCUMENTS, updated);
      return updated;
    });
    const doc = documents.find((d) => d.id === id);
    addActivity({
      type: "document",
      action: "Document verified",
      affectedEntity: doc?.title || "Document",
      detail: "Digital verification verified with institution.",
    });
    showToast("Document verified.");
  }, [documents, addActivity, showToast]);

  // CRUD OBLIGATIONS
  const saveObligations = useCallback((newObligations) => {
    setObligations(newObligations);
    storageService.set(STORAGE_KEYS.OBLIGATIONS, newObligations);
  }, []);

  const addObligation = useCallback((oblData) => {
    const newObl = {
      ...oblData,
      id: `obl_${Date.now()}`,
      amount: Number(oblData.amount) || 0,
    };
    setObligations((prev) => {
      const updated = [...prev, newObl];
      storageService.set(STORAGE_KEYS.OBLIGATIONS, updated);
      return updated;
    });
    addActivity({
      type: "obligation",
      action: "Financial obligation registered",
      affectedEntity: newObl.title,
      detail: `${newObl.type}: ₹${newObl.amount.toLocaleString("en-IN")} (${newObl.frequency}).`,
    });
    showToast(`Obligation ${newObl.title} added.`);
    return newObl;
  }, [addActivity, showToast]);

  const deleteObligation = useCallback((id) => {
    const obl = obligations.find((o) => o.id === id);
    setObligations((prev) => {
      const updated = prev.filter((o) => o.id !== id);
      storageService.set(STORAGE_KEYS.OBLIGATIONS, updated);
      return updated;
    });
    addActivity({
      type: "obligation",
      action: "Obligation removed",
      affectedEntity: obl?.title || "Obligation",
      detail: "Removed from recurring schedule.",
    });
    showToast("Obligation removed.", "info");
  }, [obligations, addActivity, showToast]);

  // CONTINUITY & CHECK-IN SYSTEM
  const saveContinuity = useCallback((newContinuity) => {
    setContinuity(newContinuity);
    storageService.set(STORAGE_KEYS.CONTINUITY, newContinuity);
  }, []);

  const completeCheckin = useCallback(() => {
    const today = new Date();
    const freq = continuity?.frequency || 30;
    const nextDate = new Date(today.getTime() + freq * 24 * 60 * 60 * 1000);
    
    const updated = {
      ...continuity,
      active: true,
      lastCheckin: today.toISOString().slice(0, 10),
      nextCheckin: nextDate.toISOString().slice(0, 10),
      protocolState: "ACTIVE",
    };
    setContinuity(updated);
    storageService.set(STORAGE_KEYS.CONTINUITY, updated);
    addActivity({
      type: "checkin",
      action: "Periodic Safety Check-in Completed",
      affectedEntity: "Continuity Protocol",
      detail: `Next scheduled check-in: ${nextDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.`,
    });
    showToast("Check-in confirmed. Continuity protocol reset to Active.");
  }, [continuity, addActivity, showToast]);

  const recordDrillResult = useCallback((score, tasksCount = 5) => {
    const today = new Date().toISOString().slice(0, 10);
    const updated = {
      ...continuity,
      drillsCompleted: (continuity?.drillsCompleted || 0) + 1,
      lastDrillDate: today,
      lastDrillScore: score,
    };
    setContinuity(updated);
    storageService.set(STORAGE_KEYS.CONTINUITY, updated);

    // Also update primary trustee's readiness profile
    setPeople((prev) => {
      const updatedPeople = prev.map((p) => {
        if (p.isPrimaryTrustee || p.id === continuity?.notifyPersonId) {
          return {
            ...p,
            readinessProfile: {
              ...p.readinessProfile,
              drillCompleted: true,
              lastConfirmationDaysAgo: 0,
            },
          };
        }
        return p;
      });
      storageService.set(STORAGE_KEYS.PEOPLE, updatedPeople);
      return updatedPeople;
    });

    addActivity({
      type: "drill",
      action: "Continuity Drill Simulation Completed",
      affectedEntity: `Score: ${score}%`,
      detail: `Simulated trusted person emergency navigation successfully.`,
    });
    showToast(`Drill completed! Score: ${score}%.`);
  }, [continuity, addActivity, showToast]);

  // VIEW MODE SWITCHER
  const changeViewMode = useCallback((mode) => {
    setViewMode(mode);
    storageService.set(STORAGE_KEYS.VIEW_MODE, mode);
    showToast(`Switched view to: ${mode === "owner" ? "Owner Command Center" : mode === "trusted" ? "Trusted Person Action Guide" : "Emergency Handoff Guide"}`);
  }, [showToast]);

  // DEMO RESET
  const handleResetDemo = useCallback(() => {
    storageService.clearAll();
    storageService.set(STORAGE_KEYS.USER, INITIAL_DEMO_DATA.user);
    storageService.set(STORAGE_KEYS.ASSETS, INITIAL_DEMO_DATA.assets);
    storageService.set(STORAGE_KEYS.PEOPLE, INITIAL_DEMO_DATA.people);
    storageService.set(STORAGE_KEYS.DOCUMENTS, INITIAL_DEMO_DATA.documents);
    storageService.set(STORAGE_KEYS.OBLIGATIONS, INITIAL_DEMO_DATA.obligations);
    storageService.set(STORAGE_KEYS.CONTINUITY, INITIAL_DEMO_DATA.continuity);
    storageService.set(STORAGE_KEYS.ACTIVITY, INITIAL_DEMO_DATA.activity);
    storageService.set(STORAGE_KEYS.VIEW_MODE, "owner");

    setUser(INITIAL_DEMO_DATA.user);
    setAssets(INITIAL_DEMO_DATA.assets);
    setPeople(INITIAL_DEMO_DATA.people);
    setDocuments(INITIAL_DEMO_DATA.documents);
    setObligations(INITIAL_DEMO_DATA.obligations);
    setContinuity(INITIAL_DEMO_DATA.continuity);
    setActivity(INITIAL_DEMO_DATA.activity);
    setViewMode("owner");
    showToast("Demo data has been reset to baseline.");
  }, [showToast]);

  const handleClearAllData = useCallback(() => {
    storageService.clearAll();
    setUser({ id: "u_new", name: "User", email: "", phone: "", avatar: "U", joinDate: new Date().toISOString().slice(0, 10) });
    setAssets([]);
    setPeople([]);
    setDocuments([]);
    setObligations([]);
    setContinuity({ active: false, frequency: 30, protocolState: "ACTIVE" });
    setActivity([]);
    setViewMode("owner");
    showToast("All data cleared. Starting fresh.", "info");
  }, [showToast]);

  // DERIVED ENGINE CALCULATIONS (Memoized)
  const continuityScoreData = useMemo(() => {
    return calculateContinuityScore(assets, people, documents, continuity, obligations);
  }, [assets, people, documents, continuity, obligations]);

  const criticalGaps = useMemo(() => {
    return detectCriticalGaps(assets, people, documents, continuity, obligations);
  }, [assets, people, documents, continuity, obligations]);

  const financialDependencies = useMemo(() => {
    return calculateFinancialDependencies(assets, obligations);
  }, [assets, obligations]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        assets,
        setAssets,
        saveAssets,
        addAsset,
        updateAsset,
        deleteAsset,
        verifyAsset,
        people,
        setPeople,
        savePeople,
        addPerson,
        updatePerson,
        deletePerson,
        documents,
        setDocuments,
        saveDocuments,
        addDocument,
        deleteDocument,
        verifyDocument,
        obligations,
        setObligations,
        saveObligations,
        addObligation,
        deleteObligation,
        continuity,
        setContinuity,
        saveContinuity,
        completeCheckin,
        recordDrillResult,
        activity,
        addActivity,
        viewMode,
        changeViewMode,
        toast,
        showToast,
        activeModal,
        openModal,
        closeModal,
        isCommandPaletteOpen,
        setCommandPaletteOpen,
        isGlobalSearchOpen,
        setGlobalSearchOpen,
        isAiAssistantOpen,
        setAiAssistantOpen,
        isOnboardingOpen,
        setOnboardingOpen,
        continuityScoreData,
        criticalGaps,
        financialDependencies,
        handleResetDemo,
        handleClearAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
