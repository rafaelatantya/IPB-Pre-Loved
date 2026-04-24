# 🎨 Dokumentasi Frontend A: Mode Pembeli & Publik

## 🎯 Fokus Utama
Developer Frontend A bertanggung jawab penuh atas *user-facing storefront*, yaitu area katalog utama yang dapat dilihat oleh semua pengguna, baik yang belum maupun yang sudah login. Fokus pada *User Experience* dan tampilan yang estetik.

## 📂 Pemetaan File & Rute
Developer A akan bekerja secara eksklusif di dalam sistem rute `(public)` dan beberapa spesifik modul.

### 1. Rute Halaman Utama (Pages & Layout)
- `src/app/(public)/layout.jsx` : File pembungkus utama untuk semua halaman publik. Di dalamnya harus di-import `Navbar.jsx` (atas) dan `Footer.jsx` (bawah).
- `src/app/(public)/page.jsx` : Halaman Katalog Utama. Merupakan *landing page* bagi pengunjung. 
- `src/app/(public)/product/[id]/page.jsx` : Halaman Detail Produk Dinamis. Menerima *params.id* produk.
- `src/app/(public)/wishlist/page.jsx` : Halaman Daftar Keinginan (Wishlist) yang terautentikasi (khusus *buyer* yang sudah login).

### 2. Komponen Antarmuka (UI Components)
Lokasi: `src/modules/catalog/components/`
- `ProductCard.jsx` : Entitas terkecil produk (menampilkan foto utama, judul barang, harga, status kondisi). Harus merespons klik (Routing ke `/product/[id]`).
- `SearchBar.jsx` : Formulir input pencarian berdasarkan teks (judul). Terhubung ke URL Query Parameters.
- `FilterSidebar.jsx` : Accordion atau panel di sisi kiri berisi check-box / dropdown pilihan rentang harga & kategori.

Lokasi: `src/components/layouts/`
- `Navbar.jsx` : Komponen header. Mengandung nama "IPB Pre-Loved", *Global Search Bar* (opsional), tombol Wishlist (Icon Hati), dan *User Avatar Profile*. Di Profile Avatar inilah harus terdapat *Dropdown* "Switch ke Dashboard Penjual" (Tautan menuju `(seller)/dashboard`).
- `Footer.jsx` : Navigasi bawah statik.

### 3. Utility & Helper
- `src/lib/whatsapp.js` : Tempat pembuatan fungsi khusus (helper). Fungsi ini akan melakukan generasi URL WhatsApp API (`wa.me`) dengan template otomatis: "Halo Kak [Nama Penjual], saya tertarik beli [Nama Barang] seharga [Harga] dari IPB Pre-Loved!".

## ⚙️ Kebutuhan Data & State Management (Checklist Pengerjaan)
- [ ] **State Pencarian/Filter**: Gunakan `useSearchParams` agar `SearchBar.jsx` dan `FilterSidebar.jsx` memengaruhi URL untuk dimanfaatkan oleh server saat *fetch* data katalog.
- [ ] **State Wishlist Lokal**: Ikon Hati di halaman detail responsif secara langsung.
- [ ] **Visual "Empty State"**: Jika *search bar* tidak mencocokkan data apapun, tampilkan ilustrasi "Barang tidak temukan".

## 🤖 Integrasi Backend (Panduan untuk AI Agent)
Frontend A harus mengambil data produk yang statusnya **APPROVED** saja. Gunakan modular service berikut:

```javascript
// Import service katalog & wishlist
import { getApprovedProducts, getProductById, getFeaturedProducts } from "@/modules/catalog/services";
import { toggleWishlist, isProductWishlisted, getWishlist } from "@/modules/wishlist/actions";

// Contoh Ambil Katalog dengan Filter
const { data, pagination } = await getApprovedProducts({
  search: "Buku",
  minPrice: 0,
  maxPrice: 500000,
  sortBy: "cheapest" // "latest", "expensive"
});

// Contoh Cek Status Wishlist (Halaman Detail)
const wishlisted = await isProductWishlisted(productId);
```

- **PENTING**: Jangan melakukan filter status `APPROVED` secara manual di sisi client. Panggil service di atas agar hanya data yang valid yang dikirim oleh server.
- **PAGINATION**: Gunakan objek `pagination` (totalPages, currentPage) untuk membangun tombol navigasi halaman.
