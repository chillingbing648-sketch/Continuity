export const STORAGE_KEYS = {
  USER: "user",
  ASSETS: "assets",
  PEOPLE: "people",
  DOCUMENTS: "documents",
  OBLIGATIONS: "obligations",
  PERMISSIONS: "permissions",
  CONTINUITY: "continuity",
  NOTIFICATIONS: "notifications",
  ACTIVITY: "activity",
  VIEW_MODE: "view_mode",
  ONBOARDED: "onboarded",
};

const getUserKey = (userId, key) => {
  if (!userId) {
    throw new Error(
      "[StorageService] Authenticated user ID is required."
    );
  }

  return `continuity:user:${userId}:${key}`;
};

const getDemoKey = (key) => {
  return `continuity:demo:${key}`;
};

const parseValue = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const storageService = {
  get: (userId, key) => {
    try {
      if (!userId) return null;
      const storageKey = getUserKey(userId, key);
      const value = localStorage.getItem(storageKey);

      return parseValue(value);
    } catch (err) {
      console.warn(
        `[StorageService] Failed to read key: ${key} for user: ${userId}`,
        err
      );
      return null;
    }
  },

  set: (userId, key, value) => {
    try {
      if (!userId) return false;
      const storageKey = getUserKey(userId, key);

      localStorage.setItem(
        storageKey,
        JSON.stringify(value)
      );

      return true;
    } catch (err) {
      console.error(
        `[StorageService] Failed to set key: ${key} for user: ${userId}`,
        err
      );
      return false;
    }
  },

  remove: (userId, key) => {
    try {
      if (!userId) return false;
      const storageKey = getUserKey(userId, key);

      localStorage.removeItem(storageKey);

      return true;
    } catch (err) {
      console.error(
        `[StorageService] Failed to remove key: ${key} for user: ${userId}`,
        err
      );
      return false;
    }
  },

  clearAll: (userId) => {
    try {
      if (!userId) {
        throw new Error(
          "[StorageService] Authenticated user ID is required to clear user storage."
        );
      }

      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(
          getUserKey(userId, key)
        );
      });

      return true;
    } catch (err) {
      console.error(
        `[StorageService] Failed to clear user storage for: ${userId}`,
        err
      );
      return false;
    }
  },

  hasUserData: (userId) => {
    try {
      if (!userId) return false;
      const userProfile = localStorage.getItem(getUserKey(userId, STORAGE_KEYS.USER));
      return userProfile !== null;
    } catch {
      return false;
    }
  },

  // Demo namespace helpers
  getDemo: (key) => {
    try {
      const storageKey = getDemoKey(key);
      const value = localStorage.getItem(storageKey);
      return parseValue(value);
    } catch {
      return null;
    }
  },

  setDemo: (key, value) => {
    try {
      const storageKey = getDemoKey(key);
      localStorage.setItem(storageKey, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  clearDemo: () => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(getDemoKey(key));
      });
      return true;
    } catch {
      return false;
    }
  },
};