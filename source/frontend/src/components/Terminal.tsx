import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "../lib/router";
import type { PageId, TerminalLine } from "../types";

export interface TerminalHandle { type: (cmd: string) => void }

let uid = 0;
const nid = () => `tl-${++uid}`;

const PROJECTS: [string, string][] = [
  ["NETRA", "defense · 28 agents"], ["Command AI", "civic · 12 agents"],
  ["Deep Account Profiling", "osint · 24 agents"], ["Cognitive Warfare", "media · 13 agents"],
  ["Campaign Alert Agent", "crisis · 14 agents"], ["VERIDOCS", "docs · 3 agents"],
];

const CMDS: Record<string, () => string> = {
  help: () => `<span class="tout">perintah tersedia:
  <span class="k">whoami</span>      siapa Feri
  <span class="k">cat about</span>   baca profil lengkap
  <span class="k">ls projects</span> daftar project
  <span class="k">stack</span>       tech stack
  <span class="k">open</span> <span class="dim">[work|experience|record|contact]</span>
  <span class="k">cat resume</span>  unduh CV
  <span class="k">contact</span>     info kontak
  <span class="k">clear</span>       bersihkan layar</span>`,
  whoami: () => `<span class="tout"><span class="a">Muhammad Feriansyah Raihan Taufiq</span>
AI/ML Engineer · fisika instrumentasi × ilmu komputer (UI)
merancang sistem LLM multi-agent untuk produksi high-stakes.</span>`,
  "cat about": () => `<span class="tout">Latar ganda: <span class="k">fisika instrumentasi</span> & <span class="k">ilmu komputer (AI)</span>, UI.
Dari sensor & sistem kontrol → arsitektur LLM multi-agent.
Di PT. Indonesia Indicator: multi-agent, RAG, tooling <span class="c">MCP</span>.
Prinsip: <span class="a">keandalan produksi > demo memukau</span>.</span>`,
  "ls projects": () => {
    let s = '<span class="tout">';
    PROJECTS.forEach((p, i) => { s += `<span class="k">${String(i + 1).padStart(2, "0")}</span>  <span class="a">${p[0].padEnd(24)}</span><span class="dim">${p[1]}</span>\n`; });
    s += `\n<span class="dim">... +6 lagi — </span><span class="k">open work</span><span class="dim"> untuk semua.</span></span>`;
    return s;
  },
  stack: () => `<span class="tout"><span class="k">lang</span>   Python · asyncio
<span class="k">ai</span>     Multi-Agent · MCP · RAG · Claude/GPT/Gemini · vLLM
<span class="k">infra</span>  FastAPI · PostgreSQL · Qdrant · Elasticsearch · Kafka
<span class="k">front</span>  React · Three.js · TensorFlow</span>`,
  contact: () => `<span class="tout"><span class="k">email</span>     muhammadferiansyahraihan@gmail.com
<span class="k">whatsapp</span>  +62 819-9967-9588
<span class="k">linkedin</span>  Muhammad Feriansyah Raihan Taufiq</span>`,
};
const ALIAS: Record<string, string> = { about: "cat about", ls: "ls projects" };

const BOOT: [string, number][] = [
  [`<span class="tout dim">booting feri.portfolio v5 ...</span>`, 180],
  [`<span class="tout"><span class="c">[ ok ]</span> loading profile.json</span>`, 240],
  [`<span class="tout"><span class="c">[ ok ]</span> mounting /projects <span class="dim">(12 systems)</span></span>`, 240],
  [`<span class="tout"><span class="c">[ ok ]</span> agents online <span class="k">100+</span></span>`, 240],
  [`<span class="tsuccess">✓ ready.</span> <span class="tout dim">ketik 'help' untuk mulai.</span>`, 280],
];

const Terminal = forwardRef<TerminalHandle>(function Terminal(_props, ref) {
  const { go } = useRouter();
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState("");
  const hist = useRef<string[]>([]);
  const hIdx = useRef(-1);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const push = (html: string) => setLines((l) => [...l, { id: nid(), html }]);
  const scroll = () => { const b = bodyRef.current; if (b) b.scrollTop = b.scrollHeight; };

  useEffect(() => { scroll(); }, [lines, showInput]);

  // boot
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (reduce) { setLines(BOOT.map(([h]) => ({ id: nid(), html: h }))); setShowInput(true); return; }
    let i = 0; let timer: number;
    const step = () => {
      if (i < BOOT.length) { push(BOOT[i][0]); timer = window.setTimeout(step, BOOT[i][1]); i++; }
      else setShowInput(true);
    };
    timer = window.setTimeout(step, 500);
    return () => clearTimeout(timer);
  }, []);

  function run(raw: string) {
    const cmd = raw.trim(); if (!cmd) return;
    push(`<span class="tprompt">➜</span> <span class="tpath">~/portfolio</span> <span class="tcmd">${escapeHtml(cmd)}</span>`);
    hist.current.push(cmd); hIdx.current = hist.current.length;
    const low = cmd.toLowerCase();

    if (low.startsWith("open ")) {
      const t = low.slice(5).trim();
      const map: Record<string, PageId> = { work: "work", projects: "work", project: "work", experience: "experience", exp: "experience", record: "record", contact: "contact", kontak: "contact" };
      if (map[t]) { push(`<span class="tsuccess">→ membuka /${map[t]} ...</span>`); setTimeout(() => go(map[t]), 450); }
      else push(`<span class="terr">open: tujuan tidak dikenal '${escapeHtml(t)}'</span>`);
      return;
    }
    if (low === "clear") { setLines([]); return; }
    if (low === "cat resume") {
      push(`<span class="tsuccess">↓ mengunduh resume.pdf ...</span>`);
      const a = document.createElement("a"); a.href = "/resume.pdf"; a.download = "M_Feriansyah_Resume.pdf"; a.click();
      return;
    }
    const key = ALIAS[low] || low;
    if (CMDS[key]) { push(CMDS[key]()); return; }
    push(`<span class="terr">command not found: ${escapeHtml(cmd)}</span> <span class="tout dim">— ketik 'help'</span>`);
  }

  useImperativeHandle(ref, () => ({
    type(cmd: string) {
      const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
      inputRef.current?.focus();
      if (reduce) { run(cmd); setValue(""); return; }
      let i = 0; setValue("");
      const iv = setInterval(() => { i++; setValue(cmd.slice(0, i)); if (i >= cmd.length) { clearInterval(iv); setTimeout(() => { run(cmd); setValue(""); }, 250); } }, 45);
    },
  }));

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { run(value); setValue(""); }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (hIdx.current > 0) { hIdx.current--; setValue(hist.current[hIdx.current] || ""); } }
    else if (e.key === "ArrowDown") { e.preventDefault(); if (hIdx.current < hist.current.length - 1) { hIdx.current++; setValue(hist.current[hIdx.current] || ""); } else { hIdx.current = hist.current.length; setValue(""); } }
  }

  return (
    <div className="term">
      <div className="term-bar">
        <span className="tdot r" /><span className="tdot y" /><span className="tdot g" />
        <span className="term-title">feri@production: ~/portfolio — zsh</span>
        <span className="term-hint">ketik <b>help</b></span>
      </div>
      <div className="term-body" ref={bodyRef} onClick={() => inputRef.current?.focus()}>
        {lines.map((l) => <div key={l.id} className="tline" dangerouslySetInnerHTML={{ __html: l.html }} />)}
        {showInput && (
          <div className="input-line">
            <span className="tprompt">➜</span><span className="tpath">~/portfolio</span>
            <input ref={inputRef} className="term-input" value={value} spellCheck={false} autoComplete="off"
              onChange={(e) => setValue(e.target.value)} onKeyDown={onKey} />
          </div>
        )}
      </div>
    </div>
  );
});

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
}

export default Terminal;
