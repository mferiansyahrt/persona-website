# Technical Depth Guide — Cara Propose Detail Teknis Tanpa Tanya Kosong

Fase 5 (Deep-Dive Loop) adalah fase yang paling banyak konten teknisnya — SQL DDL, API endpoint, alert config, performance target. Kalau Anda nanya teknis ke user non-teknis, Anda menyiksa mereka.

**Aturan utama: Anda yang propose draft teknis lengkap, user koreksi yang salah.**

File ini berisi pattern library yang Anda pakai sebagai modal untuk propose tanpa tanya kosong. Patterns dikelompokkan per section di feature brief template.

---

## 1. Cara propose Layout Dashboard (Fitur Utama)

User non-teknis tidak bisa kasih wireframe. Anda yang gambar layout pakai ASCII art.

### Modal yang Anda butuhkan
- Storyline yang sudah ter-validate (langkah-langkah konkret)
- Decision authority + POV
- KPI utama yang mau ditampilkan

### Pattern: dashboard eksekutif

Untuk eksekutif tinggi (kepala daerah, C-level), pakai pola **6-grid + main panel + bottom row**:

```
┌─────────────────────────────────────────────────────┐
│  [TITLE]                              [Date/Time]   │
├─────────────────────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐                      │
│  │ KPI1 │  │ KPI2 │  │ KPI3 │   ← Big number cards │
│  └──────┘  └──────┘  └──────┘                      │
│                                                     │
│  ┌──────────────────┐  ┌──────────────────┐       │
│  │   Trend Chart    │  │   Gauge / Status │       │
│  └──────────────────┘  └──────────────────┘       │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │            Main Visualization               │   │
│  │            (Map / Big Chart)                │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────┐  ┌─────────────────────────────┐  │
│  │  Top 5 List │  │  Secondary Trend            │  │
│  └─────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Pattern: dashboard operator harian

Untuk operator (Kabid, manajer menengah), pakai pola **filter bar + main grid + drill-down area**:

```
┌─────────────────────────────────────────────────────┐
│  [TITLE]    [Filter1▼] [Filter2▼] [Date Range]      │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────┐  │
│  │  Status Grid / Heatmap / Table               │  │
│  │  (sortable, clickable rows)                  │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│  │  Detail 1  │  │  Detail 2  │  │  Detail 3  │   │
│  │  (drill)   │  │  (drill)   │  │  (drill)   │   │
│  └────────────┘  └────────────┘  └────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Action Bar: [Export] [Tag Team] [Note]     │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Aturan:**
- Komponen yang ditampilkan harus terkait langsung ke storyline yang ter-validate
- Setiap KPI card harus traceable ke KPI yang sudah disepakati
- Maksimal 6-8 elemen visual utama per layar — lebih dari itu cluttered

---

## 2. Cara propose Struktur Data (SQL DDL + Sample Data)

User non-teknis tidak bisa kasih schema. Anda yang propose berdasarkan domain pattern.

### Pattern: dashboard pemerintah daerah (data warehouse style)

Pakai **dimensional model** — dim tables + fact tables:

```sql
-- Master Tables (slow changing)
CREATE TABLE dim_wilayah (
    id_wilayah SERIAL PRIMARY KEY,
    kode_wilayah VARCHAR(10) UNIQUE,
    nama_wilayah VARCHAR(100),
    jenis VARCHAR(20),  -- provinsi/kabupaten/kecamatan/kelurahan
    parent_id INTEGER REFERENCES dim_wilayah(id_wilayah),
    geom GEOMETRY(POLYGON, 4326),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dim_opd (
    id_opd SERIAL PRIMARY KEY,
    kode_opd VARCHAR(10) UNIQUE,
    nama_opd VARCHAR(100),
    -- ... fields lain
);

CREATE TABLE dim_waktu (
    id_waktu SERIAL PRIMARY KEY,
    tanggal DATE,
    bulan SMALLINT,
    tahun SMALLINT,
    triwulan SMALLINT,
    -- ...
);

-- Fact Tables (transactional)
CREATE TABLE fact_[domain] (
    id_fact BIGSERIAL PRIMARY KEY,
    id_waktu INTEGER REFERENCES dim_waktu(id_waktu),
    id_wilayah INTEGER REFERENCES dim_wilayah(id_wilayah),
    -- domain-specific metrics
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Pattern: e-commerce / transactional

Pakai **normalized 3NF** untuk core entitas, denormalized view untuk analytics:

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE,
    name VARCHAR(200),
    description TEXT,
    base_price DECIMAL(12,2),
    category_id INTEGER REFERENCES categories(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    status VARCHAR(20),  -- pending/paid/shipped/delivered/cancelled
    total_amount DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER,
    unit_price DECIMAL(12,2)
);
```

### Pattern: pengelolaan keluhan/aduan

Pakai **state machine pattern** — entity + status history:

```sql
CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(20) UNIQUE,
    reporter_id INTEGER REFERENCES users(id),
    category_id INTEGER REFERENCES categories(id),
    title VARCHAR(200),
    description TEXT,
    location_id INTEGER REFERENCES dim_wilayah(id_wilayah),
    geom GEOMETRY(POINT, 4326),
    severity VARCHAR(20),
    status VARCHAR(20),  -- pending/in_progress/resolved/rejected
    assigned_opd_id INTEGER REFERENCES dim_opd(id_opd),
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

CREATE TABLE complaint_status_history (
    id SERIAL PRIMARY KEY,
    complaint_id INTEGER REFERENCES complaints(id),
    from_status VARCHAR(20),
    to_status VARCHAR(20),
    changed_by INTEGER REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT NOW(),
    notes TEXT
);
```

### Sample Data — wajib disertakan

Setiap fact table harus punya **minimal 3 baris contoh data realistis** dengan angka spesifik domain. Ini bukan placeholder — ini ilustrasi yang membantu tim engineering memahami expected data shape.

Contoh:

| Tanggal | Wilayah | Indeks | Ekonomi | Sosial | Infra | Layanan |
|---------|---------|--------|---------|--------|-------|---------|
| 2026-04-07 | Kab. XYZ | 78.5 | 82.3 | 75.2 | 71.8 | 85.4 |
| 2026-04-06 | Kab. XYZ | 77.8 | 81.9 | 74.8 | 71.5 | 84.9 |
| 2026-04-05 | Kab. XYZ | 76.2 | 80.5 | 74.1 | 70.9 | 84.2 |

Angka harus realistis untuk domain. Untuk indeks 0-100, jangan pakai 99.9 di setiap baris — variasikan.

---

## 3. Cara propose API Endpoints

Tarik dari storyline + data model + interaksi UI yang sudah propose.

### Pattern: REST endpoints

Untuk setiap fitur, propose minimal 2-4 endpoint utama:

```yaml
# GET /api/v1/[resource]/[sub-resource]
# Pakai noun, bukan verb. Plural untuk collection, singular dengan ID untuk single resource.

# Contoh: dashboard summary
GET /api/v1/dashboard/summary
parameters:
  - wilayah_id: integer (optional)
  - periode: string (daily|weekly|monthly)
response:
  {
    "field1": value,
    "field2": value,
    "trend": "up|down|stable",
    "last_updated": "2026-04-07T10:30:00Z"
  }

# Contoh: list dengan filter
GET /api/v1/[resource]
parameters:
  - status: string (enum)
  - sort_by: string
  - limit: integer (default: 20)
  - offset: integer
response:
  {
    "data": [...],
    "total": 1247,
    "page": 1,
    "last_updated": "2026-04-07T10:30:00Z"
  }

# Contoh: single resource detail
GET /api/v1/[resource]/{id}
response: { ... full object ... }

# Contoh: action / state change
POST /api/v1/[resource]/{id}/action
body: { ... }
response: { "status": "ok", ...updated_object }
```

### Pattern: WebSocket untuk real-time

Kalau storyline butuh live update (anomaly alert, monitoring real-time), tambahkan WebSocket:

```javascript
// WebSocket: wss://api.[domain]/ws/[channel]

// Subscribe pattern
{
  "action": "subscribe",
  "channels": ["channel_name_1", "channel_name_2"]
}

// Server push pattern
{
  "channel": "channel_name_1",
  "data": { ... },
  "timestamp": "2026-04-07T10:35:00Z"
}
```

### Aturan API
- Versioning di path: `/api/v1/...`
- Response selalu include `last_updated` atau `timestamp`
- Pakai standard HTTP status codes (200, 400, 404, 500)
- Authentication via Bearer token (`Authorization: Bearer <token>`)
- Rate limiting di-mention kalau public endpoint

---

## 4. Cara propose Konfigurasi Alert

Tarik dari objective + KPI threshold + severity pattern.

### Pattern: alert config JSON

```json
{
  "alerts": [
    {
      "id": "alert_001",
      "name": "[Nama yang deskriptif]",
      "metric": "[field_name]",
      "condition": "above|below|increase|decrease|equal",
      "threshold": [angka],
      "unit": "points|percent|count|hours",
      "timeframe": "1h|24h|7d (kalau aplicable)",
      "severity": "low|medium|high|critical",
      "recipients": ["role_1", "role_2"],
      "channels": ["email", "push", "sms", "in_app"]
    }
  ]
}
```

### Pattern: severity levels (gunakan apa adanya untuk pemerintah/enterprise)

| Level | Warna | Aksi | Notifikasi |
|-------|-------|------|------------|
| LOW | Hijau | Log saja | - |
| MEDIUM | Kuning | Notify unit terkait | Email, In-app |
| HIGH | Merah | Escalate ke pimpinan | Push, SMS, Email |
| CRITICAL | Merah Berkedip | Emergency response | All channels + Call |

### Aturan threshold

Propose threshold spesifik berdasarkan:
- **Sektor/domain norm** — misal: indeks pelayanan publik <70 = low quality, threshold di 70
- **Statistical baseline** — misal: anomaly = >2 std deviation dari mean 30-day baseline
- **Regulatory threshold** — misal: realisasi APBD <50% di Q3 = warning (regulasi keuangan negara)

Kalau tidak yakin, pakai threshold konservatif dan tag sebagai "needs calibration with historical data" di Blind Spot Review.

---

## 5. Cara propose Spesifikasi Teknis

### Frontend libraries (default modern stack)

| Komponen | Library | Versi |
|----------|---------|-------|
| Framework | React | 18.x |
| Charting | Apache ECharts | 5.x |
| Maps | Leaflet / Mapbox GL | Latest |
| Data Grid | AG Grid | 31.x |
| State Management | Redux Toolkit | 2.x |
| Real-time | Socket.io Client | 4.x |
| Styling | TailwindCSS | 3.x |
| Forms | React Hook Form + Zod | Latest |

Sesuaikan kalau klien punya stack legacy (misal: jQuery + Vue 2).

### Performance targets (default — adjust per kontext)

| Metrik | Target | Ukuran |
|--------|--------|--------|
| Initial Load | < 3 detik | Lighthouse |
| Time to Interactive | < 5 detik | Lighthouse |
| Dashboard Refresh | < 500ms | API Response |
| Map Rendering | < 1 detik | Frame Load |
| Chart Animation | 300ms | CSS Transition |
| API Response (p95) | < 800ms | APM |
| WebSocket Latency | < 100ms | End-to-end |

### Data refresh policy

Tarik dari storyline cadence:

| Cadence storyline | Refresh policy |
|---|---|
| Real-time monitoring | WebSocket push |
| Hourly analysis | Scheduled job per jam |
| Daily decisions | ETL batch harian (subuh) |
| Weekly review | ETL batch mingguan (Senin pagi) |
| Monthly reporting | ETL batch bulanan |

---

## 6. Cara propose Use Case Scenarios

Setiap fitur **wajib punya minimal 2 skenario**, idealnya 3:

### Pattern struktur skenario

```markdown
### 8.X Skenario [Nama Singkat Skenario]

**Actor**: [Jabatan spesifik]
**Goal**: [Outcome yang ingin dicapai]

```
1. [Langkah 1 — aktor melakukan apa]
2. [Langkah 2 — sistem merespon apa]
3. [Langkah 3 — aktor melihat/memutuskan apa]
4. [...]
N. [Outcome akhir]
```
```

### Tiga skenario klasik untuk fitur dashboard

1. **Skenario Pemantauan Rutin** — happy path, daily use
2. **Skenario Respons Krisis / Edge Case** — alert/anomaly handled
3. **Skenario Evaluasi / Reporting** — periodic review use

Adjust per fitur:
- Fitur transactional (e.g., Manajemen Pengaduan) → ganti "Pemantauan" jadi "Pelaporan + Penanganan + Verifikasi"
- Fitur analytical (e.g., Intelijen Ekonomi) → ganti jadi "Eksplorasi Data + Drill-down Spesifik + Export Report"

---

## 7. Referensi Implementasi

Wajib include minimal 2-3 referensi sistem serupa. Kalau Anda tidak tahu sistem serupa di domain, tag sebagai gap di Blind Spot Review.

### Default referensi per domain

**Pemerintah daerah Indonesia:**
- Jakarta Smart City Dashboard (smartcity.jakarta.go.id)
- SP4N-LAPOR! (lapor.go.id)
- SIPD (Kemendagri)
- Bandung Command Center

**International gov tech:**
- Alberta Economic Dashboard (Kanada)
- UNDP Crisis Risk Dashboard
- gov.uk Performance Dashboard
- Singapore SmartNation

**Enterprise B2B:**
- Tableau (BI dashboard reference)
- Salesforce CRM (sales pipeline reference)
- ServiceNow (ticketing/incident reference)

Format referensi:

```markdown
### 9.X [Nama Sistem]

**URL**: [link kalau public]

**Fitur yang Diadaptasi**:
- [Fitur 1]
- [Fitur 2]
- [Pattern atau approach yang dipinjam]
```

---

## Aturan ekonomi turn — Phase 5 Deep-Dive

**Setiap fitur = 1 turn agent draft + 1 turn user koreksi.**

Anda susun draft lengkap fitur dalam 1 turn (panjang OK, ini bukan discovery). Akhiri dengan pertanyaan tertutup:

> "Brief fitur [NAMA_FITUR] di atas OK, atau ada section yang perlu dikoreksi (data model / API / alert / lainnya)?"

User boleh:
- Bilang "OK lanjut" → Anda lanjut ke fitur berikutnya, catat asumsi tertandai (tidak di-validate eksplisit)
- Koreksi spesifik ("threshold alert harusnya 30%, bukan 50%") → Anda revisi, lanjut
- Koreksi besar ("data model salah, kita tidak pakai PostgreSQL — pakai Oracle") → Anda revisi data model dan tarik implikasinya ke tech stack overview, lanjut

**Jangan loop tanya untuk fitur yang sama lebih dari 2 turn.** Kalau user kasih banyak koreksi, ambil koreksi tersebut dan move on — sisa detail masuk asumsi tertandai di Blind Spot Review.

---

## Coherence check antar fitur

Sebelum lanjut dari satu fitur ke fitur berikutnya, validate internal:

1. **Apakah data model fitur ini reference dim tables yang sama dengan fitur sebelumnya?** (e.g., `dim_wilayah`, `dim_opd`) — kalau iya, gunakan reference yang sudah ada, jangan re-define.
2. **Apakah API endpoint fitur ini overlap dengan fitur sebelumnya?** Kalau iya, satukan di overview, jangan duplicate.
3. **Apakah tech stack fitur ini konsisten dengan yang disepakati di Fase 3?** Kalau ada deviasi, angkat ke user.
4. **Apakah severity level dan alert recipients konsisten dengan struktur klien?** Dinkes nggak punya wewenang notifikasi ke Gubernur, misal — angkat kalau tidak match.

Kalau ada inconsistency, fix di draft sebelum tampil ke user. Kalau tidak bisa fix tanpa info user, tanya **satu pertanyaan tertutup**, bukan rentetan.
