import { useState } from "react";

/** Foto profil dengan efek blur→sharp on hover (brief 01 §2.1).
 * Letakkan foto di public/profile.jpg. Jika tidak ada, fallback ke inisial "F". */
export default function Avatar() {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return <div className="avatar" aria-hidden="true">F</div>;
  }
  return (
    <div className="avatar avatar-photo" aria-label="Foto Feri">
      <img src="/profile.jpg" alt="M. Feriansyah Raihan Taufiq" onError={() => setOk(false)} />
    </div>
  );
}
