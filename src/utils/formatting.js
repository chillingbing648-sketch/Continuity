export const fmt = (n) => {
  if (n === null || n === undefined || isNaN(n)) return "₹0";
  const isNegative = n < 0;
  const abs = Math.abs(n);
  
  let formatted = "";
  if (abs >= 10000000) {
    formatted = `₹${(abs / 10000000).toFixed(2)} Cr`;
  } else if (abs >= 100000) {
    formatted = `₹${(abs / 100000).toFixed(1)} L`;
  } else if (abs >= 1000) {
    formatted = `₹${(abs / 1000).toFixed(0)} K`;
  } else {
    formatted = `₹${abs.toLocaleString("en-IN")}`;
  }
  
  return isNegative ? `-${formatted}` : formatted;
};

export const fmtFullCurrency = (n, currency = "INR") => {
  if (n === null || n === undefined || isNaN(n)) return "₹0";
  const prefix = currency === "INR" ? "₹" : "$";
  return `${prefix}${Math.abs(n).toLocaleString("en-IN")}`;
};

export const fmtDate = (s) => {
  if (!s) return "—";
  try {
    const d = new Date(s);
    if (isNaN(d.getTime())) return s;
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return s;
  }
};

export const timeAgo = (s) => {
  if (!s) return "—";
  try {
    const sec = Math.floor((Date.now() - new Date(s).getTime()) / 1000);
    if (sec < 60) return "just now";
    if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
    if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
    if (sec < 86400 * 30) return `${Math.floor(sec / 86400)}d ago`;
    const d = new Date(s);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  } catch {
    return "—";
  }
};

export const formatFileSize = (bytes) => {
  if (!bytes) return "0 KB";
  if (typeof bytes === "string") return bytes;
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};
