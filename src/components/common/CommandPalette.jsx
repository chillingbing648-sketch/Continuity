import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { Icons } from "./Icons";

export function CommandPalette({ onNav }) {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    openModal,
    completeCheckin,
    setGlobalSearchOpen,
    setAiAssistantOpen,
    changeViewMode,
  } = useApp();

  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Keyboard shortcut listener: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  const commands = [
    {
      id: "search",
      title: "Global Search Everything",
      category: "Search",
      icon: <Icons.search size={16} />,
      action: () => {
        setCommandPaletteOpen(false);
        setGlobalSearchOpen(true);
      },
      shortcut: "Ctrl + S",
    },
    {
      id: "ai_assistant",
      title: "Ask Continuity AI Assistant",
      category: "AI",
      icon: <Icons.sparkles size={16} />,
      action: () => {
        setCommandPaletteOpen(false);
        setAiAssistantOpen(true);
      },
      shortcut: "AI",
    },
    {
      id: "add_asset",
      title: "Add Financial Asset / Liability",
      category: "Actions",
      icon: <Icons.plus size={16} />,
      action: () => {
        setCommandPaletteOpen(false);
        openModal("addAsset");
      },
      shortcut: "+A",
    },
    {
      id: "add_person",
      title: "Add Trusted Person / Nominee",
      category: "Actions",
      icon: <Icons.user size={16} />,
      action: () => {
        setCommandPaletteOpen(false);
        openModal("addPerson");
      },
      shortcut: "+P",
    },
    {
      id: "upload_doc",
      title: "Upload Important Document",
      category: "Actions",
      icon: <Icons.upload size={16} />,
      action: () => {
        setCommandPaletteOpen(false);
        openModal("uploadDoc");
      },
      shortcut: "+D",
    },
    {
      id: "run_sim",
      title: "Simulate Continuity ('If I Become Unavailable')",
      category: "Continuity",
      icon: <Icons.play size={16} />,
      action: () => {
        setCommandPaletteOpen(false);
        openModal("simulateContinuity");
      },
      shortcut: "Sim",
    },
    {
      id: "run_drill",
      title: "Run Continuity Drill Simulation",
      category: "Continuity",
      icon: <Icons.flag size={16} />,
      action: () => {
        setCommandPaletteOpen(false);
        openModal("runDrill");
      },
      shortcut: "Drill",
    },
    {
      id: "checkin_now",
      title: "Confirm Periodic Safety Check-in",
      category: "Continuity",
      icon: <Icons.checkCircle size={16} />,
      action: () => {
        setCommandPaletteOpen(false);
        completeCheckin();
      },
      shortcut: "Check",
    },
    {
      id: "score_breakdown",
      title: "View Continuity Score Breakdown",
      category: "Continuity",
      icon: <Icons.percent size={16} />,
      action: () => {
        setCommandPaletteOpen(false);
        openModal("scoreBreakdown");
      },
      shortcut: "Score",
    },
    {
      id: "nav_calendar",
      title: "Open Financial Calendar & Obligations",
      category: "Navigation",
      icon: <Icons.calendar size={16} />,
      action: () => {
        setCommandPaletteOpen(false);
        onNav("calendar");
      },
      shortcut: "Cal",
    },
    {
      id: "nav_lifemap",
      title: "Open Financial Life Relationship Map",
      category: "Navigation",
      icon: <Icons.lifeMap size={16} />,
      action: () => {
        setCommandPaletteOpen(false);
        onNav("lifemap");
      },
      shortcut: "Map",
    },
    {
      id: "view_trusted_mode",
      title: "Switch to Trusted Person Mode (Priya's View)",
      category: "Modes",
      icon: <Icons.shield size={16} />,
      action: () => {
        setCommandPaletteOpen(false);
        changeViewMode("trusted");
      },
      shortcut: "Trustee",
    },
    {
      id: "view_emergency_guide",
      title: "Open Emergency Guide ('If I Become Unavailable')",
      category: "Modes",
      icon: <Icons.guide size={16} />,
      action: () => {
        setCommandPaletteOpen(false);
        changeViewMode("emergency");
      },
      shortcut: "Guide",
    },
    {
      id: "nav_settings",
      title: "Open Settings & Security",
      category: "Navigation",
      icon: <Icons.settings size={16} />,
      action: () => {
        setCommandPaletteOpen(false);
        onNav("settings");
      },
      shortcut: "Set",
    },
  ];

  const filteredCommands = commands.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setCommandPaletteOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="cmd-palette-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) setCommandPaletteOpen(false);
      }}
      role="presentation"
    >
      <div className="cmd-palette" role="dialog" aria-modal="true">
        <div className="cmd-input-wrap">
          <Icons.search size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            className="cmd-input"
            placeholder="Type a command or search actions... (Esc to exit)"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <span className="cmd-shortcut">Ctrl+K</span>
        </div>

        <div className="cmd-list">
          {filteredCommands.length === 0 ? (
            <div style={{ padding: "24px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              No commands matching "{search}"
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => (
              <div
                key={cmd.id}
                className={`cmd-item ${idx === selectedIndex ? "selected" : ""}`}
                onClick={cmd.action}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className="cmd-item-left">
                  <span style={{ color: idx === selectedIndex ? "var(--accent)" : "var(--text-secondary)", display: "flex" }}>
                    {cmd.icon}
                  </span>
                  <span>{cmd.title}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{cmd.category}</span>
                  {cmd.shortcut && <span className="cmd-shortcut">{cmd.shortcut}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
