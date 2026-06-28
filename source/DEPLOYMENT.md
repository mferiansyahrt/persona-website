# Deployment — Situs Personal Feri

Stack produksi (semua **gratis**):

| Bagian | Layanan | Hasil |
|--------|---------|-------|
| Frontend (React/Vite) | **Netlify** | `https://persona-branding.netlify.app` |
| Backend (FastAPI + agno) | **Hugging Face Spaces** (Docker) | `https://feri09-feri-site-api.hf.space` |
| Database (chat history) | **Turso** (libSQL/SQLite) | `libsql://...turso.io` |
| LLM | **OpenRouter** | API key |

Alur: `Netlify (FE)` → HTTPS/SSE → `HF Space (BE)` → `Turso` + `OpenRouter`.

---

## 0. Yang perlu disiapkan

- Akun: **GitHub**, **Netlify**, **Hugging Face**, **Turso**.
- **OpenRouter API key** (openrouter.ai).
- Repo GitHub berisi folder `source/frontend` & `source/backend` (sudah ter-push).
- HF **access token** role **Write** (huggingface.co/settings/tokens) — untuk push ke Space.

> ⚠️ `.env` TIDAK pernah di-commit. Semua secret diisi via dashboard masing-masing layanan.

---

## 1. Turso (Database)

1. turso.tech → **Create Database** (nama bebas, region terdekat).
2. Ambil 2 nilai:
   - **Database URL** → `libsql://<db>-<user>.<region>.turso.io`
   - **Auth Token** → tab Connect / `turso db tokens create <db>`
3. Simpan keduanya untuk env HF Space (step 2).

Tabel dibuat **otomatis** oleh backend saat start (`init_db()`). Tidak perlu migrasi manual.

> Catatan: backend pakai transport **HTTP** (`libsql://` → `https://`), bukan WebSocket.

---

## 2. Backend → Hugging Face Spaces (Docker)

Backend di-deploy via **repo Space terpisah** (root Space = isi `source/backend`).

### a. Buat Space
- huggingface.co → **New Space** → SDK **Docker** → nama `feri-site-api` → Create.
- (SDK awal boleh apa saja; `README.md` kita ber-`sdk: docker` akan mengonversinya.)

### b. Buat HF Access Token (untuk git push ke Space)
HF **tidak menerima password akun** untuk git — wajib pakai **access token**.
1. huggingface.co/settings/tokens → **Create new token**.
2. Type **Write** (atau Fine-grained → centang **Repositories → Write access to contents/settings of all repos under your personal namespace**).
3. Beri nama → Create → **salin token** (format `hf_...`, hanya muncul sekali).

### c. Push kode ke Space
Dari root project:
```bash
git clone https://huggingface.co/spaces/<user>/feri-site-api hf-space
rsync -av --exclude='.venv' --exclude='data' --exclude='__pycache__' --exclude='.env' \
  source/backend/ hf-space/
cd hf-space
git add . && git commit -m "deploy backend"
git push
```
Saat `git push` diminta kredensial:
- **Username:** `<user>` (username HF Anda)
- **Password:** **tempel HF access token** `hf_...` (BUKAN password akun)

**Alternatif auth** (pilih salah satu):
```bash
# A. token langsung di URL remote
git remote set-url origin https://<user>:hf_xxx@huggingface.co/spaces/<user>/feri-site-api
git push

# B. login sekali via CLI (token disimpan)
pip install -U huggingface_hub
huggingface-cli login          # tempel token Write
git push
```
> ⚠️ Token = rahasia. Jangan commit ke repo. Jika bocor, revoke di settings/tokens lalu buat baru.

### c. Set Secrets (Space → Settings → *Variables and secrets*)
```
OPENROUTER_API_KEY   = sk-or-...
DEFAULT_MODEL        = deepseek/deepseek-v4-pro:nitro
DB_BACKEND           = turso
TURSO_DATABASE_URL   = libsql://...turso.io
TURSO_AUTH_TOKEN     = eyJ...
CORS_ORIGINS         = https://persona-branding.netlify.app
```
Space auto-rebuild. Cek: `https://<user>-feri-site-api.hf.space/api/health` → `{"status":"ok"}`, Swagger di `/docs`.

> Port **7860** (sudah diset di Dockerfile) — jangan diubah.

### d. Update backend berikutnya
`hf-space/` = repo HF (bukan GitHub). Untuk redeploy:
```bash
rsync -av --exclude='.venv' --exclude='data' --exclude='__pycache__' --exclude='.env' \
  source/backend/ hf-space/
cd hf-space && git add . && git commit -m "update" && git push && cd ..
```

---

## 3. Frontend → Netlify

1. netlify.com → **Add new site › Import from Git** → pilih repo, branch (`dev`).
2. Build settings:
   - **Base directory:** `source/frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `source/frontend/dist`
3. **Environment variables:**
   ```
   VITE_API_BASE_URL = https://<user>-feri-site-api.hf.space
   ```
4. Deploy → URL situs (mis. `https://persona-branding.netlify.app`).

---

## 4. Sambungkan CORS (wajib)

Di **HF Space → Secrets**, set `CORS_ORIGINS` = URL Netlify (tanpa trailing slash).
Boleh banyak, pisah koma: `https://persona-branding.netlify.app,http://localhost:5179`.
Tunggu Space rebuild → buka situs → tes chat.

---

## 5. Checklist verifikasi

- [ ] `…hf.space/api/health` → `{"status":"ok"}`
- [ ] `…hf.space/docs` terbuka
- [ ] Situs Netlify terbuka, section tampil
- [ ] Bubble chat → kirim pesan → jawaban streaming + sitasi
- [ ] Turso: jumlah baris `chat_messages` bertambah saat chat

---

## 6. Troubleshooting (error yang pernah terjadi)

| Gejala | Sebab | Solusi |
|--------|-------|--------|
| Netlify: `ERR_PNPM_OUTDATED_LOCKFILE` | ada `pnpm-lock.yaml` basi ikut ter-track | hapus dari repo + `.gitignore` (pakai `package-lock.json` saja) |
| Netlify: `No url found for submodule path 'hf-space'` | folder `hf-space/` (punya `.git` sendiri) ter-commit jadi gitlink | `git rm --cached hf-space` + `.gitignore` `hf-space/` |
| HF: `Forbidden control character detected in headers` | newline terselip di `TURSO_AUTH_TOKEN`/key | sudah ada `.strip()` di kode; pastikan secret tanpa baris ekstra |
| HF: `WSServerHandshakeError 400` (Turso) | transport WebSocket gagal | URL `libsql://` di-convert ke `https://` (sudah di kode) |
| Chat error CORS di browser | `CORS_ORIGINS` belum cocok / Space belum rebuild | set `CORS_ORIGINS` = URL Netlify, tunggu rebuild |
| Chat pertama lambat | cold start free tier | wajar; UX "AI sedang bangun tidur" sudah menangani |

---

## Catatan penting

- **Dua repo berbeda:** GitHub (`source/...`, deploy Netlify) ≠ HF Space (`hf-space/`, deploy backend). Jangan tercampur. `hf-space/` sudah di-`.gitignore` agar tidak ikut GitHub.
- **Edit kode selalu di `source/backend`** (source of truth), lalu rsync→push ke `hf-space` untuk deploy backend.
- Local dev: backend `DB_BACKEND=sqlite` (file `data/chat.db`); produksi `turso`.
