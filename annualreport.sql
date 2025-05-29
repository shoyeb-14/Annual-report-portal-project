-- Active: 1741678042001@@127.0.0.1@5432@annual_report_portal
CREATE DATABASE ANNUAL_REPORT_PORTAL;
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'viewer',  -- viewer, editor, admin
    department_id INTEGER REFERENCES departments(id)
);
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    roll_no VARCHAR(50) UNIQUE,
    department_id INT REFERENCES departments(id)
);

CREATE TABLE academics (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id),
    department_id INT REFERENCES departments(id),
    semester INT NOT NULL,
    gpa NUMERIC(3,2) NOT NULL,
    gpa_range VARCHAR(20), -- eg: '9.0 - 10.0'
    is_hau BOOLEAN DEFAULT FALSE,
    academic_year VARCHAR(10) NOT NULL -- eg: '2023-24'
);

CREATE TABLE research_faculty (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id),
    year INTEGER NOT NULL,
    total_papers INTEGER NOT NULL,
    total_projects INTEGER NOT NULL,
    funding_received NUMERIC(12,2)  -- in ₹
);
CREATE TABLE research_students (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id),
    year INTEGER NOT NULL,
    papers_presented INTEGER NOT NULL,
    patents_filed INTEGER DEFAULT 0
);
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id),
    year INTEGER NOT NULL,
    placements INTEGER NOT NULL,
    avg_package NUMERIC(10,2),
    awards_won INTEGER DEFAULT 0
);
select * from achievements;
CREATE TABLE reports_generated (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    department_id INTEGER REFERENCES departments(id),
    section VARCHAR(50),  -- 'academics', 'research', 'achievements'
    year INTEGER,
    format VARCHAR(10),  -- 'pdf', 'html'
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
--edit_history table (versioning)
CREATE TABLE edit_history (
    id SERIAL PRIMARY KEY,
    section VARCHAR(50), -- academics, research_faculty, etc.
    record_id INTEGER NOT NULL,  -- e.g., academics.id
    user_id INTEGER REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    change_summary TEXT,
    old_data JSONB,
    new_data JSONB
);
--assignments table (collaboration)
CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    department_id INTEGER REFERENCES departments(id),
    section VARCHAR(50),  -- academics, research_faculty, etc.
    year INTEGER NOT NULL
);


INSERT INTO departments (id, name) VALUES
(1, 'Information Technology'),
(2, 'Computer Science'),
(3, 'Electronics and Communication'),
(4, 'Mechanical Engineering'),
(5, 'Civil Engineering');

INSERT INTO users (id, name, email, password, role, department_id) VALUES

(1, 'Mrs. Nagalakshmi', 'nagalakshmi@college.edu', '$2y$10$7N6.ZDkJm5slU8DxCghltuE9hlz3P7wvo7ZdZjIXuHcdsQ0cZIZQG', 'hod', 1),
(2, 'Dr. Ravi Kumar', 'ravi.kumar@college.edu', '$2y$10$7N6.ZDkJm5slU8DxCghltuE9hlz3P7wvo7ZdZjIXuHcdsQ0cZIZQG', 'hod', 2),
(3, 'Admin One', 'admin1@college.edu', '$2y$10$4X1Owe2xISxjoX9fDj7MxO.JTjHgz84KzPPXagUewOnAD8NRsDLEu', 'admin', NULL),
(4, 'Admin Two', 'admin2@college.edu', '$2y$10$4X1Owe2xISxjoX9fDj7MxO.JTjHgz84KzPPXagUewOnAD8NRsDLEu', 'admin', NULL),
(5, 'Coordinator A', 'coord1@college.edu', '$2y$10$zYJJSmPG4p4gESshEuAbGu0zqtXFt7umPzvM9eM6h/UZANFq8RS.6', 'coordinator', 1),
(6, 'Coordinator B', 'coord2@college.edu', '$2y$10$zYJJSmPG4p4gESshEuAbGu0zqtXFt7umPzvM9eM6h/UZANFq8RS.6', 'coordinator', 2);

ALTER TABLE users ADD COLUMN phone VARCHAR(10) NOT NULL;
INSERT INTO students (name, roll_no, department_id) VALUES
('Aakash Sharma', 'IT2021-01', 1),
('Priya Verma', 'IT2021-02', 1),
('Ravi Kumar', 'IT2021-03', 1),
('Neha Reddy', 'IT2021-04', 1),
('Anjali Mehta', 'CSE2021-01', 2),
('Karan Joshi', 'CSE2021-02', 2),
('Deepika Rao', 'CSE2021-03', 2),
('Arjun Singh', 'CSE2021-04', 2),
('Sneha Roy', 'ECE2021-01', 3),
('Mohit Sinha', 'ECE2021-02', 3),
('Tanya Kapoor', 'ECE2021-03', 3),
('Rohan Das', 'ECE2021-04', 3);

-- IT Department (department_id = 1)
INSERT INTO academics (student_id, department_id, semester, gpa, gpa_range, is_hau, academic_year) VALUES
(1, 1, 5, 9.2, '9.0 - 10.0', TRUE, '2023-24'),
(2, 1, 5, 8.6, '8.0 - 9.0', FALSE, '2023-24'),
(3, 1, 5, 7.3, '7.0 - 8.0', FALSE, '2023-24'),
(4, 1, 5, 9.5, '9.0 - 10.0', TRUE, '2023-24'),
(5, 2, 5, 8.8, '8.0 - 9.0', FALSE, '2023-24'),-- CSE Department (department_id = 2)
(6, 2, 5, 9.1, '9.0 - 10.0', TRUE, '2023-24'),
(7, 2, 5, 6.9, '6.0 - 7.0', FALSE, '2023-24'),
(8, 2, 5, 7.5, '7.0 - 8.0', FALSE, '2023-24'),
(9, 3, 5, 9.3, '9.0 - 10.0', TRUE, '2023-24'),-- ECE Department (department_id = 3)
(10, 3, 5, 8.2, '8.0 - 9.0', FALSE, '2023-24'),
(11, 3, 5, 7.0, '7.0 - 8.0', FALSE, '2023-24'),
(12, 3, 5, 9.7, '9.0 - 10.0', TRUE, '2023-24');

-- IT Department
INSERT INTO research_faculty (department_id, year, total_papers, total_projects, funding_received)
VALUES 
(1, 2022, 12, 3, 250000.00),
(1, 2023, 18, 5, 375000.00),
(2, 2022, 20, 6, 500000.00),-- CSE Department
(2, 2023, 25, 8, 675000.00),
(3, 2022, 10, 2, 150000.00),-- ECE Department
(3, 2023, 14, 3, 220000.00), 
(4, 2022, 8, 2, 100000.00),-- MECH Department
(4, 2023, 11, 4, 180000.00),
(5, 2022, 6, 1, 80000.00),-- CIVIL Department
(5, 2023, 9, 3, 120000.00);

-- IT Department (department_id = 1)
INSERT INTO research_students (department_id, year, papers_presented, patents_filed) VALUES
(1, 2022, 5, 1),
(1, 2023, 7, 2),
(2, 2022, 6, 2),-- CSE Department (department_id = 2)
(2, 2023, 9, 3),
(3, 2022, 4, 0),-- ECE Department (department_id = 3)
(3, 2023, 6, 1),
(4, 2022, 3, 1),-- Mechanical Department (department_id = 4)
(4, 2023, 5, 2),
(5, 2022, 2, 0),-- Civil Department (department_id = 5)
(5, 2023, 4, 1);


INSERT INTO achievements (department_id, year, placements, avg_package, awards_won) VALUES
(1, 2022, 55, 450000.00, 3),
(1, 2023, 60, 500000.00, 5),
(2, 2022, 65, 550000.00, 4),
(2, 2023, 70, 600000.00, 6),
(3, 2022, 40, 400000.00, 2),
(3, 2023, 50, 450000.00, 3),
(4, 2022, 30, 350000.00, 1),
(4, 2023, 35, 370000.00, 2),
(5, 2022, 25, 320000.00, 1),
(5, 2023, 28, 340000.00, 1);

-- Reports Generated by Coordinators & HODs for different sections and formats
INSERT INTO reports_generated (user_id, department_id, section, year, format) VALUES
(1, 1, 'academics', 2023, 'pdf'),        -- HOD IT
(5, 1, 'research', 2023, 'pdf'),        -- Coordinator A
(1, 1, 'achievements', 2023, 'pdf'),
(2, 2, 'academics', 2023, 'pdf'),       -- HOD CSE
(6, 2, 'research', 2023, 'pdf'),         -- Coordinator B
(2, 2, 'achievements', 2023, 'html'),
(3, 3, 'academics', 2023, 'pdf'),        -- Admin generating ECE report
(3, 3, 'research', 2023, 'pdf'),
(3, 3, 'achievements', 2023, 'pdf'),
(4, 4, 'academics', 2023, 'pdf'),       -- Admin generating Mech report
(4, 4, 'research', 2023, 'pdf'),
(4, 4, 'achievements', 2023, 'html'),
(4, 5, 'academics', 2023, 'pdf'),
(4, 5, 'research', 2023, 'pdf'),
(4, 5, 'achievements', 2023, 'pdf');
INSERT INTO achievements (department_id, year, placements, avg_package, awards_won) VALUES
-- 2024
(1, 2024, 65, 550000.00, 4), -- IT
(2, 2024, 75, 650000.00, 7), -- CSE
(3, 2024, 55, 480000.00, 4), -- ECE
(4, 2024, 40, 400000.00, 3), -- MECH
(5, 2024, 32, 360000.00, 2), -- CIVIL
-- 2025
(1, 2025, 70, 600000.00, 6), -- IT
(2, 2025, 80, 700000.00, 8), -- CSE
(3, 2025, 60, 520000.00, 5), -- ECE
(4, 2025, 45, 430000.00, 3), -- MECH
(5, 2025, 35, 380000.00, 2); -- CIVIL
select * from achievements;

-- Update: Adding more students and academics data for each department

-- Information Technology (Department ID: 1)
INSERT INTO students (name, roll_no, department_id)
SELECT 'IT Student ' || generate_series(5, 74), 'IT2021-' || lpad(generate_series(5, 74)::TEXT, 2, '0'), 1;

UPDATE academics SET gpa = 4.5, is_hau = TRUE WHERE student_id IN (SELECT id FROM students WHERE department_id = 1 ORDER BY RANDOM() LIMIT 10);
UPDATE academics SET gpa = 6.2 WHERE student_id IN (SELECT id FROM students WHERE department_id = 1 ORDER BY RANDOM() LIMIT 20);
UPDATE academics SET gpa = 8.1 WHERE student_id IN (SELECT id FROM students WHERE department_id = 1 ORDER BY RANDOM() LIMIT 44);

-- Computer Science (Department ID: 2)
INSERT INTO students (name, roll_no, department_id)
SELECT 'CSE Student ' || generate_series(5, 68), 'CSE2021-' || lpad(generate_series(5, 68)::TEXT, 2, '0'), 2;

UPDATE academics SET gpa = 4.8, is_hau = TRUE WHERE student_id IN (SELECT id FROM students WHERE department_id = 2 ORDER BY RANDOM() LIMIT 8);
UPDATE academics SET gpa = 7.1 WHERE student_id IN (SELECT id FROM students WHERE department_id = 2 ORDER BY RANDOM() LIMIT 25);
UPDATE academics SET gpa = 8.5 WHERE student_id IN (SELECT id FROM students WHERE department_id = 2 ORDER BY RANDOM() LIMIT 35);

-- Electronics and Communication (Department ID: 3)
INSERT INTO students (name, roll_no, department_id)
SELECT 'ECE Student ' || generate_series(5, 62), 'ECE2021-' || lpad(generate_series(5, 62)::TEXT, 2, '0'), 3;

UPDATE academics SET gpa = 4.2, is_hau = TRUE WHERE student_id IN (SELECT id FROM students WHERE department_id = 3 ORDER BY RANDOM() LIMIT 12);
UPDATE academics SET gpa = 6.5 WHERE student_id IN (SELECT id FROM students WHERE department_id = 3 ORDER BY RANDOM() LIMIT 22);
UPDATE academics SET gpa = 7.8 WHERE student_id IN (SELECT id FROM students WHERE department_id = 3 ORDER BY RANDOM() LIMIT 28);

-- Mechanical Engineering (Department ID: 4)
INSERT INTO students (name, roll_no, department_id)
SELECT 'MECH Student ' || generate_series(5, 55), 'MECH2021-' || lpad(generate_series(5, 55)::TEXT, 2, '0'), 4;

UPDATE academics SET gpa = 4.9, is_hau = TRUE WHERE student_id IN (SELECT id FROM students WHERE department_id = 4 ORDER BY RANDOM() LIMIT 7);
UPDATE academics SET gpa = 6.8 WHERE student_id IN (SELECT id FROM students WHERE department_id = 4 ORDER BY RANDOM() LIMIT 20);
UPDATE academics SET gpa = 7.6 WHERE student_id IN (SELECT id FROM students WHERE department_id = 4 ORDER BY RANDOM() LIMIT 28);

-- Civil Engineering (Department ID: 5)
INSERT INTO students (name, roll_no, department_id)
SELECT 'CIVIL Student ' || generate_series(5, 60), 'CIVIL2021-' || lpad(generate_series(5, 60)::TEXT, 2, '0'), 5;

UPDATE academics SET gpa = 4.6, is_hau = TRUE WHERE student_id IN (SELECT id FROM students WHERE department_id = 5 ORDER BY RANDOM() LIMIT 9);
UPDATE academics SET gpa = 6.1 WHERE student_id IN (SELECT id FROM students WHERE department_id = 5 ORDER BY RANDOM() LIMIT 23);
UPDATE academics SET gpa = 7.9 WHERE student_id IN (SELECT id FROM students WHERE department_id = 5 ORDER BY RANDOM() LIMIT 28);
ALTER TABLE departments ADD COLUMN total_students INTEGER;
ALTER TABLE departments ADD COLUMN passed INTEGER;
ALTER TABLE departments ADD COLUMN failed INTEGER;
ALTER TABLE departments ADD COLUMN backlogs INTEGER;
-- Example: Setting initial values for the IT department (assuming ID = 1)
-- Information Technology (Assuming Department ID = 1)
UPDATE departments
SET total_students = 150,
    passed = 120,
    failed = 15,
    backlogs = 10
WHERE id = 1;

-- Computer Science (Assuming Department ID = 2)
UPDATE departments
SET total_students = 130,
    passed = 105,
    failed = 12,
    backlogs = 8
WHERE id = 2;

-- Electronics and Communication (Assuming Department ID = 3)
UPDATE departments
SET total_students = 120,
    passed = 95,
    failed = 10,
    backlogs = 7
WHERE id = 3;

-- Mechanical Engineering (Assuming Department ID = 4)
UPDATE departments
SET total_students = 110,
    passed = 85,
    failed = 15,
    backlogs = 5
WHERE id = 4;

-- Civil Engineering (Assuming Department ID = 5)
UPDATE departments
SET total_students = 100,
    passed = 80,
    failed = 12,
    backlogs = 6
WHERE id = 5;
-- Add these columns to your research_faculty table
ALTER TABLE research_faculty ADD COLUMN ongoing_projects INTEGER DEFAULT 0;
ALTER TABLE research_faculty ADD COLUMN completed_projects INTEGER DEFAULT 0;
ALTER TABLE research_faculty ADD COLUMN international_papers INTEGER DEFAULT 0;
ALTER TABLE research_faculty ADD COLUMN national_papers INTEGER DEFAULT 0;
ALTER TABLE research_faculty ADD COLUMN faculty_count INTEGER DEFAULT 0;
ALTER TABLE research_faculty ADD COLUMN performance_score INTEGER DEFAULT 0;

-- Add these columns to your research_students table
ALTER TABLE research_students ADD COLUMN international_papers INTEGER DEFAULT 0;
ALTER TABLE research_students ADD COLUMN national_papers INTEGER DEFAULT 0;
ALTER TABLE research_students ADD COLUMN performance_score INTEGER DEFAULT 0;

-- Create a table for yearly trends
CREATE TABLE research_yearly_trends (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL UNIQUE,
    total_projects INTEGER DEFAULT 0,
    total_papers INTEGER DEFAULT 0,
    total_patents INTEGER DEFAULT 0,
    total_funding NUMERIC(12,2) DEFAULT 0
);

-- Insert some initial trend data (you can update this later)
INSERT INTO research_yearly_trends (year, total_projects, total_papers, total_patents, total_funding) VALUES
(2021, 58, 112, 12, 12500000),
(2022, 75, 125, 18, 15800000),
(2023, 82, 148, 24, 18700000),
(2024, 87, 156, 22, 22300000),
(2025, 103, 175, 32, 25600000);

select * from research_faculty;
UPDATE users
SET password = '$2y$12$aUUMfZQExczGrdjekIOsbelw4CPB1A7vhvlMdzc8kUmzM7vAmO50i'
WHERE email = 'nagalakshmi@college.edu';

UPDATE users
SET password = '$2y$12$aUUMfZQExczGrdjekIOsbelw4CPB1A7vhvlMdzc8kUmzM7vAmO50i'
WHERE email = 'ravi.kumar@college.edu';

SELECT * from users;
select * from research_students;

UPDATE achievements
SET placements = '100'
WHERE id = 4;

select * from academics;