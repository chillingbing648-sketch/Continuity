import React, { useState } from "react";
import { Modal } from "./Modal";
import { Icons, LogoIcon } from "./Icons";
import { useApp } from "../../context/AppContext";

export function OnboardingModal({ onClose }) {
  const { user, people, continuity, showToast } = useApp();
  const [step, setStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Welcome to Continuity",
      desc: "If you become unavailable, can the person you trust understand and continue your financial life?",
    },
    {
      id: 2,
      title: "What are you protecting?",
      desc: "Connect your bank accounts, equity investments, term insurance, properties, and obligations into one resilient engine.",
    },
    {
      id: 3,
      title: "Designate Your Primary Trustee",
      desc: "Assign a verified spouse, sibling, or trusted advisor who will receive immediate access guide if you become unavailable.",
    },
    {
      id: 4,
      title: "Automated Safety Check-in",
      desc: "Continuity monitors your wellbeing with periodic check-ins. If unacknowledged after grace period, trusted contacts are notified.",
    },
    {
      id: 5,
      title: "Your Continuity Readiness",
      desc: "Your command center is active. Fix initial critical gaps to achieve complete peace of mind.",
    },
  ];

  const currentStep = steps[step - 1];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      showToast("Onboarding complete! Welcome to Continuity.");
      onClose();
    }
  };

  return (
    <Modal
      title={currentStep.title}
      subtitle={`Step ${step} of ${steps.length}`}
      onClose={onClose}
      size="large"
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
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
          <div style={{ display: "flex", gap: 8 }}>
            {step > 1 && (
              <button className="btn btn-secondary" onClick={() => setStep(step - 1)} type="button">
                Back
              </button>
            )}
            <button className="btn btn-primary" onClick={handleNext} type="button">
              {step === steps.length ? "Enter Command Center" : "Continue"}
              <Icons.arrowRight size={16} />
            </button>
          </div>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "16px 8px" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            boxShadow: "0 8px 24px rgba(45, 106, 79, 0.25)",
          }}
        >
          {step === 1 && <LogoIcon size={32} />}
          {step === 2 && <Icons.trending size={30} style={{ color: "white" }} />}
          {step === 3 && <Icons.user size={30} style={{ color: "white" }} />}
          {step === 4 && <Icons.clock size={30} style={{ color: "white" }} />}
          {step === 5 && <Icons.shield size={30} style={{ color: "white" }} />}
        </div>

        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", maxWidth: 440, lineHeight: 1.6, marginBottom: 24 }}>
          {currentStep.desc}
        </p>

        {step === 1 && (
          <div style={{ background: "var(--surface-alt)", padding: "14px 20px", borderRadius: "var(--radius-md)", maxWidth: 480, textAlign: "left", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <strong style={{ color: "var(--text-primary)" }}>Why Continuity exists:</strong>
            <p style={{ marginTop: 4 }}>
              Financial assets without verified nominees, unmapped debt auto-debits, and lost policy documents cause billions in unclaimed wealth and immense family distress. Continuity ensures your loved ones are never left in the dark.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="grid-3" style={{ width: "100%", maxWidth: 500, textAlign: "left" }}>
            <div className="card" style={{ padding: 12 }}>
              <Icons.bank size={20} style={{ color: "var(--accent)" }} />
              <div style={{ fontWeight: 600, fontSize: "0.85rem", marginTop: 6 }}>Banking & FDs</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Liquid emergency funds</div>
            </div>
            <div className="card" style={{ padding: 12 }}>
              <Icons.umbrella size={20} style={{ color: "var(--warn)" }} />
              <div style={{ fontWeight: 600, fontSize: "0.85rem", marginTop: 6 }}>Insurance</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Claim procedures</div>
            </div>
            <div className="card" style={{ padding: 12 }}>
              <Icons.building size={20} style={{ color: "var(--purple)" }} />
              <div style={{ fontWeight: 600, fontSize: "0.85rem", marginTop: 6 }}>Liabilities</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Auto-debit safety</div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ background: "var(--surface-alt)", padding: "14px 20px", borderRadius: "var(--radius-md)", width: "100%", maxWidth: 460, textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="avatar avatar-lg">{people[0]?.avatar || "PM"}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{people[0]?.name || "Priya Mehta"}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {people[0]?.relationship || "Spouse"} • {people[0]?.role || "Primary Trustee"}
                </div>
              </div>
              <span className="badge badge-success" style={{ marginLeft: "auto" }}>
                {people[0]?.status || "Verified"}
              </span>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ background: "var(--surface-alt)", padding: "16px 20px", borderRadius: "var(--radius-md)", width: "100%", maxWidth: 460, textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.85rem" }}>
              <span style={{ color: "var(--text-secondary)" }}>Check-in Interval:</span>
              <strong>Every {continuity?.frequency || 30} Days</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.85rem" }}>
              <span style={{ color: "var(--text-secondary)" }}>Grace Period:</span>
              <strong>{continuity?.gracePeriod || 15} Days</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
              <span style={{ color: "var(--text-secondary)" }}>Escalation Contact:</span>
              <strong>{people[0]?.name || "Priya Mehta"}</strong>
            </div>
          </div>
        )}

        {step === 5 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 460, textAlign: "left" }}>
            <div className="card" style={{ padding: "12px 16px", borderColor: "var(--accent-light)", background: "var(--accent-light)" }}>
              <div style={{ fontWeight: 700, color: "var(--accent)", fontSize: "0.9rem" }}>✓ Continuous Health Monitoring</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                Simulation engine & drill modules ready to test trustee preparedness anytime.
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
