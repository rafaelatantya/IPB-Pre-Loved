# 🚀 BACKEND DOCS: IPB PRE LOVED

Selamat datang di *Backend Documentation* IPB Pre Loved! Dokumen ini dibuat agar kolaborasi antara **Backend** (Developer 1) dan **Frontend** (Developer 2 & 3) bisa berjalan mulus dan selaras dengan rancangan sistem (DFD, UML, LKP 5).

---

## 🛠️ 1. PEMBAGIAN KERJA & FOLDER STRUCTURE

Tim menggunakan **Next.js (App Router)** sebagai Full-Stack Framework.

### 💻 Developer 1: Backend (Data & Logic)
**Target:** Cloudflare D1 (Database), R2 (Storage), NextAuth (SSO IPB).
- `src/db/schema.js`: Master definisi tabel database (Drizzle ORM).
- `src/lib/db.js`: Koneksi Drizzle & Context Helpers (`getEnv`, `getContextDb`).
- `src/lib/storage.js`: Koneksi AWS S3 Client ke Cloudflare R2 untuk upload foto.
- `src/lib/auth.js` & `src/app/api/auth/[...nextauth]/route.js`: Integrasi Google OAuth.
- `src/modules/*/actions.js`: Server Actions modular (Admin, Product, Category).
- `src/modules/catalog/services.js`: Public services untuk fetching data katalog.

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

1. **`users`**: `id` (UUID), `name`, `email`, `role`, `whatsappNumber`, `createdAt`.
2. **`categories`**: `id` (UUID), `name`, `slug`.
3. **`products`**: `id` (UUID), `sellerId`, `categoryId` (Ref UUID), `title`, `description`, `price`, `condition`, `status`, `location`, `createdAt`.
4. **`product_images`**: `id` (UUID), `productId`, `r2Key`, `url`, `sortOrder`.
5. **`qc_reviews`**: `id` (UUID), `productId`, `adminId`, `decision`, `note`, `reviewedAt`.
6. **`wishlists`**: `id` (UUID), `userId`, `productId`, `createdAt`.

> [!IMPORTANT]
> **Kepada Seluruh Developer:** Kita menggunakan string **UUID (randomUUID)** sebagai Primary Key untuk semua tabel. Jangan gunakan integer auto-increment karena sering bermasalah saat bundling Edge functions di Cloudflare.

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
...
## 🔐 6. ROLE-BASED ACCESS CONTROL (RBAC) LOGIC
Untuk mendukung fitur multi-user, aplikasi menerapkan aturan tampilan dinamis berdasarkan role:

### 👤 Buyer / Seller Mode:
- **Users List**: Hidden (Privasi).
- **Category Management**: Hidden (Read-only).
- **Product Upload**: 
  - Penjual otomatis terkunci ke dirinya sendiri.
  - Status produk default: `PENDING`.
  - Tombol Approval: Hidden.

### 🛡️ Admin Mode:
- **Full Access**: Bisa melihat/menghapus user.
- **QC Manager**: Memiliki dashboard untuk melakukan `Accept/Reject` pada produk berstatus `PENDING`.
- **Direct Post**: Produk yang diupload Admin bisa langsung berstatus `APPROVED`.

Aplikasi Next.js IPB Pre Loved difokuskan berjalan di atas ekosistem Cloudflare. Jadi, keseluruhan aplikasi baik itu **Front-End Server Component** maupun **Back-End Server Actions/API** akan di-deploy ke **Cloudflare Pages**.

**Catatan Khusus untuk Developer Fullstack:**
- Kita akan menggunakan adapter `@cloudflare/next-on-pages` untuk mengubah Next.js project menjadi fungsi Edge/Cloudflare Workers (Pages Functions).
- Oleh karena itu, usahakan tidak menggunakan fitur eksklusif Node.js (seperti modul `fs`) yang tidak *compatible* dengan *Edge runtime*. 

---

## 💻 6. PANDUAN KOLABORASI LOKAL (UNTUK TEMAN-TEMAN FRONTEND)

Bagi teman-teman Frontend (Developer 2 & 3) yang ingin melakukan *testing UI/UX* dan menyambungkannya dengan fungsi backend di laptop masing-masing, ikuti langkah berikut:

1. **JANGAN MERUBAH DATABASE STRUCT:** Database D1 dikelola penuh oleh Backend.
2. **Setup Credentials (`.dev.vars`):** Kalian wajib meminta file `.dev.vars` kepada Developer Backend. File ini tidak di-*push* ke GitHub karena rahasia. Simpan file ini di *root directory*.
3. **Jalankan Aplikasi:** 
   - Instal semua *dependencies*: `npm install`
   - Setelah kalian login ke wrangler (`npx wrangler login`), kalian bisa langsung menggunakan **Database Asli (Remote) di Cloudflare** tanpa repot bikin *dummy* lokal!
    - Jalankan perintah ini untuk melakukan *remote connection* (Local UI -> Real D1 Database):
      `npm run build && npx wrangler pages dev .vercel/output/static --remote`
    - **PENTING (Local DB):** Jika kalian ingin testing database LOKAL, gunakan perintah:
      `npm run pages:dev`
      Data akan disimpan di folder `./local-db-info`. Jangan hapus folder ini jika ingin data tetap awet.

---

## 🤝 KESEPAKATAN PENTING
> [!IMPORTANT]
> 1. **Jangan instal package yang makan memori besar** atau berbayar, gunakan ekosistem Cloudflare.
> 2. **Dilarang bikin fitur Keranjang/Checkout/Chatting**, semuanya direct ke WhatsApp!
> 3. Jangan ubah *schema database* tanpa persetujuan lewat grup, karena ini ngaruh banget ke query UI/UX.

*Selamat ngoding, jangan lupa commit rutin ke GitHub!* 🔥

---

## 🤖 7. AGENT INTEGRATION GUIDE (FOR DEVELOPER 2 & 3)

Dokumen ini adalah kontrak antara Backend Agent dan Frontend Agent.

### A. Modular Server Actions
Jangan mengimpor dari file `actions.js` tunggal lagi. Gunakan modul spesifik:
```javascript
import { ... } from "@/modules/admin/actions";   // Manajemen User & DB
import { ... } from "@/modules/product/actions"; // CRUD Produk & QC
import { ... } from "@/modules/category/actions"; // Manajemen Kategori
import { getApprovedProducts } from "@/modules/catalog/services"; // Publik Katalog
```

### B. Role-Based Logic (Frontend Rules)
- **Cek Role**: Gunakan `const isAdmin = session?.user?.role === "ADMIN"`.
- **Privacy First**: Saat memanggil `getProducts`, jika user bukan admin, berikan parameter `session.user.id` agar mereka hanya melihat produk miliknya.
- **Security Check**: Saat memanggil `deleteProduct`, sertakan `id`, `session.user.id`, dan `session.user.role`. Backend akan memvalidasi kepemilikan.

---

## 📝 CHANGELOG
- **[22 Apr 2026] Backend Modularization & security Hardening:**
  - `[x] SELESAI` - Refaktor `actions.js` ke folder `src/modules/*`.
  - `[x] SELESAI` - Implementasi **Owner-Check** pada penghapusan produk.
  - `[x] SELESAI` - Penambahan `src/modules/catalog/services.js` untuk data `APPROVED`.
  - `[x] SELESAI` - Update UI `/admin-test` dengan logic filter privacy.

- **[21 Apr 2026] UUID Migration, Persistence Fix & User Sync:**
  - `[x] SELESAI` - Migrasi seluruh Primary Key dari `Integer` ke `UUID (Text)`.
  - `[x] SELESAI` - Unified Dashboard Logic: Implementasi Role-based UI di `/admin-test`.
  - `[x] SELESAI` - Admin QC Workflow: Fitur Accept/Reject produk PENDING oleh Admin.
