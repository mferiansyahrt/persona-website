export type PageId = "about" | "experience" | "work" | "record" | "contact";

export type ProjectCat =
  | "civic" | "defense" | "media" | "osint" | "data" | "docs" | "crisis" | "research";

export interface Project {
  id: string;          // slug → /projects/<id>.html
  t: string;           // title
  cat: ProjectCat;
  ag: number;          // agents
  kick: string;        // one-line kicker
  d: string;           // description
}

export interface Chapter {
  babak: string;       // "04"
  phase: string;       // "produksi AI"
  year: string;        // "2025 — NOW"
  role: string;
  org: string;
  narr: string;        // may contain <b>
  beats: { m: string; t: string }[];
}

export interface Citation { n: number; file: string; label?: string }
export type MsgStatus = "streaming" | "final" | "failed";
export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;     // markdown
  status: MsgStatus;
  citations?: Citation[];
  model?: string;
}

export interface AgentManifest {
  id: string;
  label: { id: string; en: string };
  description: string;
  mode: "chat" | "task";
  streaming: boolean;
  input_schema?: Record<string, unknown> | null;
}

export type TLineCls =
  | "tout" | "terr" | "tsuccess" | "";
export interface TerminalLine { id: string; html: string; cls?: TLineCls }
