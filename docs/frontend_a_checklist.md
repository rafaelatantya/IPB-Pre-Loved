# 📝 Checklist & Prioritas Tugas Frontend A (Public Storefront)

Sebagai **Frontend A**, tanggung jawab utama lo adalah **semua halaman publik yang dilihat langsung oleh pengunjung** (katalog, beranda, detail barang, dll) baik yang belum maupun yang sudah login.

Berikut adalah daftar pekerjaan lo diurutkan berdasarkan prioritas. (Banyak bagian UI yang udah kita bantu *scaffold* bareng-bareng tadi!).

---

## 🔴 Prioritas Tinggi (Wajib Ada & Fungsi Utama)
Ini adalah inti dari *IPB Pre-Loved* bagian publik.

- [x] **Setup Layout Global & Routing** (`src/app/(public)/layout.jsx`).
- [x] **Setup Navbar & Footer UI** (`Navbar.jsx` & `Footer.jsx`).
- [x] **Bikin Landing Page / Beranda** (`src/app/(public)/page.jsx`).
- [x] **Bikin Halaman Katalog Utama** (`src/app/(public)/catalog/page.jsx`).
- [ ] **Logika Pencarian & Filter Katalog**: Hook `SearchBar` dan `FilterSidebar` menggunakan `useSearchParams` bawaan NextJS biar kalau user ngetik atau nge-klik filter, URL-nya berubah dan barangnya ikut ke-*filter*.
- [ ] **Halaman Detail Produk Dinamis** (`src/app/(public)/product/[id]/page.jsx`): Tampilan saat barang diklik. Wajib ada gambar produk, info penjual, deskripsi, harga, dan tombol "Hubungi Penjual".
- [ ] **Fungsi Tombol WhatsApp** (`src/lib/whatsapp.js`): Bikin *helper function* buat ngirim pesan rapi ke WA penjual (contoh: *"Halo kak, saya tertarik beli barang X..."*). Pasang ini di tombol "Hubungi Penjual" yang ada di Halaman Detail Produk.

---

## 🟡 Prioritas Menengah (Penting untuk Fitur & Autentikasi)
Bagian ini berkaitan dengan interaksi user (*micro-interactions*) dan state pas user udah *Login*.

- [ ] **Dropdown Navbar (State Login)**: Kalau user udah login, ganti tombol "Masuk" di *Navbar* jadi *Avatar Profil* yang pas diklik muncul menu *dropdown* "Menuju Dashboard Penjual" (nanti di-link ke area Frontend B).
- [ ] **Halaman Wishlist** (`src/app/(public)/wishlist/page.jsx`): Tampilan bentuk *grid* biasa dari barang-barang yang user *like* /*save*.
- [ ] **Logika Tombol Hati (Wishlist)**: Di dalam `ProductCard` dan *Halaman Detail Produk*, bikin tombol hati bisa aktif/nonaktif pas diklik. (Sementara pakai *state* lokal aja sebelum databasenya siap).
- [ ] **Tampilan "Empty State" (Pencarian Kosong)**: Bikin desain visual kecil kalau pas nge-*search* nama barang, ternyata barangnya nggak ada di *array*.

---

## 🟢 Prioritas Rendah (Finishing & Aksesoris)
Dikerjakan belakangan kalau inti logika bisnisnya udah lancar.

- [ ] Merapikan tipografi produk (jarak antar huruf, presisi UI margin-padding) hingga *100% pixel-perfect* dengan desain Figma.
- [ ] Animasi pas *hover* (contoh: neken *ProductCard* ada efek melayang / *shadow*).
- [ ] Halaman statis tambahan (Syarat & Ketentuan / Panduan lengkap).

---

> **💡 Catatan Buat Lo:** 
> Lo bisa **fokus dulu ngerjain styling Halaman Detail Produk** dan **fungsi pencarian/filter di URL**. Bagian form jualan, dashboard admin, atau halaman edit produk **bukan urusan lo** (itu tugasnya Frontend B). Semangat bro! 
