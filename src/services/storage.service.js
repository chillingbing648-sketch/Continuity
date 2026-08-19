export const STORAGE_KEYS = {
  USER: "continuity_user",
  ASSETS: "continuity_assets",
  PEOPLE: "continuity_people",
  DOCUMENTS: "continuity_documents",
  PERMISSIONS: "continuity_permissions",
  CONTINUITY: "continuity_continuity",
  NOTIFICATIONS: "continuity_notifications",
  ACTIVITY: "continuity_activity",
  VIEW_MODE: "continuity_view_mode",
};

export const storageService = {
  get: (key) => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};