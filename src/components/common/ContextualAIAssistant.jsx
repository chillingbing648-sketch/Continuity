import React, { useState } from "react";
import { Modal } from "./Modal";
import { Icons } from "./Icons";
import { useApp } from "../../context/AppContext";
import { answerContextualQuery } from "../../services/continuityEngine";

export function ContextualAIAssistant({ onClose }) {
  const { assets, people, documents, continuity, obligations, openModal } = useApp();

  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "m1",
      sender: "assistant",
      text: "Hello! I am your Continuity Intelligence Assistant. I analyze your actual financial records, nominee verifications, obligations, and continuity readiness to provide factual answers.",
    },
  ]);

  const sampleQueries = [
    "Which assets have no verified nominee?",
    "What obligations depend on my HDFC account?",
    "What would Priya need if continuity activates today?",
    "Which documents are missing for high-value assets?",
    "Why is my continuity score what it is?",
  ];

  const handleSend = (textToSend) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg = { id: `msg_${Date.now()}_u`, sender: "user", text: q };
    const answer = answerContextualQuery(q, { assets, people, documents, continuity, obligations });
    const aiMsg = { id: `msg_${Date.now()}_a`, sender: "assistant", text: answer };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputQuery("");
  };

  return (
    <Modal
      title="Continuity AI Intelligence"
      subtitle="Contextual insights based purely on your structured financial data"
      onClose={onClose}
      size="large"
      footer={
        <div style={{ display: "flex", width: "100%", gap: 10 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Ask about nominees, emergency funds, dependencies, or missing documents..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button className="btn btn-primary" onClick={() => handleSend()} type="button">
            <Icons.sparkles size={16} />
            Ask
          </button>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* QUICK PROMPTS */}
        <div style={{ background: "var(--surface-alt)", padding: "12px 14px", borderRadius: "var(--radius-sm)" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.04em" }}>
            Suggested Questions:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {sampleQueries.map((sq, idx) => (
              <button
                key={idx}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: "0.75rem", textAlign: "left" }}
                onClick={() => handleSend(sq)}
                type="button"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* CHAT MESSAGES */}
        <div
          style={{
            maxHeight: 340,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            paddingRight: 4,
          }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                display: "flex",
                gap: 10,
                alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                maxWidth: "88%",
              }}
            >
              {m.sender === "assistant" && (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "var(--accent)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <Icons.sparkles size={14} />
                </div>
              )}
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  background: m.sender === "user" ? "var(--accent)" : "var(--surface-alt)",
                  color: m.sender === "user" ? "white" : "var(--text-primary)",
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                  border: m.sender === "user" ? "none" : "1px solid var(--border-light)",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
