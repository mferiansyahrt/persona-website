import { useRouter } from "../lib/router";

export default function Curtain() {
  const { playing, label } = useRouter();
  return (
    <div className={`curtain ${playing ? "play" : ""}`} aria-hidden="true">
      <div className="slab" /><div className="slab" /><div className="slab" /><div className="slab" /><div className="slab" />
      <div className="label">{label}</div>
    </div>
  );
}
