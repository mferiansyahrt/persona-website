import { useEffect } from "react";

/** Global spotlight: cahaya radial mengikuti kursor di atas elemen .card.
 * Satu listener (event delegation), passive, hover-only via CSS. */
export function useCardSpotlight() {
  useEffect(() => {
    const hasHover = window.matchMedia?.("(hover: hover)").matches;
    if (!hasHover) return;

    function onMove(e: MouseEvent) {
      const card = (e.target as HTMLElement)?.closest?.(".card") as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    }
    document.addEventListener("mousemove", onMove, { passive: true });
    return () => document.removeEventListener("mousemove", onMove);
  }, []);
}
