# Modul Dashboard Situasional

## 1. Gambaran Umum

Dashboard Situasional merupakan **hub sentral** dari Sistem Intelijen Regional yang menyajikan gambaran kondisi daerah secara real-time dalam satu layar terintegrasi. Modul ini mengagregasi data dari seluruh modul lain dan menyajikannya dalam visualisasi yang mudah dipahami oleh pengambil keputusan.

### 1.1 Tujuan Modul

| Tujuan | Deskripsi |
|--------|-----------|
| Single Source of Truth | Menyediakan satu sumber data terpercaya untuk kondisi daerah |
| Real-time Monitoring | Pemantauan kondisi aktual tanpa keterlambatan |
| Early Detection | Identifikasi isu dan risiko sebelum eskalasi |
| Decision Support | Informasi cepat untuk pengambilan keputusan |

### 1.2 Target Pengguna

| Pengguna | Kebutuhan |
|----------|-----------|
| Kepala Daerah | Overview eksekutif untuk pengambilan keputusan strategis |
| Sekda | Koordinasi lintas OPD dan monitoring kinerja |
| Kepala OPD | Monitoring kondisi di bidangnya |
| Tim Asisten | Analisis detail dan rekomendasi kebijakan |

---

## 2. Fitur Utama

### 2.1 Dashboard Eksekutif (Executive Dashboard)

**Deskripsi**: Tampilan ringkas untuk kepala daerah dengan indikator kunci.

**Komponen Visual**:

| Komponen | Tipe | Data | Update |
|----------|------|------|--------|
| Indeks Kondisi Daerah | Gauge Chart | Skor komposit 0-100 | Real-time |
| Status Early Warning | Traffic Light | Hijau/Kuning/Merah | Real-time |
| Jumlah Pengaduan Aktif | Big Number | Count dengan trend | Real-time |
| Sentimen Publik | Line Chart | Persentase positif/negatif | Per jam |
| Realisasi APBD | Progress Bar | Persentase realisasi | Harian |
| PDRB Growth | Sparkline | Pertumbuhan ekonomi | Bulanan |

**Layout Dashboard**:

```
┌────────────────────────────────────────────────────────────────────┐
│  DASHBOARD SITUASIONAL - KABUPATEN/KOTA XYZ    [Hari, DD MMM YYYY] │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   INDEKS     │  │   STATUS     │  │  PENGADUAN   │            │
│  │   KONDISI    │  │   EWS        │  │   AKTIF      │            │
│  │   ████████   │  │    🟢        │  │    1,247     │            │
│  │    78/100    │  │   AMAN       │  │   ↓ 12%     │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                    │
│  ┌────────────────────────────┐  ┌────────────────────────────┐  │
│  │     SENTIMEN PUBLIK        │  │     REALISASI APBD         │  │
│  │  ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁          │  │  ████████████░░░░ 68%     │  │
│  │  Positif: 62%  Negatif: 38%│  │  Rp 2.4T / Rp 3.5T        │  │
│  └────────────────────────────┘  └────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    PETA ISU PRIORITAS                        │ │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐ │ │
│  │  │ Infra  │  │ Keseh. │  │ Pendid.│  │ Sosial │  │ Lingk. │ │ │
│  │  │ ████░░ │  │ █████░ │  │ ███░░░ │  │ ██░░░░ │  │ █░░░░░ │ │ │
│  │  │ 423    │  │ 356    │  │ 234    │  │ 156    │  │ 78     │ │ │
│  │  │ aduan  │  │ aduan  │  │ aduan  │  │ aduan  │  │ aduan  │ │ │
│  │  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌───────────────────────┐  ┌───────────────────────────────────┐│
│  │   TOP 5 ISU VIRAL     │  │   PERTUMBUHAN EKONOMI            ││
│  │  1. Kenaikan PBB      │  │   ▁▂▃▄▅▆▇█                      ││
│  │  2. Kemacetan Jl.X    │  │   Q1: 5.2%  Q2: 5.4%            ││
│  │  3. Banjir Kec. A     │  │   Target: 5.5%                   ││
│  │  4. Pelayanan Disduk  │  │                                   ││
│  │  5. Sampah TPA B      │  │                                   ││
│  └───────────────────────┘  └───────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
```

### 2.2 Peta Interaktif (GIS Dashboard)

**Deskripsi**: Visualisasi geospasial kondisi daerah berdasarkan lokasi.

**Komponen**:

| Layer | Sumber Data | Warna | Keterangan |
|-------|-------------|-------|------------|
| Pengaduan per Kecamatan | LAPOR!, Qlue | Heatmap | Intensitas warna = jumlah aduan |
| Titik Infrastruktur | SIPD, Dinas PU | Marker | Jalan, jembatan, drainase |
| Zona Risiko | EWS Engine | Choropleth | Hijau/Kuning/Merah per wilayah |
| Lokasi Proyek | SIPD, e-Monev | Polygon | Status realisasi proyek |
| Fasilitas Publik | POI Database | Icon | Puskesmas, sekolah, kantor |

**Interaksi**:
- Zoom in/out dengan scroll
- Filter by kategori aduan
- Filter by rentang waktu
- Click marker untuk detail
- Toggle layer visibility

### 2.3 Analisis Trend

**Deskripsi**: Visualisasi perubahan kondisi dari waktu ke waktu.

**Grafik yang Tersedia**:

| Grafik | Dimensi | Granularitas | Periode |
|--------|---------|--------------|---------|
| Trend Pengaduan | Jumlah aduan | Harian | 30 hari terakhir |
| Sentimen Timeline | Positif/Negatif | Per jam | 7 hari terakhir |
| Realisasi APBD | Persentase | Bulanan | YTD |
| Indeks Pelayanan | Skor IKM | Bulanan | 12 bulan terakhir |
| Pertumbuhan Ekonomi | Persentase | Triwulan | 2 tahun terakhir |
| Kriminalitas | Jumlah kasus | Mingguan | 3 bulan terakhir |

### 2.4 Scorecard Kinerja OPD

**Deskripsi**: Peringkat dan kinerja organisasi perangkat daerah.

**Metrik per OPD**:

| Metrik | Bobot | Sumber Data |
|--------|-------|-------------|
| Waktu Respons Pengaduan | 25% | Complaint Engine |
| Tingkat Penyelesaian | 30% | Resolution Tracker |
| Skor IKM | 20% | Survey System |
| Realisasi Program | 15% | Program Tracker |
| Efisiensi Anggaran | 10% | Fiscal Engine |

**Visualisasi Scorecard**:

```
┌─────────────────────────────────────────────────────────────────┐
│                     RANKING KINERJA OPD                         │
├─────────────────────────────────────────────────────────────────┤
│  Rank │ OPD                    │ Skor │ Trend │ Status         │
├─────────────────────────────────────────────────────────────────┤
│   1   │ Dinas Kesehatan        │ 92   │  ↑   │ 🏆 Terbaik     │
│   2   │ Dinas Pendidikan       │ 88   │  ↑   │ ✅ Baik        │
│   3   │ Dinas PUPR             │ 85   │  →   │ ✅ Baik        │
│   4   │ Dinas Sosial           │ 82   │  ↓   │ ⚠️ Perlu Peningkatan │
│   5   │ Dinas LH               │ 78   │  ↑   │ ⚠️ Perlu Peningkatan │
│   ... │ ...                    │ ...  │ ...  │ ...            │
│  25   │ BPBD                   │ 65   │  ↓   │ ❌ Perlu Intervensi │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Alur Bisnis

### 3.1 Alur Data Masuk

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Data Source │────▶│ Data Lake   │────▶│ ETL Process │
│ (SIPD, dll) │     │ (Raw)       │     │ (Clean)     │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    ┌──────────────────────────┘
                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Data        │────▶│ Analytics   │────▶│ Dashboard   │
│ Warehouse   │     │ Engine      │     │ Frontend    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 3.2 Alur Pemantauan

```
┌─────────────────────────────────────────────────────────────┐
│                    DASHBOARD SITUASIONAL                     │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌───────────┐   ┌───────────┐   ┌───────────┐
    │ Monitoring│   │ Alert     │   │ Report    │
    │ Routine   │   │ Trigger   │   │ Generator │
    └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
          │               │               │
          ▼               ▼               ▼
    ┌───────────┐   ┌───────────┐   ┌───────────┐
    │ Display   │   │ Notification│  │ Export    │
    │ Update    │   │ to Users   │   │ PDF/Excel │
    └───────────┘   └───────────┘   └───────────┘
```

### 3.3 Alur Respons Krisis

```
                    ┌─────────────────┐
                    │ Alert Triggered │
                    │ (Threshold)     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Severity Level  │
                    │ Assessment      │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
   ┌───────────┐       ┌───────────┐       ┌───────────┐
   │ LOW       │       │ MEDIUM    │       │ HIGH      │
   │ Log Only  │       │ Notify    │       │ Escalate  │
   │           │       │ OPD       │       │ Leadership│
   └───────────┘       └───────────┘       └───────────┘
```

---

## 4. Struktur Data

### 4.1 Data Model

```sql
-- Master Tables
CREATE TABLE dim_wilayah (
    id_wilayah SERIAL PRIMARY KEY,
    kode_wilayah VARCHAR(10) UNIQUE,
    nama_wilayah VARCHAR(100),
    jenis VARCHAR(20), -- kecamatan/kelurahan
    parent_id INTEGER REFERENCES dim_wilayah(id_wilayah),
    geom GEOMETRY(POLYGON, 4326),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dim_opd (
    id_opd SERIAL PRIMARY KEY,
    kode_opd VARCHAR(10) UNIQUE,
    nama_opd VARCHAR(100),
    nama_singkat VARCHAR(50),
    kepala_opd VARCHAR(100),
    email VARCHAR(100),
    telepon VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE dim_waktu (
    id_waktu SERIAL PRIMARY KEY,
    tanggal DATE,
    bulan SMALLINT,
    tahun SMALLINT,
    triwulan SMALLINT,
    semester SMALLINT,
    hari_ke dalam_tahun SMALLINT,
    minggu_ke dalam_tahun SMALLINT
);

-- Fact Tables
CREATE TABLE fact_kondisi_daerah (
    id_fact BIGSERIAL PRIMARY KEY,
    id_waktu INTEGER REFERENCES dim_waktu(id_waktu),
    id_wilayah INTEGER REFERENCES dim_wilayah(id_wilayah),
    indeks_kondisi DECIMAL(5,2),
    skor_ekonomi DECIMAL(5,2),
    skor_sosial DECIMAL(5,2),
    skor_infrastruktur DECIMAL(5,2),
    skor_pelayanan DECIMAL(5,2),
    skor_keamanan DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fact_kinerja_opd (
    id_fact BIGSERIAL PRIMARY KEY,
    id_opd INTEGER REFERENCES dim_opd(id_opd),
    id_waktu INTEGER REFERENCES dim_waktu(id_waktu),
    total_pengaduan INTEGER,
    pengaduan_selesai INTEGER,
    rata_waktu_respon_jam DECIMAL(10,2),
    skor_ikm DECIMAL(5,2),
    realisasi_program_pct DECIMAL(5,2),
    efisiensi_anggaran_pct DECIMAL(5,2),
    skor_total DECIMAL(5,2),
    peringkat INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 Sample Data

#### Data Indeks Kondisi Daerah

| Tanggal | Wilayah | Indeks | Ekonomi | Sosial | Infra | Layanan | Keamanan |
|---------|---------|--------|---------|--------|-------|---------|----------|
| 2026-04-07 | Kab. XYZ | 78.5 | 82.3 | 75.2 | 71.8 | 85.4 | 79.1 |
| 2026-04-06 | Kab. XYZ | 77.8 | 81.9 | 74.8 | 71.5 | 84.9 | 78.8 |
| 2026-04-05 | Kab. XYZ | 76.2 | 80.5 | 74.1 | 70.9 | 84.2 | 78.2 |

#### Data Kinerja OPD

| OPD | Total Aduan | Selesai | Avg Response | IKM | Realisasi | Efisiensi | Skor |
|-----|-------------|---------|--------------|-----|-----------|-----------|------|
| Dinkes | 156 | 142 | 4.2 jam | 92.5 | 78% | 85% | 92 |
| Disdik | 98 | 89 | 5.1 jam | 88.2 | 82% | 79% | 88 |
| PUPR | 423 | 356 | 8.5 jam | 78.4 | 65% | 72% | 75 |

#### Data Pengaduan per Wilayah

| Kecamatan | Jumlah Aduan | Pending | Proses | Selesai | % Selesai |
|-----------|--------------|---------|--------|---------|-----------|
| Kec. A | 234 | 45 | 67 | 122 | 52.1% |
| Kec. B | 189 | 32 | 45 | 112 | 59.3% |
| Kec. C | 156 | 28 | 34 | 94 | 60.3% |
| Kec. D | 145 | 21 | 29 | 95 | 65.5% |
| Kec. E | 123 | 18 | 25 | 80 | 65.0% |

---

## 5. API Endpoints

### 5.1 Dashboard Data

```yaml
# GET /api/v1/dashboard/summary
parameters:
  - wilayah_id: integer (optional)
  - periode: string (daily|weekly|monthly)
response:
  {
    "indeks_kondisi": 78.5,
    "trend": "up",
    "perubahan": 0.7,
    "ews_status": "aman",
    "ews_color": "green",
    "pengaduan_aktif": 1247,
    "pengaduan_trend": -12.5,
    "sentimen_positif": 62.3,
    "sentimen_negatif": 37.7,
    "realisasi_apbd_pct": 68.2,
    "realisasi_apbd_rp": "Rp 2.4T",
    "target_apbd_rp": "Rp 3.5T"
  }

# GET /api/v1/dashboard/opd-scorecard
parameters:
  - sort_by: string (skor|ranking|perubahan)
  - limit: integer (default: 10)
  - order: string (asc|desc)
response:
  {
    "data": [
      {
        "id_opd": 1,
        "nama_opd": "Dinas Kesehatan",
        "skor": 92,
        "trend": "up",
        "peringkat": 1,
        "detail": {
          "waktu_respon": 4.2,
          "penyelesaian_pct": 91.0,
          "ikm": 92.5,
          "realisasi_program": 78,
          "efisiensi_anggaran": 85
        }
      }
    ],
    "last_updated": "2026-04-07T10:30:00Z"
  }

# GET /api/v1/dashboard/map-data
parameters:
  - layer: string (aduan|risk|proyek|infra)
  - zoom_level: integer
  - bounds: object {north, south, east, west}
response:
  {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [106.845, -6.214]
        },
        "properties": {
          "id": 1,
          "kategori": "jalan",
          "status": "rusak",
          "prioritas": "tinggi",
          "jumlah_aduan": 45
        }
      }
    ]
  }
```

### 5.2 Real-time WebSocket

```javascript
// WebSocket: wss://api.ris-daerah.go.id/ws/dashboard

// Subscribe to updates
{
  "action": "subscribe",
  "channels": ["indeks_kondisi", "ews", "pengaduan", "sentimen"]
}

// Server push updates
{
  "channel": "pengaduan",
  "data": {
    "total": 1248,
    "baru": 3,
    "selesai": 5,
    "perubahan": 0.24
  },
  "timestamp": "2026-04-07T10:35:00Z"
}
```

---

## 6. Konfigurasi Alert

### 6.1 Threshold Configuration

```json
{
  "alerts": [
    {
      "id": "alert_001",
      "name": "Indeks Kondisi Menurun",
      "metric": "indeks_kondisi",
      "condition": "decrease",
      "threshold": 5,
      "unit": "points",
      "severity": "medium",
      "recipients": ["sekda", "asisten"],
      "channels": ["email", "push", "sms"]
    },
    {
      "id": "alert_002",
      "name": "Pengaduan Meningkat Drastis",
      "metric": "pengaduan_count",
      "condition": "increase",
      "threshold": 50,
      "unit": "percent",
      "timeframe": "24h",
      "severity": "high",
      "recipients": ["kepala_daerah", "sekda"],
      "channels": ["push", "sms"]
    },
    {
      "id": "alert_003",
      "name": "Sentimen Negatif Tinggi",
      "metric": "sentimen_negatif",
      "condition": "above",
      "threshold": 60,
      "unit": "percent",
      "severity": "high",
      "recipients": ["humas", "kepala_daerah"],
      "channels": ["email", "push"]
    }
  ]
}
```

### 6.2 Severity Levels

| Level | Warna | Aksi | Notifikasi |
|-------|-------|------|------------|
| LOW | Hijau | Log saja | - |
| MEDIUM | Kuning | Notify OPD terkait | Email, In-app |
| HIGH | Merah | Escalate ke pimpinan | Push, SMS, Email |
| CRITICAL | Merah Berkedip | Emergency response | All channels + Call |

---

## 7. Spesifikasi Teknis

### 7.1 Frontend Requirements

| Komponen | Library | Versi |
|----------|---------|-------|
| Framework | React | 18.x |
| Charting | Apache ECharts | 5.x |
| Maps | Leaflet / Mapbox GL | Latest |
| Data Grid | AG Grid | 31.x |
| State Management | Redux Toolkit | 2.x |
| Real-time | Socket.io Client | 4.x |

### 7.2 Performance Requirements

| Metrik | Target | Ukuran |
|--------|--------|--------|
| Initial Load | < 3 detik | Lighthouse |
| Time to Interactive | < 5 detik | Lighthouse |
| Dashboard Refresh | < 500ms | API Response |
| Map Rendering | < 1 detik | Frame Load |
| Chart Animation | 300ms | CSS Transition |

### 7.3 Data Refresh Policy

| Data | Refresh Rate | Metode |
|------|--------------|--------|
| Indeks Kondisi | Real-time | WebSocket push |
| Pengaduan Count | Real-time | WebSocket push |
| Sentimen | Per jam | Scheduled job |
| APBD Realisasi | Harian | ETL batch |
| OPD Scorecard | Harian | ETL batch |
| GIS Data | Per 5 menit | Scheduled job |

---

## 8. Use Case Scenarios

### 8.1 Skenario Pemantauan Rutin

**Actor**: Kepala Daerah
**Goal**: Memantau kondisi daerah setiap pagi

```
1. Kepala Daerah membuka aplikasi RIS di tablet
2. Sistem menampilkan Dashboard Eksekutif
3. Kepala Daerah melihat:
   - Indeks Kondisi: 78.5 (naik dari kemarin)
   - EWS Status: AMAN (hijau)
   - 1,247 pengaduan aktif (turun 12%)
4. Kepala Daerah melihat ranking OPD
5. Kepala Daerah tap pada OPD dengan ranking terendah
6. Sistem menampilkan detail kinerja OPD tersebut
7. Kepala Daerah membuat catatan untuk rapat koordinasi
```

### 8.2 Skenario Respons Krisis

**Actor**: Sekda
**Goal**: Merespons alert early warning

```
1. Sistem mendeteksi lonjakan pengaduan banjir 200% dalam 2 jam
2. Alert triggered: severity HIGH
3. Sekda menerima notifikasi push + SMS
4. Sekda membuka dashboard dari notifikasi
5. Dashboard menampilkan:
   - Peta wilayah terdampak (highlight merah)
   - Jumlah pengaduan per kecamatan
   - Status tanggap darurat BPBD
6. Sekda mengklik "Activate Crisis Mode"
7. Sistem:
   - Mengirim notifikasi ke BPBD, PUPR, Damkar
   - Mengaktifkan monitoring khusus
   - Menampilkan crisis dashboard terpisah
8. Sekda monitoring progress real-time
```

### 8.3 Skenario Evaluasi Kinerja OPD

**Actor**: Tim Asisten Pemerintahan
**Goal**: Mengevaluasi kinerja OPD bulanan

```
1. Tim membuka modul Scorecard Kinerja OPD
2. Sistem menampilkan ranking semua OPD
3. Tim memilih OPD dengan ranking rendah
4. Sistem menampilkan drill-down:
   - Trend kinerja 6 bulan terakhir
   - Breakdown per metrik
   - Daftar pengaduan outstanding
5. Tim mengunduh laporan PDF
6. Tim membuat rekomendasi intervensi
```

---

## 9. Referensi Implementasi

### 9.1 Jakarta Smart City Dashboard

**URL**: https://smartcity.jakarta.go.id

**Fitur yang Diadaptasi**:
- Real-time performance dashboard
- Multi-layer GIS visualization
- Integration dengan Qlue dan CROP
- IBM Cognos Analytics untuk reporting

### 9.2 Alberta Economic Dashboard

**URL**: https://economicdashboard.alberta.ca

**Fitur yang Diadaptasi**:
- Custom dashboard builder
- Regional comparison tools
- Export functionality
- Mobile-responsive design

### 9.3 UNDP Crisis Risk Dashboard

**URL**: https://data.undp.org/products/crisis-risk-dashboard

**Fitur yang Diadaptasi**:
- Early warning visualization
- Risk scoring methodology
- Multi-dimensional indicators

---

*Dokumen ini merupakan bagian dari Dokumentasi Implementasi Sistem Intelijen Regional (RIS)*
*Modul: Dashboard Situasional | Versi: 1.0.0*
