import { useEffect, useState } from "react";

/** Typewriter command per page. Reduced-motion → tampil instan. */
export default function MiniPrompt({ cmd, out }: { cmd: string; out: string }) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (reduce) { setTyped(cmd); return; }
    setTyped("");
    let i = 0;
    const start = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setTyped(cmd.slice(0, i));
        if (i >= cmd.length) clearInterval(iv);
      }, 32);
    }, 300);
    return () => clearTimeout(start);
  }, [cmd]);

  return (
    <div className="mini-prompt stagger">
      <span className="p">➜ ~</span>
      <span className="cmd">{typed}</span>
      <span className="cur" />
      <span className="out">{out}</span>
    </div>
  );
}
