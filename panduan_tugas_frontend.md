# Panduan Langkah Awal Pengerjaan Frontend (IPB Pre-Loved)

Dokumen ini memandu apa saja yang harus dikerjakan terlebih dahulu oleh tim Frontend secara berurutan, dengan memisahkan tugas antara **Frontend A** dan **Frontend B**.

## 📋 Fase 1: Setup Proyek (Dikerjakan Bersama / Oleh Salah Satu)
*Sebelum membagi tugas, pastikan boilerplate proyek sudah siap.*

1. **Inisialisasi Proyek Next.js** (App Router).
2. **Install & Konfigurasi** Tailwind CSS dan Shadcn UI (config `components.json`).
3. **Membangun Struktur Folder** persis sesuai arsitektur (`/src/app/(public)`, `/src/app/(seller)`, `/src/modules`, dsb).
4. Siapkan file kosong untuk masing-masing komponen agar siap diubah-ubah secara mandiri oleh masing-masing developer.

---

## 🎨 DEVELOPER 2: FRONT-END A (Mode Pembeli)
*Fokus Utama: Layout Publik, Komponen Katalog, dan Detail Produk.*

### Langkah 1: Buat Komponen Global UI (Prioritas Tinggi)
1. `src/components/layouts/Navbar.jsx`
   - Buat kerangka Header (ada kotak Pencarian & Profile Avatar).
   - Siapkan Dropdown Profile (untuk *Switch Mode* nanti).
2. `src/components/layouts/Footer.jsx`
   - Kerangka Footer simpel.
3. `src/app/(public)/layout.jsx`
   - Pasang `Navbar` dan `Footer` di dalam struktur layout mode pembeli.

### Langkah 2: Buat Komponen Katalog (Prioritas Menengah)
1. `src/modules/catalog/components/ProductCard.jsx`
   - Buat card barang berisikan Thumbnail, Judul, Harga, dan Badge Kondisi.
2. `src/modules/catalog/components/SearchBar.jsx` & `FilterSidebar.jsx`
   - Buat UI input pencarian dan sidebar buat filter (Kategori, Harga).

### Langkah 3: Rangkai Halaman Utama & Fungsional (Prioritas Lanjut)
1. `src/app/(public)/page.jsx` (Katalog Utama)
   - Susun komponen bagian Filter, Search bar, dan mapping data ke Grid ProductCard.
   - PENTING: Gunakan *Mock Data* (JSON dummy) dulu sebelum integrasi Backend.
2. `src/app/(public)/product/[id]/page.jsx` (Detail Produk)
   - Selesaikan UI gambar produk (galeri besar), nama, harga lengkap, serta tombol "Hubungi via WhatsApp".
3. `src/lib/whatsapp.js`
   - Buat utility script logic untuk nge-generate string `wa.me/628xxx...` dengan template pesan dinamis sesuai instruksi use case.
4. `src/app/(public)/wishlist/page.jsx`
   - Buat halaman grid barang yang disukai. Siapkan versi *Empty State* dengan ilustrasi SVG kalau belum ada isinya.

---

## 🏗️ DEVELOPER 3: FRONT-END B (Dashboard Penjual & Admin)
*Fokus Utama: Layout Dashboard, Form Input, Upload Gambar, dan Table QC.*

### Langkah 1: Setup UI Components Dasar (Prioritas Tinggi)
1. **Install komponen khusus Form pakai Shadcn UI** ke `src/components/ui/`
   - Wajib di-setup duluan: `input.jsx`, `select.jsx`, `textarea.jsx`, `dialog.jsx`, `badge.jsx`, dan `button.jsx`.
2. `src/components/layouts/Sidebar.jsx`
   - Buat desain navigasi samping. Menu: "Produkku", "Tambah Produk", "Antrean QC".

### Langkah 2: Layouting Dashboard & Form Barang (Prioritas Menengah)
1. `src/app/(seller)/layout.jsx` & `src/app/(admin)/layout.jsx`
   - Terapkan layout dua kolom menggunakan `Sidebar.jsx` untuk area terproteksi ini.
2. Buat Komponen Form Khusus Penjual:
   - `src/modules/product/components/ProductForm.jsx` (Input judul, harga, kondisi, select box kategori).
   - `src/modules/product/components/ImageUploader.jsx` (UI Area drag-and-drop / upload foto untuk R2).

### Langkah 3: Rangkai Halaman Form & Tabel (Prioritas Lanjut)
1. `src/app/(seller)/product/add/page.jsx`
   - Gabungkan `ProductForm` serta `ImageUploader` di page ini. Usahakan UI/interaksinya (error validation state) sudah berjalan tanpa error.
2. `src/app/(seller)/dashboard/page.jsx`
   - Bikin bentuk UI bentuk Tabel / Panel list dari status barang penjual (⏳ Pending QC, ✅ Approve, ❌ Reject).
3. Modul Halaman Admin:
   - `src/modules/admin/components/QCActionButtons.jsx` (Desain dan siapkan popover/tombol Approve/Reject).
   - `src/app/(admin)/dashboard/page.jsx` (Buat wujud Grid/Tabel buat antrean barang yang harus di-review admin).

---

## 💡 Best Practice & Cara Kerja
1. Masing-masing developer **wajib** berkutat hanya di foldernya sendiri (Frontend A dengan jalur `(public)`, Frontend B dengan jaluar `(seller)/(admin)`) agar tidak terjadi konflik git saat nge-_merge_ bareng.
2. Jangan nunggu Backend kelar! Gunakan State lokal `useState` atau hardcode Object/Array JSON dulu sebagai *Mock Data* saat menyusun UI komponen.
