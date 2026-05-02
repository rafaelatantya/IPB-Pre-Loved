# 🛠️ Dokumentasi Frontend B: Dashboard Penjual & Admin QC

## 🎯 Fokus Utama
Developer Frontend B berkuasa penuh atas halaman manajerial terproteksi. Tugas ini menuntut ketelitian pada manajemen validasi Form, interaktivitas Upload Gambar (Cloudflare R2), dan status Tabel/Dashboard.

## 📂 Pemetaan File & Rute
Berfokus pada rute Group Terproteksi `(seller)` untuk penjual dan `(admin)` untuk halaman Quality Control.

### 1. Rute Dasbor (Pages & Layout)
- `src/app/(seller)/layout.jsx` : Layout Mode Penjual. Sisipkan komponen `Sidebar.jsx`. Menampilkan area kerja utama di sebelah kanannya.
- `src/app/(seller)/dashboard/page.jsx` : Menampilkan tabel `List Produkku` dengan status *badge* yang jelas (Pending/Disetujui/Ditolak).
- `src/app/(seller)/product/add/page.jsx` : Laman utuh penambahan Barang. Tempat memanggil form submission ke Backend.
- `src/app/(admin)/dashboard/page.jsx` : Dashboard utama Admin (Statistik & Overview Antrean).
- `src/app/(admin)/admin/queue/page.jsx` : Laman Moderasi "Doom Scroll". Menampilkan satu per satu barang PENDING untuk di-QC secara berantai.
- `src/app/(admin)/admin/inventory/page.jsx` : Inventori global seluruh barang (Approved/Pending/Sold).
- `src/app/(admin)/admin/users/page.jsx` : Manajemen akun user (Ban/Unban/Delete).

### 2. Komponen Antarmuka (UI Components)
Lokasi: `src/components/ui/` (Komponen *Shadcn*)
- Setup & Import *stateless* forms Shadcn: `input.jsx`, `select.jsx`, `dialog.jsx`, `button.jsx`, `badge.jsx`.

Lokasi: `src/components/layouts/`
- `Sidebar.jsx` : Navigasi Kiri (Vertical Menu) dashboard.

Lokasi: `src/modules/product/components/`
- `ProductForm.jsx` : Form dinamis. Input Fields: Nama Produk, Harga (angka), Kondisi Barang, Kategori, Deskripsi.
- `ImageUploader.jsx` : Area *Drag & Drop* foto R2. (Tampilkan *preview* gambar).
- **MANDATORY (Video)**: Gunakan `src/lib/video.js` untuk kompresi video ke 1080p 30fps H.264!
- **MANDATORY (Image)**: Gunakan `src/lib/image.js` untuk kompresi foto ke **12MP WebP (Quality 0.8)** sebelum dikirim ke backend!

Lokasi: `src/modules/admin/components/`
- `QCActionButtons.jsx` : Tombol aksi grup per-baris tabel antrean: ❌ Tolak dan ✅ Terima.

## ⚙️ Kebutuhan Data & Form Handling (Checklist Pengerjaan)
- [ ] **Validasi Formulir Zod**: Pastikan error tervisualisasi (warna merah) di tiap tag HTML jika user mem-bypass syarat.
- [ ] **Form State Feedback**: *Loading State* & *Disabled Button Submission* saat call API sedang di-proses oleh Backend (menghindari duplikasi R2/D1).
- [ ] **Dashboard Empty States**: Tabel *"Kosong"* jika user baru registrasi dan tidak punya produk jualan. Status tag Badge `Pending`/`Approved` harus dimarkup berdasarkan text.

## 🤖 Integrasi Backend (Panduan untuk AI Agent)
Frontend B bekerja dengan data terproteksi. Backend secara otomatis mengambil `userId` dari session, jadi Anda tidak perlu mengirimkannya sebagai parameter.

```javascript
// Import modular actions & utilities
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/modules/product/actions";
import { uploadWithProgress } from "@/lib/upload";

// UPLOAD MEDIA DENGAN PROGRESS BAR
// Jangan gunakan Server Action untuk upload file besar (Video).
// Gunakan helper ini untuk mendapatkan persen progress:
const result = await uploadWithProgress(file, "video", (percent) => {
  console.log(`Upload progress: ${percent}%`);
});

// CREATE PRODUK (Kirim URL hasil upload tadi)
const productResult = await createProduct({ 
  formData, 
  imageUrls: [result.url], // Gunakan URL dari API Upload
  ... 
});
```


## 🛡️ Alur Kerja Admin QC (Doom Scroll)
Halaman `/admin/queue` menggunakan desain **Doom Scroll** untuk efisiensi tinggi:
1. **Single View**: Admin hanya melihat satu barang paling depan di antrean.
2. **Instant Action**: Tombol Approve/Reject memproses barang dan otomatis memicu *state update* untuk menampilkan barang berikutnya.
3. **Verdict Note**: Setiap penolakan (Reject) wajib menyertakan alasan yang akan dikirimkan sebagai notifikasi ke penjual.

## 👥 Kontrol Moderasi User
Admin memiliki wewenang penuh atas akun pengguna:
- **Ban Account**: Mengubah flag `isBlocked` menjadi true. User tidak akan bisa login.
- **Delete Account**: Melakukan *Hard Delete* pada tabel User. Semua produk milik user tersebut akan terhapus secara otomatis (*Cascade Delete*).
- **Self-Protection**: Sistem secara otomatis mencegah Admin untuk memblokir atau menghapus akun mereka sendiri melalui pengecekan `session.user.id`.

- **PENTING**: Saat memanggil `updateProduct`, informasikan kepada user bahwa barang akan masuk antrean moderasi ulang (status reset ke `PENDING`).
- **SECURITY**: Jangan pernah mengirim `userId` atau `role` dari client-side form. Backend sudah menanganinya secara aman di server.
