ALTER TABLE `app_bookings` ADD `payment_status` varchar(20) DEFAULT 'unpaid' NOT NULL;--> statement-breakpoint
ALTER TABLE `app_bookings` ADD `paid_amount` int;--> statement-breakpoint
ALTER TABLE `app_bookings` ADD `paid_at` date;--> statement-breakpoint
ALTER TABLE `app_bookings` ADD `created_by_admin` tinyint DEFAULT 0 NOT NULL;