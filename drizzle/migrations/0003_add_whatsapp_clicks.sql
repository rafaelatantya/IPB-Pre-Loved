-- 0003_add_whatsapp_clicks.sql
-- Goal: Manually add missing whatsapp_clicks column to products table for D1 synchronization.

ALTER TABLE `products` ADD COLUMN `whatsapp_clicks` integer DEFAULT 0;
