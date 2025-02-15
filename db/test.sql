INSERT INTO `group` (`id`, `name`, `code`, `description`, `createDate`, `label`) VALUES
(1, 'AD', 'AD', 'Admin', '2024-12-07 19:18:07', 1),
(2, 'FA', 'FA', 'FA', '2024-12-07 19:18:23', 2),
(3, 'SU', 'SU', 'SU', '2024-12-07 19:18:44', 0),
(4, 'ST', 'ST', 'ST', '2024-12-07 19:18:59', 3);


INSERT INTO `course` (`id`, `name`, `description`, `createDate`, `course_fees`, `course_duration`, `status`) VALUES
(1, 'BCA', 'BCA', '2024-12-07 19:19:30', 20000.00, 4, 0),
(2, 'BBA', 'BBA', '2024-12-07 19:19:46', 20000.00, 4, 0),
(3, 'BHM', 'BHM', '2024-12-07 19:20:04', 20000.00, 4, 0),
(4, 'MSC', 'MSC', '2024-12-07 19:20:17', 20000.00, 4, 0);

INSERT INTO `user` (`id`, `email`, `passwd`, `createDate`, `groups`, `status`, `createBy`) VALUES
('6856baa6e40622c1973a1e12a96ca943f5f49d03dede5cdc4d8386491f651e85', 'student_demo@email.com', 'scrypt:32768:8:1$ZfKCYbkDbF8I3XNZ$62d59ec0ef0cca0694d409a45e606d44961ee0949c459d0f43cc7a59a8161fc94c3e817597dd43de79fc410bdfce3c801937ef99f69df73ea837420c5c09cce6', '2024-12-07 19:38:26', 'ST', 0, '85d18056085de2defe1aab222aa6fccd727b11993e2776f2ddb5d74b51171a44'),
('85d18056085de2defe1aab222aa6fccd727b11993e2776f2ddb5d74b51171a44', 'admin@email.com', 'scrypt:32768:8:1$Pssprl8VeIABqrxs$5ef7b51685c0ee647ce9422bd78ad5c53abe5c6735c74bc775ebf3ca22b06dd15d656ff081cfa685abea5951e46d9d568d7f2f4437800d4277acb7eeb1cb7958', '2024-12-07 19:21:30', 'AD', 0, '0');


INSERT INTO `user_info` (`user_id`, `name`, `phone`, `address`, `gender`, `birth`, `img`) VALUES
('6856baa6e40622c1973a1e12a96ca943f5f49d03dede5cdc4d8386491f651e85', 'Student Demo', '7412589632', 'ABC ', 'M', '2024-12-12', ''),
('85d18056085de2defe1aab222aa6fccd727b11993e2776f2ddb5d74b51171a44', 'Admin', '7412589635', 'ABC', 'M', '2024-12-19', '');

INSERT INTO `student` (`id`, `roll`, `reg`, `course`, `semester`, `status`, `reg_by`, `createDate`) VALUES
('6856baa6e40622c1973a1e12a96ca943f5f49d03dede5cdc4d8386491f651e85', '12345', '29941', 1, 4, 0, '85d18056085de2defe1aab222aa6fccd727b11993e2776f2ddb5d74b51171a44', '2024-12-07 19:38:26');

