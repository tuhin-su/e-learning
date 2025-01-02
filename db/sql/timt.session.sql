-- Table: user
CREATE TABLE IF NOT EXISTS user (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    email VARCHAR(255),
    passwd VARCHAR(255) NOT NULL,
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    groups VARCHAR(255),
    status INT DEFAULT 0 NOT NULL,
    createBy VARCHAR(255) NOT NULL
);

-- Table: user_info
CREATE TABLE IF NOT EXISTS user_info (
    user_id VARCHAR(255) PRIMARY KEY NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(20),
    address VARCHAR(255),
    gender VARCHAR(255),
    birth DATE,
    img LONGTEXT,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Table: group
-- Table: `group`
CREATE TABLE IF NOT EXISTS `group` (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(255),
    code VARCHAR(255),
    description VARCHAR(255),
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    label INT DEFAULT 0 NOT NULL
);


-- Table: course
CREATE TABLE IF NOT EXISTS course (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(255),
    description VARCHAR(255),
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    course_fees DECIMAL(10, 2),
    course_duration INT,
    status INT DEFAULT 0 NOT NULL
);

-- Table: attends
CREATE TABLE IF NOT EXISTS attends (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    user_id VARCHAR(255),
    attendance_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    attendance_date_only DATE NOT NULL,
    UNIQUE (user_id, attendance_date_only),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Table: posts_data
CREATE TABLE IF NOT EXISTS posts_data (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    content LONGBLOB,
    content_name VARCHAR(255),
    content_type VARCHAR(255),
    content_size INT DEFAULT 0 NOT NULL,
    createBy VARCHAR(255) NOT NULL,
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (createBy) REFERENCES user(id)
);

-- Table: classes
CREATE TABLE IF NOT EXISTS classes (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    host VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    stream INT NOT NULL,
    semester INT NOT NULL,
    description VARCHAR(255),
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    content_id INT DEFAULT 0,
    FOREIGN KEY (host) REFERENCES user(id),
    FOREIGN KEY (stream) REFERENCES course(id),
    FOREIGN KEY (content_id) REFERENCES posts_data(id)
);

-- Table: class_comment
CREATE TABLE IF NOT EXISTS class_comment (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    class_id INT,
    user_id VARCHAR(255),
    comment VARCHAR(255),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Table: class_likes
CREATE TABLE IF NOT EXISTS class_likes (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    class_id INT,
    user_id VARCHAR(255),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Table: class_attends
CREATE TABLE IF NOT EXISTS class_attends (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    class_id INT,
    user_id VARCHAR(255),
    attendance_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Table: student
CREATE TABLE IF NOT EXISTS student (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    roll VARCHAR(255) NOT NULL,
    reg VARCHAR(255) NOT NULL,
    course INT,
    semester INT,
    status INT DEFAULT 0,
    reg_by VARCHAR(255),
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (id) REFERENCES user(id),
    FOREIGN KEY (course) REFERENCES course(id),
    FOREIGN KEY (reg_by) REFERENCES user(id)
);

-- Table: collage_location
CREATE TABLE IF NOT EXISTS collage_location (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    lat DECIMAL(10, 6) NOT NULL,
    lon DECIMAL(10, 6) NOT NULL,
    distend DECIMAL(10, 6) NOT NULL,
    createBy VARCHAR(255) NOT NULL,
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table: notification
CREATE TABLE IF NOT EXISTS notification (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    title VARCHAR(255) NOT NULL,
    post_id INT NULL,
    content VARCHAR(255),
    createBy VARCHAR(255) NOT NULL,
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts_data(id),
    FOREIGN KEY (createBy) REFERENCES user(id)
);

-- Table: galary
CREATE TABLE IF NOT EXISTS galary (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    content_name VARCHAR(255),
    createBy VARCHAR(255) NOT NULL,
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    post_id INT,
    FOREIGN KEY (post_id) REFERENCES posts_data(id)
);

-- Table: otp
CREATE TABLE IF NOT EXISTS otp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    otp VARCHAR(7) NULL,
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `for` VARCHAR(255) NULL
);
