import { useMemo, useState } from "react";
import { Bot, ExternalLink } from "lucide-react";
import projectsData from "../data/projects.json";
import type { Project } from "../types";
import { useSendMessage } from "../lib/useChat";
import { useUI } from "../store";
import Reveal from "./Reveal";

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
          {shown.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 70}>
            <article className="card">
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
                <a
                  className="btn-detail"
                  href={`/projects/${p.id}.html`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={15} /> Detail
                </a>
                <button className="btn-ask" onClick={() => askAbout(p)}>
                  <Bot size={15} /> Tanya AI
                </button>
              </div>
            </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
