-- Final safe migration for Cloudflare D1
ALTER TABLE `users` ADD COLUMN `updated_at` integer DEFAULT 0;
--> statement-breakpoint
UPDATE `users` SET `updated_at` = (unixepoch() * 1000) WHERE `updated_at` = 0;