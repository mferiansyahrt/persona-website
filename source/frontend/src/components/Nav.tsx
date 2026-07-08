import { useRouter } from "../lib/router";
import type { PageId } from "../types";

const LINKS: { id: PageId; num: string; label: string }[] = [
  { id: "about", num: "01", label: "About" },
  { id: "experience", num: "02", label: "Experience" },
  { id: "work", num: "03", label: "Work" },
  { id: "record", num: "04", label: "Record" },
  { id: "contact", num: "05", label: "Contact" },
];

export default function Nav() {
  const { current, go } = useRouter();
  return (
    <nav>
      <div className="nav-in">
        <button className="logo" onClick={() => go("about")} aria-label="ke About">
          <span className="d" />feri<b>@</b>prod
        </button>
        <div className="nav-links">
          {LINKS.map((l) => (
            <a key={l.id} className={current === l.id ? "active" : ""} onClick={() => go(l.id)}>
              <span className="num">{l.num}</span>{l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
