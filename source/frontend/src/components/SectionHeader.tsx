import Reveal from "./Reveal";

export default function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <Reveal>
      <div className="section-header">
        <span className="eyebrow mono">{eyebrow}</span>
        <h2 className="section-title">{title}</h2>
      </div>
    </Reveal>
  );
}
