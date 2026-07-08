import MiniPrompt from "../components/MiniPrompt";
import { chapters } from "../data/experience";

export default function Experience() {
  return (
    <section className="page active" data-page="experience">
      <div className="wrap">
        <div className="sec-head stagger"><div className="sec-idx">02</div><h2 className="sec-title">Trajectory<span className="sub">// satu cerita, empat babak</span></h2></div>
        <MiniPrompt cmd="git log --author=feri --reverse" out="4 commits" />
        <p className="story-intro stagger">Ceritanya dimulai di lab instrumentasi — <em>sensor, PID, sinyal</em> — dan mengalir menuju sistem AI yang menopang keputusan <em>high-stakes</em>. Tiap babak menambah satu instinct yang terbawa ke babak berikutnya.</p>
        <div className="stagger">
          {chapters.map((c) => (
            <div className="chapter" key={c.babak}>
              <div className="rail"><div className="node" /><div className="yr">{c.year}</div></div>
              <div className="body">
                <div className="ch-num">babak <span className="b">{c.babak}</span> — {c.phase}</div>
                <div className="ch-role">{c.role}</div>
                <div className="ch-org" dangerouslySetInnerHTML={{ __html: c.org.replace(/·/g, '<span class="sep">·</span>') }} />
                <p className="ch-narr" dangerouslySetInnerHTML={{ __html: c.narr }} />
                <div className="beats">
                  {c.beats.map((b, i) => (
                    <div className="beat" key={i}><div className="m">{b.m}</div><div className="t" dangerouslySetInnerHTML={{ __html: b.t }} /></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
