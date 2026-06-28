import { useRef } from "react";
import { streamAgent, checkHealth } from "./api";
import { useChat, useSystem } from "../store";
import type { Citation } from "../types";

/** Hook untuk mengirim pesan chat (talk_to_data) via SSE + retry + cold-start. */
export function useSendMessage() {
  const { sessionId, messages, add, appendDelta, update, remove, setStreaming, setLastPrompt } =
    useChat();
  const abortRef = useRef<null | (() => void)>(null);

  function stop() {
    abortRef.current?.();
    setStreaming(false);
  }

  async function send(text: string) {
    const q = text.trim();
    if (!q) return;
    setLastPrompt(q);

    add({ id: crypto.randomUUID(), role: "user", content: q, status: "final" });

    const aiId = crypto.randomUUID();
    add({ id: aiId, role: "assistant", content: "", status: "streaming" });
    setStreaming(true);

    // cold-start: cek backend, kalau belum siap tandai "waking" untuk UX ramah
    useSystem.getState().setHealth("waking");
    const ok = await checkHealth();
    useSystem.getState().setHealth(ok ? "up" : "down");

    const citations: Citation[] = [];
    abortRef.current = streamAgent(
      "talk_to_data",
      { q, session_id: sessionId },
      {
        onToken: (delta) => appendDelta(aiId, delta),
        onCitation: (c) => citations.push(c),
        onDone: (d) => {
          update(aiId, {
            status: "final",
            model: d.model,
            citations: (d.citations as Citation[] | undefined) ?? citations,
          });
          setStreaming(false);
        },
        onError: (e) => {
          update(aiId, {
            status: "failed",
            content: e.message ? `⚠️ ${e.message}` : "⚠️ Gagal mendapat jawaban.",
          });
          setStreaming(false);
        },
      }
    );
  }

  /** Hapus pesan AI yang gagal lalu kirim ulang prompt terakhir. */
  function retry() {
    const failed = [...messages].reverse().find((m) => m.role === "assistant" && m.status === "failed");
    if (failed) remove(failed.id);
    // hapus juga pesan user terakhir agar tidak dobel saat send menambah lagi
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const prompt = useChat.getState().lastPrompt;
    if (lastUser) remove(lastUser.id);
    if (prompt) send(prompt);
  }

  return { send, stop, retry };
}
