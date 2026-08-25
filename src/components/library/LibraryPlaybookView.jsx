import React, { useState } from "react";
import { Icons, LogoIcon } from "../common/Icons";
import { useApp } from "../../context/AppContext";

export function LibraryPlaybookView({ onNav }) {
  const {
    openModal,
    enterDemoMode,
    isDemoMode,
    exitDemoMode,
    setOnboardingOpen,
    changeViewMode,
  } = useApp();

  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    {
      id: "overview",
      title: "1. Overview & The Continuity Problem",
      icon: <Icons.home size={17} />,
      badge: "Core Concept",
    },
    {
      id: "assets",
      title: "2. Asset Registry & Nominee Verification",
      icon: <Icons.bank size={17} />,
      badge: "Holdings",
    },
    {
      id: "trustees",
      title: "3. Trusted Person Network & Preparedness",
      icon: <Icons.people size={17} />,
      badge: "Governance",
    },
    {
      id: "vault",
      title: "4. Digital Vault & Evidence Verification",
      icon: <Icons.docs size={17} />,
      badge: "Evidence",
    },
    {
      id: "obligations",
      title: "5. Financial Calendar & Debt Auto-Debits",
      icon: <Icons.calendar size={17} />,
      badge: "Cash Flow",
    },
    {
      id: "checkin",
      title: "6. Automated Safety Check-in & Grace Periods",
      icon: <Icons.continuity size={17} />,
      badge: "Protocol",
    },
    {
      id: "emergency",
      title: "7. Emergency Handoff & Trustee Execution",
      icon: <Icons.guide size={17} />,
      badge: "Emergency Guide",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1040, margin: "0 auto" }}>
      {/* HEADER HERO */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #40916C 100%)",
          color: "white",
          padding: "28px 32px",
          border: "none",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
          <div style={{ maxWidth: 620 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "4px 10px",
                  borderRadius: 20,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Official System Guide & Reference
              </span>
              {isDemoMode && (
                <span className="badge badge-warn" style={{ background: "#FFEAA7", color: "#855800" }}>
                  Demo Mode Active
                </span>
              )}
            </div>

            <h1 style={{ fontSize: "1.65rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.25 }}>
              Continuity Library & System Playbook
            </h1>
            <p style={{ fontSize: "0.9rem", opacity: 0.92, marginTop: 8, lineHeight: 1.55 }}>
              The comprehensive architectural guide to structuring, verifying, and executing your personal financial continuity plan.
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
              {!isDemoMode ? (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ background: "white", color: "var(--accent)", border: "none", fontWeight: 700 }}
                  onClick={enterDemoMode}
                >
                  <Icons.sparkles size={15} />
                  Explore Demo Workspace
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ background: "white", color: "var(--accent)", border: "none", fontWeight: 700 }}
                  onClick={exitDemoMode}
                >
                  <Icons.user size={15} />
                  Exit Demo Mode
                </button>
              )}

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}
                onClick={() => setOnboardingOpen(true)}
              >
                <Icons.guide size={15} />
                Interactive Onboarding
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}
                onClick={() => changeViewMode("emergency")}
              >
                <Icons.shield size={15} />
                View Emergency Guide
              </button>
            </div>
          </div>

          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "rgba(255, 255, 255, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <LogoIcon size={38} />
          </div>
        </div>
      </div>

      {/* MAIN PLAYBOOK INTERFACE */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, alignItems: "flex-start" }}>
        {/* CHAPTER NAVIGATION SIDEBAR */}
        <div className="card" style={{ padding: "14px 12px", position: "sticky", top: 80 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "4px 8px 10px" }}>
            Playbook Chapters
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSection(s.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 12px",
                  borderRadius: "var(--radius-sm)",
                  background: activeSection === s.id ? "var(--accent-light)" : "transparent",
                  color: activeSection === s.id ? "var(--accent)" : "var(--text-primary)",
                  fontWeight: activeSection === s.id ? 700 : 500,
                  fontSize: "0.82rem",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.icon}
                  <span>{s.title}</span>
                </div>
              </button>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--border-light)", marginTop: 14, paddingTop: 12 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", padding: "0 8px 6px" }}>
              Quick Actions
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: "flex-start", fontSize: "0.8rem" }}
                onClick={() => openModal("addAsset")}
              >
                <Icons.plus size={14} />
                Add First Asset
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: "flex-start", fontSize: "0.8rem" }}
                onClick={() => openModal("addPerson")}
              >
                <Icons.user size={14} />
                Add Trustee
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: "flex-start", fontSize: "0.8rem" }}
                onClick={() => openModal("uploadDoc")}
              >
                <Icons.upload size={14} />
                Upload Document
              </button>
            </div>
          </div>
        </div>

        {/* CHAPTER CONTENT DISPLAY */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* SECTION 1: OVERVIEW */}
          {activeSection === "overview" && (
            <div className="card" style={{ padding: "28px 30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span className="badge badge-info">Chapter 1</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Core Philosophy & Need</span>
              </div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                The Financial Continuity Problem
              </h2>

              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 12 }}>
                Modern financial lives are fragmented across dozens of institutions: bank savings accounts, mutual fund folios, stock demat accounts, term life policies, real estate deeds, employee provident funds, and recurring loan EMIs.
              </p>

              <div className="card" style={{ background: "var(--surface-alt)", margin: "18px 0", padding: "16px 18px" }}>
                <strong style={{ color: "var(--text-primary)", fontSize: "0.95rem" }}>The Reality of Unclaimed Wealth:</strong>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 6, lineHeight: 1.55 }}>
                  Over ₹1,00,000 Crores ($12 Billion+) in India and $50+ Billion in the US sit in government unclaimed depositor education funds because surviving families did not know an account existed, lost the policy number, or faced rejected claims due to missing nominee KYC.
                </p>
              </div>

              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginTop: 24, marginBottom: 10, color: "var(--text-primary)" }}>
                The Continuity Solution
              </h3>
              <div className="grid-3" style={{ gap: 12, marginTop: 10 }}>
                <div className="card" style={{ padding: "14px" }}>
                  <Icons.bank size={20} style={{ color: "var(--accent)" }} />
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", marginTop: 8 }}>1. Unified Map</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 4 }}>
                    Single source of truth for assets, accounts, and linked liabilities.
                  </div>
                </div>

                <div className="card" style={{ padding: "14px" }}>
                  <Icons.shield size={20} style={{ color: "var(--purple)" }} />
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", marginTop: 8 }}>2. Verified Nominees</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 4 }}>
                    Every rupee mapped to an acknowledged, verified beneficiary.
                  </div>
                </div>

                <div className="card" style={{ padding: "14px" }}>
                  <Icons.guide size={20} style={{ color: "var(--warn)" }} />
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", marginTop: 8 }}>3. Step-by-Step Handoff</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 4 }}>
                    Automated, actionable playbook for your trustee if you become unavailable.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: ASSETS */}
          {activeSection === "assets" && (
            <div className="card" style={{ padding: "28px 30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span className="badge badge-info">Chapter 2</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Inventory Architecture</span>
              </div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                Asset Registry & Nominee Verification
              </h2>

              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 12 }}>
                Continuity organizes your holdings into five core financial pillars:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                <div style={{ background: "var(--surface-alt)", padding: "14px 18px", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                    1. Banking & Liquid Emergency Funds
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 4 }}>
                    Savings accounts, fixed deposits, and cash reserves that your family needs immediately in the first 30 days for household maintenance and healthcare.
                  </div>
                </div>

                <div style={{ background: "var(--surface-alt)", padding: "14px 18px", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                    2. Life & Term Insurance
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 4 }}>
                    Policy numbers, claim hotlines, and explicit claim instructions. Ensures life insurance payouts are claimed within weeks, not lost.
                  </div>
                </div>

                <div style={{ background: "var(--surface-alt)", padding: "14px 18px", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                    3. Investments & Retirement
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 4 }}>
                    Mutual fund folios, demat accounts, EPF/PPF, and NPS numbers mapped to verified nominees.
                  </div>
                </div>

                <div style={{ background: "var(--surface-alt)", padding: "14px 18px", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                    4. Real Estate & Physical Assets
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 4 }}>
                    Registered deeds, physical locker locations, gold deposit receipts, and land tax IDs.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal("addAsset")}>
                  <Icons.plus size={14} />
                  Add Your First Asset Now
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => onNav("assets")}>
                  Open Assets View
                </button>
              </div>
            </div>
          )}

          {/* SECTION 3: TRUSTEES */}
          {activeSection === "trustees" && (
            <div className="card" style={{ padding: "28px 30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span className="badge badge-info">Chapter 3</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Human Network</span>
              </div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                Trusted Person Network & Trustee Preparedness
              </h2>

              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 12 }}>
                A continuity plan is only as good as the person designated to execute it. Continuity allows you to assign specific roles:
              </p>

              <div className="grid-2" style={{ gap: 12, marginTop: 16 }}>
                <div className="card" style={{ padding: 14 }}>
                  <div className="badge badge-success" style={{ alignSelf: "flex-start", marginBottom: 8 }}>
                    Primary Trustee
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Designated Executor</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 4 }}>
                    Spouse, sibling, or trusted adult who receives the complete Emergency Action Guide when the continuity escalation protocol triggers.
                  </div>
                </div>

                <div className="card" style={{ padding: 14 }}>
                  <div className="badge badge-neutral" style={{ alignSelf: "flex-start", marginBottom: 8 }}>
                    Professional Advisor
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>CA / Lawyer / Wealth Advisor</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 4 }}>
                    Key professional contacts who must be consulted prior to executing property sales or liquidating equity.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal("addPerson")}>
                  <Icons.user size={14} />
                  Add Trusted Person
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => onNav("people")}>
                  View People & Network
                </button>
              </div>
            </div>
          )}

          {/* SECTION 4: VAULT */}
          {activeSection === "vault" && (
            <div className="card" style={{ padding: "28px 30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span className="badge badge-info">Chapter 4</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Zero-Knowledge Vault</span>
              </div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                Digital Vault & Evidence Verification
              </h2>

              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 12 }}>
                In an insurance claim or estate settlement, claims fail without original proof documents. The vault links verified documents directly to assets:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "var(--surface-alt)", borderRadius: "var(--radius-sm)" }}>
                  <Icons.file size={18} style={{ color: "var(--accent)" }} />
                  <div>
                    <strong style={{ fontSize: "0.85rem" }}>Insurance Policy Certificates</strong>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Contains schedule of benefits, rider details, and insurer claim address.</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "var(--surface-alt)", borderRadius: "var(--radius-sm)" }}>
                  <Icons.file size={18} style={{ color: "var(--accent)" }} />
                  <div>
                    <strong style={{ fontSize: "0.85rem" }}>Property Sale Deeds & Tax Receipts</strong>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Title deeds and municipal survey records required to prevent property encroachment.</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "var(--surface-alt)", borderRadius: "var(--radius-sm)" }}>
                  <Icons.file size={18} style={{ color: "var(--accent)" }} />
                  <div>
                    <strong style={{ fontSize: "0.85rem" }}>Nominee Acknowledgments & Wills</strong>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Formal signed nomination forms and registered testamentary wills.</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal("uploadDoc")}>
                  <Icons.upload size={14} />
                  Upload Vault Document
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => onNav("documents")}>
                  Open Document Vault
                </button>
              </div>
            </div>
          )}

          {/* SECTION 5: OBLIGATIONS */}
          {activeSection === "obligations" && (
            <div className="card" style={{ padding: "28px 30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span className="badge badge-info">Chapter 5</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Cash Flow Protection</span>
              </div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                Financial Calendar & Debt Auto-Debits
              </h2>

              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 12 }}>
                When an individual is hospitalized or unavailable, unpaid home loan EMIs, lapsed health insurance policies, and bouncing utility auto-debits create massive legal penalties and cancellation of life-saving insurance.
              </p>

              <div className="card" style={{ background: "var(--surface-alt)", marginTop: 16, padding: 16 }}>
                <strong style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>Payment Source Mapping:</strong>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.5 }}>
                  Continuity requires every recurring obligation to specify which bank account funds the auto-debit, ensuring your trustee knows where to maintain liquid balances.
                </p>
              </div>

              <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal("addObligation")}>
                  <Icons.plus size={14} />
                  Add Financial Obligation
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => onNav("calendar")}>
                  View Calendar
                </button>
              </div>
            </div>
          )}

          {/* SECTION 6: CHECK-IN */}
          {activeSection === "checkin" && (
            <div className="card" style={{ padding: "28px 30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span className="badge badge-info">Chapter 6</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Autonomous Heartbeat</span>
              </div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                Automated Safety Check-in & Escalation
              </h2>

              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 12 }}>
                Continuity functions with an autonomous dead-man's switch / safety heartbeat protocol:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", background: "var(--surface-alt)", borderRadius: "var(--radius-sm)" }}>
                  <span className="badge badge-success" style={{ flexShrink: 0 }}>Active</span>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                    Periodic interval (e.g. every 30 days). A 1-click confirmation confirms everything is running smoothly.
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", background: "var(--surface-alt)", borderRadius: "var(--radius-sm)" }}>
                  <span className="badge badge-warn" style={{ flexShrink: 0 }}>Grace Period</span>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                    If a check-in is missed, a 15-day grace period sends reminder notifications before any contacts are notified.
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", background: "var(--surface-alt)", borderRadius: "var(--radius-sm)" }}>
                  <span className="badge badge-error" style={{ flexShrink: 0 }}>Escalation</span>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                    If unacknowledged through the entire grace window, the system automatically triggers notification to your designated Primary Trustee with access instructions.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => onNav("continuity")}>
                  <Icons.continuity size={14} />
                  Configure Continuity Protocols
                </button>
              </div>
            </div>
          )}

          {/* SECTION 7: EMERGENCY */}
          {activeSection === "emergency" && (
            <div className="card" style={{ padding: "28px 30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span className="badge badge-info">Chapter 7</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Execution Playbook</span>
              </div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                Emergency Handoff & Trustee Execution
              </h2>

              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 12 }}>
                If you become unavailable, your trustee will see a dedicated, simplified view called the <strong>Emergency Guide ("If I Become Unavailable")</strong>.
              </p>

              <div className="card" style={{ background: "var(--surface-alt)", margin: "16px 0", padding: "16px 18px" }}>
                <strong style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>Prioritized Action Sequence:</strong>
                <ol style={{ paddingLeft: 18, marginTop: 8, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <li><strong>Day 1–3:</strong> Secure liquid emergency funds from primary savings accounts.</li>
                  <li><strong>Day 3–7:</strong> Notify life insurance providers with policy numbers and death/disability certificates.</li>
                  <li><strong>Day 7–14:</strong> Fund linked bank accounts to prevent EMI default and penalties.</li>
                  <li><strong>Day 14+:</strong> Consult designated chartered accountant and lawyer for mutual fund / demat transmission.</li>
                </ol>
              </div>

              <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => changeViewMode("emergency")}>
                  <Icons.guide size={14} />
                  Open Live Emergency Guide View
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => changeViewMode("trusted")}>
                  <Icons.shield size={14} />
                  View Trustee Guide
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
