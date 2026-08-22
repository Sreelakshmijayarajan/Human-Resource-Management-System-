import pool from './db.js';

export async function initializeDatabase() {
  try {
    // 1. Departments Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        head_name VARCHAR(100) DEFAULT 'Unassigned',
        head_email VARCHAR(150) DEFAULT '',
        head_initials VARCHAR(10) DEFAULT 'NA',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) DEFAULT 'password123',
        role ENUM('employee', 'hr_admin') NOT NULL DEFAULT 'employee',
        department VARCHAR(100) DEFAULT 'Engineering & Tech',
        job_title VARCHAR(100) DEFAULT 'Software Engineer',
        initials VARCHAR(10) DEFAULT 'US',
        avatar_color VARCHAR(50) DEFAULT 'bg-indigo-500',
        status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Employees Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(100) NOT NULL,
        department VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        phone VARCHAR(30) DEFAULT '+91 98765 43210',
        status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
        join_date VARCHAR(50) DEFAULT '15 Mar 2022',
        initials VARCHAR(10) DEFAULT 'SK',
        avatar_color VARCHAR(50) DEFAULT 'bg-blue-500',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Notifications Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(50) PRIMARY KEY,
        category ENUM('alert', 'announcement') NOT NULL DEFAULT 'alert',
        type VARCHAR(50) NOT NULL DEFAULT 'system',
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        time VARCHAR(50) DEFAULT 'Just now',
        read_status TINYINT(1) DEFAULT 0,
        author_name VARCHAR(100) DEFAULT 'Uma Umamaheshwari',
        target_audience VARCHAR(100) DEFAULT 'All Employees (248)',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Always seed users
    await pool.query(`
      INSERT INTO users (id, name, email, role, department, job_title, initials, avatar_color) VALUES
      ('USR-001', 'Uma Umamaheshwari', 'umau35579@dayflow.io', 'hr_admin', 'Human Resources', 'Head of People Operations', 'UU', 'bg-indigo-600'),
      ('USR-002', 'Sanjay Kumar', 'sanjay.kumar@dayflow.io', 'employee', 'Product & Design', 'Senior Product Designer', 'SK', 'bg-blue-500'),
      ('USR-003', 'Priya Sharma', 'priya.sharma@dayflow.io', 'employee', 'Engineering', 'Frontend Engineer', 'PS', 'bg-purple-500')
      ON DUPLICATE KEY UPDATE name=VALUES(name);
    `);

    // Always seed employees
    await pool.query(`
      INSERT INTO employees (id, name, role, department, email, phone, status, join_date, initials, avatar_color) VALUES
      ('E001', 'Sanjay Kumar', 'Senior Product Designer', 'Product & Design', 'sanjay.kumar@dayflow.io', '+91 98765 43210', 'active', '15 Mar 2022', 'SK', 'bg-blue-500'),
      ('E002', 'Priya Sharma', 'Frontend Engineer', 'Engineering', 'priya.sharma@dayflow.io', '+91 91234 56789', 'active', '02 Jun 2021', 'PS', 'bg-purple-500'),
      ('E003', 'Rahul Verma', 'HR Business Partner', 'Human Resources', 'rahul.verma@dayflow.io', '+91 87654 32109', 'on_leave', '19 Jan 2023', 'RV', 'bg-emerald-500')
      ON DUPLICATE KEY UPDATE name=VALUES(name);
    `);

    // Always seed departments
    await pool.query(`
      INSERT INTO departments (id, name, description, head_name, head_email, head_initials) VALUES
      ('dept-1', 'Engineering & Tech', 'Frontend, backend, mobile apps, DevOps infrastructure.', 'Arjun Singh', 'arjun.singh@dayflow.io', 'AS'),
      ('dept-2', 'Product & Design', 'UI/UX design systems, user research, product strategy.', 'Sanjay Kumar', 'sanjay.kumar@dayflow.io', 'SK'),
      ('dept-3', 'Human Resources', 'Talent acquisition, employee lifecycle, performance and payroll.', 'Uma Umamaheshwari', 'umau35579@dayflow.io', 'UU')
      ON DUPLICATE KEY UPDATE name=VALUES(name);
    `);

    console.log('✅ Dayflow MySQL Tables & Seed Records Ready!');
  } catch (err) {
    console.error('⚠️ DB Init Note:', err.message);
  }
}
