# IPB Pre Loved - AI Agent Context Rules

## 1. PROJECT IDENTITY & BACKGROUND
- **Name:** IPB Pre Loved (Kelompok 5 R3)
- **Problem:** Mahasiswa IPB kesulitan mencari/menjual barang bekas layak pakai.
- **Solution:** Platform web terpusat dan aman khusus IPB untuk jual-beli pre-loved.
- **Target Users:** Civitas Akademika IPB University.

## 2. TECH STACK
- **Front-End:** Next.js (App Router), React, Tailwind CSS, Shadcn UI.
- **Arsitektur Backend (Latest)**
- **Runtime**: Cloudflare Edge (Wrangler Pages Dev)
- **Database**: Cloudflare D1 (SQLite) dengan Drizzle ORM
- **Primary Keys**: Menggunakan **UUID String** (v4) untuk semua tabel (Categories, Users, Products, Wishlists) guna menghindari konflik auto-increment di environment Edge.
- **Persistence**: Database lokal disimpan di `./local-db-info`. Gunakan `--persist-to ./local-db-info` saat menjalankan CLI.
- **Storage**: Cloudflare R2 untuk upload gambar produk.
- **Image Serving**: Melalui API Proxy internal `/api/images/[key]` (Edge Function) untuk menjamin aksesibilitas gambar di lingkungan lokal dan produksi tanpa domain publik R2.
- **Deployment & Hosting:** Cloudflare Pages (ditembak via adapter `@cloudflare/next-on-pages`). Seluruh function akan di-build menjadi Edge workers. 
- **Authentication:** NextAuth (Google OAuth) - **Strictly limited to @apps.ipb.ac.id domain**.
- **ORM:** Drizzle ORM.

## 3. CORE FUNCTIONALITIES (IN-SCOPE)
1. **Google OAuth Login:** Hanya untuk akun IPB. Auto-register jika belum ada.
2. **Katalog & Filter:** Pencarian teks, filter by kategori & harga.
3. **Wishlist:** Pembeli dapat menyimpan barang.
4. **Manajemen Produk (Seller):** Upload foto, harga, deskripsi barang. Status default: `PENDING`.
5. **Validasi QC (Admin):** Approve/Reject barang PENDING agar bisa tampil di publik.
6. **Integrasi WhatsApp:** Arahkan ke WA penjual (menggunakan `wa.me` + pesan otomatis) untuk transaksi.

## 4. STRICT CONSTRAINTS (OUT-OF-SCOPE) - DO NOT IMPLEMENT!
- **NO INTERNAL PAYMENTS:** Tidak ada payment gateway atau dompet digital.
- **NO SHOPPING CART:** Checkout dilakukan murni via chat WhatsApp.
- **NO IN-APP CHAT:** Semua komunikasi logistik dan finansial dilakukan di luar platform.
- **NO COMPLEX PACKAGES:** Jangan sarankan package pihak ketiga yang berat atau berbayar. Gunakan kapabilitas Cloudflare sebanyak mungkin.

## 5. DATABASE SCHEMA (D1)
Sistem menggunakan `users` (BUYER/SELLER/ADMIN), `products` (PENDING/APPROVED/REJECTED), `categories`, `product_images`, `qc_reviews`, dan `wishlists`. 
Pastikan setiap interaksi database yang dibuat oleh AI menggunakan **Drizzle ORM** dan **Server Actions** (bukan API Routes `/api/...` jika memungkinkan).

## 6. AI BEHAVIORAL RULES FOR THIS REPO
1. **Scope Check:** Selalu rujuk ke "STRICT CONSTRAINTS" sebelum merancang solusi atau menulis kode.
2. **KISS (Keep It Simple, Stupid):** Prioritaskan MVP (Minimum Viable Product). Tim hanya punya batas waktu dan resource yang minim (max 5 jam/minggu per orang).
3. **Root Cause First:** DILARANG melakukan "UI Hacks" (seperti menambahkan opsi manual/shortcut) untuk menutupi bug di level data atau backend. Jika ada ketidaksinkronan data (misal: ID tidak cocok), AI WAJIB mencari akarnya di level Database, Auth, atau Actions sebelum menyentuh UI.
4. **Formal Mode for Docs:** Jika diminta membuat dokumen akademik (UML, DFD, LKP), gunakan gaya bahasa formal dan akademis.
5. **Casual Mode for Dev:** Jika membantu coding atau diskusi teknis, gunakan bahasa yang santai dan langsung pada intinya (praktis).
6. **Edge Case & Security First**: Always identify potential security holes or "happy-path-only" logic. Proactively suggest and implement guards (e.g., checking if a user owns a resource before deleting it).
7. **Automatic Status Reversion**: Any edit to an `APPROVED` product by a non-admin user MUST automatically set its status back to `PENDING` for re-review. This is a hard security rule to prevent "Bait & Switch" tactics.
8. **Internal Session Authority**: Never trust `userId` or `role` parameters passed from the client-side for sensitive operations (Update/Delete/Create). Always retrieve these values internally using `getAuth()` in Server Actions.
9. **System Boundaries Adherence**: Always read and follow the constraints defined in `docs/system_boundaries.md` for role-based access, media limits, and business rules.

## 7. ROLE-BASED AGENT INSTRUCTIONS
Tim developer (coding) terdiri dari 3 entitas aktif di repository ini (1 Backend, 2 Frontend).
Jika user (prompt) belum menentukan peran apa yang sedang ia kerjakan di awal percakapan, **KAMU (AI) HARUS MENANYAKAN USER TERLEBIH DAHULU UNTUK MEMILIH PERAN.** Jangan sembarangan mengubah kode sampai peran dikonfirmasi.

Berikut panduan dan batasan unik untuk masing-masing peran:
- **Backend (Developer 1):** Fokus eksklusif pada `src/db/*`, `src/lib/*`, middleware, dan modular actions di `src/modules/*/actions.js`. Tugas utama merancang Drizzle Schema, Edge Workers, D1, R2.
- **Frontend A (Mode Pembeli):** Jangan ubah Backend! Fokus pada UI/UX Katalog, Search, Wishlist menggunakan `src/modules/catalog/services.js`.
- **Frontend B (Mode Penjual/Admin):** Jangan ubah Backend! Fokus pada Dashboard, Antrean QC menggunakan `src/modules/product/actions.js` dan `src/modules/category/actions.js`.

**PANDUAN LINGKUNGAN LOKAL KOMUNAL:**
- Semua *developer* & *AI* HARUS asumsikan *local environment* tersimulasi via Cloudflare. Jika UI/UX melakukan testing database, AI Frontend wajib memastikan file `.dev.vars` (konfigurasi D1/R2 emulation) ada, dan tidak sembarangan memaksa `drizzle-kit push` tanpa persetujuan peran Backend.

---

## 8. 🚨 RUN & TESTING FLOW (READ CAREFULLY)
Untuk menjalankan project dari nol, semua AI Agent **WAJIB** mengikuti panduan resmi di [README.md](file:///home/lenovo/projects/IPB-Pre-Loved/README.md).

**Quick Summary for Agents:**
1. **Dependencies**: `npm install --legacy-peer-deps` (untuk menghindari konflik Next.js 15).
2. **Environment**: Copy `.dev.vars.example` ke `.dev.vars` dan isi secret keys.
3. **Database**: Selalu jalankan `npx wrangler d1 migrations apply DB --local` sebelum testing pertama kali.
4. **Execution**: Gunakan `npx wrangler dev` (Recommended) agar binding D1/R2 berfungsi dengan benar.

---

**ATURAN UPDATE DOCS & DICTIONARY (WAJIB DIIKUTI AI):**
1. Setiap kali ada fitur baru, aturan baru, atau perubahan struktur yang muncul selama kerja, *AI* HARUS melakukan *update* ke dalam **dokumen resmi yang sesuai dengan *role* saat itu** (`docs/backend_docs.md` atau `docs/frontend_a_docs.md` dll). Jangan sampai dokumen out-of-date.
2. Setiap kali Agent selesai membuat/mengubah secara signifikan suatu folder atau file, wajib untuk mencatatnya secara terpusat di `docs/file_desc.md` sebagai **Kamus File** project.

### Backend Handover Notes
- **Marketplace Logic**: Non-admin dapat melihat produk `APPROVED` milik orang lain, namun produk `PENDING` tetap terproteksi hanya untuk pemilik dan Admin.
- **Image Proxy**: Selalu gunakan path relatif `/api/images/` untuk menampilkan gambar dari R2.
- **Drizzle Studio**: Jalankan `npx drizzle-kit studio` untuk visualisasi data relasional secara GUI.
- **Run Dev**: Gunakan panduan di `README.md`.

---
*Note to AI: Read and adhere to these rules strictly whenever solving a task in this workspace.*
