import React from "react";
import { TrustedPersonReadinessCard } from "./TrustedPersonReadinessCard";
import { Icons } from "../common/Icons";
import { EmptyState } from "../common/EmptyState";
import { useApp } from "../../context/AppContext";

export function PeopleView() {
  const { people, openModal, deletePerson } = useApp();

  const primaryTrustees = people.filter((p) => p.isPrimaryTrustee || p.role?.toLowerCase().includes("trustee"));
  const advisorsAndOthers = people.filter((p) => !p.isPrimaryTrustee && !p.role?.toLowerCase().includes("trustee"));

  const handleDelete = (p) => {
    openModal("confirm", {
      title: "Remove Trusted Contact",
      desc: `Are you sure you want to remove ${p.name}? Any linked nominee designations will become unassigned.`,
      isDanger: true,
      onConfirm: () => deletePerson(p.id),
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Trusted Persons & Advisors
          </h2>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
            Manage trustees, nominees, and advisors who will protect and continue your financial life.
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => openModal("addPerson")}
        >
          <Icons.plus size={15} />
          Add Trusted Person
        </button>
      </div>

      {people.length === 0 ? (
        <EmptyState
          icon={<Icons.people size={24} />}
          title="No trusted persons assigned"
          desc="Add a spouse, family member, or advisor to receive continuity instructions and emergency access."
          action={
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => openModal("addPerson")}
            >
              <Icons.plus size={14} />
              Add Primary Trustee
            </button>
          }
        />
      ) : (
        <>
          {/* PRIMARY TRUSTEES SECTION */}
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>
              Primary Trustees & Emergency Handoff Network ({primaryTrustees.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {primaryTrustees.map((person) => (
                <TrustedPersonReadinessCard
                  key={person.id}
                  person={person}
                  onEditPermissions={(p) => openModal("editPermissions", { person: p })}
                  onEditPerson={(p) => openModal("editPerson", { person: p })}
                />
              ))}
            </div>
          </div>

          {/* ADVISORS & SECONDARY CONTACTS */}
          {advisorsAndOthers.length > 0 && (
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>
                Advisors & Secondary Emergency Contacts ({advisorsAndOthers.length})
              </div>
              <div className="grid-2">
                {advisorsAndOthers.map((p) => (
                  <div key={p.id} className="card" style={{ padding: "16px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="avatar">{p.avatar || "P"}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{p.name}</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                            {p.relationship} • {p.role}
                          </div>
                        </div>
                      </div>
                      <span className={`badge ${p.status === "Verified" ? "badge-success" : "badge-neutral"}`}>
                        {p.status}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 14 }}>
                      <div>Phone: <strong>{p.phone}</strong></div>
                      <div>Email: <strong>{p.email}</strong></div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-light)", paddingTop: 10 }}>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ color: "var(--error)", padding: "4px 8px" }}
                        onClick={() => handleDelete(p)}
                      >
                        <Icons.trash size={13} />
                        Remove
                      </button>

                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openModal("editPermissions", { person: p })}
                        >
                          Permissions
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openModal("editPerson", { person: p })}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
