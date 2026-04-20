# 🖥️ BACKEND MILESTONES

Gunakan file ini untuk tracking tugas-tugas sebagai Developer Backend (Data & Logic). Ubah status `[ ] BELUM` menjadi `[x] SELESAI` setiap kali ada milestone spesifik yang berhasil dikerjakan.

---

## Phase 1: Database Setup & Drizzle ORM
- `[x] SELESAI` - Inisiasi Schema Dasar: `users`, `categories`, `products`, `wishlists` (Di file: `src/db/schema.js`)
- `[x] SELESAI` - Tambah Schema Baru: Tabel `product_images` dan `qc_reviews`
- `[x] SELESAI` - Definisi Relasi Tabel: Set-up block Drizzle `relations()` agar `products` nyambung ke images, category, dll.
- `[x] SELESAI` - Set up DB Connection: (File: `src/lib/db.js` binding ke `env.DB`)

## Phase 2: Cloudflare Resources Setup
- `[ ] BELUM` - AWS S3 Client / R2 Setup: Buat file koneksi S3 di `src/lib/storage.js` untuk R2.
- `[ ] BELUM` - Next-on-Pages Setup: Pastikan dependencies `@cloudflare/next-on-pages` running di project.

## Phase 3: Autentikasi SSO (Google Workspace)
- `[ ] BELUM` - Route Provider NextAuth: Bikin Catch-all route di `src/app/api/auth/[...nextauth]/route.js`.
- `[ ] BELUM` - Filter Domain `@apps.ipb.ac.id`: Validasi auto-register di callbacks signin `src/lib/auth.js`.
- `[ ] BELUM` - Route Guarding: File `src/middleware.js` buat ngamanin rute `/seller` dan `/admin`.

## Phase 4: Server Actions Foundation (The Brains)
- `[ ] BELUM` - Catalog Services: Fungsi fetch data barang *Approved* ke `src/modules/catalog/services.js`.
- `[ ] BELUM` - Product Actions: Bikin form submission `submitProduct(formData)` untuk upload R2 dan D1 (File di: `src/modules/product/actions.js`).
- `[ ] BELUM` - Admin QC Actions: Bikin script fetch data pending & tombol lempar `processQC(decision)` (File di: `src/modules/admin/actions.js`).
