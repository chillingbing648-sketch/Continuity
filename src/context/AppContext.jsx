import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "./AuthContext";
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
  const { user: authUser } = useAuth();

  const [user, setUser] = useState(null);
  const [assets, setAssets] = useState([]);
  const [people, setPeople] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [obligations, setObligations] = useState([]);
  const [continuity, setContinuity] = useState(null);
  const [activity, setActivity] = useState([]);
  const [viewMode, setViewMode] = useState("owner"); // owner | trusted | emergency
  const [isDemoMode, setIsDemoMode] = useState(false);

  const [toast, setToast] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isGlobalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [isAiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [isOnboardingOpen, setOnboardingOpen] = useState(false);

  // Initialize and synchronize user data when authUser changes or when switching Demo Mode
  useEffect(() => {
    // 1. Guard: If no authenticated user, reset in-memory state cleanly
    if (!authUser?.id) {
      setUser(null);
      setAssets([]);
      setPeople([]);
      setDocuments([]);
      setObligations([]);
      setContinuity(null);
      setActivity([]);
      setViewMode("owner");
      setIsDemoMode(false);
      return;
    }

    // 2. If Demo Mode is active, load demo dataset in memory (do not write to user storage)
    if (isDemoMode) {
      setUser(INITIAL_DEMO_DATA.user);
      setAssets(INITIAL_DEMO_DATA.assets);
      setPeople(INITIAL_DEMO_DATA.people);
      setDocuments(INITIAL_DEMO_DATA.documents);
      setObligations(INITIAL_DEMO_DATA.obligations);
      setContinuity(INITIAL_DEMO_DATA.continuity);
      setActivity(INITIAL_DEMO_DATA.activity);
      setViewMode("owner");
      return;
    }

    // 3. User Workspace: Check if user data exists in user-scoped storage
    const userId = authUser.id;
    const hasExistingData = storageService.hasUserData(userId);

    if (hasExistingData) {
      // Existing User: Load from user-scoped storage
      const storedUser = storageService.get(userId, STORAGE_KEYS.USER);
      const storedAssets = storageService.get(userId, STORAGE_KEYS.ASSETS) || [];
      const storedPeople = storageService.get(userId, STORAGE_KEYS.PEOPLE) || [];
      const storedDocuments = storageService.get(userId, STORAGE_KEYS.DOCUMENTS) || [];
      const storedObligations = storageService.get(userId, STORAGE_KEYS.OBLIGATIONS) || [];
      const storedContinuity = storageService.get(userId, STORAGE_KEYS.CONTINUITY) || {
        active: false,
        frequency: 30,
        gracePeriod: 15,
        protocolState: "ACTIVE",
        drillsCompleted: 0,
        notifyPersonId: null,
      };
      const storedActivity = storageService.get(userId, STORAGE_KEYS.ACTIVITY) || [];
      const storedViewMode = storageService.get(userId, STORAGE_KEYS.VIEW_MODE) || "owner";

      setUser(
        storedUser || {
          id: userId,
          name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
          email: authUser.email || "",
          phone: "",
          avatar: (authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "U").slice(0, 2).toUpperCase(),
          joinDate: new Date().toISOString().slice(0, 10),
        }
      );
      setAssets(storedAssets);
      setPeople(storedPeople);
      setDocuments(storedDocuments);
      setObligations(storedObligations);
      setContinuity(storedContinuity);
      setActivity(storedActivity);
      setViewMode(storedViewMode);
    } else {
      // NEW USER: Create a CLEAN EMPTY workspace (DO NOT load INITIAL_DEMO_DATA)
      const cleanProfile = {
        id: userId,
        name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
        email: authUser.email || "",
        phone: "",
        avatar: (authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "U").slice(0, 2).toUpperCase(),
        joinDate: new Date().toISOString().slice(0, 10),
      };
      const cleanContinuity = {
        active: false,
        frequency: 30,
        gracePeriod: 15,
        protocolState: "ACTIVE",
        drillsCompleted: 0,
        notifyPersonId: null,
      };

      // Persist clean empty workspace to user-scoped storage
      storageService.set(userId, STORAGE_KEYS.USER, cleanProfile);
      storageService.set(userId, STORAGE_KEYS.ASSETS, []);
      storageService.set(userId, STORAGE_KEYS.PEOPLE, []);
      storageService.set(userId, STORAGE_KEYS.DOCUMENTS, []);
      storageService.set(userId, STORAGE_KEYS.OBLIGATIONS, []);
      storageService.set(userId, STORAGE_KEYS.CONTINUITY, cleanContinuity);
      storageService.set(userId, STORAGE_KEYS.ACTIVITY, []);
      storageService.set(userId, STORAGE_KEYS.VIEW_MODE, "owner");

      setUser(cleanProfile);
      setAssets([]);
      setPeople([]);
      setDocuments([]);
      setObligations([]);
      setContinuity(cleanContinuity);
      setActivity([]);
      setViewMode("owner");

      // Trigger Onboarding for newly registered account if not yet onboarded
      const isOnboarded = storageService.get(userId, STORAGE_KEYS.ONBOARDED);
      if (!isOnboarded) {
        setOnboardingOpen(true);
      }
    }
  }, [authUser?.id, isDemoMode]);

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

  // DEMO MODE CONTROLS
  const enterDemoMode = useCallback(() => {
    setIsDemoMode(true);
    showToast("Entered Demo Mode (Reference Workspace).", "info");
  }, [showToast]);

  const exitDemoMode = useCallback(() => {
    setIsDemoMode(false);
    showToast("Returned to your personal workspace.");
  }, [showToast]);

  const handleResetDemo = useCallback(() => {
    if (isDemoMode) {
      setUser(INITIAL_DEMO_DATA.user);
      setAssets(INITIAL_DEMO_DATA.assets);
      setPeople(INITIAL_DEMO_DATA.people);
      setDocuments(INITIAL_DEMO_DATA.documents);
      setObligations(INITIAL_DEMO_DATA.obligations);
      setContinuity(INITIAL_DEMO_DATA.continuity);
      setActivity(INITIAL_DEMO_DATA.activity);
      setViewMode("owner");
      showToast("Demo data has been reset to baseline sample data.");
    } else {
      enterDemoMode();
    }
  }, [isDemoMode, enterDemoMode, showToast]);

  // RESET / CLEAR USER WORKSPACE
  const handleClearAllData = useCallback(() => {
    if (!authUser?.id) return;
    const userId = authUser.id;
    storageService.clearAll(userId);

    const cleanProfile = {
      id: userId,
      name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
      email: authUser.email || "",
      phone: "",
      avatar: (authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "U").slice(0, 2).toUpperCase(),
      joinDate: new Date().toISOString().slice(0, 10),
    };
    const cleanContinuity = {
      active: false,
      frequency: 30,
      gracePeriod: 15,
      protocolState: "ACTIVE",
      drillsCompleted: 0,
      notifyPersonId: null,
    };

    storageService.set(userId, STORAGE_KEYS.USER, cleanProfile);
    storageService.set(userId, STORAGE_KEYS.ASSETS, []);
    storageService.set(userId, STORAGE_KEYS.PEOPLE, []);
    storageService.set(userId, STORAGE_KEYS.DOCUMENTS, []);
    storageService.set(userId, STORAGE_KEYS.OBLIGATIONS, []);
    storageService.set(userId, STORAGE_KEYS.CONTINUITY, cleanContinuity);
    storageService.set(userId, STORAGE_KEYS.ACTIVITY, []);
    storageService.set(userId, STORAGE_KEYS.VIEW_MODE, "owner");

    setUser(cleanProfile);
    setAssets([]);
    setPeople([]);
    setDocuments([]);
    setObligations([]);
    setContinuity(cleanContinuity);
    setActivity([]);
    setViewMode("owner");
    setIsDemoMode(false);
    showToast("Your workspace data has been cleared. Starting fresh.", "info");
  }, [authUser, showToast]);

  // ONBOARDING
  const completeOnboarding = useCallback(() => {
    if (authUser?.id) {
      storageService.set(authUser.id, STORAGE_KEYS.ONBOARDED, true);
    }
    setOnboardingOpen(false);
    showToast("Onboarding complete! Welcome to Continuity.");
  }, [authUser, showToast]);

  // USER PROFILE
  const updateUserProfile = useCallback(
    (updates) => {
      setUser((prev) => {
        const updated = { ...prev, ...updates };
        if (!isDemoMode && authUser?.id) {
          storageService.set(authUser.id, STORAGE_KEYS.USER, updated);
        }
        return updated;
      });
    },
    [isDemoMode, authUser]
  );

  // ACTIVITY LOGGER
  const addActivity = useCallback(
    (entry) => {
      setActivity((prev) => {
        const newEntry = {
          ...entry,
          id: `act_${Date.now()}`,
          timestamp: entry.timestamp || new Date().toISOString(),
          actor: entry.actor || user?.name || authUser?.user_metadata?.full_name || "Account Owner",
        };
        const updated = [newEntry, ...(prev || [])];
        if (!isDemoMode && authUser?.id) {
          storageService.set(authUser.id, STORAGE_KEYS.ACTIVITY, updated);
        }
        return updated;
      });
    },
    [isDemoMode, authUser, user]
  );

  // CRUD ASSETS
  const saveAssets = useCallback(
    (newAssets) => {
      setAssets(newAssets);
      if (!isDemoMode && authUser?.id) {
        storageService.set(authUser.id, STORAGE_KEYS.ASSETS, newAssets);
      }
    },
    [isDemoMode, authUser]
  );

  const addAsset = useCallback(
    (assetData) => {
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
          if (!isDemoMode && authUser?.id) {
            storageService.set(authUser.id, STORAGE_KEYS.ASSETS, updated);
          }
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
    },
    [isDemoMode, authUser, addActivity, showToast]
  );

  const updateAsset = useCallback(
    (id, updates) => {
      setAssets((prev) => {
        const updated = prev.map((a) =>
          a.id === id
            ? { ...a, ...updates, lastVerified: updates.lastVerified || new Date().toISOString().slice(0, 10) }
            : a
        );
        if (!isDemoMode && authUser?.id) {
          storageService.set(authUser.id, STORAGE_KEYS.ASSETS, updated);
        }
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
    },
    [assets, isDemoMode, authUser, addActivity, showToast]
  );

  const deleteAsset = useCallback(
    (id) => {
      const item = assets.find((a) => a.id === id);
      setAssets((prev) => {
        const updated = prev.filter((a) => a.id !== id);
        if (!isDemoMode && authUser?.id) {
          storageService.set(authUser.id, STORAGE_KEYS.ASSETS, updated);
        }
        return updated;
      });
      addActivity({
        type: "asset",
        action: "Asset removed",
        affectedEntity: item?.name || "Asset",
        detail: "Removed from active financial inventory.",
      });
      showToast("Asset removed.", "info");
    },
    [assets, isDemoMode, authUser, addActivity, showToast]
  );

  const verifyAsset = useCallback(
    (id) => {
      const today = new Date().toISOString().slice(0, 10);
      setAssets((prev) => {
        const updated = prev.map((a) => (a.id === id ? { ...a, lastVerified: today, nomineeVerified: true } : a));
        if (!isDemoMode && authUser?.id) {
          storageService.set(authUser.id, STORAGE_KEYS.ASSETS, updated);
        }
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
    },
    [assets, isDemoMode, authUser, addActivity, showToast]
  );

  // CRUD PEOPLE
  const savePeople = useCallback(
    (newPeople) => {
      setPeople(newPeople);
      if (!isDemoMode && authUser?.id) {
        storageService.set(authUser.id, STORAGE_KEYS.PEOPLE, newPeople);
      }
    },
    [isDemoMode, authUser]
  );

  const addPerson = useCallback(
    (personData) => {
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
          if (!isDemoMode && authUser?.id) {
            storageService.set(authUser.id, STORAGE_KEYS.PEOPLE, updated);
          }
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
    },
    [isDemoMode, authUser, addActivity, showToast]
  );

  const updatePerson = useCallback(
    (id, updates) => {
      setPeople((prev) => {
        const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
        if (!isDemoMode && authUser?.id) {
          storageService.set(authUser.id, STORAGE_KEYS.PEOPLE, updated);
        }
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
    },
    [people, isDemoMode, authUser, addActivity, showToast]
  );

  const deletePerson = useCallback(
    (id) => {
      const p = people.find((item) => item.id === id);
      setPeople((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        if (!isDemoMode && authUser?.id) {
          storageService.set(authUser.id, STORAGE_KEYS.PEOPLE, updated);
        }
        return updated;
      });
      addActivity({
        type: "person",
        action: "Trusted person removed",
        affectedEntity: p?.name || "Person",
        detail: "Revoked continuity permissions.",
      });
      showToast("Contact removed.", "info");
    },
    [people, isDemoMode, authUser, addActivity, showToast]
  );

  // CRUD DOCUMENTS
  const saveDocuments = useCallback(
    (newDocs) => {
      setDocuments(newDocs);
      if (!isDemoMode && authUser?.id) {
        storageService.set(authUser.id, STORAGE_KEYS.DOCUMENTS, newDocs);
      }
    },
    [isDemoMode, authUser]
  );

  const addDocument = useCallback(
    (docData) => {
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
          if (!isDemoMode && authUser?.id) {
            storageService.set(authUser.id, STORAGE_KEYS.DOCUMENTS, updated);
          }
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
    },
    [isDemoMode, authUser, addActivity, showToast]
  );

  const deleteDocument = useCallback(
    (id) => {
      const doc = documents.find((d) => d.id === id);
      setDocuments((prev) => {
        const updated = prev.filter((d) => d.id !== id);
        if (!isDemoMode && authUser?.id) {
          storageService.set(authUser.id, STORAGE_KEYS.DOCUMENTS, updated);
        }
        return updated;
      });
      addActivity({
        type: "document",
        action: "Document removed",
        affectedEntity: doc?.title || "Document",
        detail: "Removed from vault.",
      });
      showToast("Document deleted.", "info");
    },
    [documents, isDemoMode, authUser, addActivity, showToast]
  );

  const verifyDocument = useCallback(
    (id) => {
      setDocuments((prev) => {
        const updated = prev.map((d) => (d.id === id ? { ...d, verified: true } : d));
        if (!isDemoMode && authUser?.id) {
          storageService.set(authUser.id, STORAGE_KEYS.DOCUMENTS, updated);
        }
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
    },
    [documents, isDemoMode, authUser, addActivity, showToast]
  );

  // CRUD OBLIGATIONS
  const saveObligations = useCallback(
    (newObligations) => {
      setObligations(newObligations);
      if (!isDemoMode && authUser?.id) {
        storageService.set(authUser.id, STORAGE_KEYS.OBLIGATIONS, newObligations);
      }
    },
    [isDemoMode, authUser]
  );

  const addObligation = useCallback(
    (oblData) => {
      const newObl = {
        ...oblData,
        id: `obl_${Date.now()}`,
        amount: Number(oblData.amount) || 0,
      };
      setObligations((prev) => {
        const updated = [...prev, newObl];
        if (!isDemoMode && authUser?.id) {
          storageService.set(authUser.id, STORAGE_KEYS.OBLIGATIONS, updated);
        }
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
    },
    [isDemoMode, authUser, addActivity, showToast]
  );

  const deleteObligation = useCallback(
    (id) => {
      const obl = obligations.find((o) => o.id === id);
      setObligations((prev) => {
        const updated = prev.filter((o) => o.id !== id);
        if (!isDemoMode && authUser?.id) {
          storageService.set(authUser.id, STORAGE_KEYS.OBLIGATIONS, updated);
        }
        return updated;
      });
      addActivity({
        type: "obligation",
        action: "Obligation removed",
        affectedEntity: obl?.title || "Obligation",
        detail: "Removed from recurring schedule.",
      });
      showToast("Obligation removed.", "info");
    },
    [obligations, isDemoMode, authUser, addActivity, showToast]
  );

  // CONTINUITY & CHECK-IN SYSTEM
  const saveContinuity = useCallback(
    (newContinuity) => {
      setContinuity(newContinuity);
      if (!isDemoMode && authUser?.id) {
        storageService.set(authUser.id, STORAGE_KEYS.CONTINUITY, newContinuity);
      }
    },
    [isDemoMode, authUser]
  );

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
    if (!isDemoMode && authUser?.id) {
      storageService.set(authUser.id, STORAGE_KEYS.CONTINUITY, updated);
    }
    addActivity({
      type: "checkin",
      action: "Periodic Safety Check-in Completed",
      affectedEntity: "Continuity Protocol",
      detail: `Next scheduled check-in: ${nextDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}.`,
    });
    showToast("Check-in confirmed. Continuity protocol reset to Active.");
  }, [continuity, isDemoMode, authUser, addActivity, showToast]);

  const recordDrillResult = useCallback(
    (score) => {
      const today = new Date().toISOString().slice(0, 10);
      const updated = {
        ...continuity,
        drillsCompleted: (continuity?.drillsCompleted || 0) + 1,
        lastDrillDate: today,
        lastDrillScore: score,
      };
      setContinuity(updated);
      if (!isDemoMode && authUser?.id) {
        storageService.set(authUser.id, STORAGE_KEYS.CONTINUITY, updated);
      }

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
        if (!isDemoMode && authUser?.id) {
          storageService.set(authUser.id, STORAGE_KEYS.PEOPLE, updatedPeople);
        }
        return updatedPeople;
      });

      addActivity({
        type: "drill",
        action: "Continuity Drill Simulation Completed",
        affectedEntity: `Score: ${score}%`,
        detail: `Simulated trusted person emergency navigation successfully.`,
      });
      showToast(`Drill completed! Score: ${score}%.`);
    },
    [continuity, isDemoMode, authUser, addActivity, showToast]
  );

  // VIEW MODE SWITCHER
  const changeViewMode = useCallback(
    (mode) => {
      setViewMode(mode);
      if (!isDemoMode && authUser?.id) {
        storageService.set(authUser.id, STORAGE_KEYS.VIEW_MODE, mode);
      }
      showToast(
        `Switched view to: ${
          mode === "owner"
            ? "Owner Command Center"
            : mode === "trusted"
            ? "Trusted Person Action Guide"
            : "Emergency Handoff Guide"
        }`
      );
    },
    [isDemoMode, authUser, showToast]
  );

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
        updateUserProfile,
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
        isDemoMode,
        enterDemoMode,
        exitDemoMode,
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
        completeOnboarding,
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
