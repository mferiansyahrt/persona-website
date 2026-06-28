export type Domain =
  | "civic" | "defense" | "media" | "osint" | "data"
  | "geospatial" | "infra" | "docs" | "crisis" | "research";

export interface Project {
  id: string;
  name: string;
  domain: Domain;
  agents: number;
  tagline: string;
  summary: string;
  stack: string[];
  knowledgeFile: string;
}

export interface Citation {
  n: number;
  file: string;
  label?: string;
}

export type MsgStatus = "pending" | "streaming" | "final" | "failed";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
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
