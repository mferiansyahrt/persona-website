import type { Chapter } from "../types";

/** Storyline 4 babak — dibaca dari sekarang (04) ke awal (01). Narr boleh <b>. */
export const chapters: Chapter[] = [
  {
    babak: "04", phase: "produksi AI", year: "2025 — NOW",
    role: "AI Researcher / Engineer",
    org: "PT. Indonesia Indicator · Tangerang Selatan",
    narr: "Di sinilah semua bertemu. Saya mendesain &amp; men-deploy <b>sistem AI multi-agent skala produksi</b> lintas tim, mengadaptasi arsitektur per klien — dan belajar bahwa yang membedakan sistem hidup dari demo adalah bagaimana ia bertahan saat ada yang gagal.",
    beats: [
      { m: "OSINT", t: "<b>11+ agent</b> untuk social profiling — scraping, web search, image analysis, facial recognition." },
      { m: "DEFENSE", t: "Cognitive warfare detection + <b>campaign engine 3-tier</b> (Normal / Crisis / War)." },
      { m: "MCP", t: "Table Augmented Generation (DocETL) diekspos sebagai <b>layanan MCP</b> lintas domain." },
      { m: "GEO", t: "<b>28 indicator agent</b> untuk simulasi geoekonomi + Stellar Deep Research Agent." },
    ],
  },
  {
    babak: "03", phase: "pasar global", year: "2022 — 2025",
    role: "Remote Data Scientist",
    org: "Fiverr (Freelance) · Depok",
    narr: "Bertahun-tahun mengubah masalah bisnis klien internasional menjadi <b>model Machine / Deep Learning</b> yang benar-benar dipakai — bukan sekadar notebook. Di sini saya belajar dokumentasi &amp; keandalan sama pentingnya dengan akurasi.",
    beats: [
      { m: "SCOPE", t: "Menerjemahkan kebutuhan bisnis menjadi <b>solusi ML konkret</b> dari nol." },
      { m: "SHIP", t: "Mengirim model + <b>dokumentasi penggunaan</b> yang siap pakai." },
    ],
  },
  {
    babak: "02", phase: "dunia fisik", year: "2021",
    role: "Instrument Control Engineer",
    org: "PPSDM Migas Cepu · Internship · Cepu",
    narr: "Akar instrumentasi. Mengontrol parameter level <b>Boiler Drum–Heat Exchanger</b> dengan tuning PID mengajarkan hal yang tak pernah hilang: sistem nyata punya inersia, noise, dan konsekuensi.",
    beats: [
      { m: "PID", t: "Memilih metode <b>tuning PID</b> yang tepat &amp; menganalisis data kontrol." },
    ],
  },
  {
    babak: "01", phase: "mengajar", year: "2021",
    role: "Head, Electronics Lab Assistant",
    org: "Universitas Indonesia · Depok",
    narr: "Titik awal. Memimpin asistensi praktikum elektronika — <b>menyusun 18 modul eksperimen</b> &amp; membimbing mahasiswa. Menjelaskan sistem ke orang lain memaksa saya benar-benar memahaminya.",
    beats: [
      { m: "LEAD", t: "Mengatur jadwal praktikum <b>2 semester</b> &amp; memberi penilaian akhir." },
    ],
  },
];
