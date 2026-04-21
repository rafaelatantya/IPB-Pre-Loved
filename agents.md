# IPB Pre Loved - AI Agent Context Rules

## 1. PROJECT IDENTITY & BACKGROUND
- **Name:** IPB Pre Loved (Kelompok 5 R3)
- **Problem:** Mahasiswa IPB kesulitan mencari/menjual barang bekas layak pakai.
- **Solution:** Platform web terpusat dan aman khusus IPB untuk jual-beli pre-loved.
- **Target Users:** Civitas Akademika IPB University.

## 2. TECH STACK
- **Front-End:** Next.js (App Router), React, Tailwind CSS, Shadcn UI.
- **Back-End / Server:** Next.js Server Actions, Cloudflare D1 (SQLite), Cloudflare R2 (Object Storage).
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
3. **Formal Mode for Docs:** Jika diminta membuat dokumen akademik (UML, DFD, LKP), gunakan gaya bahasa formal dan akademis.
4. **Casual Mode for Dev:** Jika membantu coding atau diskusi teknis, gunakan bahasa yang santai dan langsung pada intinya (praktis).

## 7. ROLE-BASED AGENT INSTRUCTIONS
Tim developer (coding) terdiri dari 3 entitas aktif di repository ini (1 Backend, 2 Frontend).
Jika user (prompt) belum menentukan peran apa yang sedang ia kerjakan di awal percakapan, **KAMU (AI) HARUS MENANYAKAN USER TERLEBIH DAHULU UNTUK MEMILIH PERAN.** Jangan sembarangan mengubah kode sampai peran dikonfirmasi.

Berikut panduan dan batasan unik untuk masing-masing peran:
- **Backend (Developer 1):** Fokus eksklusif pada `src/db/*`, `src/lib/*`, middleware, dan `actions.js`. Tugas utama merancang Drizzle Schema, Edge Workers `@cloudflare/next-on-pages`, D1, R2.
- **Frontend A (Mode Pembeli):** Jangan ubah Backend! Fokus pada UI/UX Katalog, Search, Wishlist (`src/app/(public)/*`) dan pembentukan link `wa.me`.
- **Frontend B (Mode Penjual/Admin):** Jangan ubah Backend! Fokus pada Form Upload Produk, Dashboard, Antrean QC (`src/app/(seller)/*`, `src/app/(admin)/*`). Tanggung jawab pada Form Validation via Zod dan memanggil `actions.js`.

**PANDUAN LINGKUNGAN LOKAL KOMUNAL:**
- Semua *developer* & *AI* HARUS asumsikan *local environment* tersimulasi via Cloudflare. Jika UI/UX melakukan testing database, AI Frontend wajib memastikan file `.dev.vars` (konfigurasi D1/R2 emulation) ada, dan tidak sembarangan memaksa `drizzle-kit push` tanpa persetujuan peran Backend.

---

## 8. 🚨 FRONTEND AI TESTING & TROUBLESHOOTING FLOW
Karena pengembangan frontend dan backend sangat terikat pada ekosistem Cloudflare, setiap *AI Agent* yang melayani developer Frontend (Frontend A & B) **WAJIB** mengikuti *flow* ini ketika mencoba men-jalankan *(run)* atau mencari jalan keluar dari *error* selama *testing*.

**Tahap 1: Verifikasi Pre-Flight (Sebelum Run)**
1. **Cek Kredensial:** Pastikan `.dev.vars` dan `.env.local` eksis. Jangan teruskan testing jika tidak ada.
2. **Cek Dependency:** Jalankan `npm install --legacy-peer-deps` (wajib pakai flag ini karena ada _conflict_ versi `next-on-pages` dan Next.js 15).

**Tahap 2: Execution Command (DILARANG PAKAI `npm run dev` BAE)**
- Secara bawaan, Next.js akan mendeteksi `next dev`. Tapi karena kita butuh *binding* Cloudflare D1/R2, AI HARUS meminta eksekusi ini ke terminal:
  `npm run build && npx wrangler pages dev .next --remote`
  *(Catatan: flag `--remote` menghubungkan frontend lokal langsung ke database Cloudflare di internet).*

**Tahap 3: Resolusi Error Spesifik (DO NOT HALLUCINATE FIXES)**
Jika command di Tahap 2 *error* atau *crash*, AI Frontend harus mendiagnosa berdasarkan daftar ini sebelum mengubah *source code*:
- **Error D1/Database Not Found:** Artinya flag `--remote` lupa disertakan, atau user belum login ke wrangler terminal (`npx wrangler login`). **JANGAN** pernah AI Frontend menjalankan migrasi database paksa (`drizzle-kit`). Suruh user koordinasi ke *Backend*.
- **Error API Route Fetching / Auth.js pecah:** Ingat ini Edge Workers! Node.js API tradisional seperti `fs` dan `path` tidak akan jalan. Cek *actions* apakah terbebas dari Node modules.
- **Error Hydration UI:** Frontend AI bebas memperbaiki kode React Components.

---

**ATURAN UPDATE DOCS (WAJIB DIIKUTI AI):**
Setiap kali ada fitur baru, aturan baru, atau perubahan struktur yang muncul selama kerja, *AI* HARUS langsung melakukan *update* (menambahkan log/catatan) ke dalam **dokumen resmi yang sesuai dengan *role* saat itu** (`docs/backend_docs.md` untuk Backend, `docs/frontend_a_docs.md` untuk Frontend A, atau `docs/frontend_b_docs.md` untuk Frontend B). Jangan sampai dokumen out-of-date.

---
*Note to AI: Read and adhere to these rules strictly whenever solving a task in this workspace.*
