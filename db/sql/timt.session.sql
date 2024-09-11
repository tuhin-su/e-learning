-- Create table for storing user information
CREATE TABLE IF NOT EXISTS `user` (
    `id` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) DEFAULT NULL,
    `passwd` VARCHAR(255) NOT NULL,
    `createDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `groups` VARCHAR(255) DEFAULT NULL,
    `status` INT DEFAULT 0 NOT NULL,
    `createBy` INT NOT NULL,
    PRIMARY KEY (`id`)
);

-- Create table for storing additional user info
CREATE TABLE IF NOT EXISTS `user_info` (
    `user_id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) DEFAULT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `address` VARCHAR(255) DEFAULT NULL,
    `gender` VARCHAR(255) DEFAULT NULL,
    `birth` DATE DEFAULT NULL,
    `img` LONGTEXT DEFAULT NULL,
    PRIMARY KEY (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Create table for storing group information
CREATE TABLE IF NOT EXISTS `group` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) DEFAULT NULL,
    `code` VARCHAR(255) DEFAULT NULL,
    `description` VARCHAR(255) DEFAULT NULL,
    `createDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `label` INT DEFAULT 0 NOT NULL,
    PRIMARY KEY (`id`)
);

-- Create table for storing course information
CREATE TABLE IF NOT EXISTS `course` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) DEFAULT NULL,
    `description` VARCHAR(255) DEFAULT NULL,
    `createDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `course_fees` DECIMAL(10,2) DEFAULT NULL,
    `course_duration` INT DEFAULT NULL,
    `status` INT DEFAULT 0 NOT NULL,
    PRIMARY KEY (`id`)
);

-- Create the `attends` table
CREATE TABLE IF NOT EXISTS `attends` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` VARCHAR(255) DEFAULT NULL,
    `attendance_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `attendance_date_only` DATE NOT NULL,
    UNIQUE KEY `unique_user_per_day` (`user_id`, `attendance_date_only`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Create table for storing class information
CREATE TABLE IF NOT EXISTS `classes` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `host` VARCHAR(255) DEFAULT NULL,
    `createDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `content` INT DEFAULT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`host`) REFERENCES `user`(`id`)
);

-- Create table for storing class attendance records
CREATE TABLE IF NOT EXISTS `class_attends` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `class_id` INT DEFAULT NULL,
    `user_id` VARCHAR(255) DEFAULT NULL,
    `attendance_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Create table for storing class content
CREATE TABLE IF NOT EXISTS `class_content` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `content` TEXT DEFAULT NULL,
    `date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`)
);

-- Create table for storing student information
CREATE TABLE IF NOT EXISTS `student` (
    `id` VARCHAR(255) NOT NULL,
    `roll` INT DEFAULT NULL,
    `reg` INT DEFAULT NULL,
    `course` VARCHAR(255) DEFAULT NULL,
    `semester` INT DEFAULT NULL,
    `status` INT DEFAULT 0 NOT NULL,
    `reg_by` VARCHAR(255) DEFAULT NULL,
    `createDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`id`) REFERENCES `user`(`id`),
    FOREIGN KEY (`reg_by`) REFERENCES `user`(`id`)
);

CREATE TABLE IF NOT EXISTS `collage_location` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `lat` DECIMAL(10, 6) NOT NULL,
    `lon` DECIMAL(10, 6) NOT NULL,
    `distend` DECIMAL(10, 6) NOT NULL,
    `createBy` VARCHAR(255),
    `createDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`)
);