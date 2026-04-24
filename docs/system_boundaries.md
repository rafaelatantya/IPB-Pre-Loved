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
- **Batas Ukuran**: Maksimal **5MB** per file.
- **Format**: JPEG, PNG, WEBP.
- **Minimal**: 3 Foto (jika tanpa video).
- **Compression**: Sangat disarankan kompresi di sisi client sebelum upload untuk menghemat bandwidth.

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
3. **Session Consistency**: `userId` selalu diambil dari session server (`getAuth()`), bukan dari parameter client-side.
4. **Image Proxy Access**: Akses ke `/api/images/*` hanya diizinkan untuk folder `products/`.

---

## 🚦 4. Alur Status Produk (State Machine)
- `PENDING`: Baru diupload atau baru diedit. Tidak muncul di katalog publik.
- `APPROVED`: Sudah divalidasi Admin. Muncul di katalog.
- `REJECTED`: Ditolak Admin (disertai alasan). Tidak muncul di katalog.
