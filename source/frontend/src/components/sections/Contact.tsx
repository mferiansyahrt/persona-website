import { useState } from "react";
import { Mail, MessageCircle, Linkedin, Copy, Check, Bot } from "lucide-react";
import SectionHeader from "../SectionHeader";
import Reveal from "../Reveal";
import { profile } from "../../data/profile";
import { useUI } from "../../store";

const ICONS: Record<string, JSX.Element> = {
  email: <Mail size={18} />,
  whatsapp: <MessageCircle size={18} />,
  linkedin: <Linkedin size={18} />,
};

export default function Contact() {
  const { openChat } = useUI();
  const [copied, setCopied] = useState<string | null>(null);

  function copy(value: string) {
    navigator.clipboard?.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <section className="section" id="contact">
      <div className="container">
        <SectionHeader eyebrow="MARI TERHUBUNG" title="Contact" />
        <div className="contact-grid">
          {profile.contact.map((c, i) => (
            <Reveal key={c.kind} delay={i * 70}>
            <div className="card contact-card">
              <div className="contact-icon">{ICONS[c.kind]}</div>
              <div className="contact-body">
                <div className="contact-label mono">{c.label}</div>
                <a className="contact-value" href={c.href} target="_blank" rel="noreferrer">
                  {c.value}
                </a>
              </div>
              <button className="contact-copy" onClick={() => copy(c.value)} aria-label={`Salin ${c.label}`}>
                {copied === c.value ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            </Reveal>
          ))}
        </div>
        <div className="contact-cta">
          <p>Atau tanya langsung ke AI tentang pengalaman & project saya:</p>
          <button className="btn-accent" onClick={openChat}><Bot size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} /> Tanya AI tentang saya</button>
        </div>
      </div>
    </section>
  );
}
