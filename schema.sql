-- =========================================================
-- Dayflow HR Management System (HRMS) - MySQL Database Schema
-- Database Name: dayflow_hrms
-- =========================================================

CREATE DATABASE IF NOT EXISTS `dayflow_hrms` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `dayflow_hrms`;

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS `departments` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `head_name` VARCHAR(100) DEFAULT 'Unassigned',
  `head_email` VARCHAR(150) DEFAULT '',
  `head_initials` VARCHAR(10) DEFAULT 'NA',
  `head_avatar_color` VARCHAR(50) DEFAULT 'bg-indigo-500',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL DEFAULT '$2a$10$e8T7W/Pj...default',
  `role` ENUM('employee', 'hr_admin') NOT NULL DEFAULT 'employee',
  `department` VARCHAR(100) DEFAULT 'Engineering & Tech',
  `job_title` VARCHAR(100) DEFAULT 'Software Engineer',
  `initials` VARCHAR(10) DEFAULT 'US',
  `avatar_color` VARCHAR(50) DEFAULT 'bg-indigo-500',
  `last_active` VARCHAR(100) DEFAULT 'Active now',
  `status` ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Employees Details Table
CREATE TABLE IF NOT EXISTS `employees` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(50),
  `name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(100) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone` VARCHAR(30) DEFAULT '+91 98765 43210',
  `status` ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
  `join_date` VARCHAR(50) DEFAULT '15 Mar 2022',
  `initials` VARCHAR(10) DEFAULT 'SK',
  `avatar_color` VARCHAR(50) DEFAULT 'bg-blue-500',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Attendance Records Table
CREATE TABLE IF NOT EXISTS `attendance_records` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `employee_id` VARCHAR(50) NOT NULL,
  `employee_name` VARCHAR(100) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `date` DATE NOT NULL,
  `check_in` VARCHAR(20) DEFAULT NULL,
  `check_out` VARCHAR(20) DEFAULT NULL,
  `work_hours` VARCHAR(20) DEFAULT '8h 00m',
  `status` ENUM('present', 'absent', 'late', 'half_day', 'on_leave') DEFAULT 'present',
  `anomaly` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Leave Requests Table
CREATE TABLE IF NOT EXISTS `leave_requests` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `employee_id` VARCHAR(50) NOT NULL,
  `employee_name` VARCHAR(100) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `leave_type` VARCHAR(50) NOT NULL,
  `from_date` VARCHAR(50) NOT NULL,
  `to_date` VARCHAR(50) NOT NULL,
  `days` INT NOT NULL DEFAULT 1,
  `reason` TEXT,
  `applied_on` VARCHAR(50) NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `avatar_color` VARCHAR(50) DEFAULT 'bg-blue-500',
  `initials` VARCHAR(10) DEFAULT 'SK',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Leave Policies Table
CREATE TABLE IF NOT EXISTS `leave_policies` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `days` INT NOT NULL DEFAULT 12,
  `description` TEXT,
  `carry_forward_max` INT DEFAULT 0,
  `requires_approval` TINYINT(1) DEFAULT 1,
  `paid` TINYINT(1) DEFAULT 1,
  `icon_color` VARCHAR(100) DEFAULT 'text-blue-600 bg-blue-50'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Payroll Records Table
CREATE TABLE IF NOT EXISTS `payroll_records` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `employee_id` VARCHAR(50) NOT NULL,
  `employee_name` VARCHAR(100) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `month` VARCHAR(20) NOT NULL,
  `year` INT NOT NULL,
  `basic_salary` DECIMAL(12, 2) NOT NULL,
  `allowances` DECIMAL(12, 2) DEFAULT 0.00,
  `deductions` DECIMAL(12, 2) DEFAULT 0.00,
  `net_salary` DECIMAL(12, 2) NOT NULL,
  `status` ENUM('pending', 'processed', 'paid') DEFAULT 'pending',
  `payment_date` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Notifications & Announcements Table
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `category` ENUM('alert', 'announcement') NOT NULL DEFAULT 'alert',
  `type` VARCHAR(50) NOT NULL DEFAULT 'system',
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `time` VARCHAR(50) DEFAULT 'Just now',
  `read_status` TINYINT(1) DEFAULT 0,
  `author_name` VARCHAR(100) DEFAULT 'Uma Umamaheshwari',
  `author_role` VARCHAR(100) DEFAULT 'HR Administrator',
  `target_audience` VARCHAR(100) DEFAULT 'All Employees (248)',
  `action_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Company Profile Table
CREATE TABLE IF NOT EXISTS `company_profile` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(255) NOT NULL,
  `tax_id` VARCHAR(100) DEFAULT '',
  `domain` VARCHAR(100) DEFAULT 'dayflow.io',
  `phone` VARCHAR(50) DEFAULT '',
  `email` VARCHAR(150) DEFAULT '',
  `address` TEXT,
  `city` VARCHAR(100) DEFAULT 'Bengaluru',
  `state` VARCHAR(100) DEFAULT 'Karnataka',
  `country` VARCHAR(100) DEFAULT 'India',
  `work_start_time` VARCHAR(20) DEFAULT '09:00',
  `work_end_time` VARCHAR(20) DEFAULT '18:00',
  `weekly_off_days` VARCHAR(255) DEFAULT 'Saturday,Sunday'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- INITIAL SEED DATA
-- =========================================================

-- Seed Departments
INSERT INTO `departments` (`id`, `name`, `description`, `head_name`, `head_email`, `head_initials`, `head_avatar_color`) VALUES
('dept-1', 'Engineering & Tech', 'Frontend, backend, mobile apps, DevOps infrastructure.', 'Arjun Singh', 'arjun.singh@dayflow.io', 'AS', 'bg-indigo-500'),
('dept-2', 'Product & Design', 'UI/UX design systems, user research, product strategy.', 'Sanjay Kumar', 'sanjay.kumar@dayflow.io', 'SK', 'bg-blue-500'),
('dept-3', 'Human Resources', 'Talent acquisition, employee lifecycle, performance and payroll.', 'Uma Umamaheshwari', 'umau35579@dayflow.io', 'UU', 'bg-indigo-600'),
('dept-4', 'Analytics & Data', 'Business intelligence, data warehousing, predictive models.', 'Ananya Iyer', 'ananya.iyer@dayflow.io', 'AI', 'bg-pink-500'),
('dept-5', 'Finance & Accounts', 'Statutory compliance, tax deductions, corporate audits.', 'Kavitha Reddy', 'kavitha.reddy@dayflow.io', 'KR', 'bg-rose-500')
ON DUPLICATE KEY UPDATE `name`=`name`;

-- Seed Users
INSERT INTO `users` (`id`, `name`, `email`, `role`, `department`, `job_title`, `initials`, `avatar_color`, `status`) VALUES
('USR-001', 'Uma Umamaheshwari', 'umau35579@dayflow.io', 'hr_admin', 'Human Resources', 'Head of People Operations', 'UU', 'bg-indigo-600', 'active'),
('USR-002', 'Sanjay Kumar', 'sanjay.kumar@dayflow.io', 'employee', 'Product & Design', 'Senior Product Designer', 'SK', 'bg-blue-500', 'active'),
('USR-003', 'Priya Sharma', 'priya.sharma@dayflow.io', 'employee', 'Engineering', 'Frontend Engineer', 'PS', 'bg-purple-500', 'active'),
('USR-004', 'Rahul Verma', 'rahul.verma@dayflow.io', 'hr_admin', 'Human Resources', 'HR Business Partner', 'RV', 'bg-emerald-500', 'active'),
('USR-005', 'Dev Patel', 'dev.patel@dayflow.io', 'employee', 'Engineering', 'Backend Engineer', 'DP', 'bg-amber-500', 'active')
ON DUPLICATE KEY UPDATE `email`=`email`;

-- Seed Employees
INSERT INTO `employees` (`id`, `user_id`, `name`, `role`, `department`, `email`, `phone`, `status`, `join_date`, `initials`, `avatar_color`) VALUES
('E001', 'USR-002', 'Sanjay Kumar', 'Senior Product Designer', 'Product & Design', 'sanjay.kumar@dayflow.io', '+91 98765 43210', 'active', '15 Mar 2022', 'SK', 'bg-blue-500'),
('E002', 'USR-003', 'Priya Sharma', 'Frontend Engineer', 'Engineering', 'priya.sharma@dayflow.io', '+91 91234 56789', 'active', '02 Jun 2021', 'PS', 'bg-purple-500'),
('E003', 'USR-004', 'Rahul Verma', 'HR Business Partner', 'Human Resources', 'rahul.verma@dayflow.io', '+91 87654 32109', 'on_leave', '19 Jan 2023', 'RV', 'bg-emerald-500'),
('E004', 'USR-005', 'Dev Patel', 'Backend Engineer', 'Engineering', 'dev.patel@dayflow.io', '+91 77665 54433', 'active', '23 Nov 2022', 'DP', 'bg-amber-500')
ON DUPLICATE KEY UPDATE `email`=`email`;

-- Seed Company Profile
INSERT INTO `company_profile` (`id`, `company_name`, `tax_id`, `domain`, `phone`, `email`, `address`, `city`, `state`, `country`, `work_start_time`, `work_end_time`, `weekly_off_days`) VALUES
(1, 'Dayflow Technologies India Pvt Ltd', 'GSTIN29AAACD1234F1Z5', 'dayflow.io', '+91 80 4567 8900', 'people-ops@dayflow.io', 'Block B, 4th Floor, Salarpuria Tech Park, Outer Ring Road', 'Bengaluru', 'Karnataka', 'India', '09:00', '18:00', 'Saturday,Sunday')
ON DUPLICATE KEY UPDATE `company_name`=`company_name`;
