import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';

// Tabel Users - Filter domain @apps.ipb.ac.id nanti di level logic
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), 
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').default('ONBOARDING'), // ONBOARDING, BUYER, SELLER, ADMIN
  whatsappNumber: text('whatsapp_number'),
  userType: text('user_type').default('STUDENT'), // STUDENT, STAFF, ALUMNI
  isBlocked: integer('is_blocked', { mode: 'boolean' }).default(false),
  isFlagged: integer('is_flagged', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at').default(sql`(unixepoch() * 1000)`),
  updatedAt: integer('updated_at').default(sql`(unixepoch() * 1000)`),
});

export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  qcReviews: many(qcReviews),
  wishlistItems: many(wishlists),
}));

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(), // Pindah ke UUID (lebih stabil di Edge)
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  sellerId: text('seller_id').notNull().references(() => users.id),
  categoryId: text('category_id').references(() => categories.id), // Samakan tipe data
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  condition: text('condition').notNull(), // NEW, LIKE_NEW, GOOD, FAIR
  status: text('status').default('PENDING'), // PENDING, APPROVED, REJECTED, SOLD
  videoUrl: text('video_url'), 
  videoDuration: integer('video_duration'), // Dalam detik
  location: text('location').default('IPB Dramaga'),
  whatsappClicks: integer('whatsapp_clicks').default(0),
  createdAt: integer('created_at').default(sql`(unixepoch() * 1000)`),
  updatedAt: integer('updated_at').default(sql`(unixepoch() * 1000)`),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  qcReviews: many(qcReviews),
  wishlistedBy: many(wishlists),
}));

// Tabel Product Images (BARU - Sesuai UML)
export const productImages = sqliteTable('product_images', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  r2Key: text('r2_key').notNull(),
  url: text('url').notNull(),
  sortOrder: integer('sort_order').default(0),
});

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

// Tabel QC Reviews (BARU - Sesuai UML)
export const qcReviews = sqliteTable('qc_reviews', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  adminId: text('admin_id').notNull().references(() => users.id),
  decision: text('decision').notNull(), // APPROVE, REJECT
  note: text('note'),
  reviewedAt: integer('reviewed_at').default(sql`(unixepoch() * 1000)`),
});

export const qcReviewsRelations = relations(qcReviews, ({ one }) => ({
  product: one(products, {
    fields: [qcReviews.productId],
    references: [products.id],
  }),
  admin: one(users, {
    fields: [qcReviews.adminId],
    references: [users.id],
  }),
}));

export const wishlists = sqliteTable('wishlists', {
  id: text('id').primaryKey(), 
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at').default(sql`(unixepoch() * 1000)`),
}, (table) => ({
  unq: uniqueIndex('wishlist_user_product_idx').on(table.userId, table.productId),
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlists.productId],
    references: [products.id],
  }),
}));

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').default('INFO'), // INFO, SUCCESS, WARNING, DANGER
  isRead: integer('is_read', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at').default(sql`(unixepoch() * 1000)`),
});

export const adminLogs = sqliteTable('admin_logs', {
  id: text('id').primaryKey(),
  adminId: text('adminId').notNull().references(() => users.id),
  action: text('action').notNull(), // REVIEW_PRODUCT, BLOCK_USER, etc.
  targetId: text('targetId'),
  details: text('details'),
  createdAt: integer('created_at').default(sql`(unixepoch() * 1000)`),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const adminLogsRelations = relations(adminLogs, ({ one }) => ({
  admin: one(users, { fields: [adminLogs.adminId], references: [users.id] }),
}));