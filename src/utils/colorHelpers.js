export const catColor = (type) =>
  ({
    Banking: "#1D4ED8",
    Investments: "#6D28D9",
    Insurance: "#B45309",
    Retirement: "#0F766E",
    Property: "#BE185D",
    Loans: "#DC2626",
    Liabilities: "#DC2626",
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
    Liabilities: "#FEF2F2",
    Other: "#F9FAFB",
  }[type] || "#F9FAFB");

export const getSeverityColor = (severity) => {
  switch (severity) {
    case "critical":
    case "high":
      return {
        bg: "#FEE2E2",
        text: "#B91C1C",
        border: "#FECACA",
        badge: "badge-error",
      };
    case "warning":
    case "medium":
      return {
        bg: "#FEF3C7",
        text: "#B45309",
        border: "#FDE68A",
        badge: "badge-warn",
      };
    case "info":
    case "low":
      return {
        bg: "#EFF6FF",
        text: "#1D4ED8",
        border: "#BFDBFE",
        badge: "badge-info",
      };
    default:
      return {
        bg: "#DCFCE7",
        text: "#166534",
        border: "#BBF7D0",
        badge: "badge-success",
      };
  }
};
