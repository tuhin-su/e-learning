-- Create user table
CREATE TABLE IF NOT EXISTS user (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    email VARCHAR(255),
    passwd VARCHAR(255) NOT NULL,
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    groups VARCHAR(255),
    status INT DEFAULT 0 NOT NULL
);

-- Create user_info table
CREATE TABLE IF NOT EXISTS user_info (
    user_id VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(20),
    address VARCHAR(255),
    gender VARCHAR(255),
    birth DATE,
    img LONGTEXT,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Create group table
CREATE TABLE IF NOT EXISTS `group` (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(255),
    code VARCHAR(255),
    description VARCHAR(255),
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    label INT DEFAULT 0 NOT NULL
);

-- Create course table
CREATE TABLE IF NOT EXISTS course (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    course_fees DECIMAL(10, 2),
    course_duration INT,
    status INT DEFAULT 0 NOT NULL
);

-- Create attends table
CREATE TABLE IF NOT EXISTS attends (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255),
    attendance_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    host VARCHAR(255),
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    content INT,
    FOREIGN KEY (host) REFERENCES user(id)
);

-- Create class_attends table
CREATE TABLE IF NOT EXISTS class_attends (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    class_id INT,
    user_id VARCHAR(255),
    attendance_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Create class_content table
CREATE TABLE IF NOT EXISTS class_content (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    content TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create resource table
CREATE TABLE IF NOT EXISTS resource (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255),
    content LONGTEXT,
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    version INT NOT NULL
);

-- Create student table
CREATE TABLE IF NOT EXISTS student (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    roll INT,
    reg INT,
    course VARCHAR(255),
    semester INT,
    status INT DEFAULT 0 NOT NULL,
    reg_by VARCHAR(255),
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (id) REFERENCES user(id),
    FOREIGN KEY (reg_by) REFERENCES user(id)
);
