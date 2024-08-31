-- Create the user table if it does not exist
CREATE TABLE IF NOT EXISTS `user` (
    `id` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) DEFAULT NULL,
    `passwd` VARCHAR(255) NOT NULL,
    `createDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `groups` VARCHAR(255) DEFAULT NULL,
    `status` INT DEFAULT 0 NOT NULL,
    PRIMARY KEY (`id`)
);

-- Create the user_info table if it does not exist
CREATE TABLE IF NOT EXISTS `user_info` (
    `user_id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) DEFAULT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `address` VARCHAR(255) DEFAULT NULL,
    `gender` INT DEFAULT NULL,
    `birth` DATE DEFAULT NULL,
    PRIMARY KEY (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Create the group table if it does not exist
CREATE TABLE IF NOT EXISTS `group` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) DEFAULT NULL,
    `code` VARCHAR(255) DEFAULT NULL,
    `description` VARCHAR(255) DEFAULT NULL,
    `createDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `label` INT DEFAULT 0 NOT NULL,
    PRIMARY KEY (`id`)
);

-- Create the course table if it does not exist
CREATE TABLE IF NOT EXISTS `course` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) DEFAULT NULL,
    `description` VARCHAR(255) DEFAULT NULL,
    `createDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `course_fees` DECIMAL(10, 2) DEFAULT NULL,
    `course_duration` INT DEFAULT NULL,
    `status` INT DEFAULT 0 NOT NULL,
    PRIMARY KEY (`id`)
);

-- Create the attends table if it does not exist
CREATE TABLE IF NOT EXISTS `attends` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(255) DEFAULT NULL,
    `attendance_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Create the classes table if it does not exist
CREATE TABLE IF NOT EXISTS `classes` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `host` VARCHAR(255) DEFAULT NULL,
    `createDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `content` INT DEFAULT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`host`) REFERENCES `user`(`id`)
);

-- Create the class_attends table if it does not exist
CREATE TABLE IF NOT EXISTS `class_attends` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `class_id` INT DEFAULT NULL,
    `user_id` VARCHAR(255) DEFAULT NULL,
    `attendance_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Create the class_content table if it does not exist
CREATE TABLE IF NOT EXISTS `class_content` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `content` TEXT DEFAULT NULL,
    `date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`)
);

-- Create the resource table if it does not exist
CREATE TABLE IF NOT EXISTS `resource` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) DEFAULT NULL,
    `content` LONGTEXT DEFAULT NULL,
    `createDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `version` INT NOT NULL,
    PRIMARY KEY (`id`)
);

-- Create the student table if it does not exist
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
