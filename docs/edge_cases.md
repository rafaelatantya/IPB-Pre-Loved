# 🌪️ Edge Cases & "Crazy" Infrastructure Bugs

Dokumen ini mencatat masalah teknis non-trivial yang muncul akibat batasan infrastruktur (Cloudflare Workers, Next.js Edge, D1) dan bagaimana cara mengatasinya.

## 1. Cloudflare Root Path 405 (Method Not Allowed)
- **Symptom**: Klik tombol yang memicu Server Action di halaman utama (`/`) menghasilkan alert "Unexpected response" atau error 405 di terminal.
- **Root Cause**: Cloudflare Pages menganggap path `/` sebagai file statis (`index.html`) yang menolak request `POST`.
- **Ultimate Solution**: Jangan gunakan Server Action langsung di root path. Buat **API Route** khusus (misal: `/api/user/upgrade`) dan panggil menggunakan `fetch()` dari client. API Route di Cloudflare tidak memiliki batasan routing 405 seperti root path.

## 2. DNS Lookup Failed: internal_suspense_cache_hostname.local
- **Symptom**: Server Action crash (500 error) saat mencoba menjalankan `revalidatePath("/")`.
- **Root Cause**: Bug pada runtime `workerd` (Cloudflare) saat berinteraksi dengan sistem caching internal Next.js 15. Server mencoba mencari host internal untuk menghapus cache tapi gagal koneksi DNS.
- **Solution**: Matikan/comment semua fungsi `revalidatePath()` di Server Actions.
- **Workaround**: Gunakan `window.location.href = "/..."` di sisi Client setelah action sukses untuk memaksa browser memuat data segar.

## 3. JWT Sync Stale State (Amnesia Session)
- **Symptom**: User sudah berhasil update database (pilih role), tapi Middleware atau UI masih melihat user sebagai `ONBOARDING`.
- **Root Cause**: Next-Auth v5 di Edge Runtime tidak selalu melakukan re-fetch database secara otomatis kecuali dipicu manual.
- **Solution**:
    1. Tambahkan fail-safe check di `jwt` callback (`src/lib/auth.js`) yang akan memaksa query ke database D1 jika `token.role === "ONBOARDING"`.
    2. Gunakan `email` (verified) sebagai identifier utama untuk database update, bukan `userId` dari Google yang formatnya sering tidak konsisten dengan UUID database.

## 4. SQLITE_BUSY (Sequential Uploads)
- **Symptom**: Upload banyak media sekaligus menghasilkan error `database is locked`.
- **Root Cause**: Cloudflare D1 (SQLite) hanya mendukung satu operasi tulis pada satu waktu. Upload paralel yang terlalu cepat mengunci database.
- **Solution**: Gunakan loop **Sequential** (bukan `Promise.all`) untuk operasi yang menulis ke database secara bertubi-tubi di lingkungan lokal.

## 5. NextAuth PKCE InvalidCheck (Docker/Windows)
- **Symptom**: Login Google gagal dengan error `pkceCodeVerifier could not be parsed` di terminal Docker.
- **Root Cause**: Hostname mismatch antara browser (localhost) dan container, menyebabkan browser menolak mengirim balik cookie keamanan.
- **Solution**: 
    1. Set `AUTH_TRUST_HOST=true` di environment.
    2. Override `cookies.pkceCodeVerifier` di `src/lib/auth.js` dengan `secure: false` dan `sameSite: "lax"`.
    3. Selalu akses via `http://localhost:8788` (bukan IP).

## 6. The 1970 Timestamp Bug (String vs Integer)
- **Symptom**: Semua tanggal notifikasi atau produk muncul sebagai "1 Jan 1970".
- **Root Cause**: SQLite `CURRENT_TIMESTAMP` mengembalikan string ISO, sedangkan Drizzle mode `timestamp` mengharapkan `integer` (milidetik) untuk kolom bertipe `integer`.
- **Solution**: Gunakan `sql\`(unixepoch() * 1000)\`` sebagai default value di `schema.js` dan pastikan data diinput menggunakan `new Date().getTime()` atau biarkan Drizzle mengonversi `new Date()`.

## 7. R2 Storage Leak (Orphaned Media)
- **Symptom**: Storage R2 membengkak padahal barang sudah banyak yang dihapus.
- **Root Cause**: Menghapus baris data di Database (D1) tidak otomatis menghapus file fisik di R2. Begitu juga saat mengupdate foto produk.
- **Solution**: 
    - Gunakan **Diffing Logic** di `updateProduct`: Bandingkan list foto lama vs baru, hapus yang tidak terpakai dari R2.
    - Gunakan **Pre-deletion Fetch**: Ambil semua `r2Key` sebelum menghapus produk dari database agar bisa dihapus dari R2 setelahnya.
    - **Note**: Selalu hapus database dulu baru R2 (atau sebaliknya) dalam satu alur kerja untuk menjaga sinkronisasi.

---
*Catatan: Dokumen ini wajib dibaca Agent AI sebelum melakukan perubahan besar pada alur Auth atau Media.*
