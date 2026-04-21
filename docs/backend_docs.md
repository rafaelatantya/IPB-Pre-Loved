# 🚀 BACKEND DOCS: IPB PRE LOVED

Selamat datang di *Backend Documentation* IPB Pre Loved! Dokumen ini dibuat agar kolaborasi antara **Backend** (Developer 1) dan **Frontend** (Developer 2 & 3) bisa berjalan mulus dan selaras dengan rancangan sistem (DFD, UML, LKP 5).

---

## 🛠️ 1. PEMBAGIAN KERJA & FOLDER STRUCTURE

Tim menggunakan **Next.js (App Router)** sebagai Full-Stack Framework.

### 💻 Developer 1: Backend (Data & Logic)
**Target:** Cloudflare D1 (Database), R2 (Storage), NextAuth (SSO IPB).
- `src/db/schema.js`: Master definisi tabel database (Drizzle ORM).
- `src/lib/db.js`: Koneksi ke Cloudflare D1.
- `src/lib/storage.js`: Koneksi AWS S3 Client ke Cloudflare R2 untuk upload foto.
- `src/lib/auth.js` & `src/app/api/auth/[...nextauth]/route.js`: Integrasi Google OAuth `@apps.ipb.ac.id`.
- `src/modules/*/actions.js`: Kumpulan **Server Actions** (`'use server'`) yang akan dipanggil oleh Frontend.

### 🎨 Developer 2: Frontend A (Mode Pembeli)
**Target:** UI/UX Katalog, Pencarian, Wishlist, Integrasi WhatsApp.
- `src/app/(public)/*`: Semua halaman yang bisa diakses user biasa (Katalog, Detail, Wishlist).
- `src/components/layouts/Navbar.jsx`: Harus berisi *Search Bar* dan *Tombol Switch Mode* (Pembeli/Penjual/Admin).
- `src/lib/whatsapp.js`: Fungsi untuk nge-generate link `wa.me` dengan pesan otomatis.

### 🏗️ Developer 3: Frontend B (Mode Dashboard & Penjual)
**Target:** Form Upload Produk, QC Dashboard, UI Shadcn.
- `src/app/(seller)/*` & `src/app/(admin)/*`: Halaman dashboard dengan *Sidebar*.
- `src/components/ui/*`: Copy-paste komponen *Shadcn UI* (Button, Input, Badge, Dialog, dll).
- Tanggung jawab bikin *form validasi* menggunakan tipe data yang disepakati dengan Backend (Zod).

---

## 🗄️ 2. DATABASE SCHEMA MANDATORY (DRIZZLE)

Berikut adalah struktur tabel yang harus diimplementasikan oleh Backend di `src/db/schema.js` berdasarkan UML Class Diagram:

1. **`users`**: `id`, `name`, `email`, `role`, `whatsappNumber`, `createdAt`.
2. **`categories`**: `id`, `name`, `slug`.
3. **`products`**: `id`, `sellerId`, `categoryId`, `title`, `description`, `price`, `condition`, `status` (PENDING/APPROVED/REJECTED), `location`, `createdAt`.
4. **`product_images`** *(Belum ada di code existing!)*: `id`, `productId`, `r2Key`, `url`, `sortOrder`.
5. **`qc_reviews`** *(Belum ada di code existing!)*: `id`, `productId`, `adminId`, `decision`, `note`, `reviewedAt`.
6. **`wishlists`**: `id`, `userId`, `productId`, `createdAt`.

> [!CAUTION]
> **Kepada Backend:** Jangan lupa definisikan `relations` dari Drizzle ORM agar join data antara produk, gambar, dan kategori jauh lebih mudah saat query!

---

## ⚡ 3. INTEGRASI FRONTEND & BACKEND (SERVER ACTIONS)

Frontend **DILARANG** melakukan query database secara langsung atau membuat API routes tradisional (`/api/...`) jika tidak perlu. Gunakan **Server Actions** yang dibuat oleh Backend.

**Contoh Alur Upload Barang:**
1. **Frontend B** me-render `ProductForm.jsx`.
2. User isi form dan pilih foto, lalu klik "Simpan".
3. **Frontend B** akan memanggil fungsi dari `src/modules/product/actions.js` (buatan Backend): `await submitProduct(formData)`
4. Di dalam `submitProduct`, **Backend** bertugas:
   - Upload file foto ke R2 via `src/lib/storage.js`.
   - Insert data teks dan URL foto ke database D1.
   - Return *success/error status* ke Frontend B.
5. **Frontend B** menampilkan notifikasi dan *redirect* ke halaman dashboard.

---

## 🔐 4. ATURAN AUTENTIKASI EKSKLUSIF

Sistem **TIDAK** menggunakan password. 
- Login hanya via *Google Workspace*.
- **Backend** HARUS memastikan middleware mengecek properti email: `if (!email.endsWith('@apps.ipb.ac.id')) throw new Error("Akses Ditolak")`.
- Kalau email tersebut belum ada di tabel `users`, sistem melakukan auto-register sebagai `BUYER` (sesuai Use Case).

---

## 🌐 5. DEPLOYMENT & HOSTING (CLOUDFLARE PAGES)

Aplikasi Next.js IPB Pre Loved difokuskan berjalan di atas ekosistem Cloudflare. Jadi, keseluruhan aplikasi baik itu **Front-End Server Component** maupun **Back-End Server Actions/API** akan di-deploy ke **Cloudflare Pages**.

**Catatan Khusus untuk Developer Fullstack:**
- Kita akan menggunakan adapter `@cloudflare/next-on-pages` untuk mengubah Next.js project menjadi fungsi Edge/Cloudflare Workers (Pages Functions).
- Oleh karena itu, usahakan tidak menggunakan fitur eksklusif Node.js (seperti modul `fs`) yang tidak *compatible* dengan *Edge runtime*. 

---

## 🤝 KESEPAKATAN PENTING
> [!IMPORTANT]
> 1. **Jangan instal package yang makan memori besar** atau berbayar, gunakan ekosistem Cloudflare.
> 2. **Dilarang bikin fitur Keranjang/Checkout/Chatting**, semuanya direct ke WhatsApp!
> 3. Jangan ubah *schema database* tanpa persetujuan lewat grup, karena ini ngaruh banget ke query UI/UX.

*Selamat ngoding, jangan lupa commit rutin ke GitHub!* 🔥

---

## 📝 CHANGELOG
- **[21 Apr 2026] Phase 2 & 3 Completed:**
  - Ditambahkan dependensi `next`, `react`, `@cloudflare/next-on-pages`, `@aws-sdk/client-s3`.
  - Dibuat `src/lib/storage.js` untuk R2 Client.
  - Dibuat setup `next-auth@beta` pada `src/lib/auth.js` dan route API.
  - Middleware dibuat untuk proteksi halaman `/seller` dan `/admin`.
