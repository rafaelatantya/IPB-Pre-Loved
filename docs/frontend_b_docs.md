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
- **MANDATORY**: Gunakan `src/lib/video.js` untuk kompresi video ke **1080p 30fps H.264** sebelum dikirim ke backend!

Lokasi: `src/modules/admin/components/`
- `QCActionButtons.jsx` : Tombol aksi grup per-baris tabel antrean: ❌ Tolak dan ✅ Terima.

## ⚙️ Kebutuhan Data & Form Handling (Checklist Pengerjaan)
- [ ] **Validasi Formulir Zod**: Pastikan error tervisualisasi (warna merah) di tiap tag HTML jika user mem-bypass syarat.
- [ ] **Form State Feedback**: *Loading State* & *Disabled Button Submission* saat call API sedang di-proses oleh Backend (menghindari duplikasi R2/D1).
- [ ] **Dashboard Empty States**: Tabel *"Kosong"* jika user baru registrasi dan tidak punya produk jualan. Status tag Badge `Pending`/`Approved` harus dimarkup berdasarkan text.

## 🤖 Integrasi Backend (Panduan untuk AI Agent)
Frontend B bekerja dengan data terproteksi. Backend secara otomatis mengambil `userId` dari session, jadi Anda tidak perlu mengirimkannya sebagai parameter.

```javascript
// Import modular actions
import { getProducts, createProductWithImage, updateProduct, deleteProduct } from "@/modules/product/actions";
import { updateSellerProfile, getUserProfile } from "@/modules/user/actions";

// LIST PRODUKKU (Mode Penjual)
// Backend otomatis memfilter produk milik user yang login
const { data: myProducts } = await getProducts();

// UPDATE PRODUK
// PENTING: Jika role bukan ADMIN, status otomatis kembali ke PENDING!
const result = await updateProduct(productId, formData);

// UPDATE PROFIL (WhatsApp)
const updateResult = await updateSellerProfile({ whatsappNumber: "0812..." });
```

- **PENTING**: Saat memanggil `updateProduct`, informasikan kepada user bahwa barang akan masuk antrean moderasi ulang (status reset ke `PENDING`).
- **SECURITY**: Jangan pernah mengirim `userId` atau `role` dari client-side form. Backend sudah menanganinya secara aman di server.
