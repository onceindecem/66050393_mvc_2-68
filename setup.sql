-- 1. create DB
DROP DATABASE IF EXISTS rumor_tracking;
CREATE DATABASE rumor_tracking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rumor_tracking;

-- 2. create Table
CREATE TABLE rumors (
    rumor_id CHAR(8) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    source VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    credibility_score INT DEFAULT 50,
    status ENUM('ปกติ', 'panic', 'verified_true', 'verified_false') DEFAULT 'ปกติ'
);

CREATE TABLE reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    rumor_id CHAR(8) NOT NULL,
    report_type ENUM('บิดเบือน', 'ปลุกปั่น', 'ข้อมูลเท็จ') NOT NULL,
    reported_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rumor_id) REFERENCES rumors(rumor_id)
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    role ENUM('ผู้ใช้ทั่วไป', 'ผู้ตรวจสอบ') NOT NULL
);

-- 3. insert data
INSERT INTO rumors (rumor_id, title, source, created_at, credibility_score, status) VALUES 
-- Panic
('10000001', 'ด่วน! เขื่อนภูมิพลร้าว เตรียมรับมือน้ำท่วมใหญ่', 'Line Group แม่บ้าน', DATE_SUB(NOW(), INTERVAL 24 HOUR), 10, 'panic'),
('10000002', 'แบงก์ชาติประกาศลอยตัวค่าเงินบาทรอบ 2', 'Twitter (X) #การเงิน', DATE_SUB(NOW(), INTERVAL 12 HOUR), 5, 'panic'),

-- Verified
('10000004', 'ครม. อนุมัติวันหยุดพิเศษช่วงสงกรานต์เพิ่ม', 'สำนักนายกรัฐมนตรี', DATE_SUB(NOW(), INTERVAL 2 DAY), 95, 'verified_true'),
('10000005', 'กินทุเรียนเผาไฟ ช่วยลดความดันโลหิต', 'TikTok @HealthGuru', DATE_SUB(NOW(), INTERVAL 3 DAY), 0, 'verified_false'),

-- Almost Panic
('10000003', 'พบสารกัมมันตรังสีรั่วไหลในโรงงานนิคมฯ ดัง', 'Facebook Live', DATE_SUB(NOW(), INTERVAL 6 HOUR), 15, 'ปกติ'),
('10000006', 'ราคาทองคำจะร่วงเหลือ 25,000 บาท พรุ่งนี้', 'เพจนักลงทุน', DATE_SUB(NOW(), INTERVAL 5 HOUR), 30, 'ปกติ'),
('10000007', 'พายุไต้ฝุ่นลูกใหม่จ่อเข้าไทย ทวีกำลังแรงกว่าปีก่อน', 'กรมอุตุฯ (ปลอม)', DATE_SUB(NOW(), INTERVAL 4 HOUR), 40, 'ปกติ'),

-- Normal
('10000008', 'ดาราคู่จิ้นชื่อดัง ซุ่มจดทะเบียนสมรสเงียบ', 'เพจใต้เตียงดารา', DATE_SUB(NOW(), INTERVAL 2 HOUR), 50, 'ปกติ'),
('10000009', 'แจกสูตรลับ ลดพุง 5 นิ้ว ใน 1 คืน', 'Instagram Stories', DATE_SUB(NOW(), INTERVAL 1 HOUR), 20, 'ปกติ'),
('10000010', 'ค่ายมือถือแจกเน็ตฟรี 100GB ฉลองครบรอบ', 'SMS Spam', NOW(), 10, 'ปกติ');

-- 10000001 (Panic)
INSERT INTO reports (user_id, rumor_id, report_type, reported_at) VALUES 
(1, '10000001', 'ปลุกปั่น', NOW()), (2, '10000001', 'ปลุกปั่น', NOW()), (3, '10000001', 'ปลุกปั่น', NOW()), (4, '10000001', 'ปลุกปั่น', NOW()),
(5, '10000001', 'ข้อมูลเท็จ', NOW()), (6, '10000001', 'ข้อมูลเท็จ', NOW()), (7, '10000001', 'ข้อมูลเท็จ', NOW()), (8, '10000001', 'ข้อมูลเท็จ', NOW()),
(9, '10000001', 'บิดเบือน', NOW()), (10, '10000001', 'บิดเบือน', NOW()), (11, '10000001', 'บิดเบือน', NOW()), (12, '10000001', 'บิดเบือน', NOW()),
(1, '10000001', 'ปลุกปั่น', NOW()), (2, '10000001', 'ปลุกปั่น', NOW()), (3, '10000001', 'ปลุกปั่น', NOW()), (4, '10000001', 'ปลุกปั่น', NOW());

-- 10000002 (Panic)
INSERT INTO reports (user_id, rumor_id, report_type, reported_at) VALUES 
(1, '10000002', 'บิดเบือน', NOW()), (2, '10000002', 'บิดเบือน', NOW()), (3, '10000002', 'บิดเบือน', NOW()), (4, '10000002', 'บิดเบือน', NOW()), (5, '10000002', 'บิดเบือน', NOW()),
(6, '10000002', 'ข้อมูลเท็จ', NOW()), (7, '10000002', 'ข้อมูลเท็จ', NOW()), (8, '10000002', 'ข้อมูลเท็จ', NOW()), (9, '10000002', 'ข้อมูลเท็จ', NOW()), (10, '10000002', 'ข้อมูลเท็จ', NOW()),
(1, '10000002', 'ปลุกปั่น', NOW()), (2, '10000002', 'ปลุกปั่น', NOW()), (3, '10000002', 'ปลุกปั่น', NOW()), (4, '10000002', 'ปลุกปั่น', NOW()), (5, '10000002', 'ปลุกปั่น', NOW());

-- 10000003 (Almost Panic) 
INSERT INTO reports (user_id, rumor_id, report_type, reported_at) VALUES 
(1, '10000003', 'ข้อมูลเท็จ', NOW()), (2, '10000003', 'ข้อมูลเท็จ', NOW()), (3, '10000003', 'ข้อมูลเท็จ', NOW()), (4, '10000003', 'ข้อมูลเท็จ', NOW()), (5, '10000003', 'ข้อมูลเท็จ', NOW()),
(6, '10000003', 'ปลุกปั่น', NOW()), (7, '10000003', 'ปลุกปั่น', NOW()), (8, '10000003', 'ปลุกปั่น', NOW()), (9, '10000003', 'ปลุกปั่น', NOW());

-- 10000006 (Almost Panic) 
INSERT INTO reports (user_id, rumor_id, report_type, reported_at) VALUES 
(1, '10000006', 'ปลุกปั่น', NOW()), (2, '10000006', 'ปลุกปั่น', NOW()), (3, '10000006', 'ปลุกปั่น', NOW()), (4, '10000006', 'ปลุกปั่น', NOW());

-- 10000007 (Almost Panic)
INSERT INTO reports (user_id, rumor_id, report_type, reported_at) VALUES 
(5, '10000007', 'ข้อมูลเท็จ', NOW()), (6, '10000007', 'ข้อมูลเท็จ', NOW()), (7, '10000007', 'ข้อมูลเท็จ', NOW()), (8, '10000007', 'ข้อมูลเท็จ', NOW());

-- Normal 
INSERT INTO reports (user_id, rumor_id, report_type, reported_at) VALUES 
(1, '10000008', 'บิดเบือน', NOW()),
(1, '10000005', 'ข้อมูลเท็จ', DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Insert Sample Users
INSERT INTO users (name, role) VALUES 
('Somchai', 'ผู้ใช้ทั่วไป'), ('Somsri', 'ผู้ใช้ทั่วไป'), ('John Doe', 'ผู้ตรวจสอบ'),
('Alice', 'ผู้ใช้ทั่วไป'), ('Bob', 'ผู้ใช้ทั่วไป'), ('Charlie', 'ผู้ใช้ทั่วไป'),
('Dave', 'ผู้ตรวจสอบ'), ('Eve', 'ผู้ใช้ทั่วไป'), ('Frank', 'ผู้ใช้ทั่วไป'), ('Grace', 'ผู้ใช้ทั่วไป');