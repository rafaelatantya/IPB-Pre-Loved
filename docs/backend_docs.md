# 🏗️ Dokumentasi Backend & Modular Monolith

Dokumen ini berisi standar teknis, struktur database, dan panduan integrasi bagi tim frontend untuk proyek **IPB Pre-Loved**.

## 🏰 System Boundaries & Access Control

### 👮 1. Matriks Akses (Role-Based)

| Fitur | Guest | Buyer | Seller | Admin |
| --- | :---: | :---: | :---: | :---: |
| Lihat Katalog Publik | ✅ | ✅ | ✅ | ✅ |
| Wishlist (Add/Remove) | ❌ | ✅ | ✅ | ✅ |
| Jual Barang (Create Listing) | ❌ | ❌ | ✅ | ✅ |
| Akses Dashboard Seller | ❌ | ❌ | ✅ | ✅ |
| Moderasi QC (Approve/Reject) | ❌ | ❌ | ❌ | ✅ |

### 📸 2. Aturan Media (Enforced)
- **Foto**: Max 5MB (WebP). Min 3 foto (atau 1 video + 1 foto).
- **Video**: Max 50MB (MP4 H.264). Durasi min 5 detik.
- **Enforcement**: Kompresi wajib di **Client-side** (Frontend) untuk menjaga performa Worker.

## 🚀 Filosofi Arsitektur
Kita menggunakan **Modular Monolith** dengan Next.js App Router. Setiap fitur utama (Auth, Product, Catalog, Admin, dll) memiliki folder modulnya sendiri di `src/modules/`.

### 3. Edge-Safe Authentication & Role Upgrade
Karena batasan runtime Cloudflare pada root path (`/`), sistem menggunakan arsitektur berikut untuk stabilitas:
- **Dedicated Upgrade API**: Proses upgrade Buyer ke Seller dilakukan via `POST /api/user/upgrade` untuk menghindari error 405 pada root path.
- **JWT Sinkronisasi**: Menggunakan fail-safe check di `src/lib/auth.js` yang memaksa re-fetch ke D1 jika user berstatus `ONBOARDING`.
- **Trust Host Policy & Dynamic Auth URL**: Mengaktifkan `AUTH_TRUST_HOST` dan custom injection di `src/app/api/auth/[...nextauth]/route.js` untuk memaksa protokol `https://` saat via Ngrok dan `http://` saat Localhost, sehingga NextAuth aman berjalan berdampingan tanpa config ganda.
- **Auto-Formatting WhatsApp**: Semua input nomor WhatsApp (Onboarding & Upgrade Profile) akan otomatis diubah ke format internasional Indonesia (`+62...`) di level API (Validation Transform & Backend Actions). Angka `0` di depan otomatis dihapus.

### 1. Keamanan & Role (Guard Logic)
Sistem memiliki 4 role utama:
- `GUEST`: Belum login. Cuma bisa liat Landing Page (Beranda). Akses ke Katalog & Detail Produk dilarang (Redirect ke Login).
- `ONBOARDING`: Sudah login IPB tapi belum pilih role (Buyer/Seller). Dipaksa masuk `/onboarding` oleh `OnboardingGuard`.
- `BUYER`: Pengguna umum yang bisa belanja & wishlist.
- `SELLER`: Pengguna yang bisa buka Dashboard Penjual & listing barang.
- `ADMIN`: Pengguna dengan akses ke QC Dashboard dan Bypass rute publik.

### 2. Alur Onboarding (Security First)
- User baru (Google Login) otomatis dapet role `ONBOARDING`.
- Tidak bisa akses beranda katalog sebelum pilih role via `/onboarding`.
- **Onboarding Guard**: Menggunakan komponen `OnboardingGuard.jsx` di Root Layout yang secara proaktif mengalihkan user `ONBOARDING` menjauh dari rute utama.
- Server Action: `completeOnboarding({ role, whatsappNumber })` dari `@/modules/auth/actions`.
- **Hard Rule**: Sekali role dipilih, user tidak bisa balik ke state `ONBOARDING`.

### 3. Alur Seller & QC (Bait & Switch Protection)
- **Automatic Status Reversion**: Jika seller mengedit produk yang sudah `APPROVED`, status produk otomatis kembali ke `PENDING`.
- Produk akan hilang dari katalog publik sampai Admin melakukan review ulang.
- Server Action: `updateProduct(id, formData)` dari `@/modules/product/actions`.

### 4. Modular Boundaries & Actions
Berikut daftar fungsi modular yang siap digunakan oleh Frontend:

| Modul | Fungsi Utama | Kegunaan |
| --- | --- | --- |
| **Media** | `POST /api/upload` | Upload file (Image/Video) dengan progress bar. |
| **Catalog** | `getApprovedProducts(filters)` | Ambil data publik dengan filter (Search, Price, Category, Condition). |
| **Catalog** | `getProductById(id)` | Detail produk lengkap (images + video + seller info). |
| **Product** | `createProduct({ urls, ... })` | Simpan produk (validasi aturan 3 foto / 1+1 video). |
| **Product** | `updateProduct(id, ...)` | Edit barang (status reset ke `PENDING` jika non-admin). |
| **Admin** | `reviewProduct(...)` | Admin Approve/Reject produk + Log review. |
| **Admin** | `getAdminInventory({page, limit})` | Ambil seluruh inventory produk (Paginated). |
| **Admin** | `getAdminUsers(search)` | Ambil seluruh database user (Searchable). |
| **Admin** | `deleteUser(id)` | Hard delete user + Cascade delete semua produknya. |
| **User** | `updateSellerProfile(...)` | Update nomor WhatsApp di Settings. |
| **Notification** | `getNotifications()` | Ambil daftar notifikasi user (Real-time logs). |
| **Notification** | `markAsRead(id)` | Tandai notifikasi sebagai sudah dibaca. |
| **Product** | `trackWhatsAppClick(id)`| Increment counter leads (Engagement analytics). |
| **Admin** | `getAdminDashboardStats()` | Ambil agregasi stats (User, Products, Sold, Leads). |

## 🛠️ Aturan Pengembangan (PENTING)

> [!IMPORTANT]
> 1. **Jangan instal package yang makan memori besar** atau berbayar, gunakan ekosistem Cloudflare.
> 2. **Dilarang bikin fitur Keranjang/Checkout/Chatting**, semuanya direct ke WhatsApp!
> 3. Jangan ubah *schema database* tanpa persetujuan lewat grup. Pastikan jalankan `npm run db:generate` jika mengubah `schema.js`.
> 4. **Middleware Protection**: Seluruh rute `/catalog` dan `/product` wajib login (Internal IPB Only).

---

## 🤖 7. AGENT INTEGRATION GUIDE (FOR DEVELOPER 2 & 3)

Dokumen ini adalah kontrak antara Backend Agent dan Frontend Agent.

### A. Modular Server Actions
Jangan mengimpor dari file `actions.js` tunggal lagi. Gunakan modul spesifik:
```javascript
import { ... } from "@/modules/admin/actions";   // Manajemen User & DB
import { ... } from "@/modules/product/actions"; // CRUD Produk & QC
import { ... } from "@/modules/category/actions"; // Manajemen Kategori
import { ... } from "@/modules/wishlist/actions"; // Manajemen Wishlist
import { ... } from "@/modules/user/actions";     // Manajemen Profil
import { getApprovedProducts, getProductById, getFeaturedProducts } from "@/modules/catalog/services"; // Katalog & Detail
```

### B. Role-Based Logic (Frontend Rules)
- **Cek Role**: Gunakan `const isAdmin = session?.user?.role === "ADMIN"`.
- **Proteksi Halaman**: Gunakan middleware atau server-side checks untuk mengalihkan user non-onboarding menjauh dari `/onboarding`.
- **User Blocking**: Jika flag `isBlocked` di database diatur ke `true`, middleware wajib menghentikan akses user tersebut (Session Invalidated).

## 📊 8. Feature Logic & Edge Cases

### A. Sistem Notifikasi (Eternal Logs)
Notifikasi di IPB Pre-Loved dirancang sebagai **log abadi**. Data tidak akan dihapus otomatis agar pengguna memiliki riwayat interaksi yang jelas dengan Admin (QC Status, Ban Info, dll).
- **Trigger Otomatis**: QC Approved/Rejected, User Blocked/Unblocked, User Role Changed, Product Sold.
- **Timestamp**: Menggunakan format `integer` (milidetik) untuk menghindari bug 1970 di SQLite.

### B. Multi-Image & R2 Garbage Collection
Sistem secara proaktif menjaga kebersihan storage Cloudflare R2:
- **Delete Product**: Otomatis menghapus semua file gambar & video terkait di R2.
- **Update Product**: Melakukan *Diffing Logic*. Hanya foto yang benar-benar dihapus dari list yang akan dicleanup dari R2. Foto yang masih ada cuma diupdate urutannya.
- **Atomic Batch**: Menggunakan `db.batch` untuk memastikan integritas antara Database dan Storage.

### C. Status "SOLD" (Laku Terjual)
- Produk berstatus `SOLD` otomatis **disembunyikan** dari Katalog Publik, Produk Unggulan, dan Rekomendasi.
- Tetap muncul di Dashboard Penjual sebagai riwayat transaksi.
- Memberikan notifikasi "SUCCESS" otomatis ke penjual saat diaktifkan.

### D. Cloudflare D1 & Drizzle ORM Edge Cases (CRITICAL)
- **Mandatory `.run()` / `.execute()`**: Semua operasi Write (`db.insert`, `db.update`, `db.delete`) **WAJIB** diakhiri dengan `.run()` atau `.execute()`. Jika hanya menggunakan `await db.update(...)` tanpa eksekutor, Drizzle D1 **TIDAK AKAN** menjalankan query-nya (Silent Failure / "0 aksi").
- **Timestamp Integer Normalization**: Drizzle SQLite tidak memiliki tipe `Date` asli. Jangan pernah gunakan `{ mode: 'timestamp' }` di schema karena Next.js Edge Runtime akan salah mengkalkulasi Epoch (menjadi tahun 58304). Selalu gunakan `integer('created_at').default(sql\`(unixepoch() * 1000)\`)` untuk menyimpan milidetik secara natif.

### E. Moderasi Akun & Cascade Delete
- **Ban / Block User**: Memblokir pengguna akan mengubah status akun `isBlocked` menjadi `true`. Seluruh produk berstatus `APPROVED` milik pengguna tersebut otomatis diubah menjadi `ARCHIVED` (dihapus dari katalog publik, tapi tetap tersimpan). Saat di-unban, semua produk `ARCHIVED` otomatis dikembalikan ke `APPROVED`.
- **Session Eviction**: Sesi login pengguna yang di-ban otomatis ditolak pada refresh halaman berikutnya via validasi JWT di callback `jwt()`. Percobaan login baru akan diblokir dengan pesan dialog instruksi menghubungi admin.
- **Cascade Delete**: Menghapus akun user akan melakukan pemindaian produk terlebih dahulu untuk konfirmasi admin. Begitu disetujui, sistem menghapus ulasan QC, gambar produk relasional, produk milik user, dan barulah baris akun user tersebut dihapus secara atomik menggunakan transaksi batch `db.batch`. Seluruh proses dicatat secara mendalam di `adminLogs`.

### F. Manajemen Database Lokal Fast Reset
- Untuk melakukan reset database teks relasional tanpa menghapus dan mengunduh ulang gambar biner di R2 lokal (yang memakan waktu 35+ detik), tim pengembang dapat menjalankan `npm run db:reset:fast`. Ini hanya akan menyeka folder `./local-db-info/v3/d1` dan mengabaikan emulasi folder `/r2` sehingga reset database selesai dalam waktu kurang dari 3 detik dengan gambar yang tetap tampil sempurna di browser.

### G. Manajemen Database Cloud (Production) Reset
Untuk mengelola database produksi di Cloudflare Cloud (D1 & R2), tim pengembang memiliki 2 perintah utama di `package.json`:
- **Reset Total (`npm run db:reset:remote`)**: Menghapus seluruh tabel relasional di database produksi Cloudflare D1, menerapkan migrasi ulang dari awal, mengeksekusi seed SQL data, dan mengunduh serta mengunggah ulang seluruh gambar biner produk awal (seeding) ke Cloudflare R2 secara sekuensial. Gunakan ini jika terdapat perubahan struktur tabel (skema) yang bersifat destruktif.
- **Reset Cepat (`npm run db:reset:fast:remote`)**: Menghapus baris seluruh data di database produksi Cloudflare D1 (tanpa merusak skema tabel), menerapkan migrasi pending, dan meng-execute seed SQL data baru. Perintah ini **sama sekali tidak menyentuh/menghapus storage R2 produksi**, sehingga seluruh gambar produk bawaan tetap utuh, terhubung sempurna, dan reset selesai dalam waktu kurang dari 5 detik!
