# 📂 KAMUS FILE (File Dictionary)

Dokumen ini berisi pemetaan dan fungsi dari skrip-skrip yang ada di dalam *repository* IPB Pre-Loved.
**[PERHATIAN AI]: WAJIB MENAMBAHKAN ENTRI BARU KE TABEL INI** setiap selesai membuat atau mengubah tujuan fungsionalitas file secara besar-besaran.

| File / Folder Path | Deskripsi Fungsi |
| --- | --- |
| `src/db/schema.js` | Struktur rancangan tabel database D1 menggunakan Drizzle ORM |
| `src/lib/db.js` | Helper koneksi adapter dari ORM Drizzle ke env DB Cloudflare D1 |
| `src/lib/storage.js` | Inisiasi client/koneksi AWS S3-SDK untuk upload object ke Cloudflare R2 |
| `src/lib/auth.js` | Konfigurasi inti dan callback rules pembatasan domain NextAuth (SSO Google) |
| `src/app/api/auth/[...nextauth]/route.js` | Route handler yang mengakomodir standard fetch Edge dari library NextAuth |
| `src/middleware.js` | Midleware pelindung rute SSR Next.js berdasarkan Role (SELLER/ADMIN bypass rules) |
| `wrangler.toml` | Konfigurasi build Cloudflare Emulator, Binding Database ID, dan R2 ID |
| `agents.md` | Aturan konteks/batas suci mandat untuk semua AI di lingkungan project ini |
| `src/actions.js` | Kumpulan Next.js Server Actions untuk interaksi database (D1) |
| `docs/backend_docs.md` | Panduan teknis khusus Backend untuk setup D1, R2, dan Server Actions |
| `jsconfig.json` | Konfigurasi path aliasing `@/*` untuk memudahkan import modul |
| `tailwind.config.js` | Konfigurasi framework CSS Tailwind untuk styling aplikasi |
| `src/app/globals.css` | File CSS global yang berisi direktif Tailwind dan desain sistem dasar |
| `src/app/login/page.js` | Halaman Login premium dengan integrasi Google OAuth |
| `src/app/AuthContext.js` | Client component wrapper untuk provide session NextAuth ke seluruh aplikasi |
| `local-db-info/` | Folder persitensi lokal untuk D1 Database dan R2 Storage (shared CLI & Server) |
| `src/app/admin-test/page.js` | Dashboard modular untuk pengujian CRUD Backend (User, Category, R2 Product) |
| `drizzle.config.js` | Konfigurasi Drizzle Kit untuk jalankan Drizzle Studio (Lokal & Remote) |
