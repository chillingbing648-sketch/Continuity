import React from "react";
import { Icons } from "./Icons";

export function Toast({ msg, type = "success" }) {
  if (!msg) return null;

  return (
    <div className={`toast toast-${type}`} role="status" aria-live="polite">
      {type === "success" && <Icons.check size={18} />}
      {type === "error" && <Icons.alertTriangle size={18} />}
      {type === "info" && <Icons.info size={18} />}
      <span>{msg}</span>
    </div>
  );
}
