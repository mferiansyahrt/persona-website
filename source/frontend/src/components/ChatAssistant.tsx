import { useEffect, useRef, useState } from "react";
import Markdown from "./Markdown";
import { useChat } from "../lib/chat";

const SUGGEST = ["Project paling menantang?", "Kenapa deterministic scoring?", "Pengalaman multi-agent?"];

function Icon({ d, size = 17 }: { d: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />;
}

export default function ChatAssistant() {
  const { open, expanded, streaming, messages, openPanel, closePanel, toggleExpand, clear, ask, stop } = useChat();
  const [text, setText] = useState("");
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { const b = bodyRef.current; if (b) b.scrollTop = b.scrollHeight; }, [messages]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 300); }, [open]);

  function submit(q: string) { if (!q.trim() || streaming) return; ask(q); setText(""); }
  const showSuggest = messages.length <= 1;

  return (
    <>
      <button className={`chat-fab ${open ? "hide" : ""}`} onClick={openPanel} aria-label="Buka AI Assistant">
        <span className="badge" />
        <Icon size={24} d='<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' />
      </button>

      <div className={`chat-panel ${open ? "open" : ""} ${expanded ? "expanded" : ""}`} role="dialog" aria-label="AI Assistant">
        <div className="chat-head">
          <div className="who"><span className="dot" />AI Assistant</div>
          <div className="acts">
            <button onClick={clear} title="Bersihkan / sesi baru"><Icon d='<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>' /></button>
            <button onClick={toggleExpand} title="Perbesar"><Icon d='<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>' /></button>
            <button onClick={closePanel} title="Tutup"><Icon d='<path d="M18 6 6 18M6 6l12 12"/>' /></button>
          </div>
        </div>

        <div className="chat-body" ref={bodyRef}>
          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="msg user">{m.content}</div>
            ) : (
              <div key={m.id} className="msg ai">
                <span className="name">✦ Assistant</span>
                {m.content
                  ? <Markdown>{m.content}</Markdown>
                  : m.status === "streaming" ? <span className="typingdots">▍</span> : null}
                {m.status === "streaming" && m.content && <span className="caretblink" />}
                {m.citations && m.citations.length > 0 && (
                  <div className="sources">
                    <span className="lbl">📄 Sumber:</span>
                    {m.citations.map((c) => <span key={c.n} className="src">[{c.n}] {c.file}</span>)}
                  </div>
                )}
                {m.model && m.status === "final" && <div className="model">◈ {m.model}</div>}
                {m.status === "failed" && <button className="retry" onClick={() => { /* re-ask last user */ }}>gagal — coba lagi nanti</button>}
              </div>
            )
          )}
          {streaming && messages[messages.length - 1]?.content === "" && (
            <div className="typing"><span /><span /><span /></div>
          )}
        </div>

        {showSuggest && (
          <div className="chat-suggest">
            {SUGGEST.map((s) => <button key={s} onClick={() => submit(s)}>{s}</button>)}
          </div>
        )}

        <div className="chat-input">
          <input ref={inputRef} value={text} placeholder="Tanya apa pun tentang Feri..." autoComplete="off"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(text); }} />
          {streaming ? (
            <button className="send" onClick={stop} aria-label="Stop"><Icon d='<rect x="6" y="6" width="12" height="12" rx="1"/>' size={18} /></button>
          ) : (
            <button className="send" onClick={() => submit(text)} aria-label="Kirim"><Icon d='<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>' size={20} /></button>
          )}
        </div>
      </div>
    </>
  );
}
