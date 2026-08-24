import React, { useState } from "react";
import { Icons } from "../common/Icons";
import { EmptyState } from "../common/EmptyState";
import { useApp } from "../../context/AppContext";
import { fmtDate, timeAgo } from "../../utils/formatting";

export function ActivityView() {
  const { activity } = useApp();
  const [filterType, setFilterType] = useState("all");

  const filteredActivity = activity.filter((act) => {
    if (filterType === "all") return true;
    return act.type === filterType;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Continuity Audit Trail
          </h2>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
            Immutable historical log of check-ins, nominee verifications, document uploads, and drills.
          </div>
        </div>

        {/* TYPE FILTERS */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["all", "checkin", "asset", "document", "person", "drill", "obligation"].map((type) => (
            <button
              key={type}
              type="button"
              className={`btn btn-sm ${filterType === type ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "0.75rem", textTransform: "capitalize", padding: "4px 10px", borderRadius: 16 }}
              onClick={() => setFilterType(type)}
            >
              {type === "all" ? "All Events" : type}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVITY TIMELINE */}
      {filteredActivity.length === 0 ? (
        <EmptyState
          icon={<Icons.activity size={24} />}
          title="No audit events found"
          desc="Activities will be recorded automatically when you modify assets, verify nominees, or complete check-ins."
        />
      ) : (
        <div className="card" style={{ padding: "18px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, position: "relative" }}>
            {filteredActivity.map((act, idx) => (
              <div
                key={act.id || idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background:
                      act.type === "checkin"
                        ? "var(--success-light)"
                        : act.type === "drill"
                        ? "var(--purple-light)"
                        : act.type === "document"
                        ? "var(--info-light)"
                        : "var(--surface-alt)",
                    color:
                      act.type === "checkin"
                        ? "var(--success)"
                        : act.type === "drill"
                        ? "var(--purple)"
                        : act.type === "document"
                        ? "var(--info)"
                        : "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {act.type === "checkin" && <Icons.checkCircle size={16} />}
                  {act.type === "drill" && <Icons.flag size={16} />}
                  {act.type === "document" && <Icons.docs size={16} />}
                  {act.type === "person" && <Icons.user size={16} />}
                  {act.type === "asset" && <Icons.bank size={16} />}
                  {act.type !== "checkin" &&
                    act.type !== "drill" &&
                    act.type !== "document" &&
                    act.type !== "person" &&
                    act.type !== "asset" && <Icons.activity size={16} />}
                </div>

                <div style={{ flex: 1, borderBottom: idx < filteredActivity.length - 1 ? "1px solid var(--border-light)" : "none", paddingBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                      {act.action}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {timeAgo(act.timestamp)} • {fmtDate(act.timestamp)}
                    </span>
                  </div>

                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                    <strong>Target:</strong> {act.affectedEntity} • <strong>Actor:</strong> {act.actor || "Owner"}
                  </div>

                  {act.detail && (
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 4 }}>
                      {act.detail}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
