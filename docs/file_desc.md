# 📂 KAMUS FILE (File Dictionary)

Dokumen ini berisi pemetaan dan fungsi dari skrip-skrip yang ada di dalam *repository* IPB Pre-Loved.
**[PERHATIAN AI]: WAJIB MENAMBAHKAN ENTRI BARU KE TABEL INI** setiap selesai membuat atau mengubah tujuan fungsionalitas file secara besar-besaran.

| File / Folder Path | Deskripsi Fungsi |
| --- | --- |
| `src/db/schema.js` | Struktur rancangan tabel database D1 menggunakan Drizzle ORM |
| `src/lib/db.js` | Helper koneksi Drizzle + Context Helpers (`getEnv`, `getContextDb`) |
| `src/lib/storage.js` | Inisiasi client/koneksi AWS S3-SDK untuk upload object ke Cloudflare R2 |
| `src/lib/auth.js` | Konfigurasi inti dan callback rules pembatasan domain NextAuth (SSO Google) |
| `src/app/api/auth/[...nextauth]/route.js` | Route handler yang mengakomodir standard fetch Edge dari library NextAuth |
| `src/middleware.js` | Midleware pelindung rute SSR Next.js berdasarkan Role (SELLER/ADMIN bypass rules) |
| `wrangler.toml` | Konfigurasi build Cloudflare Emulator, Binding Database ID, dan R2 ID |
| `agents.md` | Aturan konteks/batas suci mandat untuk semua AI di lingkungan project ini |
| `src/modules/admin/actions.js` | Server Actions khusus manajemen user dan inisialisasi DB |
| `src/modules/product/actions.js` | Server Actions untuk CRUD produk (dengan security owner logic) |
| `src/modules/category/actions.js` | Server Actions untuk manajemen kategori barang |
| `src/modules/wishlist/actions.js` | Server Actions untuk manajemen produk favorit (Wishlist) pembeli |
| `src/modules/catalog/services.js` | Business logic/Services untuk query data katalog publik (Approved, Featured, & Detail) |
| `docs/backend_docs.md` | Panduan teknis Backend & Integrasi Agent (Role-Based) |
| `jsconfig.json` | Konfigurasi path aliasing `@/*` untuk memudahkan import modul |
| `tailwind.config.js` | Konfigurasi framework CSS Tailwind untuk styling aplikasi |
| `src/app/globals.css` | File CSS global yang berisi direktif Tailwind dan desain sistem dasar |
| `src/app/login/page.js` | Halaman Login premium dengan integrasi Google OAuth |
| `src/app/AuthContext.js` | Client component wrapper untuk provide session NextAuth ke seluruh aplikasi |
| `local-db-info/` | Folder persitensi lokal untuk D1 Database dan R2 Storage (shared CLI & Server) |
| `src/app/admin-test/page.js` | Dashboard modular untuk pengujian CRUD Backend (User, Category, R2 Product) |
| `src/app/api/images/[...key]/route.js` | API Proxy untuk melayani file gambar dari R2 ke browser (Local & Prod) |
| `drizzle.config.js` | Konfigurasi Drizzle Kit untuk jalankan Drizzle Studio (Lokal & Remote) |
| `src/app/api/upload/route.js` | API Route untuk upload file besar ke R2 dengan progress bar support |
| `src/lib/upload.js` | Utility frontend untuk upload file via API dengan tracking progres (%) |
| `src/lib/video.js` | Utility frontend untuk kompresi video 1080p 30fps H.264 (FFmpeg) |
| `src/lib/image.js` | Utility frontend untuk kompresi gambar ke 12MP WebP |
| `src/modules/auth/actions.js` | Server Actions untuk manajemen pendaftaran dan proses onboarding role |
| `src/modules/user/actions.js` | Server Actions untuk manajemen profil user (Seller/Buyer Settings) |
| `src/modules/wishlist/actions.js` | Server Actions untuk manajemen produk favorit (Wishlist) pembeli |
