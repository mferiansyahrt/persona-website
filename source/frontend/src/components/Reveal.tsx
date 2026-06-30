import { cloneElement, useEffect, useRef, type ReactElement } from "react";

/** Bungkus 1 elemen DOM → animasikan fade+slide-up saat masuk viewport.
 * Tanpa menambah node DOM (pakai cloneElement). Hormati prefers-reduced-motion (via CSS). */
export default function Reveal({
  children,
  delay = 0,
}: {
  children: ReactElement;
  delay?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("reveal-in");
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("reveal-in");
            obs.unobserve(el);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return cloneElement(children, {
    ref,
    className: `${(children.props as any).className ?? ""} reveal`.trim(),
    style: { ...(children.props as any).style, "--rd": `${delay}ms` },
  } as any);
}
