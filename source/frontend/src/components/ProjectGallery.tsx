import { useMemo, useState } from "react";
import { Bot, Info } from "lucide-react";
import projectsData from "../data/projects.json";
import type { Project } from "../types";
import { useSendMessage } from "../lib/useChat";
import { useUI } from "../store";
import ProjectModal from "./ProjectModal";

const projects = projectsData as Project[];

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "defense", label: "Defense" },
  { key: "osint", label: "OSINT" },
  { key: "media", label: "Media" },
  { key: "data", label: "Data" },
  { key: "docs", label: "Docs" },
  { key: "crisis", label: "Crisis" },
  { key: "research", label: "Research" },
];

export default function ProjectGallery() {
  const [active, setActive] = useState("all");
  const [detail, setDetail] = useState<Project | null>(null);
  const { send } = useSendMessage();
  const { openChat } = useUI();

  const shown = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.domain === active)),
    [active]
  );

  function askAbout(p: Project) {
    openChat();
    send(`Ceritakan tentang project ${p.name}.`);
  }

  return (
    <section className="section" id="projects">
      <div className="container">
        <h2 className="section-title">🗂️ Projects</h2>
        <div className="filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filter ${active === f.key ? "filter-active" : ""}`}
              onClick={() => setActive(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid">
          {shown.map((p) => (
            <article key={p.id} className="card">
              <div className="card-badge mono">
                {p.domain} · {p.agents} agent
              </div>
              <h3 className="card-title">{p.name}</h3>
              <p className="card-tagline">{p.tagline}</p>
              <p className="card-summary">{p.summary}</p>
              <div className="card-stack">
                {p.stack.slice(0, 4).map((s) => (
                  <span key={s} className="tag mono">{s}</span>
                ))}
              </div>
              <div className="card-actions">
                <button className="btn-detail" onClick={() => setDetail(p)}>
                  <Info size={15} /> Detail
                </button>
                <button className="btn-ask" onClick={() => askAbout(p)}>
                  <Bot size={15} /> Tanya AI
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      {detail && (
        <ProjectModal project={detail} onClose={() => setDetail(null)} onAsk={askAbout} />
      )}
    </section>
  );
}
