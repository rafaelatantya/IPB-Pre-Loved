# 🖥️ BACKEND MILESTONES

Gunakan file ini untuk tracking tugas-tugas sebagai Developer Backend (Data & Logic). Ubah status `[ ] BELUM` menjadi `[x] SELESAI` setiap kali ada milestone spesifik yang berhasil dikerjakan.

---

## Phase 1: Database Setup & Drizzle ORM
- `[x] SELESAI` - Inisiasi Schema Dasar: `users`, `categories`, `products`, `wishlists` (Di file: `src/db/schema.js`)
- `[x] SELESAI` - Tambah Schema Baru: Tabel `product_images` dan `qc_reviews`
- `[x] SELESAI` - Definisi Relasi Tabel: Set-up block Drizzle `relations()` agar `products` nyambung ke images, category, dll.
- `[x] SELESAI` - Set up DB Connection: (File: `src/lib/db.js` binding ke `env.DB`)

## Phase 2: Cloudflare Resources Setup
- `[x] SELESAI` - AWS S3 Client / R2 Setup: Buat file koneksi S3 di `src/lib/storage.js` untuk R2.
- `[x] SELESAI` - Next-on-Pages Setup: Pastikan dependencies `@cloudflare/next-on-pages` running di project.

## Phase 3: Autentikasi SSO (Google Workspace)
- `[x] SELESAI` - Route Provider NextAuth: Bikin Catch-all route di `src/app/api/auth/[...nextauth]/route.js`.
- `[x] SELESAI` - Filter Domain `@apps.ipb.ac.id`: Validasi auto-register di callbacks signin `src/lib/auth.js`.
- `[x] SELESAI` - Route Guarding: File `src/middleware.js` buat ngamanin rute `/seller` dan `/admin`.
- `[x] SELESAI` - Manual Admin List: Implementasi `ADMIN_EMAILS` di `auth.js` untuk bypass role testing.

## Phase 4: Server Actions Foundation (The Brains)
- `[x] SELESAI` - Product Actions Foundation: Bikin form submission `createProductWithImage` untuk upload R2 dan D1 (File di: `src/actions.js`).
- `[x] SELESAI` - Local Sync Logic: Mekanisme sinkronisasi user session ke D1 via `/admin-test` untuk testing jualan.
- `[ ] BELUM` - Catalog Services: Fungsi fetch data barang *Approved* ke `src/modules/catalog/services.js`.
- `[ ] BELUM` - Admin QC Dashboard: Halaman khusus admin untuk Approve/Reject barang PENDING.

## Phase 5: Online Deployment & Security
- `[ ] BELUM` - Cloudflare Pages Deployment: Push kode ke repo dan hubungkan ke Dashboard Cloudflare.
- `[ ] BELUM` - Remote D1 Sync: Migrasi data dari lokal ke database online.
- `[ ] BELUM` - Image Bucket Policy: Setting public access URL untuk R2 images.
