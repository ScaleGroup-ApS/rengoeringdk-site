CREATE TABLE `app_bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'requested',
	`service` varchar(120) NOT NULL,
	`audience` varchar(10) NOT NULL,
	`requested_date` date NOT NULL,
	`requested_time` varchar(5),
	`confirmed_date` date,
	`confirmed_time` varchar(5),
	`recurrence` varchar(20) NOT NULL DEFAULT 'once',
	`address` varchar(500),
	`postnr` varchar(10),
	`by` varchar(120),
	`m2` int,
	`estimated_price` int,
	`customer_note` text,
	`admin_note` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `app_bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `app_pricing_addons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`audience` varchar(10) NOT NULL,
	`name` varchar(120) NOT NULL,
	`add_amount` int,
	`pct` decimal(5,4),
	`icon_key` varchar(60),
	`sort_order` int NOT NULL DEFAULT 0,
	`active` tinyint NOT NULL DEFAULT 1,
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `app_pricing_addons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `app_pricing_frequencies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`multiplier` decimal(4,2) NOT NULL,
	`visits_per_month` decimal(5,2),
	`sort_order` int NOT NULL DEFAULT 0,
	`active` tinyint NOT NULL DEFAULT 1,
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `app_pricing_frequencies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `app_pricing_property_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`audience` varchar(10) NOT NULL,
	`name` varchar(120) NOT NULL,
	`rate` decimal(5,2) NOT NULL,
	`icon_key` varchar(60),
	`sort_order` int NOT NULL DEFAULT 0,
	`active` tinyint NOT NULL DEFAULT 1,
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `app_pricing_property_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `app_pricing_ptype_unique` UNIQUE(`audience`,`name`)
);
--> statement-breakpoint
CREATE TABLE `app_pricing_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`audience` varchar(10) NOT NULL,
	`base_price` int NOT NULL,
	`vat_multiplier` decimal(4,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'DKK',
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `app_pricing_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `app_pricing_settings_audience_unique` UNIQUE(`audience`)
);
--> statement-breakpoint
CREATE TABLE `app_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`role` varchar(20) NOT NULL DEFAULT 'customer',
	`token_version` int NOT NULL DEFAULT 0,
	`navn` varchar(255) NOT NULL,
	`virksomhed` varchar(255),
	`cvr` varchar(8),
	`tlf` varchar(50),
	`adresse` varchar(500),
	`postnr` varchar(10),
	`by` varchar(120),
	`audience` varchar(10) NOT NULL DEFAULT 'privat',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `app_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `app_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `app_bookings` ADD CONSTRAINT `app_bookings_user_id_app_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `app_users`(`id`) ON DELETE no action ON UPDATE no action;