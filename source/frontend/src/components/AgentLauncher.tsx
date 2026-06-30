import { useState } from "react";
import Markdown from "./Markdown";
import Reveal from "./Reveal";
import { Zap, X } from "lucide-react";
import { useAgents, useChat } from "../store";
import { streamAgent } from "../lib/api";
import type { AgentManifest } from "../types";

export default function AgentLauncher() {
  const { agents } = useAgents();
  const tasks = agents.filter((a) => a.mode === "task");
  const [open, setOpen] = useState<AgentManifest | null>(null);

  if (tasks.length === 0) return null;

  return (
    <section className="section" id="agents">
      <div className="container">
        <h2 className="section-title"><Zap size={20} /> Agent — minta AI lakukan tugas spesifik</h2>
        <div className="grid grid-2">
          {tasks.map((a, i) => (
            <Reveal key={a.id} delay={i * 70}>
            <article className="card card-agent">
              <h3 className="card-title">{a.label.id}</h3>
              <p className="card-summary">{a.description}</p>
              <button className="btn-accent" onClick={() => setOpen(a)}>Jalankan ▸</button>
            </article>
            </Reveal>
          ))}
        </div>
      </div>
      {open && <AgentModal agent={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

function AgentModal({ agent, onClose }: { agent: AgentManifest; onClose: () => void }) {
  const { sessionId } = useChat();
  const props = (agent.input_schema?.properties || {}) as Record<string, any>;
  const required: string[] = (agent.input_schema?.required as string[]) || [];
  const [form, setForm] = useState<Record<string, string>>({ lang: "id" });
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  function run() {
    for (const r of required) {
      if (!form[r]?.trim()) return;
    }
    setRunning(true);
    setOutput("");
    streamAgent(
      agent.id,
      { ...form, session_id: sessionId },
      {
        onToken: (d) => setOutput((o) => o + d),
        onDone: () => setRunning(false),
        onError: (e) => { setOutput(`⚠️ ${e.message || "error"}`); setRunning(false); },
      }
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{agent.label.id}</h3>
          <button onClick={onClose} aria-label="Tutup"><X size={18} /></button>
        </div>

        {Object.entries(props).map(([key, spec]) => {
          if (key === "lang") return null;
          const long = key === "job_description";
          return (
            <div key={key} className="field">
              <label className="mono">{key}{required.includes(key) ? " *" : ""}</label>
              {long ? (
                <textarea
                  rows={5}
                  placeholder={spec.description || ""}
                  value={form[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              ) : (
                <input
                  placeholder={spec.description || ""}
                  value={form[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              )}
            </div>
          );
        })}

        <div className="field">
          <label className="mono">bahasa</label>
          <div className="lang-toggle">
            {["id", "en"].map((l) => (
              <button
                key={l}
                className={form.lang === l ? "lang-active" : ""}
                onClick={() => setForm({ ...form, lang: l })}
              >{l.toUpperCase()}</button>
            ))}
          </div>
        </div>

        <button className="btn-accent" onClick={run} disabled={running}>
          {running ? "Menjalankan…" : "Jalankan ▸"}
        </button>

        {output && (
          <div className="agent-output">
            <Markdown>{output}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}
