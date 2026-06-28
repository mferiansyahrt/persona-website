/* Konten naratif terkurasi tentang Feri — selaras dengan
   backend/knowledge/profile.md & experience.md. Satu sumber untuk teks situs. */

export const profile = {
  name: "M. Feriansyah Raihan Taufiq",
  shortName: "Feri",
  role: "AI/ML Engineer",
  eyebrow: "AI/ML ENGINEER",
  tagline: "Membangun sistem AI multi-agent yang andal di produksi — bukan sekadar mengesankan di demo.",

  about: [
    "Saya seorang AI/ML Engineer dengan latar ganda yang jarang ketemu: **fisika instrumentasi** dan **ilmu komputer (AI)** — keduanya dari Universitas Indonesia. Perjalanan saya dimulai dari sensor, sistem kontrol, dan computer vision, lalu bermuara ke tempat saya sekarang: merancang sistem LLM multi-agent yang berjalan di lingkungan produksi nyata.",
    "Di PT. Indonesia Indicator, saya mendesain dan men-deploy arsitektur AI multi-agent, pipeline RAG, dan tooling berbasis MCP lintas domain — media intelligence, pertahanan, finansial, hingga riset geopolitik. Mulai dari evaluasi LLM (OpenAI, Claude, Gemini, self-hosted), vector search, orkestrasi async, sampai deployment.",
    "Akar riset saya di deep learning & computer vision (skripsi S1 dan tesis S2 keduanya soal generative models, image translation, dan rekonstruksi citra). Prinsip yang saya pegang sederhana: **keandalan di produksi lebih penting daripada demo yang memukau** — deterministic scoring, fallback chain antar-model, dan desain yang tetap aman saat terdegradasi.",
  ],

  stats: [
    { value: "12", label: "Production Systems" },
    { value: "100+", label: "AI Agents dibangun" },
    { value: "2", label: "Gelar (UI)" },
    { value: "5", label: "Sertifikasi" },
  ],

  techPills: [
    "Python", "asyncio", "Multi-Agent / MCP", "RAG", "FastAPI",
    "Claude / GPT / Gemini", "Qdrant", "PostgreSQL", "Elasticsearch",
    "Kafka", "React", "TensorFlow",
  ],

  experience: [
    {
      company: "PT. Indonesia Indicator",
      role: "AI Researcher / Engineer",
      period: "Mar 2025 — sekarang",
      location: "Tangerang Selatan",
      summary:
        "Mendesain & men-deploy sistem AI multi-agent skala produksi lintas tim, mengadaptasi arsitektur per klien.",
      highlights: [
        "Platform OSINT social profiling — 11+ agent (scraping, web search, image analysis, facial recognition).",
        "Cognitive warfare detection dengan causal inference + campaign engine 3-tier (Normal/Crisis/War).",
        "Table Augmented Generation (DocETL) diekspos sebagai layanan MCP.",
        "28 indicator agent untuk simulasi geoekonomi + Stellar Deep Research Agent + Book Generator.",
      ],
    },
    {
      company: "Fiverr (Freelance)",
      role: "Remote Data Scientist",
      period: "Nov 2022 — Jan 2025",
      location: "Depok",
      summary:
        "Membangun model Machine/Deep Learning untuk klien internasional, dari konsultasi masalah hingga dokumentasi.",
      highlights: [
        "Menerjemahkan kebutuhan bisnis klien menjadi solusi ML yang konkret.",
        "Mengirim model + dokumentasi penggunaan yang siap pakai.",
      ],
    },
    {
      company: "PPSDM Migas Cepu",
      role: "Instrument Control Engineer (Internship)",
      period: "Jun 2021 — Jul 2021",
      location: "Cepu",
      summary:
        "Akar instrumentasi: mengontrol parameter level Boiler Drum-Heat Exchanger dengan tuning PID.",
      highlights: [
        "Memilih metode tuning PID yang tepat dan menganalisis data kontrol.",
      ],
    },
    {
      company: "Universitas Indonesia",
      role: "Head of Electronics Laboratory Assistant",
      period: "Jan 2021 — Des 2021",
      location: "Depok",
      summary:
        "Memimpin asistensi praktikum elektronika — menyusun 18 modul eksperimen & membimbing mahasiswa.",
      highlights: [
        "Mengatur jadwal praktikum 2 semester dan memberi penilaian akhir.",
      ],
    },
  ],

  education: [
    {
      degree: "M.Sc. Computer Science (AI)",
      school: "Universitas Indonesia",
      period: "2023 — 2025",
      gpa: "GPA 3.70 / 4.00",
    },
    {
      degree: "B.Sc. System & Instrumentation Physics",
      school: "Universitas Indonesia",
      period: "2018 — 2022",
      gpa: "GPA 3.65 / 4.00 · Cumlaude",
    },
  ],

  theses: [
    {
      title: "Super-Resolution CycleGAN untuk Day-to-Night Image Translation",
      level: "Tesis S2",
      desc: "Meningkatkan resolusi citra malam sintetis pada terjemahan citra siang→malam berbasis Super-Resolution CycleGAN.",
    },
    {
      title: "Hyperspectral Image Reconstruction dari RGB (CNN Dense Block)",
      level: "Skripsi S1",
      desc: "Rekonstruksi citra hiperspektral dari RGB memakai CNN arsitektur Dense Block — studi kasus prediksi karotenoid daun.",
    },
  ],

  certifications: [
    "Python - Data Science (Sanbercode)",
    "Advance Python - Data Science (Sanbercode)",
    "The Complete SQL Bootcamp 2022 (Udemy)",
    "TensorFlow 2.0: Deep Learning & AI (Udemy)",
    "Deep Learning Bootcamp (DSC Universitas Indonesia)",
  ],

  highlights: [
    "Deterministic scoring — LLM untuk narasi, skor dihitung di kode agar auditable.",
    "Multi-model fallback chain (OpenAI / Claude / Gemini / OpenRouter / self-hosted vLLM).",
    "Arsitektur degraded-safe — sistem tetap jalan saat komponen gagal.",
  ],

  contact: [
    { kind: "email", label: "Email", value: "muhammadferiansyahraihan@gmail.com", href: "mailto:muhammadferiansyahraihan@gmail.com" },
    { kind: "whatsapp", label: "WhatsApp", value: "+62 819-9967-9588", href: "https://wa.me/6281999679588" },
    { kind: "linkedin", label: "LinkedIn", value: "Muhammad Feriansyah Raihan Taufiq", href: "https://www.linkedin.com/in/" },
  ],
};

export const NAV_SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];
