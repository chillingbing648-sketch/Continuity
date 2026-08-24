import React, { useState, useMemo } from "react";
import { Modal } from "../common/Modal";
import { Icons } from "../common/Icons";
import { useApp } from "../../context/AppContext";
import { getContinuityDrillTasks } from "../../services/continuityEngine";

export function ContinuityDrillModal({ onClose }) {
  const { assets, people, documents, recordDrillResult } = useApp();

  const drillTasks = useMemo(() => {
    return getContinuityDrillTasks(assets, people, documents);
  }, [assets, people, documents]);

  const [completedTaskIds, setCompletedTaskIds] = useState(() => {
    return drillTasks.filter((t) => t.completed).map((t) => t.id);
  });

  const toggleTask = (id) => {
    setCompletedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const completedCount = completedTaskIds.length;
  const totalCount = drillTasks.length;
  const drillScore = Math.round((completedCount / totalCount) * 100);

  const handleFinishDrill = () => {
    recordDrillResult(drillScore, totalCount);
    onClose();
  };

  return (
    <Modal
      title="Continuity Drill Simulation"
      subtitle="Simulate whether your trusted person can successfully navigate your financial life"
      onClose={onClose}
      size="large"
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            <strong>{completedCount} / {totalCount}</strong> Tasks Verified ({drillScore}%)
          </span>
          <button className="btn btn-primary" onClick={handleFinishDrill} type="button">
            Record Drill Result
            <Icons.check size={16} />
          </button>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "var(--radius-md)",
            background: "var(--surface-alt)",
            border: "1px solid var(--border)",
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: "var(--text-primary)" }}>How the drill works:</strong>
          <p style={{ marginTop: 3 }}>
            Review each key discovery pathway below. Verify whether your designated primary trustee (Priya) has the permissions, account identifiers, and access knowledge to locate each essential item during an emergency.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {drillTasks.map((task, idx) => {
            const isDone = completedTaskIds.includes(task.id);

            return (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: "var(--radius-sm)",
                  background: isDone ? "var(--surface)" : "var(--surface-alt)",
                  border: `1px solid ${isDone ? "var(--accent)" : "var(--border)"}`,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    border: `2px solid ${isDone ? "var(--accent)" : "var(--border)"}`,
                    background: isDone ? "var(--accent)" : "transparent",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {isDone && <Icons.check size={16} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                      {idx + 1}. {task.title}
                    </span>
                    <span className="badge badge-neutral">{task.targetType}</span>
                  </div>

                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 3 }}>
                    {task.description}
                  </p>

                  <div
                    style={{
                      fontSize: "0.75rem",
                      background: isDone ? "var(--accent-light)" : "var(--surface)",
                      color: isDone ? "var(--accent)" : "var(--text-muted)",
                      padding: "4px 8px",
                      borderRadius: 4,
                      display: "inline-block",
                      marginTop: 6,
                      fontWeight: 600,
                    }}
                  >
                    Matched Record: {task.expectedInfo}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
