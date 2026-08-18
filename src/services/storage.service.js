export const STORAGE_KEYS = {
  USER: "continuum_user",
  ASSETS: "continuum_assets",
  PEOPLE: "continuum_people",
  DOCUMENTS: "continuum_documents",
  PERMISSIONS: "continuum_permissions",
  CONTINUITY: "continuum_continuity",
  NOTIFICATIONS: "continuum_notifications",
  ACTIVITY: "continuum_activity",
  VIEW_MODE: "continuum_view_mode",
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