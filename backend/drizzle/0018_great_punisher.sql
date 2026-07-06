CREATE INDEX `address_user_idx` ON `addresses` (`user_id`);--> statement-breakpoint
CREATE INDEX `notification_user_idx` ON `notifications` (`user_id`);--> statement-breakpoint
CREATE INDEX `notification_is_read_idx` ON `notifications` (`is_read`);--> statement-breakpoint
CREATE INDEX `order_customer_name_idx` ON `orders` (`customer_name`);--> statement-breakpoint
CREATE INDEX `order_customer_email_idx` ON `orders` (`customer_email`);--> statement-breakpoint
CREATE INDEX `return_user_idx` ON `returns` (`user_id`);--> statement-breakpoint
CREATE INDEX `return_type_idx` ON `returns` (`type`);--> statement-breakpoint
CREATE INDEX `tracking_order_id_idx` ON `trackings` (`order_id`);--> statement-breakpoint
CREATE INDEX `wallet_user_idx` ON `wallet_transactions` (`user_id`);