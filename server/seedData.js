import pool from './db.js';

async function seed() {
  try {
    await pool.query(`
      INSERT IGNORE INTO employees (id, name, role, department, email, phone, status, join_date, initials, avatar_color) VALUES
      ('E001', 'Sanjay Kumar', 'Senior Product Designer', 'Product & Design', 'sanjay.kumar@dayflow.io', '+91 98765 43210', 'active', '15 Mar 2022', 'SK', 'bg-blue-500'),
      ('E002', 'Priya Sharma', 'Frontend Engineer', 'Engineering', 'priya.sharma@dayflow.io', '+91 91234 56789', 'active', '02 Jun 2021', 'PS', 'bg-purple-500'),
      ('E003', 'Rahul Verma', 'HR Business Partner', 'Human Resources', 'rahul.verma@dayflow.io', '+91 87654 32109', 'on_leave', '19 Jan 2023', 'RV', 'bg-emerald-500');
    `);

    await pool.query(`
      INSERT IGNORE INTO departments (id, name, description, head_name, head_email, head_initials) VALUES
      ('dept-1', 'Engineering & Tech', 'Frontend, backend, mobile apps, DevOps infrastructure.', 'Arjun Singh', 'arjun.singh@dayflow.io', 'AS'),
      ('dept-2', 'Product & Design', 'UI/UX design systems, user research, product strategy.', 'Sanjay Kumar', 'sanjay.kumar@dayflow.io', 'SK'),
      ('dept-3', 'Human Resources', 'Talent acquisition, employee lifecycle, performance and payroll.', 'Uma Umamaheshwari', 'umau35579@dayflow.io', 'UU');
    `);

    console.log('✅ Seed completed!');
    process.exit(0);
  } catch (err) {
    console.error('Err:', err);
    process.exit(1);
  }
}

seed();
