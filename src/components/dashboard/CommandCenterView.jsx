import React, { useMemo } from "react";
import { Icons } from "../common/Icons";
import { useApp } from "../../context/AppContext";
import { fmt, fmtDate, timeAgo } from "../../utils/formatting";
import "./command-center.css";

function daysUntil(date) {
  const target = new Date(date);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

function urgencyTone(days) {
  if (days < 0) return "danger";
  if (days <= 7) return "warning";
  return "neutral";
}

export function CommandCenterView({ onNav }) {
  const {
    user,
    assets,
    people,
    documents,
    obligations,
    continuity,
    activity,
    continuityScoreData,
    criticalGaps,
    openModal,
    enterDemoMode,
    setAiAssistantOpen,
  } = useApp();

  const primaryTrustee = people.find(
    (person) => person.isPrimaryTrustee || person.role?.toLowerCase().includes("trustee") || person.role?.toLowerCase().includes("trusted")
  );

  const upcoming = useMemo(
    () => [...obligations]
      .filter((item) => item?.nextDueDate)
      .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime())
      .slice(0, 4),
    [obligations]
  );

  const prioritizedGaps = useMemo(
    () => [...(criticalGaps || [])]
      .sort((a, b) => (a.severity === "critical" ? -1 : 1) - (b.severity === "critical" ? -1 : 1))
      .slice(0, 4),
    [criticalGaps]
  );

  const topAction = prioritizedGaps[0];
  const score = continuityScoreData?.score ?? 0;
  const scoreState = score >= 80 ? "Strong" : score >= 60 ? "Needs attention" : "At risk";
  const totalAssetValue = assets.reduce((sum, asset) => sum + (Number(asset.approxValue) || 0), 0);
  const verifiedAssets = assets.filter((asset) => asset.nomineeVerified === true).length;
  const activeContinuity = continuity?.active;

  const handleGapAction = (gap) => {
    const target = gap?.actionTarget;
    if (!target) return;
    if (target.modal) {
      openModal(target.modal, target.assetId ? { assetId: target.assetId } : {});
      return;
    }
    if (target.view) onNav(target.view);
  };

  return (
    <div className="cc-shell">
      <section className="cc-hero card">
        <div className="cc-hero-copy">
          <div className="cc-eyebrow">Financial continuity command center</div>
          <h2>Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {user?.name || "there"}.</h2>
          <p>Your workspace is organized around what matters next — protecting access, reducing gaps, and keeping the plan ready when life changes.</p>
          <div className="cc-hero-actions">
            {topAction ? (
              <button type="button" className="btn btn-primary btn-sm" onClick={() => handleGapAction(topAction)}>
                <Icons.alertTriangle size={15} />
                {topAction.actionLabel || "Resolve top gap"}
                <Icons.arrowRight size={14} />
              </button>
            ) : (
              <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal("quickAdd")}>
                <Icons.plus size={15} />
                Add to workspace
              </button>
            )}
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => openModal("simulateContinuity")}>
              <Icons.play size={14} />
              Run simulation
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAiAssistantOpen(true)}>
              <Icons.sparkles size={14} />
              Ask AI
            </button>
          </div>
        </div>

        <div className="cc-score-panel">
          <div className="cc-score-ring" style={{ "--score": `${score}%` }}>
            <div className="cc-score-inner"><strong>{score}</strong><span>/100</span></div>
          </div>
          <div className="cc-score-meta">
            <span className="cc-score-label">Continuity health</span>
            <strong>{scoreState}</strong>
            <span>{continuityScoreData?.criticalCount || 0} critical · {continuityScoreData?.warningCount || 0} warnings</span>
          </div>
        </div>
      </section>

      <section className="cc-kpis">
        <div className="cc-kpi card"><div className="cc-kpi-icon"><Icons.bank size={16} /></div><div><span>Financial inventory</span><strong>{assets.length}</strong><small>{fmt(totalAssetValue)} tracked</small></div></div>
        <div className="cc-kpi card"><div className="cc-kpi-icon"><Icons.people size={16} /></div><div><span>Trusted network</span><strong>{people.length}</strong><small>{primaryTrustee ? `${primaryTrustee.name} is primary` : "No primary trustee"}</small></div></div>
        <div className="cc-kpi card"><div className="cc-kpi-icon"><Icons.docs size={16} /></div><div><span>Document vault</span><strong>{documents.length}</strong><small>{verifiedAssets} assets verified</small></div></div>
        <div className="cc-kpi card"><div className="cc-kpi-icon"><Icons.continuity size={16} /></div><div><span>Protocol</span><strong>{activeContinuity ? "Active" : "Off"}</strong><small>{activeContinuity ? `Every ${continuity.frequency || 30} days` : "Enable check-ins"}</small></div></div>
      </section>

      <section className="cc-grid cc-grid-main">
        <div className="card cc-priority-card">
          <div className="cc-section-head"><div><div className="cc-section-kicker">Next best actions</div><h3>Highest-impact continuity work.</h3></div><button type="button" className="btn btn-ghost btn-sm" onClick={() => onNav("continuity")}>View all <Icons.arrowRight size={14} /></button></div>
          {prioritizedGaps.length ? (
            <div className="cc-action-list">
              {prioritizedGaps.map((gap) => (
                <button type="button" className="cc-action-row" key={gap.id} onClick={() => handleGapAction(gap)}>
                  <span className={`cc-severity ${gap.severity === "critical" ? "critical" : "warning"}`}>{gap.severity === "critical" ? "!" : "•"}</span>
                  <span className="cc-action-copy"><strong>{gap.affectedEntity || gap.title}</strong><span>{gap.title}</span></span>
                  <span className="cc-action-cta">{gap.actionLabel || "Review"}<Icons.arrowRight size={13} /></span>
                </button>
              ))}
            </div>
          ) : (
            <div className="cc-empty"><div className="cc-empty-icon"><Icons.checkCircle size={18} /></div><div><strong>No active continuity gaps</strong><span>Your current workspace has no flagged actions.</span></div></div>
          )}
        </div>

        <div className="card cc-deadline-card">
          <div className="cc-section-head"><div><div className="cc-section-kicker">Time-sensitive</div><h3>Upcoming obligations</h3></div><button type="button" className="btn btn-ghost btn-sm" onClick={() => onNav("calendar")}>Calendar <Icons.arrowRight size={14} /></button></div>
          {upcoming.length ? (
            <div className="cc-deadline-list">
              {upcoming.map((item) => {
                const days = daysUntil(item.nextDueDate);
                const tone = urgencyTone(days);
                return <div className="cc-deadline-row" key={item.id}><div className={`cc-date-chip ${tone}`}><strong>{days < 0 ? "Late" : days === 0 ? "Today" : `${days}d`}</strong></div><div className="cc-deadline-copy"><strong>{item.title}</strong><span>{fmtDate(item.nextDueDate)} · {item.frequency}</span></div><strong className="cc-deadline-amount">{fmt(item.amount)}</strong></div>;
              })}
            </div>
          ) : (
            <div className="cc-empty"><div className="cc-empty-icon"><Icons.calendar size={18} /></div><div><strong>No deadlines scheduled</strong><span>Add obligations so future cash commitments stay visible.</span></div></div>
          )}
        </div>
      </section>

      <section className="cc-grid cc-grid-secondary">
        <div className="card">
          <div className="cc-section-head"><div><div className="cc-section-kicker">Readiness</div><h3>One-minute health check</h3></div><button type="button" className="btn btn-ghost btn-sm" onClick={() => openModal("scoreBreakdown")}>Breakdown <Icons.arrowRight size={14} /></button></div>
          <div className="cc-progress-stack">{(continuityScoreData?.breakdowns || []).slice(0, 5).map((item) => <div className="cc-progress-row" key={item.id}><div className="cc-progress-label"><span>{item.title}</span><strong>{item.score}/{item.maxScore}</strong></div><div className="cc-progress-track"><span style={{ width: `${Math.min(100, (item.score / item.maxScore) * 100)}%` }} /></div></div>)}</div>
        </div>

        <div className="card">
          <div className="cc-section-head"><div><div className="cc-section-kicker">Recent changes</div><h3>Workspace activity</h3></div><button type="button" className="btn btn-ghost btn-sm" onClick={() => onNav("activity")}>Audit trail <Icons.arrowRight size={14} /></button></div>
          {activity?.length ? <div className="cc-activity-list">{activity.slice(0, 4).map((item) => <div className="cc-activity-row" key={item.id}><span className="cc-activity-dot" /><div><strong>{item.action}</strong><span>{item.affectedEntity || "Workspace"}</span></div><time>{timeAgo(item.timestamp)}</time></div>)}</div> : <div className="cc-empty"><div className="cc-empty-icon"><Icons.activity size={18} /></div><div><strong>No activity yet</strong><span>Your actions will appear here as the workspace evolves.</span></div></div>}
        </div>
      </section>

      <section className="cc-quickbar card">
        <div><div className="cc-section-kicker">Fast access</div><h3>Do the next useful thing</h3></div>
        <div className="cc-quick-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => openModal("addAsset")}><Icons.plus size={14} /> Add asset</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => openModal("addPerson")}><Icons.people size={14} /> Trusted person</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => openModal("uploadDoc")}><Icons.docs size={14} /> Upload document</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={enterDemoMode}><Icons.sparkles size={14} /> Explore demo</button>
        </div>
      </section>
    </div>
  );
}
