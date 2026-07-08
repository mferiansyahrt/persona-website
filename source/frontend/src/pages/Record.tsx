import { useEffect, useState } from "react";
import MiniPrompt from "../components/MiniPrompt";
import { useChat } from "../lib/chat";

const CHECK = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>;

const CERTS: [string, string][] = [
  ["Python — Data Science", "Sanbercode"],
  ["Advance Python — Data Science", "Sanbercode"],
  ["Complete SQL Bootcamp 2022", "Udemy"],
  ["TensorFlow 2.0: Deep Learning & AI", "Udemy"],
  ["Deep Learning Bootcamp", "DSC Universitas Indonesia"],
];

export default function Record() {
  const { runAgent } = useChat();
  const [filled, setFilled] = useState(false);
  useEffect(() => { const t = setTimeout(() => setFilled(true), 150); return () => clearTimeout(t); }, []);

  function pitch() {
    const jd = window.prompt("Tempel job description / kebutuhan Anda:");
    if (jd && jd.trim()) runAgent("tailored_pitch", { job_description: jd.trim(), lang: "id" }, "Pitch Sesuai Kebutuhan");
  }

  return (
    <section className="page active" data-page="record">
      <div className="wrap">
        <div className="sec-head stagger"><div className="sec-idx">04</div><h2 className="sec-title">The Record<span className="sub">// pendidikan · riset · prinsip</span></h2></div>
        <MiniPrompt cmd="cat education.json research.md certs.txt" out="ok" />

        <div className="rec-grid stagger">
          <div className="rec-card">
            <div className="glow" />
            <div className="rec-label">Pendidikan <span className="ln" /></div>
            <div className="deg-block">
              <div className="dh"><div className="lvl">M.Sc. Computer Science — AI</div><div className="yr">2023—2025</div></div>
              <div className="inst">Universitas Indonesia</div>
              <div className="gpa-bar"><div className="track"><div className="fill" style={{ width: filled ? "92.5%" : "0%" }} /></div><div className="val">3.70 / 4.00</div></div>
            </div>
            <div className="deg-block">
              <div className="dh"><div className="lvl">B.Sc. System &amp; Instrumentation Physics</div><div className="yr">2018—2022</div></div>
              <div className="inst">Universitas Indonesia · Cumlaude</div>
              <div className="gpa-bar"><div className="track"><div className="fill" style={{ width: filled ? "91.25%" : "0%" }} /></div><div className="val">3.65 / 4.00</div></div>
            </div>
          </div>
          <div className="rec-card">
            <div className="glow" />
            <div className="rec-label">Riset &amp; Tesis <span className="ln" /></div>
            <div className="thesis-card"><span className="tag">TESIS S2</span><div className="t">Super-Resolution CycleGAN — Day-to-Night Image Translation</div><p>Meningkatkan resolusi citra malam sintetis pada terjemahan citra siang→malam berbasis SR-CycleGAN.</p></div>
            <div className="thesis-card"><span className="tag">SKRIPSI S1</span><div className="t">Hyperspectral Reconstruction dari RGB — CNN Dense Block</div><p>Rekonstruksi citra hiperspektral dari RGB memakai Dense Block — studi kasus prediksi karotenoid daun.</p></div>
          </div>
        </div>

        <div className="rec-card stagger" style={{ marginBottom: 15 }}>
          <div className="rec-label">Sertifikasi <span className="ln" /></div>
          <div className="cert-grid">
            {CERTS.map(([c, src]) => (
              <div className="cert-item" key={c}><span className="ic">{CHECK}</span><span className="ct">{c}<span className="src">{src}</span></span></div>
            ))}
          </div>
        </div>

        <div className="sig-full stagger">
          <div className="rec-label">Signature Teknis <span className="ln" /></div>
          <div className="sig-list">
            <div className="sig-item"><div className="sn">01</div><h5>Deterministic Scoring</h5><p>LLM dipakai untuk narasi, tapi skor final dihitung di kode — auditable &amp; reproducible.</p></div>
            <div className="sig-item"><div className="sn">02</div><h5>Multi-Model Fallback</h5><p>Rantai fallback antar-provider: OpenAI / Claude / Gemini / OpenRouter / self-hosted vLLM.</p></div>
            <div className="sig-item"><div className="sn">03</div><h5>Degraded-Safe</h5><p>Arsitektur yang tetap jalan &amp; aman saat salah satu komponen gagal.</p></div>
          </div>
        </div>

        <div className="agent-box stagger">
          <div className="agent-top"><div className="k">✦ Ask the Agent</div><h3>Minta AI lakukan tugas spesifik.</h3></div>
          <div className="agent-cards">
            <div className="agent-card"><div className="h">Ringkasan Eksekutif</div><p>Ringkasan padat tentang Feri: siapa, kekuatan, project unggulan, dan fit.</p><button className="btn btn-p" onClick={() => runAgent("executive_summary", { lang: "id" }, "Ringkasan Eksekutif")}>Jalankan →</button></div>
            <div className="agent-card"><div className="h">Pitch Sesuai Kebutuhan</div><p>Tempel job description / kebutuhan → kecocokan + pitch siap pakai.</p><button className="btn btn-p" onClick={pitch}>Jalankan →</button></div>
          </div>
        </div>
      </div>
    </section>
  );
}
