-- SEEDING DATA UNTUK TESTING FRONTEND A (SIMPLIFIED)

-- 1. Insert Kategori
INSERT OR IGNORE INTO categories (id, name, slug) VALUES ('cat1', 'Buku & Modul', 'BUKU');
INSERT OR IGNORE INTO categories (id, name, slug) VALUES ('cat2', 'Elektronik', 'ELECTRONICS');
INSERT OR IGNORE INTO categories (id, name, slug) VALUES ('cat3', 'Kebutuhan Kost', 'DORM ESSENTIALS');
INSERT OR IGNORE INTO categories (id, name, slug) VALUES ('cat4', 'Peralatan Praktikum', 'PRAKTIKUM');

-- 2. Insert User (Penjual) - Menghilangkan user_type karena error di DB lokal
INSERT OR IGNORE INTO users (id, name, email, role, whatsapp_number) 
VALUES ('user-test-1', 'Andi (Test Seller)', 'andi@apps.ipb.ac.id', 'SELLER', '6281234567890');

-- 3. Insert Produk (Status: APPROVED)
INSERT OR IGNORE INTO products (id, seller_id, category_id, title, description, price, condition, status, location)
VALUES ('p1', 'user-test-1', 'cat2', 'Laptop Asus Vivobook S14', 'Laptop kenceng buat nugas, RAM 8GB, SSD 512GB. Minus lecet dikit di pojokan.', 4500000, 'LIKE NEW', 'APPROVED', 'DRAMAGA');

INSERT OR IGNORE INTO products (id, seller_id, category_id, title, description, price, condition, status, location)
VALUES ('p2', 'user-test-1', 'cat1', 'Buku Biostatistika Terapan', 'Buku sakti buat yang lagi ngambil matkul Biostat. Masih bersih nggak ada coretan.', 75000, 'BAIK', 'APPROVED', 'BARANANGSIANG');

INSERT OR IGNORE INTO products (id, seller_id, category_id, title, description, price, condition, status, location)
VALUES ('p3', 'user-test-1', 'cat3', 'Meja Lipat Kayu Pinus', 'Cocok buat yang nge-kost kamarnya sempit. Bisa dilipat kalau nggak dipake.', 50000, 'CUKUP', 'APPROVED', 'CILIBENDE');

INSERT OR IGNORE INTO products (id, seller_id, category_id, title, description, price, condition, status, location)
VALUES ('p4', 'user-test-1', 'cat4', 'Jas Laboratorium Putih (L)', 'Jas lab buat praktikum kimia/biologi. Udah dicuci bersih wangi.', 80000, 'BAIK', 'APPROVED', 'DRAMAGA');

-- 4. Insert Gambar Produk
INSERT OR IGNORE INTO product_images (id, product_id, r2_key, url)
VALUES ('img1', 'p1', 'test/laptop', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800');

INSERT OR IGNORE INTO product_images (id, product_id, r2_key, url)
VALUES ('img2', 'p2', 'test/book', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800');

INSERT OR IGNORE INTO product_images (id, product_id, r2_key, url)
VALUES ('img3', 'p3', 'test/table', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800');

INSERT OR IGNORE INTO product_images (id, product_id, r2_key, url)
VALUES ('img4', 'p4', 'test/labcoat', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800');

