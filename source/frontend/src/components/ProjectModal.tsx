import { X, Bot } from "lucide-react";
import type { Project } from "../types";

export default function ProjectModal({
  project,
  onClose,
  onAsk,
}: {
  project: Project;
  onClose: () => void;
  onAsk: (p: Project) => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{project.name}</h3>
          <button onClick={onClose} aria-label="Tutup"><X size={18} /></button>
        </div>
        <div className="card-badge mono">{project.domain} · {project.agents} agent</div>
        <p className="card-tagline">{project.tagline}</p>
        <p className="card-summary" style={{ color: "var(--text)" }}>{project.summary}</p>
        <div>
          <div className="mono" style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6 }}>
            Tech stack
          </div>
          <div className="card-stack">
            {project.stack.map((s) => (
              <span key={s} className="tag mono">{s}</span>
            ))}
          </div>
        </div>
        <button className="btn-accent" onClick={() => { onClose(); onAsk(project); }}>
          <Bot size={15} style={{ verticalAlign: "-2px", marginRight: 6 }} />
          Tanya AI lebih dalam tentang {project.name}
        </button>
      </div>
    </div>
  );
}
