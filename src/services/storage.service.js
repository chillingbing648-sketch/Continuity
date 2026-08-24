export const STORAGE_KEYS = {
  USER: "continuity_user",
  ASSETS: "continuity_assets",
  PEOPLE: "continuity_people",
  DOCUMENTS: "continuity_documents",
  OBLIGATIONS: "continuity_obligations",
  PERMISSIONS: "continuity_permissions",
  CONTINUITY: "continuity_continuity",
  NOTIFICATIONS: "continuity_notifications",
  ACTIVITY: "continuity_activity",
  VIEW_MODE: "continuity_view_mode",
  ONBOARDED: "continuity_onboarded",
};

export const storageService = {
  get: (key) => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch (err) {
      console.warn(`[StorageService] Failed to read key: ${key}`, err);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[StorageService] Failed to set key: ${key}`, err);
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error(`[StorageService] Failed to remove key: ${key}`, err);
      return false;
    }
  },
  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
      return true;
    } catch (err) {
      console.error(`[StorageService] Failed to clear storage`, err);
      return false;
    }
  },
};