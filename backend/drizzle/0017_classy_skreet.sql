CREATE TABLE `newsletter_leads` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`source` text DEFAULT 'footer',
	`is_active` integer DEFAULT 1,
	`subscribed_at` text,
	`unsubscribed_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_leads_email_unique` ON `newsletter_leads` (`email`);--> statement-breakpoint
CREATE INDEX `order_item_order_id_idx` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE INDEX `order_item_product_id_idx` ON `order_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `order_user_id_idx` ON `orders` (`user_id`);--> statement-breakpoint
CREATE INDEX `order_status_idx` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `order_created_at_idx` ON `orders` (`created_at`);--> statement-breakpoint
CREATE INDEX `product_category_idx` ON `products` (`category_id`);--> statement-breakpoint
CREATE INDEX `product_brand_idx` ON `products` (`brand`);--> statement-breakpoint
CREATE INDEX `product_price_idx` ON `products` (`price`);--> statement-breakpoint
CREATE INDEX `product_active_idx` ON `products` (`is_active`);--> statement-breakpoint
CREATE INDEX `review_product_idx` ON `reviews` (`product_id`);--> statement-breakpoint
CREATE INDEX `review_user_idx` ON `reviews` (`user_id`);--> statement-breakpoint
CREATE INDEX `review_status_idx` ON `reviews` (`status`);--> statement-breakpoint
CREATE INDEX `review_product_status_idx` ON `reviews` (`product_id`,`status`);