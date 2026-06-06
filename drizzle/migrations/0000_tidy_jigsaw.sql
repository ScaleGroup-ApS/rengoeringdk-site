CREATE TABLE `contact_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`navn` varchar(255) NOT NULL,
	`virksomhed` varchar(255),
	`email` varchar(255) NOT NULL,
	`tlf` varchar(50) NOT NULL,
	`type` varchar(100),
	`besked` text,
	`ip` varchar(45),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `contact_submissions_id` PRIMARY KEY(`id`)
);
