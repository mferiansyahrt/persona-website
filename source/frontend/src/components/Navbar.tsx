import ThemeToggle from "./ThemeToggle";
import { NAV_SECTIONS, profile } from "../data/profile";
import { useScrollSpy } from "../lib/useScrollSpy";

export default function Navbar() {
  const ids = NAV_SECTIONS.map((s) => s.id);
  const active = useScrollSpy(ids);

  function go(e: React.MouseEvent, id: string) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav className="navbar">
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
    </nav>
  );
}
