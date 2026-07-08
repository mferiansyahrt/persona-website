import MiniPrompt from "../components/MiniPrompt";

export default function Contact() {
  return (
    <section className="page active" data-page="contact">
      <div className="wrap">
        <div className="sec-head stagger"><div className="sec-idx">05</div><h2 className="sec-title">Let's Talk<span className="sub">// mari terhubung</span></h2></div>
        <MiniPrompt cmd="curl -X POST feri.dev/hire" out="200 ok" />
        <div className="contact-huge stagger"><a href="mailto:muhammadferiansyahraihan@gmail.com">Kirim email →</a></div>
        <div className="contact-grid stagger">
          <a className="cc" href="mailto:muhammadferiansyahraihan@gmail.com"><div className="l">Email</div><div className="v">muhammadferiansyahraihan@gmail.com</div></a>
          <a className="cc" href="https://wa.me/6281999679588" target="_blank" rel="noreferrer"><div className="l">WhatsApp</div><div className="v">+62 819-9967-9588</div></a>
          <a className="cc" href="https://www.linkedin.com/in/" target="_blank" rel="noreferrer"><div className="l">LinkedIn</div><div className="v">Muhammad Feriansyah Raihan Taufiq</div></a>
        </div>
        <div className="contact-foot stagger"><span>© 2026 — Built with intent. Deterministic by design.</span><span>TANGERANG SELATAN / ID · −6.29, 106.71</span></div>
      </div>
    </section>
  );
}
