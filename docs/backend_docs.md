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
| **User** | `updateSellerProfile(...)` | Update nomor WhatsApp di Settings. |

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
