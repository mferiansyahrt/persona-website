import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { streamAgent } from "./api";
import type { ChatMessage, Citation } from "../types";

function sid(): string {
  let id = localStorage.getItem("sessionId");
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("sessionId", id); }
  return id;
}

const GREETING: ChatMessage = {
  id: "greet", role: "ai", status: "final",
  content: "Halo! 👋 Saya asisten AI di portfolio Feri. Tanya apa saja soal **pengalaman, project, atau keahlian teknis**-nya.",
};

interface ChatCtx {
  open: boolean;
  expanded: boolean;
  streaming: boolean;
  messages: ChatMessage[];
  openPanel: () => void;
  closePanel: () => void;
  toggleExpand: () => void;
  clear: () => void;
  ask: (text: string) => void;
  runAgent: (agentId: string, payload: Record<string, string>, userLabel: string) => void;
  stop: () => void;
}
const Ctx = createContext<ChatCtx | null>(null);
export const useChat = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useChat must be used within ChatProvider");
  return c;
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const sessionId = useRef(sid()).current;
  const abortRef = useRef<null | (() => void)>(null);

  const openPanel = useCallback(() => setOpen(true), []);
  const closePanel = useCallback(() => setOpen(false), []);
  const toggleExpand = useCallback(() => setExpanded((e) => !e), []);
  const clear = useCallback(() => {
    localStorage.setItem("sessionId", crypto.randomUUID());
    setMessages([GREETING]);
  }, []);
  const stop = useCallback(() => { abortRef.current?.(); setStreaming(false); }, []);

  const patch = useCallback((id: string, up: Partial<ChatMessage>) => {
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, ...up } : x)));
  }, []);

  const runStream = useCallback((agentId: string, params: Record<string, string>) => {
    const aiId = crypto.randomUUID();
    setMessages((m) => [...m, { id: aiId, role: "ai", content: "", status: "streaming" }]);
    setStreaming(true);
    const citations: Citation[] = [];
    abortRef.current = streamAgent(
      agentId,
      { ...params, session_id: sessionId },
      {
        onToken: (delta) => setMessages((m) => m.map((x) => (x.id === aiId ? { ...x, content: x.content + delta } : x))),
        onCitation: (c) => citations.push(c),
        onDone: (d) => {
          patch(aiId, { status: "final", model: d.model, citations: (d.citations as Citation[]) ?? citations });
          setStreaming(false);
        },
        onError: (e) => {
          patch(aiId, { status: "failed", content: e.message ? `⚠️ ${e.message}` : "⚠️ Terjadi kesalahan." });
          setStreaming(false);
        },
      }
    );
  }, [patch, sessionId]);

  const ask = useCallback((text: string) => {
    const q = text.trim();
    if (!q || streaming) return;
    setOpen(true);
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: q, status: "final" }]);
    runStream("talk_to_data", { q });
  }, [runStream, streaming]);

  const runAgent = useCallback((agentId: string, payload: Record<string, string>, userLabel: string) => {
    if (streaming) return;
    setOpen(true);
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: `▶ ${userLabel}`, status: "final" }]);
    runStream(agentId, payload);
  }, [runStream, streaming]);

  return (
    <Ctx.Provider value={{ open, expanded, streaming, messages, openPanel, closePanel, toggleExpand, clear, ask, runAgent, stop }}>
      {children}
    </Ctx.Provider>
  );
}
