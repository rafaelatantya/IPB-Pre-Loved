# Dokumentasi Frontend A: Mode Pembeli & Publik

## 🎯 Fokus Utama
Developer Frontend A bertanggung jawab penuh atas *user-facing storefront*, yaitu area katalog utama yang dapat dilihat oleh semua pengguna, baik yang belum maupun yang sudah login.

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
- `Navbar.jsx` : Komponen header. Mengandung nama "IPB Pre-Loved", *Global Search Bar* (opsional), tombol Wishlist (Icon Hati), dan *User Avatar Profile*. Di Profile Avatar inilah harus terdapat *Dropdown* "Switch ke Dashboard Penjual".
- `Footer.jsx` : Navigasi bawah statik (Copyright, Syarat ketentuan - statis saja cukup).

### 3. Utility & Helper
- `src/lib/whatsapp.js` : Tempat pembuatan fungsi khusus (helper). Fungsi ini akan melakukan generasi URL WhatsApp API (`wa.me`) dengan template otomatis: "Halo Kak [Nama Penjual], saya tertarik beli [Nama Barang] seharga [Harga] dari IPB Pre-Loved!".

## ⚙️ Kebutuhan Data & State Management (Checklist Pengerjaan)
- [ ] **State Pencarian/Filter**: Gunakan cara "Lift state up" (atau query string pada Next.js `useSearchParams`) agar `SearchBar.jsx` dan `FilterSidebar.jsx` dapat mengubah URL, lalu `page.jsx` (Server/Client) menangkap URL param untuk nge-fetch data yang relevan.
- [ ] **State Wishlist Lokal**: Di halaman detail, ikon 💖 harus responsif di klik. Siapkan status "Active / Not Active".
- [ ] **Data Dummy Dulu**: Sambil nunggu D1 & Drizzle rampung, buat Array Object Hardcode, contoh: `const products = [{ id: 1, title: 'Laptop', price: 9000000, condition: 'BEKAS' }]`.
- [ ] **Visual "Empty State"**: Jika filter menghasilkan *array* kosong, buat ilustrasi halaman (file SVG) dengan teks "Maaf, barang ini ndak nemu".

---

*Disetujui untuk: Developer Frontend A*
