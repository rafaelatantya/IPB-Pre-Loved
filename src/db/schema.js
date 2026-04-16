import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Tabel Users - Filter domain @apps.ipb.ac.id nanti di level logic
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), 
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').default('BUYER'), // BUYER, SELLER, ADMIN
  whatsappNumber: text('whatsapp_number'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Tabel Categories
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
});

// Tabel Products
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  sellerId: text('seller_id').references(() => users.id),
  categoryId: integer('category_id').references(() => categories.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  condition: text('condition').notNull(), // NEW, LIKE_NEW, GOOD, FAIR
  status: text('status').default('PENDING'), // PENDING, APPROVED, REJECTED
  location: text('location').default('IPB Dramaga'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Tabel Wishlist
export const wishlists = sqliteTable('wishlists', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').references(() => users.id),
  productId: text('product_id').references(() => products.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});