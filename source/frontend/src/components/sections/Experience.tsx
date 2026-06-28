import SectionHeader from "../SectionHeader";
import { profile } from "../../data/profile";

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container">
        <SectionHeader eyebrow="PERJALANAN KARIER" title="Experience" />
        <div className="timeline">
          {profile.experience.map((e) => (
            <div key={e.company} className="tl-item">
              <div className="tl-dot" />
              <div className="tl-card">
                <div className="tl-head">
                  <h3 className="tl-role">{e.role}</h3>
                  <span className="tl-period mono">{e.period}</span>
                </div>
                <div className="tl-company">{e.company} · <span className="tl-loc">{e.location}</span></div>
                <p className="tl-summary">{e.summary}</p>
                <ul className="tl-highlights">
                  {e.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
