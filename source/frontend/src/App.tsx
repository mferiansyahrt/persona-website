import { useEffect } from "react";
import Navbar from "./components/Navbar";
import About from "./components/sections/About";
import Experience from "./components/sections/Experience";
import ProjectGallery from "./components/ProjectGallery";
import Achievements from "./components/sections/Achievements";
import AgentLauncher from "./components/AgentLauncher";
import Contact from "./components/sections/Contact";
import ChatBubble from "./components/ChatBubble";
import HealthBanner from "./components/HealthBanner";
import { useAgents, useChat, useSystem, useTheme } from "./store";
import { fetchAgents, fetchHistory, checkHealth } from "./lib/api";
import { useCardSpotlight } from "./lib/useCardSpotlight";
import { useMagnetic } from "./lib/useMagnetic";
import { profile } from "./data/profile";
import "./styles/components.css";

export default function App() {
  const { theme } = useTheme();
  const { setAgents } = useAgents();
  const { setHealth } = useSystem();
  const { sessionId, setMessages } = useChat();
  useCardSpotlight();
  useMagnetic();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    checkHealth().then((ok) => setHealth(ok ? "up" : "down"));
    fetchAgents().then(setAgents).catch(() => {});
    fetchHistory(sessionId)
      .then((d) => {
        if (d.messages?.length) {
          setMessages(
            d.messages.map((m: any) => ({
              id: crypto.randomUUID(),
              role: m.role,
              content: m.content,
              status: "final",
              model: m.model,
              citations: m.citations,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="bg-ambient" />
      <div className="bg-noise" aria-hidden="true" />
      <Navbar />
      <HealthBanner />
      <main>
        <About />
        <Experience />
        <ProjectGallery />
        <Achievements />
        <AgentLauncher />
        <Contact />
      </main>
      <footer className="footer">
        <div className="container">
          <p className="mono">© {profile.name} · {profile.role} · {profile.contact[0].value}</p>
        </div>
      </footer>
      <ChatBubble />
    </>
  );
}
