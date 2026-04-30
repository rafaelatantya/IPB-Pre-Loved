-- GIGA SEED V7: THE UNIQUE EDITION (15 Products, 45 Unique Images, 3 Unique Videos)
-- Wajib jalankan: bash scripts/seed-media.sh sebelum db:wipe

DELETE FROM admin_logs;
DELETE FROM notifications;
DELETE FROM wishlists;
DELETE FROM qc_reviews;
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM users;

-- 1. KATEGORI
INSERT INTO categories (id, name, slug) VALUES 
('cat-buku', 'Buku & Modul', 'buku'),
('cat-elek', 'Elektronik', 'elektronik'),
('cat-kost', 'Kebutuhan Kost', 'kost'),
('cat-prak', 'Peralatan Praktikum', 'praktikum'),
('cat-fash', 'Fashion & Formal', 'fashion');

-- 2. USERS
INSERT INTO users (id, name, email, role, user_type, whatsapp_number) VALUES 
('user-admin', 'Admin IPB', 'admin@apps.ipb.ac.id', 'ADMIN', 'STAFF', '628111111111'),
('user-seller-1', 'Andi Seller', 'andi@apps.ipb.ac.id', 'SELLER', 'STUDENT', '6281234567890'),
('user-seller-2', 'Budi Seller', 'budi@apps.ipb.ac.id', 'SELLER', 'STUDENT', '6281122334455');

-- 3. PRODUCTS (15 Entri)
INSERT INTO products (id, seller_id, category_id, title, description, price, condition, status, location, video_url, video_duration) VALUES 
('p-1', 'user-seller-1', 'cat-elek', 'MacBook Air M1 2020 Space Grey', 'Barang simpanan, mulus 99%. Fullset original.', 9500000, 'LIKE_NEW', 'APPROVED', 'DRAMAGA', '/api/images/products/video_1.mp4', 10),
('p-2', 'user-seller-1', 'cat-buku', 'Buku Koding Python Dasar', 'Buku wajib buat yang mau belajar AI.', 120000, 'NEW', 'APPROVED', 'BARANANGSIANG', NULL, NULL),
('p-3', 'user-seller-1', 'cat-kost', 'Meja Lipat Kayu Pinus', 'Cocok buat kamar sempit. Bisa dilipat rapi.', 50000, 'CUKUP', 'APPROVED', 'CILIBENDE', '/api/images/products/video_2.mp4', 8),
('p-4', 'user-seller-2', 'cat-elek', 'Lampu Meja LED Eye-Care', 'Terang tapi nggak bikin mata sakit.', 85000, 'LIKE_NEW', 'APPROVED', 'DRAMAGA', NULL, NULL),
('p-5', 'user-seller-2', 'cat-prak', 'Kalkulator Casio FX-991EX', 'Kalkulator saintifik buat anak teknik/sains.', 250000, 'GOOD', 'APPROVED', 'BARANANGSIANG', NULL, NULL),
('p-6', 'user-seller-1', 'cat-prak', 'Jas Lab Ukuran L', 'Jas lab bersih, baru dipake 1 semester praktikum.', 75000, 'GOOD', 'APPROVED', 'DRAMAGA', NULL, NULL),
('p-7', 'user-seller-2', 'cat-fash', 'Sepatu Pantofel Hitam 42', 'Sepatu formal buat sidang atau wisuda.', 150000, 'LIKE_NEW', 'APPROVED', 'CILIBENDE', '/api/images/products/video_3.mp4', 12),
('p-8', 'user-seller-1', 'cat-kost', 'Kipas Angin Miyako Kecil', 'Bikin adem kostan, suara mesin halus.', 110000, 'GOOD', 'APPROVED', 'BARANANGSIANG', NULL, NULL),
('p-9', 'user-seller-2', 'cat-elek', 'Headset Logitech G335', 'Mantap buat dengerin materi atau gaming.', 450000, 'LIKE_NEW', 'APPROVED', 'DRAMAGA', NULL, NULL),
('p-10', 'user-seller-1', 'cat-fash', 'Tas Ransel Eiger 25L', 'Kuat banget buat bawa laptop dan buku tebal.', 300000, 'CUKUP', 'APPROVED', 'CILIBENDE', NULL, NULL),
('p-11', 'user-seller-2', 'cat-buku', 'Modul Kalkulus I & II', 'Modul lengkap dengan coretan tips n trik.', 45000, 'CUKUP', 'APPROVED', 'BARANANGSIANG', NULL, NULL),
('p-12', 'user-seller-1', 'cat-kost', 'Rak Sepatu 4 Susun', 'Bahan plastik kokoh, gampang dibongkar pasang.', 35000, 'GOOD', 'APPROVED', 'DRAMAGA', NULL, NULL),
('p-13', 'user-seller-2', 'cat-elek', 'Monitor LG 24 Inch IPS', 'Layar jernih buat multitasking tugas.', 1200000, 'LIKE_NEW', 'APPROVED', 'BARANANGSIANG', NULL, NULL),
('p-14', 'user-seller-1', 'cat-fash', 'Kemeja Batik IPB Official', 'Wajib dipake hari Jumat. Bahan adem.', 180000, 'NEW', 'APPROVED', 'CILIBENDE', NULL, NULL),
('p-15', 'user-seller-2', 'cat-kost', 'Termos Lock&Lock 500ml', 'Tahan panas sampe 12 jam. Mulus.', 95000, 'LIKE_NEW', 'APPROVED', 'DRAMAGA', NULL, NULL);

-- 4. PRODUCT IMAGES (45 UNIQUE MAPPING)
INSERT INTO product_images (id, product_id, r2_key, url, sort_order) VALUES 
('img-1-1', 'p-1', 'products/prod_1.jpg', '/api/images/products/prod_1.jpg', 0), ('img-1-2', 'p-1', 'products/prod_2.jpg', '/api/images/products/prod_2.jpg', 1), ('img-1-3', 'p-1', 'products/prod_3.jpg', '/api/images/products/prod_3.jpg', 2),
('img-2-1', 'p-2', 'products/prod_4.jpg', '/api/images/products/prod_4.jpg', 0), ('img-2-2', 'p-2', 'products/prod_5.jpg', '/api/images/products/prod_5.jpg', 1), ('img-2-3', 'p-2', 'products/prod_6.jpg', '/api/images/products/prod_6.jpg', 2),
('img-3-1', 'p-3', 'products/prod_7.jpg', '/api/images/products/prod_7.jpg', 0), ('img-3-2', 'p-3', 'products/prod_8.jpg', '/api/images/products/prod_8.jpg', 1), ('img-3-3', 'p-3', 'products/prod_9.jpg', '/api/images/products/prod_9.jpg', 2),
('img-4-1', 'p-4', 'products/prod_10.jpg', '/api/images/products/prod_10.jpg', 0), ('img-4-2', 'p-4', 'products/prod_11.jpg', '/api/images/products/prod_11.jpg', 1), ('img-4-3', 'p-4', 'products/prod_12.jpg', '/api/images/products/prod_12.jpg', 2),
('img-5-1', 'p-5', 'products/prod_13.jpg', '/api/images/products/prod_13.jpg', 0), ('img-5-2', 'p-5', 'products/prod_14.jpg', '/api/images/products/prod_14.jpg', 1), ('img-5-3', 'p-5', 'products/prod_15.jpg', '/api/images/products/prod_15.jpg', 2),
('img-6-1', 'p-6', 'products/prod_16.jpg', '/api/images/products/prod_16.jpg', 0), ('img-6-2', 'p-6', 'products/prod_17.jpg', '/api/images/products/prod_17.jpg', 1), ('img-6-3', 'p-6', 'products/prod_18.jpg', '/api/images/products/prod_18.jpg', 2),
('img-7-1', 'p-7', 'products/prod_19.jpg', '/api/images/products/prod_19.jpg', 0), ('img-7-2', 'p-7', 'products/prod_20.jpg', '/api/images/products/prod_20.jpg', 1), ('img-7-3', 'p-7', 'products/prod_21.jpg', '/api/images/products/prod_21.jpg', 2),
('img-8-1', 'p-8', 'products/prod_22.jpg', '/api/images/products/prod_22.jpg', 0), ('img-8-2', 'p-8', 'products/prod_23.jpg', '/api/images/products/prod_23.jpg', 1), ('img-8-3', 'p-8', 'products/prod_24.jpg', '/api/images/products/prod_24.jpg', 2),
('img-9-1', 'p-9', 'products/prod_25.jpg', '/api/images/products/prod_25.jpg', 0), ('img-9-2', 'p-9', 'products/prod_26.jpg', '/api/images/products/prod_26.jpg', 1), ('img-9-3', 'p-9', 'products/prod_27.jpg', '/api/images/products/prod_27.jpg', 2),
('img-10-1', 'p-10', 'products/prod_28.jpg', '/api/images/products/prod_28.jpg', 0), ('img-10-2', 'p-10', 'products/prod_29.jpg', '/api/images/products/prod_29.jpg', 1), ('img-10-3', 'p-10', 'products/prod_30.jpg', '/api/images/products/prod_30.jpg', 2),
('img-11-1', 'p-11', 'products/prod_31.jpg', '/api/images/products/prod_31.jpg', 0), ('img-11-2', 'p-11', 'products/prod_32.jpg', '/api/images/products/prod_32.jpg', 1), ('img-11-3', 'p-11', 'products/prod_33.jpg', '/api/images/products/prod_33.jpg', 2),
('img-12-1', 'p-12', 'products/prod_34.jpg', '/api/images/products/prod_34.jpg', 0), ('img-12-2', 'p-12', 'products/prod_35.jpg', '/api/images/products/prod_35.jpg', 1), ('img-12-3', 'p-12', 'products/prod_36.jpg', '/api/images/products/prod_36.jpg', 2),
('img-13-1', 'p-13', 'products/prod_37.jpg', '/api/images/products/prod_37.jpg', 0), ('img-13-2', 'p-13', 'products/prod_38.jpg', '/api/images/products/prod_38.jpg', 1), ('img-13-3', 'p-13', 'products/prod_39.jpg', '/api/images/products/prod_39.jpg', 2),
('img-14-1', 'p-14', 'products/prod_40.jpg', '/api/images/products/prod_40.jpg', 0), ('img-14-2', 'p-14', 'products/prod_41.jpg', '/api/images/products/prod_41.jpg', 1), ('img-14-3', 'p-14', 'products/prod_42.jpg', '/api/images/products/prod_42.jpg', 2),
('img-15-1', 'p-15', 'products/prod_43.jpg', '/api/images/products/prod_43.jpg', 0), ('img-15-2', 'p-15', 'products/prod_44.jpg', '/api/images/products/prod_44.jpg', 1), ('img-15-3', 'p-15', 'products/prod_45.jpg', '/api/images/products/prod_45.jpg', 2);
