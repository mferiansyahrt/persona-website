import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { NAV_SECTIONS, profile } from "../data/profile";
import { useScrollSpy } from "../lib/useScrollSpy";

export default function Navbar() {
  const ids = NAV_SECTIONS.map((s) => s.id);
  const active = useScrollSpy(ids);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
        setScrolled(h.scrollTop > 24);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  function go(e: React.MouseEvent, id: string) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav className={`navbar ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="container navbar-inner">
        <a href="#about" className="brand" onClick={(e) => go(e, "about")}>
          {profile.name}
        </a>
        <div className="nav-links">
          {NAV_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`nav-link ${active === s.id ? "nav-active" : ""}`}
              onClick={(e) => go(e, s.id)}
            >
              {s.label}
            </a>
          ))}
          <ThemeToggle />
        </div>
      </div>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
    </nav>
  );
}
