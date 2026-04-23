# 🛠️ Dokumentasi Frontend B: Dashboard Penjual & Admin QC

## 🎯 Fokus Utama
Developer Frontend B berkuasa penuh atas halaman manajerial terproteksi. Tugas ini menuntut ketelitian pada manajemen validasi Form, interaktivitas Upload Gambar (Cloudflare R2), dan status Tabel/Dashboard.

## 📂 Pemetaan File & Rute
Berfokus pada rute Group Terproteksi `(seller)` untuk penjual dan `(admin)` untuk halaman Quality Control.

### 1. Rute Dasbor (Pages & Layout)
- `src/app/(seller)/layout.jsx` : Layout Mode Penjual. Sisipkan komponen `Sidebar.jsx`. Menampilkan area kerja utama di sebelah kanannya.
- `src/app/(seller)/dashboard/page.jsx` : Menampilkan tabel `List Produkku` dengan status *badge* yang jelas (Pending/Disetujui/Ditolak).
- `src/app/(seller)/product/add/page.jsx` : Laman utuh penambahan Barang. Tempat memanggil form submission ke Backend.
- `src/app/(admin)/layout.jsx` : Layout Admin QC, mereplika layout Penjual, hanya beda tab sisi.
- `src/app/(admin)/dashboard/page.jsx` : Tabel `Antrean Produk Pending`. Mengandung wewenang tinggi bagi Admin.

### 2. Komponen Antarmuka (UI Components)
Lokasi: `src/components/ui/` (Komponen *Shadcn*)
- Setup & Import *stateless* forms Shadcn: `input.jsx`, `select.jsx`, `dialog.jsx`, `button.jsx`, `badge.jsx`.

Lokasi: `src/components/layouts/`
- `Sidebar.jsx` : Navigasi Kiri (Vertical Menu) dashboard.

Lokasi: `src/modules/product/components/`
- `ProductForm.jsx` : Form dinamis. Input Fields: Nama Produk, Harga (angka), Kondisi Barang, Kategori, Deskripsi.
- `ImageUploader.jsx` : Area *Drag & Drop* foto R2. (Tampilkan *preview* gambar).

Lokasi: `src/modules/admin/components/`
- `QCActionButtons.jsx` : Tombol aksi grup per-baris tabel antrean: ❌ Tolak dan ✅ Terima.

## ⚙️ Kebutuhan Data & Form Handling (Checklist Pengerjaan)
- [ ] **Validasi Formulir Zod**: Pastikan error tervisualisasi (warna merah) di tiap tag HTML jika user mem-bypass syarat.
- [ ] **Form State Feedback**: *Loading State* & *Disabled Button Submission* saat call API sedang di-proses oleh Backend (menghindari duplikasi R2/D1).
- [ ] **Dashboard Empty States**: Tabel *"Kosong"* jika user baru registrasi dan tidak punya produk jualan. Status tag Badge `Pending`/`Approved` harus dimarkup berdasarkan text.

## 🤖 Integrasi Backend (Panduan untuk AI Agent)
Frontend B bekerja dengan data terproteksi. Pastikan Agent menggunakan modular actions berikut:

```javascript
// Import modular actions
import { getProducts, deleteProduct } from "@/modules/product/actions";
import { updateProductStatus } from "@/modules/product/actions"; // QC Admin
import { getCategories } from "@/modules/category/actions";

// PRIVACY FIRST: List Produkku (Mode Penjual)
// Berikan sellerId agar user hanya melihat barangnya sendiri
const myProducts = await getProducts(session.user.id);

// SECURITY: Penghapusan Produk
// Wajib menyertakan ID user dan Role untuk validasi di backend
const result = await deleteProduct(productId, session.user.id, session.user.role);
```

- **PENTING**: Admin QC tetap bisa melihat semua produk dengan memanggil `getProducts()` tanpa parameter (null).
