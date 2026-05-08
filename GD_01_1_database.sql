-- Tạo database (project)
CREATE DATABASE exp_web_math;
-- Sử dụng database
USE exp_web_math;
-- Tạo bảng usFunctionsers
CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	email VARCHAR(150) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	role ENUM('student', 'admin') DEFAULT 'student',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Thêm user test
INSERT INTO users (name, email, password)
VALUES ('Phu Gia', 'phugia@gmail.com', '123456');
-- Xem dữ liệu
SELECT *
FROM users;