import React, { useState } from "react";
import { Modal } from "./Modal";
import { Icons, LogoIcon } from "./Icons";
import { useApp } from "../../context/AppContext";

export function OnboardingModal({ onClose, onOpenPlaybook }) {
  const { user, people, continuity, completeOnboarding, enterDemoMode } = useApp();
  const [step, setStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Welcome to Continuity",
      subtitle: "Your Financial Continuity Workspace is Ready",
      desc: "If you become unavailable tomorrow, can the person you trust find your bank accounts, claim life insurance, and stop loan penalties?",
    },
    {
      id: 2,
      title: "What are you protecting?",
      subtitle: "Unified Financial Inventory",
      desc: "Connect your bank accounts, equity investments, term insurance, properties, and obligations into one resilient continuity engine.",
    },
    {
      id: 3,
      title: "Designate Your Primary Trustee",
      subtitle: "Trusted Person Network",
      desc: "Assign a verified spouse, sibling, or trusted advisor who will receive immediate access guide if you become unavailable.",
    },
    {
      id: 4,
      title: "Automated Safety Check-in",
      subtitle: "Autonomous Heartbeat Protocol",
      desc: "Continuity monitors your wellbeing with periodic check-ins. If unacknowledged after a grace period, trusted contacts are notified.",
    },
    {
      id: 5,
      title: "Ready to Build Your Continuity Plan",
      subtitle: "Clean Personal Workspace",
      desc: "Your personal command center is ready. Start by adding real assets or explore the sample reference workspace to see how it works.",
    },
  ];

  const currentStep = steps[step - 1];

  const handleFinish = () => {
    completeOnboarding();
    if (onClose) onClose();
  };

  const handleExploreDemo = () => {
    enterDemoMode();
    handleFinish();
  };

  const handleOpenPlaybook = () => {
    handleFinish();
    if (onOpenPlaybook) {
      onOpenPlaybook();
    }
  };

  return (
    <Modal
      title={currentStep.title}
      subtitle={`Step ${step} of ${steps.length} • ${currentStep.subtitle}`}
      onClose={handleFinish}
      size="large"
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {steps.map((s) => (
              <div
                key={s.id}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: s.id === step ? "var(--accent)" : s.id < step ? "var(--accent-mid)" : "var(--border)",
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {step === 1 && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleOpenPlaybook}
              >
                <Icons.guide size={14} />
                Open Library Playbook
              </button>
            )}

            {step > 1 && (
              <button className="btn btn-secondary btn-sm" onClick={() => setStep(step - 1)} type="button">
                Back
              </button>
            )}

            {step < steps.length ? (
              <button className="btn btn-primary btn-sm" onClick={() => setStep(step + 1)} type="button">
                Continue
                <Icons.arrowRight size={15} />
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={handleFinish} type="button">
                Start Building My Workspace
                <Icons.arrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "16px 8px" }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 18,
            background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            boxShadow: "0 8px 24px rgba(45, 106, 79, 0.25)",
          }}
        >
          {step === 1 && <LogoIcon size={32} />}
          {step === 2 && <Icons.trending size={28} style={{ color: "white" }} />}
          {step === 3 && <Icons.user size={28} style={{ color: "white" }} />}
          {step === 4 && <Icons.clock size={28} style={{ color: "white" }} />}
          {step === 5 && <Icons.shield size={28} style={{ color: "white" }} />}
        </div>

        <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", maxWidth: 460, lineHeight: 1.6, marginBottom: 20 }}>
          {currentStep.desc}
        </p>

        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 500, textAlign: "left" }}>
            <div style={{ background: "var(--surface-alt)", padding: "14px 18px", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              <strong style={{ color: "var(--text-primary)" }}>Why Continuity matters:</strong>
              <p style={{ marginTop: 4 }}>
                Unclaimed investments, unmapped debt auto-debits, and lost policy certificates cause billions in lost family wealth. Continuity ensures your loved ones have clarity, access, and step-by-step guidance.
              </p>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleOpenPlaybook}
              >
                <Icons.guide size={14} />
                Explore System Playbook First
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleExploreDemo}
              >
                <Icons.sparkles size={14} />
                Explore Demo Workspace
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid-3" style={{ width: "100%", maxWidth: 520, textAlign: "left" }}>
            <div className="card" style={{ padding: 12 }}>
              <Icons.bank size={20} style={{ color: "var(--accent)" }} />
              <div style={{ fontWeight: 700, fontSize: "0.85rem", marginTop: 6 }}>Banking & FDs</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Liquid emergency funds</div>
            </div>
            <div className="card" style={{ padding: 12 }}>
              <Icons.umbrella size={20} style={{ color: "var(--warn)" }} />
              <div style={{ fontWeight: 700, fontSize: "0.85rem", marginTop: 6 }}>Insurance</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Claim procedures & docs</div>
            </div>
            <div className="card" style={{ padding: 12 }}>
              <Icons.building size={20} style={{ color: "var(--purple)" }} />
              <div style={{ fontWeight: 700, fontSize: "0.85rem", marginTop: 6 }}>Liabilities</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>EMI auto-debit safety</div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ background: "var(--surface-alt)", padding: "16px 20px", borderRadius: "var(--radius-sm)", width: "100%", maxWidth: 480, textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="avatar avatar-lg">{people[0]?.avatar || "PT"}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{people[0]?.name || "Designated Primary Trustee"}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {people[0]?.relationship || "Spouse / Sibling"} • {people[0]?.role || "Primary Trustee"}
                </div>
              </div>
              <span className="badge badge-success" style={{ marginLeft: "auto" }}>
                {people[0]?.status || "Pending Setup"}
              </span>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 10, lineHeight: 1.45 }}>
              Your trustee will only receive the emergency access instructions if you fail to respond during an active safety check-in window.
            </p>
          </div>
        )}

        {step === 4 && (
          <div style={{ background: "var(--surface-alt)", padding: "16px 20px", borderRadius: "var(--radius-sm)", width: "100%", maxWidth: 480, textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.85rem" }}>
              <span style={{ color: "var(--text-secondary)" }}>Check-in Interval:</span>
              <strong>Every {continuity?.frequency || 30} Days</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.85rem" }}>
              <span style={{ color: "var(--text-secondary)" }}>Grace Period:</span>
              <strong>{continuity?.gracePeriod || 15} Days</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
              <span style={{ color: "var(--text-secondary)" }}>Escalation Notice:</span>
              <strong>Automatic Trustee Alert</strong>
            </div>
          </div>
        )}

        {step === 5 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 480, textAlign: "left" }}>
            <div className="card" style={{ padding: "14px 18px", borderColor: "var(--accent-light)", background: "var(--accent-light)" }}>
              <div style={{ fontWeight: 700, color: "var(--accent)", fontSize: "0.9rem" }}>
                ✓ Clean Personal Workspace Active
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.45 }}>
                Your data is completely isolated and private. You can start adding your personal assets or explore the demo mode anytime.
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={handleExploreDemo}
              >
                <Icons.sparkles size={14} />
                Explore Demo Mode
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={handleOpenPlaybook}
              >
                <Icons.guide size={14} />
                Read Playbook
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
