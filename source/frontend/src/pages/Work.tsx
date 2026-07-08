import { useMemo, useState } from "react";
import MiniPrompt from "../components/MiniPrompt";
import { projects, WORK_FILTERS } from "../data/projects";
import { useCardSpotlight } from "../lib/useCardSpotlight";
import type { Project, ProjectCat } from "../types";

function Card({ p, i }: { p: Project; i: number }) {
  return (
    <article className="pcard card" data-cat={p.cat} data-title={p.t}>
      <div className="top">
        <span className="cat"><span className="d" />{p.cat.toUpperCase()}</span>
        <span className="idxbig">{String(i + 1).padStart(2, "0")}</span>
      </div>
      <h3>{p.t}</h3>
      <div className="kick">{p.kick}</div>
      <p>{p.d}</p>
      <div className="foot">
        <span className="agent"><span className="bars"><i /><i /><i /><i /></span> {p.ag} AGENT</span>
        <a className="detail" href={`/projects/${p.id}.html`} target="_blank" rel="noreferrer" data-detail={p.t}>
          Detail
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M7 7h10v10" /></svg>
        </a>
      </div>
    </article>
  );
}

export default function Work() {
  const [f, setF] = useState<"all" | ProjectCat>("all");
  useCardSpotlight();
  const list = useMemo(() => (f === "all" ? projects : projects.filter((p) => p.cat === f)), [f]);
  return (
    <section className="page active" data-page="work">
      <div className="wrap">
        <div className="sec-head stagger"><div className="sec-idx">03</div><h2 className="sec-title">Selected Work<span className="sub">// 12 sistem produksi · 100+ agent</span></h2></div>
        <MiniPrompt cmd="query projects --all --sort=impact" out="12 rows" />
        <div className="work-top stagger">
          <div className="work-filters">
            {WORK_FILTERS.map((flt) => (
              <span key={flt.key} className={`filter ${f === flt.key ? "on" : ""}`} data-f={flt.key} onClick={() => setF(flt.key)}>{flt.label}</span>
            ))}
          </div>
          <div className="work-count"><b>{list.length}</b> SISTEM</div>
        </div>
        <div className="work-list stagger">
          {list.map((p, i) => <Card key={p.id} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}
