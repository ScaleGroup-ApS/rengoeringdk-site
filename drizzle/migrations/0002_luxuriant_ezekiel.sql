ALTER TABLE `app_bookings` ADD `series_id` int;--> statement-breakpoint
ALTER TABLE `app_bookings` ADD CONSTRAINT `app_bookings_series_date_unique` UNIQUE(`series_id`,`confirmed_date`);