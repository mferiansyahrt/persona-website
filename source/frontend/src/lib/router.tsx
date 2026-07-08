import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { PageId } from "../types";

const PAGES: PageId[] = ["about", "experience", "work", "record", "contact"];
const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion:reduce)").matches;

interface RouterCtx {
  current: PageId;
  go: (name: PageId) => void;
  label: PageId;
  playing: boolean;
}
const Ctx = createContext<RouterCtx | null>(null);
export const useRouter = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useRouter must be used within RouterProvider");
  return c;
};

function initial(): PageId {
  const h = (location.hash || "#about").slice(1) as PageId;
  return PAGES.includes(h) ? h : "about";
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<PageId>(initial);
  const [label, setLabel] = useState<PageId>(current);
  const [playing, setPlaying] = useState(false);
  const animating = useRef(false);

  const setActive = useCallback((name: PageId) => {
    setCurrent(name);
    window.scrollTo(0, 0);
  }, []);

  const go = useCallback((name: PageId, push = true) => {
    if (name === current || animating.current || !PAGES.includes(name)) return;
    if (push) history.pushState({ page: name }, "", "#" + name);
    if (reduce) { setActive(name); return; }
    animating.current = true;
    setLabel(name);
    setPlaying(false);
    // restart animation
    requestAnimationFrame(() => setPlaying(true));
    setTimeout(() => setActive(name), 430);
    setTimeout(() => { setPlaying(false); animating.current = false; }, 900);
  }, [current, setActive]);

  useEffect(() => {
    const onPop = () => {
      const p = (location.hash || "#about").slice(1) as PageId;
      setActive(PAGES.includes(p) ? p : "about");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [setActive]);

  return <Ctx.Provider value={{ current, go, label, playing }}>{children}</Ctx.Provider>;
}
