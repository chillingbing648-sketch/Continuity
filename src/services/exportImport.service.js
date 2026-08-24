import { STORAGE_KEYS, storageService } from "./storage.service";

export const exportContinuityData = () => {
  const exportPayload = {
    version: "2.0.0",
    exportedAt: new Date().toISOString(),
    user: storageService.get(STORAGE_KEYS.USER),
    assets: storageService.get(STORAGE_KEYS.ASSETS) || [],
    people: storageService.get(STORAGE_KEYS.PEOPLE) || [],
    documents: storageService.get(STORAGE_KEYS.DOCUMENTS) || [],
    obligations: storageService.get(STORAGE_KEYS.OBLIGATIONS) || [],
    continuity: storageService.get(STORAGE_KEYS.CONTINUITY),
    activity: storageService.get(STORAGE_KEYS.ACTIVITY) || [],
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

export const importContinuityData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (!data.user && !data.assets) {
      throw new Error("Invalid continuity backup file format");
    }

    if (data.user) storageService.set(STORAGE_KEYS.USER, data.user);
    if (data.assets) storageService.set(STORAGE_KEYS.ASSETS, data.assets);
    if (data.people) storageService.set(STORAGE_KEYS.PEOPLE, data.people);
    if (data.documents) storageService.set(STORAGE_KEYS.DOCUMENTS, data.documents);
    if (data.obligations) storageService.set(STORAGE_KEYS.OBLIGATIONS, data.obligations);
    if (data.continuity) storageService.set(STORAGE_KEYS.CONTINUITY, data.continuity);
    if (data.activity) storageService.set(STORAGE_KEYS.ACTIVITY, data.activity);

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || "Failed to parse JSON file" };
  }
};
