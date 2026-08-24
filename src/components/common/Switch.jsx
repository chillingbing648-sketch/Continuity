import React from "react";

export function Switch({ checked, onChange, disabled = false, id }) {
  return (
    <label className="switch" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="switch-slider" />
    </label>
  );
}
