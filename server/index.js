import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    res.json({
      status: 'online',
      message: 'Dayflow HRMS MySQL Database Connected Successfully!',
      database: process.env.DB_NAME || 'dayflow_hrms',
      test: rows[0].solution,
    });
  } catch (error) {
    res.status(500).json({
      status: 'offline',
      message: 'MySQL Database Connection Error',
      error: error.message,
    });
  }
});

// 1. Auth Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, role } = req.body;
  try {
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND role = ?',
      [email, role]
    );

    if (users.length > 0) {
      const user = users[0];
      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          avatarInitials: user.initials,
        },
      });
    }

    // Default fallback response if user not in DB yet
    res.json({
      success: true,
      user: {
        id: role === 'hr_admin' ? 'USR-001' : 'USR-002',
        name: role === 'hr_admin' ? 'Uma Umamaheshwari' : 'Sanjay Kumar',
        email,
        role,
        avatarInitials: role === 'hr_admin' ? 'UU' : 'SK',
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Employees Routes
app.get('/api/employees', async (req, res) => {
  try {
    const [employees] = await pool.query('SELECT * FROM employees ORDER BY created_at DESC');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/employees', async (req, res) => {
  const { name, role, department, email, phone } = req.body;
  const id = `E00${Date.now().toString().slice(-3)}`;
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase();
  try {
    await pool.query(
      'INSERT INTO employees (id, name, role, department, email, phone, initials) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, role, department, email, phone, initials]
    );
    res.status(201).json({ message: 'Employee added successfully', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Departments Routes
app.get('/api/settings/departments', async (req, res) => {
  try {
    const [depts] = await pool.query('SELECT * FROM departments ORDER BY name ASC');
    res.json(depts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings/departments', async (req, res) => {
  const { name, description, headName, headEmail } = req.body;
  const id = `dept-${Date.now()}`;
  const initials = headName ? headName.split(' ').map((n) => n[0]).join('') : 'NA';
  try {
    await pool.query(
      'INSERT INTO departments (id, name, description, head_name, head_email, head_initials) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, description, headName || 'Unassigned', headEmail || '', initials]
    );
    res.status(201).json({ message: 'Department created successfully', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/settings/departments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM departments WHERE id = ?', [id]);
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Notifications Routes
app.get('/api/notifications', async (req, res) => {
  try {
    const [notifications] = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC');
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notifications', async (req, res) => {
  const { category, type, title, message, authorName, targetAudience } = req.body;
  const id = `notif-${Date.now()}`;
  try {
    await pool.query(
      'INSERT INTO notifications (id, category, type, title, message, author_name, target_audience) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, category || 'announcement', type || 'system', title, message, authorName || 'Uma Umamaheshwari', targetAudience || 'All Employees (248)']
    );
    res.status(201).json({ message: 'Notification created', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Dayflow HRMS Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 Health Check Endpoint: http://localhost:${PORT}/api/health`);
});
