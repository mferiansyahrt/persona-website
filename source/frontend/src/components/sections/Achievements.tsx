import { GraduationCap, FileText, Award, Sparkles } from "lucide-react";
import SectionHeader from "../SectionHeader";
import { profile } from "../../data/profile";

export default function Achievements() {
  return (
    <section className="section" id="achievements">
      <div className="container">
        <SectionHeader eyebrow="PENDIDIKAN & PENCAPAIAN" title="Achievements" />
        <div className="ach-grid">
          {/* Pendidikan */}
          <article className="card ach-card">
            <h3 className="ach-title"><GraduationCap size={18} /> Pendidikan</h3>
            {profile.education.map((ed) => (
              <div key={ed.degree} className="ach-edu">
                <div className="ach-edu-degree">{ed.degree}</div>
                <div className="ach-edu-school">{ed.school} · <span className="mono">{ed.period}</span></div>
                <span className="badge">{ed.gpa}</span>
              </div>
            ))}
          </article>

          {/* Tesis */}
          <article className="card ach-card">
            <h3 className="ach-title"><FileText size={18} /> Riset & Tesis</h3>
            {profile.theses.map((t) => (
              <div key={t.title} className="ach-thesis">
                <span className="tag mono">{t.level}</span>
                <div className="ach-thesis-title">{t.title}</div>
                <p className="ach-thesis-desc">{t.desc}</p>
              </div>
            ))}
          </article>

          {/* Sertifikasi */}
          <article className="card ach-card">
            <h3 className="ach-title"><Award size={18} /> Sertifikasi</h3>
            <ul className="ach-list">
              {profile.certifications.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </article>

          {/* Highlight teknis */}
          <article className="card ach-card">
            <h3 className="ach-title"><Sparkles size={18} /> Signature Teknis</h3>
            <ul className="ach-list">
              {profile.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
