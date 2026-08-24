import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { Icons } from "./Icons";
import { fmt } from "../../utils/formatting";

export function GlobalSearchModal({ onNav }) {
  const {
    isGlobalSearchOpen,
    setGlobalSearchOpen,
    assets,
    people,
    documents,
    obligations,
    openModal,
  } = useApp();

  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isGlobalSearchOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const q = query.toLowerCase().trim();

  // Search Assets
  const matchingAssets = q
    ? assets.filter(
        (a) =>
          a.name?.toLowerCase().includes(q) ||
          a.institution?.toLowerCase().includes(q) ||
          a.type?.toLowerCase().includes(q) ||
          a.subtype?.toLowerCase().includes(q) ||
          a.nominee?.toLowerCase().includes(q) ||
          a.instructions?.toLowerCase().includes(q)
      )
    : [];

  // Search People
  const matchingPeople = q
    ? people.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.relationship?.toLowerCase().includes(q) ||
          p.role?.toLowerCase().includes(q) ||
          p.email?.toLowerCase().includes(q) ||
          p.phone?.toLowerCase().includes(q)
      )
    : [];

  // Search Documents
  const matchingDocs = q
    ? documents.filter(
        (d) =>
          d.title?.toLowerCase().includes(q) ||
          d.docType?.toLowerCase().includes(q) ||
          d.category?.toLowerCase().includes(q) ||
          d.institution?.toLowerCase().includes(q) ||
          d.identifier?.toLowerCase().includes(q) ||
          d.notes?.toLowerCase().includes(q)
      )
    : [];

  // Search Obligations
  const matchingObligations = q
    ? obligations.filter(
        (o) =>
          o.title?.toLowerCase().includes(q) ||
          o.type?.toLowerCase().includes(q) ||
          o.beneficiary?.toLowerCase().includes(q) ||
          o.instructions?.toLowerCase().includes(q)
      )
    : [];

  const totalResults =
    matchingAssets.length +
    matchingPeople.length +
    matchingDocs.length +
    matchingObligations.length;

  return (
    <div
      className="cmd-palette-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) setGlobalSearchOpen(false);
      }}
      role="presentation"
    >
      <div className="cmd-palette" style={{ maxWidth: 680 }} role="dialog" aria-modal="true">
        <div className="cmd-input-wrap">
          <Icons.search size={20} style={{ color: "var(--accent)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            className="cmd-input"
            placeholder="Search assets, institutions, nominees, documents, obligations... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setGlobalSearchOpen(false);
            }}
          />
          <button
            className="btn-icon"
            onClick={() => setGlobalSearchOpen(false)}
            type="button"
          >
            <Icons.x size={18} />
          </button>
        </div>

        <div style={{ maxHeight: 440, overflowY: "auto", padding: "12px 14px" }}>
          {!q ? (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
              <div style={{ marginBottom: 8 }}>
                <Icons.search size={28} style={{ opacity: 0.5 }} />
              </div>
              Search anything across your financial universe:
              <div style={{ marginTop: 10, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                <span className="badge badge-neutral">HDFC</span>
                <span className="badge badge-neutral">Priya</span>
                <span className="badge badge-neutral">LIC</span>
                <span className="badge badge-neutral">Mutual Funds</span>
                <span className="badge badge-neutral">Will</span>
                <span className="badge badge-neutral">EMI</span>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
              No matches found for "{query}".
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* ASSETS */}
              {matchingAssets.length > 0 && (
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                    Financial Assets ({matchingAssets.length})
                  </div>
                  {matchingAssets.map((a) => (
                    <div
                      key={a.id}
                      className="cmd-item"
                      onClick={() => {
                        setGlobalSearchOpen(false);
                        openModal("assetDetail", { asset: a });
                      }}
                    >
                      <div className="cmd-item-left">
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            background: "var(--surface-alt)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icons.bank size={14} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{a.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {a.institution} • {a.subtype || a.type}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{fmt(a.approxValue)}</div>
                        <div style={{ fontSize: "0.72rem", color: a.nomineeVerified ? "var(--success)" : "var(--warn)" }}>
                          {a.nominee ? `Nominee: ${a.nominee}` : "No nominee"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PEOPLE */}
              {matchingPeople.length > 0 && (
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                    People & Trusted Network ({matchingPeople.length})
                  </div>
                  {matchingPeople.map((p) => (
                    <div
                      key={p.id}
                      className="cmd-item"
                      onClick={() => {
                        setGlobalSearchOpen(false);
                        onNav("people");
                      }}
                    >
                      <div className="cmd-item-left">
                        <div className="avatar" style={{ width: 28, height: 28, fontSize: "0.72rem" }}>
                          {p.avatar || "P"}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{p.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {p.relationship} • {p.role}
                          </div>
                        </div>
                      </div>
                      <span className={`badge ${p.status === "Verified" ? "badge-success" : "badge-warn"}`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* DOCUMENTS */}
              {matchingDocs.length > 0 && (
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                    Documents ({matchingDocs.length})
                  </div>
                  {matchingDocs.map((d) => (
                    <div
                      key={d.id}
                      className="cmd-item"
                      onClick={() => {
                        setGlobalSearchOpen(false);
                        openModal("docDetail", { doc: d });
                      }}
                    >
                      <div className="cmd-item-left">
                        <Icons.file size={16} style={{ color: "var(--accent)" }} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{d.title}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {d.docType} • {d.institution || d.category}
                          </div>
                        </div>
                      </div>
                      <span className={`badge ${d.verified ? "badge-success" : "badge-neutral"}`}>
                        {d.verified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* OBLIGATIONS */}
              {matchingObligations.length > 0 && (
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                    Obligations & Calendar ({matchingObligations.length})
                  </div>
                  {matchingObligations.map((o) => (
                    <div
                      key={o.id}
                      className="cmd-item"
                      onClick={() => {
                        setGlobalSearchOpen(false);
                        onNav("calendar");
                      }}
                    >
                      <div className="cmd-item-left">
                        <Icons.calendar size={16} style={{ color: "var(--warn)" }} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{o.title}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {o.type} • Due {o.nextDueDate}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>
                        {fmt(o.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
