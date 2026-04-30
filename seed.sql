-- MEGA SEED V4: INTERNAL STORAGE EDITION
-- Semua media sudah menggunakan Internal Proxy (/api/images/products/)
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
('user-seller-1', 'Andi Seller', 'andi@apps.ipb.ac.id', 'SELLER', 'STUDENT', '6281234567890');

-- 3. PRODUK 1: MACBOOK (KASUS: Internal Video & Multi-Image)
INSERT INTO products (id, seller_id, category_id, title, description, price, condition, status, location, video_url, video_duration) VALUES 
('p-macbook', 'user-seller-1', 'cat-elek', 'MacBook Air M1 2020 Space Grey', 'Barang simpanan, mulus 99%. Jarang dipake keluar. Fullset original.', 9500000, 'LIKE_NEW', 'APPROVED', 'DRAMAGA', '/api/images/products/demo-video.mp4', 10);

INSERT INTO product_images (id, product_id, r2_key, url, sort_order) VALUES 
('img-mac-1', 'p-macbook', 'products/mac1.jpg', '/api/images/products/mac1.jpg', 0),
('img-mac-2', 'p-macbook', 'products/mac2.jpg', '/api/images/products/mac2.jpg', 1),
('img-mac-3', 'p-macbook', 'products/mac3.jpg', '/api/images/products/mac3.jpg', 2);

-- 4. PRODUK 2: BUKU (KASUS: Internal Multi-Image)
INSERT INTO products (id, seller_id, category_id, title, description, price, condition, status, location) VALUES 
('p-buku', 'user-seller-1', 'cat-buku', 'Buku Koding Python Dasar', 'Buku wajib buat yang mau belajar AI. Kondisi masih segel.', 120000, 'NEW', 'APPROVED', 'BARANANGSIANG');

INSERT INTO product_images (id, product_id, r2_key, url, sort_order) VALUES 
('img-buku-1', 'p-buku', 'products/book1.jpg', '/api/images/products/book1.jpg', 0),
('img-buku-2', 'p-buku', 'products/book2.jpg', '/api/images/products/book2.jpg', 1),
('img-buku-3', 'p-buku', 'products/book3.jpg', '/api/images/products/book3.jpg', 2);

-- 5. PRODUK 3: MEJA (KASUS: Internal Video)
INSERT INTO products (id, seller_id, category_id, title, description, price, condition, status, location, video_url, video_duration) VALUES 
('p-meja', 'user-seller-1', 'cat-kost', 'Meja Lipat Kayu Pinus', 'Cocok buat kamar sempit. Bisa dilipat rapi.', 50000, 'CUKUP', 'APPROVED', 'CILIBENDE', '/api/images/products/demo-video.mp4', 8);

INSERT INTO product_images (id, product_id, r2_key, url, sort_order) VALUES 
('img-meja-1', 'p-meja', 'products/table.jpg', '/api/images/products/table.jpg', 0);
