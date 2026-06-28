import type { AgentManifest } from "../types";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function fetchAgents(): Promise<AgentManifest[]> {
  const r = await fetch(`${BASE}/api/agents`);
  if (!r.ok) throw new Error("gagal memuat agents");
  return r.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const r = await fetch(`${BASE}/api/health`, { signal: AbortSignal.timeout(4000) });
    return r.ok;
  } catch {
    return false;
  }
}

export async function fetchHistory(sessionId: string) {
  const r = await fetch(`${BASE}/api/sessions/${sessionId}/messages`);
  if (!r.ok) return { messages: [] };
  return r.json();
}

export interface SSEHandlers {
  onToken?: (delta: string) => void;
  onCitation?: (c: { n: number; file: string; label?: string }) => void;
  onDone?: (d: { model?: string; content?: string; citations?: any[] }) => void;
  onError?: (e: { code?: string; message?: string }) => void;
}

/** Stream agent via SSE (GET + query params). Mengembalikan fungsi abort. */
export function streamAgent(
  agentId: string,
  params: Record<string, string>,
  handlers: SSEHandlers
): () => void {
  const controller = new AbortController();
  const qs = new URLSearchParams(params).toString();
  const url = `${BASE}/api/agents/${agentId}/stream?${qs}`;

  (async () => {
    try {
      const resp = await fetch(url, {
        headers: { Accept: "text/event-stream" },
        signal: controller.signal,
      });
      if (!resp.ok || !resp.body) {
        handlers.onError?.({ message: `HTTP ${resp.status}` });
        return;
      }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        // pisah per event (dipisah baris kosong)
        const parts = buf.split("\n\n");
        buf = parts.pop() || "";
        for (const part of parts) {
          const ev = parseSSE(part);
          if (!ev) continue;
          dispatch(ev.event, ev.data, handlers);
        }
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") handlers.onError?.({ message: String(e?.message || e) });
    }
  })();

  return () => controller.abort();
}

function parseSSE(block: string): { event: string; data: any } | null {
  let event = "message";
  let data = "";
  for (const line of block.split("\n")) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) data += line.slice(5).trim();
  }
  if (!data) return null;
  try {
    return { event, data: JSON.parse(data) };
  } catch {
    return null;
  }
}

function dispatch(event: string, data: any, h: SSEHandlers) {
  if (event === "token") h.onToken?.(data.delta);
  else if (event === "citation") h.onCitation?.(data);
  else if (event === "done") h.onDone?.(data);
  else if (event === "error") h.onError?.(data);
}
