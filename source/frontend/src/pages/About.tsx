import { useRef } from "react";
import Terminal, { type TerminalHandle } from "../components/Terminal";
import StatusPanel from "../components/StatusPanel";
import { useCountUp } from "../lib/useCountUp";

function Stat({ n, s, l }: { n: string; s?: string; l: string }) {
  const { ref, display } = useCountUp(n);
  return (
    <div className="c">
      <div className="n"><span ref={ref}>{display}</span>{s && <span className="s">{s}</span>}</div>
      <div className="l">{l}</div>
    </div>
  );
}

export default function About() {
  const term = useRef<TerminalHandle>(null);
  return (
    <section className="page active" data-page="about">
      <div className="wrap">
        <div className="eyebrow stagger">AI / ML Engineer — Multi-Agent Systems</div>
        <h1 className="headline stagger">Saya bangun sistem AI multi-agent yang <span className="g">andal di produksi</span> — bukan demo.</h1>
        <p className="subhead stagger">12 sistem produksi, 100+ agent, di domain <b>high-stakes</b> (pertahanan, krisis, pemerintah). Prinsipnya: deterministic scoring, fallback chain, degraded-safe. <b>Coba terminal di bawah — atau langsung klik.</b></p>
        <div className="cta-row stagger">
          <button className="btn btn-p" onClick={() => term.current?.type("open work")}>◈ Lihat Project →</button>
          <button className="btn btn-g" onClick={() => term.current?.type("cat resume")}>↓ Download CV</button>
          <button className="btn btn-g" onClick={() => term.current?.type("open contact")}>✉ Kontak</button>
        </div>

        <div className="console-grid stagger">
          <Terminal ref={term} />
          <StatusPanel />
        </div>

        <div className="strip stagger">
          <Stat n="12" l="Prod Systems" />
          <Stat n="100" s="+" l="Agents" />
          <Stat n="2" l="Degrees · UI" />
          <Stat n="5" l="Certs" />
        </div>
      </div>
    </section>
  );
}
