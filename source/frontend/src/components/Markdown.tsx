import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renderer markdown konsisten (GFM: tabel, strikethrough, dll) + styling .md. */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
