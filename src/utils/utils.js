export const fmt = (n) =>
  n >= 10000000
    ? `₹${(n / 10000000).toFixed(2)}Cr`
    : n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : n >= 1000
    ? `₹${(n / 1000).toFixed(0)}K`
    : `₹${Math.abs(n).toLocaleString("en-IN")}`;

export const assetIcon = (type) =>
  ({
    Banking: require("@/assets/bank.svg"),
    Investments: require("@/assets/trending.svg"),
    Insurance: require("@/assets/umbrella.svg"),
    Retirement: require("@/assets/shield.svg"),
    Property: require("@/assets/building.svg"),
    Loans: require("@/assets/dollar.svg"),
    Other: require("@/assets/package.svg"),
  }[type] || require("@/assets/layers.svg"));

export const catColor = (type) =>
  ({
    Banking: "#1D4ED8",
    Investments: "#6D28D9",
    Insurance: "#B45309",
    Retirement: "#0F766E",
    Property: "#BE185D",
    Loans: "#DC2626",
    Other: "#4B5563",
  }[type] || "#4B5563");

export const catBg = (type) =>
  ({
    Banking: "#EFF6FF",
    Investments: "#F5F3FF",
    Insurance: "#FFFBEB",
    Retirement: "#F0FDFA",
    Property: "#FDF2F8",
    Loans: "#FEF2F2",
    Other: "#F9FAFB",
  }[type] || "#F9FAFB");

export const fmtDate = (s) => {
  if (!s) return "—";
  const d = new Date(s);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const timeAgo = (s) => {
  const sec = Math.floor((Date.now() - new Date(s)) / 1000);
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  const d = new Date(s);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};