CREATE TABLE `admin_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`adminId` text NOT NULL,
	`action` text NOT NULL,
	`targetId` text,
	`details` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`adminId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`type` text DEFAULT 'INFO',
	`is_read` integer DEFAULT false,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`role` text DEFAULT 'ONBOARDING',
	`whatsapp_number` text,
	`user_type` text DEFAULT 'STUDENT',
	`is_blocked` integer DEFAULT false,
	`is_flagged` integer DEFAULT false,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "role", "whatsapp_number", "user_type", "is_blocked", "is_flagged", "created_at") SELECT "id", "name", "email", "role", "whatsapp_number", "user_type", "is_blocked", "is_flagged", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `products` ADD `video_url` text;--> statement-breakpoint
ALTER TABLE `products` ADD `video_duration` integer;--> statement-breakpoint
ALTER TABLE `products` ADD `updated_at` integer DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
CREATE UNIQUE INDEX `wishlist_user_product_idx` ON `wishlists` (`user_id`,`product_id`);