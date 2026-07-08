import type { Project, ProjectCat } from "../types";

/** 12 sistem produksi — id = nama file di public/projects/<id>.html */
export const projects: Project[] = [
  { id: "command_ai", t: "Command AI", cat: "civic", ag: 12, kick: "Reality Intelligence Platform", d: "Fusi suara publik & organisasi jadi reality score untuk intelijen, WhatsApp-native." },
  { id: "netra", t: "NETRA", cat: "defense", ag: 28, kick: "Multi-Agent Defense Intelligence", d: "Analisis skenario geopolitik & ketahanan defense-ekonomi dengan 28 agent paralel." },
  { id: "cognitive_warfare", t: "Cognitive Warfare Engine", cat: "media", ag: 13, kick: "Deteksi isu sebelum eskalasi", d: "Monitoring 8 platform, clustering meta-issue, laporan intelijen ~78 detik." },
  { id: "contextual_intelligence", t: "Contextual Intelligence", cat: "media", ag: 2, kick: "Topic Management Layer (ACIS)", d: "Enrich anchor post → ekstraksi event → klasifikasi issue / framing / narrative." },
  { id: "deep_account_profiling", t: "Deep Account Profiling", cat: "osint", ag: 24, kick: "OSINT lintas 6 platform", d: "Profil risiko digital + vision AI + riset rekam jejak otonom dalam ~5 menit." },
  { id: "document_etl", t: "Document-ETL", cat: "data", ag: 8, kick: "Table Augmented Generation", d: "NL → temukan dataset → Text-to-SQL → sintesis tabel, diekspos layanan MCP." },
  { id: "argus_mro", t: "ARGUS MRO", cat: "defense", ag: 1, kick: "Naval MRO — KRI Brawijaya", d: "Dashboard kesiapan tempur 488 komponen + 3D digital twin + AI 21 tools." },
  { id: "fire_intelligence", t: "FIP v2", cat: "research", ag: 2, kick: "Fire Intelligence Platform", d: "Pemetaan & prediksi sebaran karhutla H-7→T+7, 1.076 zona desa Riau." },
  { id: "acis_lifecycle", t: "ACIS Lifecycle Engine", cat: "data", ag: 4, kick: "Object Monitoring State Machine", d: "Health scoring & transisi lifecycle objek, event-driven via Kafka." },
  { id: "veridocs", t: "VERIDOCS", cat: "docs", ag: 3, kick: "AI Document Audit Engine", d: "Audit FS BUMD & Perda APBD vs regulasi, skor deterministik, output PDF berkop." },
  { id: "campaign_alert", t: "Campaign Alert Agent", cat: "crisis", ag: 14, kick: "AI Crisis Response Pipeline", d: "3-tier Normal/Crisis/War, velocity scoring, auto-post untuk 10+ instansi." },
  { id: "iterative_data_searcher", t: "Iterative Data Searcher", cat: "research", ag: 7, kick: "AI PDF Research Pipeline", d: "NL → temukan & verifikasi PDF + jurnal Indonesia tersitasi, 2 fase." },
];

export const WORK_FILTERS: { key: "all" | ProjectCat; label: string }[] = [
  { key: "all", label: "All" },
  { key: "defense", label: "Defense" },
  { key: "osint", label: "OSINT" },
  { key: "media", label: "Media" },
  { key: "data", label: "Data" },
  { key: "docs", label: "Docs" },
  { key: "crisis", label: "Crisis" },
  { key: "research", label: "Research" },
];
