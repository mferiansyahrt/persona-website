import { create } from "zustand";
import type { AgentManifest, ChatMessage } from "./types";

/* ---- Theme ---- */
type Theme = "dark" | "light";
function initialTheme(): Theme {
  const saved = localStorage.getItem("theme") as Theme | null;
  if (saved) return saved;
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}
interface ThemeState {
  theme: Theme;
  toggle: () => void;
}
export const useTheme = create<ThemeState>((set, get) => ({
  theme: initialTheme(),
  toggle: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
    set({ theme: next });
  },
}));

/* ---- Session ---- */
function getSessionId(): string {
  let id = localStorage.getItem("sessionId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("sessionId", id);
  }
  return id;
}

/* ---- Chat ---- */
interface ChatState {
  sessionId: string;
  messages: ChatMessage[];
  streaming: boolean;
  lastPrompt: string;
  add: (m: ChatMessage) => void;
  update: (id: string, patch: Partial<ChatMessage>) => void;
  appendDelta: (id: string, delta: string) => void;
  remove: (id: string) => void;
  setStreaming: (v: boolean) => void;
  setMessages: (m: ChatMessage[]) => void;
  setLastPrompt: (p: string) => void;
  resetSession: () => void;
}
export const useChat = create<ChatState>((set) => ({
  sessionId: getSessionId(),
  messages: [],
  streaming: false,
  lastPrompt: "",
  add: (m) => set((s) => ({ messages: [...s.messages, m] })),
  update: (id, patch) =>
    set((s) => ({ messages: s.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
  appendDelta: (id, delta) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, content: m.content + delta } : m
      ),
    })),
  remove: (id) => set((s) => ({ messages: s.messages.filter((m) => m.id !== id) })),
  setStreaming: (v) => set({ streaming: v }),
  setMessages: (m) => set({ messages: m }),
  setLastPrompt: (p) => set({ lastPrompt: p }),
  resetSession: () => {
    const id = crypto.randomUUID();
    localStorage.setItem("sessionId", id);
    set({ sessionId: id, messages: [], streaming: false, lastPrompt: "" });
  },
}));

/* ---- UI (chat bubble open/close) ---- */
interface UIState {
  chatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}
export const useUI = create<UIState>((set) => ({
  chatOpen: false,
  openChat: () => set({ chatOpen: true }),
  closeChat: () => set({ chatOpen: false }),
  toggleChat: () => set((s) => ({ chatOpen: !s.chatOpen })),
}));

/* ---- System (backend health / cold-start) ---- */
type Health = "unknown" | "up" | "down" | "waking";
interface SystemState {
  health: Health;
  setHealth: (h: Health) => void;
}
export const useSystem = create<SystemState>((set) => ({
  health: "unknown",
  setHealth: (h) => set({ health: h }),
}));

/* ---- Agents manifest ---- */
interface AgentsState {
  agents: AgentManifest[];
  setAgents: (a: AgentManifest[]) => void;
}
export const useAgents = create<AgentsState>((set) => ({
  agents: [],
  setAgents: (a) => set({ agents: a }),
}));
