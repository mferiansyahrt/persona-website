export default function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="section-header">
      <span className="eyebrow mono">{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
    </div>
  );
}
