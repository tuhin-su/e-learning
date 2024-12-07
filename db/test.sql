-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Dec 07, 2024 at 07:43 PM
-- Server version: 10.6.20-MariaDB-ubu2004
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `attends`
--

CREATE TABLE `attends` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `attendance_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `attendance_date_only` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `host` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `stream` int(11) NOT NULL,
  `semester` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `content_id` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `host`, `title`, `stream`, `semester`, `description`, `createDate`, `content_id`) VALUES
(1, '85d18056085de2defe1aab222aa6fccd727b11993e2776f2ddb5d74b51171a44', 'ABC', 1, 4, 'BAC', '2024-12-07 19:41:38', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `class_attends`
--

CREATE TABLE `class_attends` (
  `id` int(11) NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `attendance_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `class_comment`
--

CREATE TABLE `class_comment` (
  `id` int(11) NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `class_likes`
--

CREATE TABLE `class_likes` (
  `id` int(11) NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `collage_location`
--

CREATE TABLE `collage_location` (
  `id` int(11) NOT NULL,
  `lat` decimal(10,6) NOT NULL,
  `lon` decimal(10,6) NOT NULL,
  `distend` decimal(10,6) NOT NULL,
  `createBy` varchar(255) NOT NULL,
  `createDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `course_fees` decimal(10,2) DEFAULT NULL,
  `course_duration` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`id`, `name`, `description`, `createDate`, `course_fees`, `course_duration`, `status`) VALUES
(1, 'BCA', 'BCA', '2024-12-07 19:19:30', 20000.00, 4, 0),
(2, 'BBA', 'BBA', '2024-12-07 19:19:46', 20000.00, 4, 0),
(3, 'BHM', 'BHM', '2024-12-07 19:20:04', 20000.00, 4, 0),
(4, 'MSC', 'MSC', '2024-12-07 19:20:17', 20000.00, 4, 0);

-- --------------------------------------------------------

--
-- Table structure for table `galary`
--

CREATE TABLE `galary` (
  `id` int(11) NOT NULL,
  `content_name` varchar(255) DEFAULT NULL,
  `createBy` varchar(255) NOT NULL,
  `createDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `post_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `group`
--

CREATE TABLE `group` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `label` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `group`
--

INSERT INTO `group` (`id`, `name`, `code`, `description`, `createDate`, `label`) VALUES
(1, 'AD', 'AD', 'Admin', '2024-12-07 19:18:07', 1),
(2, 'FA', 'FA', 'FA', '2024-12-07 19:18:23', 2),
(3, 'SU', 'SU', 'SU', '2024-12-07 19:18:44', 0),
(4, 'ST', 'ST', 'ST', '2024-12-07 19:18:59', 3);

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `post_id` int(11) NOT NULL,
  `createBy` varchar(255) NOT NULL,
  `createDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `posts_data`
--

CREATE TABLE `posts_data` (
  `id` int(11) NOT NULL,
  `content` longblob DEFAULT NULL,
  `content_name` varchar(255) DEFAULT NULL,
  `content_type` varchar(255) DEFAULT NULL,
  `content_size` int(11) NOT NULL DEFAULT 0,
  `createBy` varchar(255) NOT NULL,
  `createDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `id` varchar(255) NOT NULL,
  `roll` varchar(255) NOT NULL,
  `reg` varchar(255) NOT NULL,
  `course` int(11) DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT 0,
  `reg_by` varchar(255) DEFAULT NULL,
  `createDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`id`, `roll`, `reg`, `course`, `semester`, `status`, `reg_by`, `createDate`) VALUES
('6856baa6e40622c1973a1e12a96ca943f5f49d03dede5cdc4d8386491f651e85', '12345', '29941', 1, 4, 0, '85d18056085de2defe1aab222aa6fccd727b11993e2776f2ddb5d74b51171a44', '2024-12-07 19:38:26');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `passwd` varchar(255) NOT NULL,
  `createDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `groups` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `createBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `passwd`, `createDate`, `groups`, `status`, `createBy`) VALUES
('6856baa6e40622c1973a1e12a96ca943f5f49d03dede5cdc4d8386491f651e85', 'student_demo@email.com', 'scrypt:32768:8:1$ZfKCYbkDbF8I3XNZ$62d59ec0ef0cca0694d409a45e606d44961ee0949c459d0f43cc7a59a8161fc94c3e817597dd43de79fc410bdfce3c801937ef99f69df73ea837420c5c09cce6', '2024-12-07 19:38:26', 'ST', 0, '85d18056085de2defe1aab222aa6fccd727b11993e2776f2ddb5d74b51171a44'),
('85d18056085de2defe1aab222aa6fccd727b11993e2776f2ddb5d74b51171a44', 'admin@email.com', 'scrypt:32768:8:1$Pssprl8VeIABqrxs$5ef7b51685c0ee647ce9422bd78ad5c53abe5c6735c74bc775ebf3ca22b06dd15d656ff081cfa685abea5951e46d9d568d7f2f4437800d4277acb7eeb1cb7958', '2024-12-07 19:21:30', 'AD', 0, '0');

-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

CREATE TABLE `user_info` (
  `user_id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `birth` date DEFAULT NULL,
  `img` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_info`
--

INSERT INTO `user_info` (`user_id`, `name`, `phone`, `address`, `gender`, `birth`, `img`) VALUES
('6856baa6e40622c1973a1e12a96ca943f5f49d03dede5cdc4d8386491f651e85', 'Student Demo', '7412589632', 'ABC ', 'M', '2024-12-12', ''),
('85d18056085de2defe1aab222aa6fccd727b11993e2776f2ddb5d74b51171a44', 'Admin', '7412589635', 'ABC', 'M', '2024-12-19', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attends`
--
ALTER TABLE `attends`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`attendance_date_only`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `host` (`host`),
  ADD KEY `stream` (`stream`),
  ADD KEY `content_id` (`content_id`);

--
-- Indexes for table `class_attends`
--
ALTER TABLE `class_attends`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `class_comment`
--
ALTER TABLE `class_comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `class_likes`
--
ALTER TABLE `class_likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `collage_location`
--
ALTER TABLE `collage_location`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `galary`
--
ALTER TABLE `galary`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indexes for table `group`
--
ALTER TABLE `group`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `createBy` (`createBy`);

--
-- Indexes for table `posts_data`
--
ALTER TABLE `posts_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `createBy` (`createBy`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course` (`course`),
  ADD KEY `reg_by` (`reg_by`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attends`
--
ALTER TABLE `attends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `class_attends`
--
ALTER TABLE `class_attends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `class_comment`
--
ALTER TABLE `class_comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `class_likes`
--
ALTER TABLE `class_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `collage_location`
--
ALTER TABLE `collage_location`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `galary`
--
ALTER TABLE `galary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `group`
--
ALTER TABLE `group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `posts_data`
--
ALTER TABLE `posts_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attends`
--
ALTER TABLE `attends`
  ADD CONSTRAINT `attends_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`host`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `classes_ibfk_2` FOREIGN KEY (`stream`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `classes_ibfk_3` FOREIGN KEY (`content_id`) REFERENCES `posts_data` (`id`);

--
-- Constraints for table `class_attends`
--
ALTER TABLE `class_attends`
  ADD CONSTRAINT `class_attends_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  ADD CONSTRAINT `class_attends_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `class_comment`
--
ALTER TABLE `class_comment`
  ADD CONSTRAINT `class_comment_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  ADD CONSTRAINT `class_comment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `class_likes`
--
ALTER TABLE `class_likes`
  ADD CONSTRAINT `class_likes_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  ADD CONSTRAINT `class_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `galary`
--
ALTER TABLE `galary`
  ADD CONSTRAINT `galary_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts_data` (`id`);

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts_data` (`id`),
  ADD CONSTRAINT `notification_ibfk_2` FOREIGN KEY (`createBy`) REFERENCES `user` (`id`);

--
-- Constraints for table `posts_data`
--
ALTER TABLE `posts_data`
  ADD CONSTRAINT `posts_data_ibfk_1` FOREIGN KEY (`createBy`) REFERENCES `user` (`id`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `student_ibfk_2` FOREIGN KEY (`course`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `student_ibfk_3` FOREIGN KEY (`reg_by`) REFERENCES `user` (`id`);

--
-- Constraints for table `user_info`
--
ALTER TABLE `user_info`
  ADD CONSTRAINT `user_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
