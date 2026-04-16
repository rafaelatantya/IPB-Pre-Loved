# IPB Pre Loved - AI Agent Context Rules

## 1. PROJECT IDENTITY & BACKGROUND
- **Name:** IPB Pre Loved (Kelompok 5 R3)
- **Problem:** Mahasiswa IPB kesulitan mencari/menjual barang bekas layak pakai.
- **Solution:** Platform web terpusat dan aman khusus IPB untuk jual-beli pre-loved.
- **Target Users:** Civitas Akademika IPB University.

## 2. TECH STACK
- **Front-End:** Next.js (App Router), React, Tailwind CSS, Shadcn UI.
- **Back-End:** Next.js Server Actions, Cloudflare D1 (SQLite), Cloudflare R2 (Object Storage).
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

---
*Note to AI: Read and adhere to these rules strictly whenever solving a task in this workspace.*
