import { useSystem } from "../store";

/** Banner non-blocking saat backend tidak terjangkau (offline / cold start). */
export default function HealthBanner() {
  const { health } = useSystem();
  if (health !== "down") return null;
  return (
    <div className="health-banner" role="status">
      ⚠️ AI assistant sedang tidak terjangkau. Jika ini server gratis, mungkin sedang
      bangun dari tidur — coba kirim lagi sebentar lagi.
    </div>
  );
}
