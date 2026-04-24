# 🏰 System Boundaries & Access Control

Dokumen ini mendefinisikan batasan akses (RBAC) dan aturan sistem untuk setiap role pengguna di IPB Pre-Loved.

## 👮 1. Matriks Akses (Role-Based)

| Fitur | Guest | Buyer | Seller | Admin |
| --- | :---: | :---: | :---: | :---: |
| Lihat Katalog Publik | ✅ | ✅ | ✅ | ✅ |
| Lihat Detail Produk | ✅ | ✅ | ✅ | ✅ |
| Login Google (@apps.ipb.ac.id) | ❌ | ✅ | ✅ | ✅ |
| Wishlist (Add/Remove) | ❌ | ✅ | ✅ | ✅ |
| Jual Barang (Create Listing) | ❌ | ❌ | ✅ | ✅ |
| Edit/Hapus Barang Sendiri | ❌ | ❌ | ✅ | ✅ |
| Akses Dashboard Seller | ❌ | ❌ | ✅ | ✅ |
| Moderasi QC (Approve/Reject) | ❌ | ❌ | ❌ | ✅ |
| Blokir/Flag User | ❌ | ❌ | ❌ | ✅ |
| Edit Barang Milik Orang Lain | ❌ | ❌ | ❌ | ✅ |

---

## 🛠️ 2. Aturan Media & Penyimpanan

### 📸 Foto
- **Batas Ukuran**: Maksimal **5MB** per file (sebelum kompresi).
- **Format Output**: **WebP** (sangat disarankan untuk efisiensi).
- **Minimal**: 3 Foto (jika tanpa video).
- **Spesifikasi Teknis (Enforced)**:
    - **Resolusi**: Maksimal 12MP (long side 4032px).
    - **Target Kualitas**: 0.8 (80%) WebP compression.
- **Enforcement Plan**: Kompresi dilakukan di **sisi Client (Frontend)** menggunakan library seperti `browser-image-compression` untuk mengubah JPEG berat menjadi WebP ringan tanpa kehilangan detail 12MP-nya.

### 🎥 Video
- **Batas Ukuran**: Maksimal **50MB** per file.
- **Durasi Minimal**: 5 Detik.
- **Minimal**: 1 Video + 1 Foto (sebagai alternatif dari aturan 3 foto).
- **Format & Codec**: **MP4 (H.264)**.
- **Spesifikasi Teknis (Enforced)**:
    - **Resolusi**: Maksimal 1080p (FHD).
    - **Frame Rate**: 30 FPS.
    - **Bitrate**: VBR 5000kbps peak.
- **Enforcement Plan**: Kompresi wajib dilakukan di **sisi Client (Frontend)** menggunakan `ffmpeg.wasm` atau library sejenis sebelum di-upload ke backend untuk menjaga performa server edge.

---

### 🛡️ 3. Aturan Keamanan "Hardened"
1. **Bait & Switch Protection**: Setiap pengeditan pada produk yang sudah `APPROVED` akan memaksa status kembali ke `PENDING`.
2. **Domain Restriction**: Hanya email dengan domain `@apps.ipb.ac.id` yang diizinkan masuk (kecuali email admin yang didaftarkan khusus di environment).
3. **Internal Session Authority**: Never trust `userId` or `role` parameters passed from the client-side for sensitive operations. Always retrieve internally via `getAuth()`.
4. **MIME Validation**: API Upload hanya menerima file dengan header `image/*` atau `video/*`. Ekstensi file wajib sesuai dengan kontennya.
5. **Media URL Safety**: Fungsi `createProduct` hanya menerima URL yang berasal dari `/api/images/products/`. URL eksternal akan dibuang secara otomatis.
6. **Progress Bar Standard**: Semua upload media wajib menggunakan `/api/upload` (API Route) agar user mendapatkan feedback progress bar yang akurat.

---

## 🚦 4. Alur Status Produk (State Machine)
- `PENDING`: Baru diupload atau baru diedit. Tidak muncul di katalog publik.
- `APPROVED`: Sudah divalidasi Admin. Muncul di katalog.
- `REJECTED`: Ditolak Admin (disertai alasan). Tidak muncul di katalog.
