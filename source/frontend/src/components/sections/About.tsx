import Avatar from "../Avatar";
import Reveal from "../Reveal";
import { profile } from "../../data/profile";
import { useUI } from "../../store";
import { useCountUp } from "../../lib/useCountUp";

function StatItem({ value, label }: { value: string; label: string }) {
  const { ref, display } = useCountUp(value);
  return (
    <div className="stat">
      <span className="stat-value" ref={ref}>{display}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function About() {
  const { openChat } = useUI();
  return (
    <section className="section about" id="about">
      <div className="aurora" aria-hidden="true" />
      <div className="container">
        <Reveal><span className="eyebrow mono about-eyebrow">{profile.eyebrow}</span></Reveal>
        <div className="about-grid">
          <Reveal>
          <div className="about-photo">
            <Avatar />
          </div>
          </Reveal>
          <Reveal delay={120}>
          <div className="about-body">
            <h1 className="about-greet">
              Hai, saya <span className="serif name-gradient">{profile.shortName}</span> 👋
            </h1>
            <p className="about-tagline">{profile.tagline}</p>
            {profile.about.map((p, i) => (
              <p key={i} className="about-para"
                 dangerouslySetInnerHTML={{ __html: mdBold(p) }} />
            ))}
            <div className="stat-row">
              {profile.stats.map((s) => (
                <StatItem key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
            <div className="pill-row">
              {profile.techPills.map((t) => (
                <span key={t} className="pill mono">{t}</span>
              ))}
            </div>
            <button className="btn-accent" onClick={openChat}>💬 Tanya AI tentang saya</button>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** ubah **teks** jadi <strong> (narasi pakai bold ringan). */
function mdBold(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}
