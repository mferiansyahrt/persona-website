import { useEffect, useRef } from "react";
import type { PageId } from "../types";

interface Node { x: number; y: number; vx: number; vy: number; r: number; hot: boolean }
interface Dot { x: number; y: number; r: number; s: number; ph: number }

/** Ambient background canvas — scene berbeda per page. Mati saat reduced-motion. */
export default function BackgroundCanvas({ scene }: { scene: PageId }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<PageId>(scene);
  sceneRef.current = scene;

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
    const cv = ref.current;
    if (!cv || reduce) return;
    const bx = cv.getContext("2d")!;
    let W = 0, H = 0, DPR = 1, T = 0, raf = 0;
    let nodes: Node[] = [], dots: Dot[] = [];
    const mouse = { x: -9999, y: -9999 };

    function build() {
      nodes = [];
      const n = Math.min(64, Math.floor(innerWidth / 22));
      for (let i = 0; i < n; i++) nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .2 * DPR, vy: (Math.random() - .5) * .2 * DPR, r: (Math.random() * 1.4 + .5) * DPR, hot: Math.random() < .15 });
      dots = [];
      for (let i = 0; i < 46; i++) dots.push({ x: Math.random() * W, y: Math.random() * H, r: (Math.random() * 1.1 + .4) * DPR, s: (Math.random() * .3 + .1) * DPR, ph: Math.random() * 6 });
    }
    function rs() {
      DPR = Math.min(devicePixelRatio || 1, 2);
      W = cv!.width = innerWidth * DPR; H = cv!.height = innerHeight * DPR;
      cv!.style.width = innerWidth + "px"; cv!.style.height = innerHeight + "px";
      build();
    }
    const onMove = (e: MouseEvent) => { mouse.x = e.clientX * DPR; mouse.y = e.clientY * DPR; };
    const onLeave = () => { mouse.x = mouse.y = -9999; };

    function net() {
      const L = 124 * DPR, MR = 150 * DPR;
      for (const p of nodes) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
        if (d < MR) { const f = (1 - d / MR) * .5; p.vx -= dx / d * f * DPR * .1; p.vy -= dy / d * f * DPR * .1; }
        p.x += p.vx; p.y += p.vy; p.vx *= .99; p.vy *= .99;
        if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
        p.x = Math.max(0, Math.min(W, p.x)); p.y = Math.max(0, Math.min(H, p.y));
      }
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
        if (d < L) { const o = (1 - d / L) * .3, h = a.hot || b.hot; bx.strokeStyle = h ? "rgba(196,245,66," + (o * .75) + ")" : "rgba(90,100,112," + (o * .5) + ")"; bx.lineWidth = .5 * DPR; bx.beginPath(); bx.moveTo(a.x, a.y); bx.lineTo(b.x, b.y); bx.stroke(); }
      }
      for (const p of nodes) { bx.beginPath(); bx.arc(p.x, p.y, p.r, 0, 7); if (p.hot) { bx.fillStyle = "rgba(196,245,66,.75)"; bx.shadowColor = "rgba(196,245,66,.6)"; bx.shadowBlur = 6 * DPR; } else { bx.fillStyle = "rgba(130,140,150,.4)"; bx.shadowBlur = 0; } bx.fill(); }
      bx.shadowBlur = 0;
    }
    function flow() {
      for (let r = 0; r < 6; r++) {
        const y = H * (r + .5) / 6, amp = (12 + r * 4) * DPR, fr = .004 + r * .0008, sp = T * .4 * (r % 2 ? 1 : -1);
        bx.strokeStyle = "rgba(196,245,66," + (.045 + (r === 2 ? .05 : 0)) + ")"; bx.lineWidth = 1 * DPR; bx.beginPath();
        for (let x = 0; x <= W; x += 8 * DPR) { const yy = y + Math.sin(x * fr + sp) * amp * Math.sin(T * .3 + r); if (x === 0) bx.moveTo(x, yy); else bx.lineTo(x, yy); }
        bx.stroke();
      }
    }
    function grid() {
      const g = 56 * DPR, off = (T * 7 * DPR) % g; bx.strokeStyle = "rgba(60,70,82,.14)"; bx.lineWidth = 1;
      for (let x = -off; x < W; x += g) { bx.beginPath(); bx.moveTo(x, 0); bx.lineTo(x, H); bx.stroke(); }
      for (let y = -off; y < H; y += g) { bx.beginPath(); bx.moveTo(0, y); bx.lineTo(W, y); bx.stroke(); }
      for (const d of dots) { d.y -= d.s; if (d.y < 0) d.y = H; bx.beginPath(); bx.arc(d.x, d.y, d.r, 0, 7); bx.fillStyle = "rgba(196,245,66," + (.14 + Math.sin(T + d.ph) * .09) + ")"; bx.fill(); }
    }
    function contour() {
      const cx = W * .82, cy = H * .28;
      for (let i = 0; i < 9; i++) { const rad = (56 + i * 52) * DPR + Math.sin(T * .3 + i * .4) * 7 * DPR; bx.strokeStyle = "rgba(196,245,66," + (.055 - i * .005) + ")"; bx.lineWidth = 1 * DPR; bx.beginPath(); bx.arc(cx, cy, rad, 0, 7); bx.stroke(); }
    }
    function plex() {
      for (const d of dots) { d.x += d.s * .4; d.y -= d.s * .3; if (d.x > W) d.x = 0; if (d.y < 0) d.y = H; bx.beginPath(); bx.arc(d.x, d.y, d.r, 0, 7); bx.fillStyle = "rgba(130,140,150,.3)"; bx.fill(); }
      for (let i = 0; i < dots.length; i++) for (let j = i + 1; j < dots.length; j++) { const a = dots[i], b = dots[j], dd = Math.hypot(a.x - b.x, a.y - b.y); if (dd < 100 * DPR) { bx.strokeStyle = "rgba(196,245,66," + ((1 - dd / (100 * DPR)) * .07) + ")"; bx.lineWidth = .5 * DPR; bx.beginPath(); bx.moveTo(a.x, a.y); bx.lineTo(b.x, b.y); bx.stroke(); } }
    }
    function loop() {
      T += .016; bx.clearRect(0, 0, W, H);
      const s = sceneRef.current;
      if (s === "about") net(); else if (s === "experience") flow(); else if (s === "work") grid(); else if (s === "record") contour(); else plex();
      raf = requestAnimationFrame(loop);
    }

    rs();
    addEventListener("resize", rs);
    addEventListener("mousemove", onMove);
    addEventListener("mouseleave", onLeave);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", rs);
      removeEventListener("mousemove", onMove);
      removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas className="bgcanvas" ref={ref} aria-hidden="true" />;
}
