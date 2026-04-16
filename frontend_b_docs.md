# Dokumentasi Frontend B: Dashboard Penjual & Admin QC

## 🎯 Fokus Utama
Developer Frontend B berkuasa penuh atas halaman manajerial terproteksi. Tugas ini menuntut ketelitian pada manajemen validasi Form, interaktivitas Upload Gambar (R2), dan status Tabel/Dashboard.

## 📂 Pemetaan File & Rute
Berfokus pada rute Group Terproteksi `(seller)` untuk penjual dan `(admin)` untuk halaman Quality Control.

### 1. Rute Dasbor (Pages & Layout)
- `src/app/(seller)/layout.jsx` : Layout Mode Penjual. Sisipkan komponen `Sidebar.jsx`. Menampilkan area kerja utama di sebelah kanannya.
- `src/app/(seller)/dashboard/page.jsx` : Menampilkan tabel `List Produkku` dengan status *badge* yang jelas (Pending/Disetujui/Ditolak).
- `src/app/(seller)/product/add/page.jsx` : Laman utuh penambahan Barang. Tempat dipanggilnya komponen `ProductForm` & `ImageUploader`.
- `src/app/(seller)/product/[id]/edit/page.jsx` : Serupa dengan atas, namun datanya harus ter-*pre-fill*. (Gunakan saat rilis fitur Edit Nanti).

- `src/app/(admin)/layout.jsx` : Layout Admin QC, strukturnya dapat mereplikasi file Layout Penjual, hanya beda opsi menu tab sisi.
- `src/app/(admin)/dashboard/page.jsx` : Tabel `Antrean Produk Pending`. Mengandung wewenang tinggi bagi Admin.

### 2. Komponen Antarmuka (UI Components)
Lokasi: `src/components/ui/` (Komponen *Shadcn*)
- Harus melakukan setup & import komponen *stateless* atau generik dari Shadcn: `input.jsx`, `select.jsx`, `dialog.jsx` (Modal detail QC), `button.jsx`, `badge.jsx`.

Lokasi: `src/components/layouts/`
- `Sidebar.jsx` : Navigasi Kiri (Vertical Menu). Gunakan icon sederhana, misalnya Home, List Box, File Plus. 

Lokasi: `src/modules/product/components/`
- `ProductForm.jsx` : Form dinamis. Input Fields: Nama Produk, Harga (number), Kondisi Barang (Dropdown: Baru / Bekas / Seperti Baru), Kategori (Dropdown), Deskripsi (Text Area). 
- `ImageUploader.jsx` : Area *Drag & Drop* untuk mengunggah foto. Perlu memvisualisasikan *preview* gambar yang akan di-upload sebelum menekan simpan secara total.

Lokasi: `src/modules/admin/components/`
- `QCActionButtons.jsx` : Tombol aksi grup per-baris tabel: ❌ **Tolak (Reject)** dan ✅ **Terima (Approve)**. *Jika ditolak, bisa munculkan Modal Dialog Alasan Penolakan*.

## ⚙️ Kebutuhan Data & Form Handling (Checklist Pengerjaan)
- [ ] **Validasi Formulir**: Integrasikan skema Zod (mis. minimal judul 5 karakter, dilarang input harga 0 atau huruf) pada `ProductForm.jsx` menggunakan `react-hook-form` atau metode native Server Actions standard. Kasih warna merah/error text bila input gak sesuai syarat.
- [ ] **Form State Feedback**: Berikan status `Loading...` atau interaksi Disable Button "Simpan" ketika proses pengiriman sedang berlangsung (ke R2 maupun D1 DB). Hal ini mencegah "Double-Click Submission".
- [ ] **Dashboard States**: Visualisasikan tabel saat Data kosong. ("Belum ada barang, yuk tambah barang pertamamu!"). Gunakan `badge.jsx` Shadcn UI untuk Status produk. Warnai Status: *Hijau (Approved)*, *Kuning (Pending)*, dan *Merah (Rejected)*. PENTING!

---

*Disetujui untuk: Developer Frontend B*
