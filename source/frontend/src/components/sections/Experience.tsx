import { useEffect, useRef } from "react";
import { Bot, Briefcase, Gauge, FlaskConical, Building2, type LucideIcon } from "lucide-react";
import SectionHeader from "../SectionHeader";
import Reveal from "../Reveal";
import { profile } from "../../data/profile";

/** Ikon semantik per pekerjaan (konsisten dgn tema, bukan logo asli). */
const JOB_ICONS: Record<string, LucideIcon> = {
  "PT. Indonesia Indicator": Bot,
  "Fiverr (Freelance)": Briefcase,
  "PPSDM Migas Cepu": Gauge,
  "Universitas Indonesia": FlaskConical,
};

export default function Experience() {
  const tlRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = tlRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { el.classList.add("drawn"); obs.unobserve(el); }
      }),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section" id="experience">
      <div className="container">
        <SectionHeader eyebrow="PERJALANAN KARIER" title="Experience" />
        <div className="timeline" ref={tlRef}>
          {profile.experience.map((e, i) => {
            const Icon = JOB_ICONS[e.company] ?? Building2;
            return (
            <Reveal key={e.company} delay={i * 80}>
            <div className="tl-item">
              <div className="tl-dot" />
              <div className="tl-card">
                <div className="tl-logo" aria-hidden="true"><Icon size={20} /></div>
                <div className="tl-main">
                  <div className="tl-head">
                    <h3 className="tl-role">{e.role}</h3>
                    <span className="tl-period mono">{e.period}</span>
                  </div>
                  <div className="tl-company">{e.company} · <span className="tl-loc">{e.location}</span></div>
                  <p className="tl-summary">{e.summary}</p>
                  <ul className="tl-highlights">
                    {e.highlights.map((h, idx) => <li key={idx}>{h}</li>)}
                  </ul>
                </div>
              </div>
            </div>
            </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
