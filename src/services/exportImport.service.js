import { STORAGE_KEYS, storageService } from "./storage.service";
import { INITIAL_DEMO_DATA } from "../data/demoData";

export const exportContinuityData = (userId) => {
  if (!userId) {
    throw new Error("[ExportService] Authenticated user ID is required for data export.");
  }

  const exportPayload = {
    version: "2.0.0",
    exportedAt: new Date().toISOString(),
    user: storageService.get(userId, STORAGE_KEYS.USER),
    assets: storageService.get(userId, STORAGE_KEYS.ASSETS) || [],
    people: storageService.get(userId, STORAGE_KEYS.PEOPLE) || [],
    documents: storageService.get(userId, STORAGE_KEYS.DOCUMENTS) || [],
    obligations: storageService.get(userId, STORAGE_KEYS.OBLIGATIONS) || [],
    continuity: storageService.get(userId, STORAGE_KEYS.CONTINUITY) || null,
    activity: storageService.get(userId, STORAGE_KEYS.ACTIVITY) || [],
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `continuity_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  return true;
};

export const importContinuityData = (userId, jsonString) => {
  if (!userId) {
    return { success: false, error: "Authenticated user ID is required for data import." };
  }

  try {
    const data = JSON.parse(jsonString);
    if (!data.user && !data.assets && !data.people && !data.documents) {
      throw new Error("Invalid continuity backup file format");
    }

    // Security & Isolation: Enforce current authenticated user ID ownership
    if (data.user) {
      const sanitizedUser = {
        ...data.user,
        id: userId,
      };
      storageService.set(userId, STORAGE_KEYS.USER, sanitizedUser);
    }
    if (Array.isArray(data.assets)) storageService.set(userId, STORAGE_KEYS.ASSETS, data.assets);
    if (Array.isArray(data.people)) storageService.set(userId, STORAGE_KEYS.PEOPLE, data.people);
    if (Array.isArray(data.documents)) storageService.set(userId, STORAGE_KEYS.DOCUMENTS, data.documents);
    if (Array.isArray(data.obligations)) storageService.set(userId, STORAGE_KEYS.OBLIGATIONS, data.obligations);
    if (data.continuity) storageService.set(userId, STORAGE_KEYS.CONTINUITY, data.continuity);
    if (Array.isArray(data.activity)) storageService.set(userId, STORAGE_KEYS.ACTIVITY, data.activity);

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || "Failed to parse JSON backup file." };
  }
};
