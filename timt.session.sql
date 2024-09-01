-- Create the `user` table
CREATE TABLE `user` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `email` VARCHAR(255) DEFAULT NULL,
    `passwd` VARCHAR(255) NOT NULL,
    `createDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `groups` VARCHAR(255) DEFAULT NULL,
    `status` INT DEFAULT 0 NOT NULL
);

-- Create the `user_info` table
CREATE TABLE `user_info` (
    `user_id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) DEFAULT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `address` VARCHAR(255) DEFAULT NULL,
    `gender` VARCHAR(255) DEFAULT NULL,
    `birth` DATE DEFAULT NULL,
    `img` LONGTEXT DEFAULT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Create the `group` table
CREATE TABLE `group` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) DEFAULT NULL,
    `code` VARCHAR(255) DEFAULT NULL,
    `description` VARCHAR(255) DEFAULT NULL,
    `createDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `label` INT DEFAULT 0 NOT NULL
);

-- Create the `course` table
CREATE TABLE `course` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) DEFAULT NULL,
    `description` VARCHAR(255) DEFAULT NULL,
    `createDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `course_fees` DECIMAL(10, 2) DEFAULT NULL,
    `course_duration` INT DEFAULT NULL,
    `status` INT DEFAULT 0 NOT NULL
);

-- Create the `attends` table
CREATE TABLE `attends` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` VARCHAR(255) DEFAULT NULL,
    `attendance_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE KEY `unique_user_per_day` (`user_id`, DATE(`attendance_date`)),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Create the `classes` table
CREATE TABLE `classes` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `host` VARCHAR(255) DEFAULT NULL,
    `createDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `content` INT DEFAULT NULL,
    FOREIGN KEY (`host`) REFERENCES `user`(`id`)
);

-- Create the `class_attends` table
CREATE TABLE `class_attends` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `class_id` INT DEFAULT NULL,
    `user_id` VARCHAR(255) DEFAULT NULL,
    `attendance_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Create the `class_content` table
CREATE TABLE `class_content` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `content` TEXT DEFAULT NULL,
    `date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create the `student` table
CREATE TABLE `student` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `roll` INT DEFAULT NULL,
    `reg` INT DEFAULT NULL,
    `course` VARCHAR(255) DEFAULT NULL,
    `semester` INT DEFAULT NULL,
    `status` INT DEFAULT 0 NOT NULL,
    `reg_by` VARCHAR(255) DEFAULT NULL,
    `createDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (`id`) REFERENCES `user`(`id`),
    FOREIGN KEY (`reg_by`) REFERENCES `user`(`id`)
);
