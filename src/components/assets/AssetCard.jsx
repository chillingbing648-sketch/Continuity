import React from "react";
import { Icons } from "../common/Icons";
import { fmt, fmtDate } from "../../utils/formatting";
import { catColor, catBg } from "../../utils/colorHelpers";

export function AssetCard({ asset, onClick }) {
  const isPositive = (asset.approxValue || 0) >= 0;
  const isLoan = asset.type === "Loans" || asset.type === "Liabilities" || !isPositive;

  return (
    <div
      className="card card-clickable"
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        padding: "16px 18px",
      }}
    >
      <div>
        {/* TOP ROW: CATEGORY BADGE & VALUATION */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: catBg(asset.type),
                color: catColor(asset.type),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {asset.type === "Banking" && <Icons.bank size={16} />}
              {asset.type === "Investments" && <Icons.trending size={16} />}
              {asset.type === "Insurance" && <Icons.umbrella size={16} />}
              {asset.type === "Property" && <Icons.building size={16} />}
              {asset.type === "Loans" && <Icons.dollar size={16} />}
              {asset.type === "Retirement" && <Icons.shield size={16} />}
              {asset.type !== "Banking" &&
                asset.type !== "Investments" &&
                asset.type !== "Insurance" &&
                asset.type !== "Property" &&
                asset.type !== "Loans" &&
                asset.type !== "Retirement" && <Icons.layers size={16} />}
            </span>
            <div>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: catColor(asset.type),
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {asset.subtype || asset.type}
              </span>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {asset.institution}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: isLoan ? "var(--error)" : "var(--text-primary)",
              }}
            >
              {fmt(asset.approxValue)}
            </div>
            {asset.isEmergencyFund && (
              <span className="badge badge-info" style={{ marginTop: 2, fontSize: "0.65rem" }}>
                Emergency Fund
              </span>
            )}
          </div>
        </div>

        {/* ASSET NAME */}
        <h3
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: 8,
            letterSpacing: "-0.01em",
          }}
        >
          {asset.name}
        </h3>

        {/* INSTRUCTIONS SNIPPET IF ANY */}
        {asset.instructions ? (
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--text-secondary)",
              lineHeight: 1.4,
              marginBottom: 12,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {asset.instructions}
          </p>
        ) : (
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--warn)",
              lineHeight: 1.4,
              marginBottom: 12,
            }}
          >
            ⚠️ Missing continuity instructions
          </p>
        )}
      </div>

      {/* FOOTER: NOMINEE STATUS & VERIFICATION */}
      <div
        style={{
          borderTop: "1px solid var(--border-light)",
          paddingTop: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Icons.user size={13} style={{ color: "var(--text-muted)" }} />
          {asset.nominee ? (
            <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
              {asset.nominee}
            </span>
          ) : (
            <span style={{ color: "var(--error)", fontWeight: 600 }}>No Nominee</span>
          )}
        </div>

        <span
          className={`badge ${
            asset.nomineeVerified
              ? "badge-success"
              : asset.nominee
              ? "badge-warn"
              : "badge-error"
          }`}
        >
          {asset.nomineeVerified ? "Verified" : asset.nominee ? "Unverified" : "Action Needed"}
        </span>
      </div>
    </div>
  );
}
