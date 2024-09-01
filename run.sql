CREATE TABLE `attends` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` VARCHAR(255) DEFAULT NULL,
    `attendance_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE KEY `unique_user_per_day` (`user_id`, DATE(`attendance_date`)),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);