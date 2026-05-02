-- 0002_slim_katie_power.sql
-- Goal: Add updated_at and NORMALIZE all timestamps to miliseconds (INTEGER) for Cloudflare D1 compatibility.

-- 1. Add missing column to users
ALTER TABLE `users` ADD COLUMN `updated_at` integer DEFAULT 0;

--> statement-breakpoint
-- 2. Normalize USERS table
UPDATE `users` SET `created_at` = strftime('%s', `created_at`) * 1000 WHERE typeof(`created_at`) = 'text';
UPDATE `users` SET `updated_at` = (unixepoch() * 1000) WHERE `updated_at` = 0;

--> statement-breakpoint
-- 3. Normalize PRODUCTS table
UPDATE `products` SET `created_at` = strftime('%s', `created_at`) * 1000 WHERE typeof(`created_at`) = 'text';
UPDATE `products` SET `updated_at` = strftime('%s', `updated_at`) * 1000 WHERE typeof(`updated_at`) = 'text';

--> statement-breakpoint
-- 4. Normalize other tables (QC, Logs, Notifications, Wishlists)
UPDATE `qc_reviews` SET `reviewed_at` = strftime('%s', `reviewed_at`) * 1000 WHERE typeof(`reviewed_at`) = 'text';
UPDATE `admin_logs` SET `created_at` = strftime('%s', `created_at`) * 1000 WHERE typeof(`created_at`) = 'text';
UPDATE `notifications` SET `created_at` = strftime('%s', `created_at`) * 1000 WHERE typeof(`created_at`) = 'text';
UPDATE `wishlists` SET `created_at` = strftime('%s', `created_at`) * 1000 WHERE typeof(`created_at`) = 'text';