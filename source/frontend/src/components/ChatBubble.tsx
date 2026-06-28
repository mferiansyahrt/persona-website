import { useEffect, useState } from "react";
import { MessageCircle, X, Maximize2, Minimize2, Trash2 } from "lucide-react";
import Chat from "./Chat";
import { useUI, useChat } from "../store";

export default function ChatBubble() {
  const { chatOpen, openChat, closeChat } = useUI();
  const { resetSession, messages } = useChat();
  const [maximized, setMaximized] = useState(false);

  // ESC menutup panel
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeChat();
    }
    if (chatOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chatOpen, closeChat]);

  function clearChat() {
    if (messages.length === 0) return;
    if (window.confirm("Mulai sesi chat baru? Riwayat percakapan saat ini akan dikosongkan.")) {
      resetSession();
    }
  }

  return (
    <>
      {chatOpen && (
        <div className={`chat-panel ${maximized ? "chat-panel-max" : ""}`} role="dialog" aria-label="AI Assistant">
          <div className="chat-panel-head">
            <span className="chat-panel-title">
              <span className="ai-dot" /> AI Assistant
            </span>
            <div className="chat-panel-actions">
              <button onClick={clearChat} aria-label="Mulai sesi baru" title="Sesi baru (clear)">
                <Trash2 size={16} />
              </button>
              <button onClick={() => setMaximized((m) => !m)}
                      aria-label={maximized ? "Perkecil" : "Perbesar"}
                      title={maximized ? "Perkecil" : "Perbesar"}>
                {maximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button onClick={closeChat} aria-label="Tutup chat" title="Tutup"><X size={18} /></button>
            </div>
          </div>
          <Chat embedded />
        </div>
      )}

      <button
        className={`fab ${chatOpen ? "fab-open" : ""}`}
        onClick={() => (chatOpen ? closeChat() : openChat())}
        aria-label={chatOpen ? "Tutup chat" : "Buka chat AI"}
        aria-expanded={chatOpen}
      >
        {chatOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  );
}
