-- Table: user
CREATE TABLE `user` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `email` VARCHAR(255) NULL,
    `passwd` VARCHAR(255) NOT NULL,
    `createDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `groups` VARCHAR(255) NULL,
    `status` INT NOT NULL DEFAULT 0,
    `createBy` VARCHAR(255) NOT NULL
);

-- Table: user_info
CREATE TABLE `user_info` (
    `user_id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NULL,
    `phone` VARCHAR(20) NULL,
    `address` VARCHAR(255) NULL,
    `gender` VARCHAR(255) NULL,
    `birth` DATE NULL,
    `img` LONGTEXT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Table: group
CREATE TABLE `group` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NULL,
    `code` VARCHAR(255) NULL,
    `description` VARCHAR(255) NULL,
    `createDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `label` INT NOT NULL DEFAULT 0
);

-- Table: course
CREATE TABLE `course` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NULL,
    `description` VARCHAR(255) NULL,
    `createDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `course_fees` DECIMAL(10, 2) NULL,
    `course_duration` INT NULL,
    `status` INT NOT NULL DEFAULT 0
);

-- Table: attends
CREATE TABLE `attends` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` VARCHAR(255),
    `attendance_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `attendance_date_only` DATE NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
    UNIQUE (`user_id`, `attendance_date_only`)
);

-- Table: posts_data
CREATE TABLE `posts_data` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `content` LONGBLOB NULL,
    `content_name` VARCHAR(255) NULL,
    `content_type` VARCHAR(255) NULL,
    `content_size` INT NOT NULL DEFAULT 0,
    `createBy` VARCHAR(255) NOT NULL,
    `createDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`createBy`) REFERENCES `user`(`id`)
);


-- Table: classes
CREATE TABLE `classes` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `host` VARCHAR(255),
    `title` VARCHAR(255) NOT NULL,
    `stream` INT NOT NULL,
    `semester` INT NOT NULL,
    `description` VARCHAR(255) NULL,
    `createDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `content_id` INT NOT NULL DEFAULT 0,
    FOREIGN KEY (`host`) REFERENCES `user`(`id`),
    FOREIGN KEY (`stream`) REFERENCES `course`(`id`),
    FOREIGN KEY (`content_id`) REFERENCES `posts_data`(`id`)
);

-- Table: class_comment
CREATE TABLE `class_comment` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `class_id` INT,
    `user_id` VARCHAR(255),
    `comment` VARCHAR(255) NULL,
    FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Table: class_likes
CREATE TABLE `class_likes` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `class_id` INT,
    `user_id` VARCHAR(255),
    FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Table: class_attends
CREATE TABLE `class_attends` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `class_id` INT,
    `user_id` VARCHAR(255),
    `attendance_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Table: student
CREATE TABLE `student` (
    `id` VARCHAR(255) NOT NULL PRIMARY KEY,
    `roll` INT NULL,
    `reg` INT NULL,
    `course` INT,
    `semester` INT NULL,
    `status` INT DEFAULT 0 NULL,
    `reg_by` VARCHAR(255),
    `createDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`id`) REFERENCES `user`(`id`),
    FOREIGN KEY (`course`) REFERENCES `course`(`id`),
    FOREIGN KEY (`reg_by`) REFERENCES `user`(`id`)
);

-- Table: collage_location
CREATE TABLE `collage_location` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `lat` DECIMAL(10, 6) NOT NULL,
    `lon` DECIMAL(10, 6) NOT NULL,
    `distend` DECIMAL(10, 6) NOT NULL,
    `createBy` VARCHAR(255) NOT NULL,
    `createDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);