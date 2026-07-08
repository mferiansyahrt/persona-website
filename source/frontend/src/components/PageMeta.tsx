import { useRouter } from "../lib/router";
import type { PageId } from "../types";

const ORDER: PageId[] = ["about", "experience", "work", "record", "contact"];

export default function PageMeta() {
  const { current } = useRouter();
  const idx = String(ORDER.indexOf(current) + 1).padStart(2, "0");
  return (
    <div className="page-meta">
      <span className="cur">{idx}</span> / 05 — {current.toUpperCase()}
    </div>
  );
}
