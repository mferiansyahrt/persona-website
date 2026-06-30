import { useEffect } from "react";

/** Efek magnetic ringan: tombol .btn-accent sedikit menarik ke kursor.
 * Global delegation, hover-only, reset saat keluar. Skip jika reduce-motion. */
export function useMagnetic() {
  useEffect(() => {
    const hasHover = window.matchMedia?.("(hover: hover)").matches;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!hasHover || reduce) return;

    let active: HTMLElement | null = null;
    function reset() {
      if (active) { active.style.transform = ""; active = null; }
    }
    function onMove(e: MouseEvent) {
      const btn = (e.target as HTMLElement)?.closest?.(".btn-accent") as HTMLElement | null;
      if (!btn) { reset(); return; }
      active = btn;
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.3}px)`;
    }
    document.addEventListener("mousemove", onMove, { passive: true });
    return () => { document.removeEventListener("mousemove", onMove); reset(); };
  }, []);
}
