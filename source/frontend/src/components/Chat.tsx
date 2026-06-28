import { useEffect, useRef, useState } from "react";
import Markdown from "./Markdown";
import { Send, Square, FileText, Cpu, RotateCcw } from "lucide-react";
import { useChat, useSystem } from "../store";
import { useSendMessage } from "../lib/useChat";

const CHIPS = [
  "Apa pengalaman Feri dengan multi-agent systems?",
  "Project mana yang cocok untuk role fintech?",
  "Ringkas latar belakang Feri dalam 3 poin",
  "Stack teknologi yang paling dikuasai?",
];

export default function Chat({ embedded = false }: { embedded?: boolean }) {
  const { messages, streaming } = useChat();
  const { health } = useSystem();
  const { send, stop, retry } = useSendMessage();
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function submit() {
    if (!input.trim() || streaming) return;
    send(input);
    setInput("");
  }

  const hasMessages = messages.length > 0;

  return (
    <div className={`chat ${embedded ? "chat-embedded" : ""}`}>
      <div className="chat-messages" aria-live="polite">
          {messages.map((m) => (
            <div key={m.id} className={`bubble bubble-${m.role} ${m.status === "failed" ? "bubble-failed" : ""}`}>
              <div className="bubble-body">
                {m.role === "assistant" && m.status === "streaming" && !m.content && (
                  <span className="thinking">
                    AI sedang berpikir
                    {health === "waking" && " — server mungkin sedang bangun tidur ⏳"}
                    <span className="caret">▌</span>
                  </span>
                )}
                {m.content && <Markdown>{m.content}</Markdown>}
                {m.status === "streaming" && m.content && <span className="caret">▌</span>}
              </div>
              {m.role === "assistant" && m.citations && m.citations.length > 0 && (
                <div className="citations">
                  <span className="cit-label"><FileText size={13} /> Sumber:</span>
                  {m.citations.map((c) => (
                    <span key={c.n} className="cit-chip">[{c.n}] {c.file}</span>
                  ))}
                </div>
              )}
              {m.role === "assistant" && m.model && m.status === "final" && (
                <div className="model-badge"><Cpu size={12} /> {m.model}</div>
              )}
              {m.role === "assistant" && m.status === "failed" && (
                <button className="btn-retry" onClick={retry}>
                  <RotateCcw size={14} /> Coba lagi
                </button>
              )}
            </div>
          ))}
          <div ref={endRef} />
      </div>

      {!hasMessages && (
        <div className="chips">
          {CHIPS.map((c) => (
            <button key={c} className="chip" onClick={() => send(c)}>{c}</button>
          ))}
        </div>
      )}

      <div className="composer">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
          }}
          placeholder="Tanya apa pun tentang Feri..."
          rows={1}
        />
        {streaming ? (
          <button className="btn-stop" onClick={stop} aria-label="Stop"><Square size={16} /></button>
        ) : (
          <button className="btn-send" onClick={submit} aria-label="Kirim"><Send size={16} /></button>
        )}
      </div>
    </div>
  );
}
