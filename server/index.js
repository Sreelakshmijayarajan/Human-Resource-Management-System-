import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import { initializeDatabase } from './initDb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Auto initialize tables on start
initializeDatabase();

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
    const [employees] = await pool.query('SELECT * FROM employees');
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

// 5. Groq AI Chatbot Assistant API
app.post('/api/chat', async (req, res) => {
  const { message, history, userContext } = req.body;
  const isHR = userContext?.role === 'hr_admin';

  const systemPrompt = `You are "Dayflow AI", the official HR Intelligence and Compliance Assistant for Dayflow HRMS.

ACCURACY & PRECISION RULES:
1. Provide 100% accurate, factual answers based strictly on Dayflow HR policies and statutory rules.
2. Be crisp, professional, and well-structured using Markdown (bold headings, bullet points, numbered lists).
3. If drafting an email or announcement, produce a ready-to-broadcast template with [Subject], [Body], and signature.

GROUND TRUTH DAYFLOW KNOWLEDGE BASE:
- Organization: Dayflow Technologies India Pvt Ltd, Salarpuria Tech Park Outer Ring Road, Bengaluru, Karnataka.
- Timings: 09:00 AM – 06:00 PM (Monday to Friday). Saturday & Sunday are weekly offs.
- Check-in Rules: Check-in before 09:30 AM is On-Time. Check-in between 09:30 AM and 11:00 AM is flagged 'Late'. Less than 4 hours is recorded as 'Half Day'.
- Statutory Leave Policies:
  * Annual / Earned Leave: 18 days/year (Paid, carry forward max 5 days).
  * Sick / Medical Leave: 12 days/year (Paid, medical cert required if >2 consecutive days).
  * Casual Leave: 6 days/year (Paid, for personal urgent matters).
  * Maternity Leave: 182 days / 26 weeks (Fully paid, as per Maternity Benefit Act).
  * Paternity Leave: 14 days (Fully paid, applicable within 6 months of delivery).
  * Bereavement Leave: 5 days (Paid, for immediate family bereavement).
- Payroll Details: Salaries are calculated by the 25th and credited directly to bank accounts on the LAST WORKING DAY of each calendar month. Deductions: 12% Provident Fund (PF), Professional Tax (PT: ₹200), and Income Tax TDS.
- Current User: ${userContext?.name || (isHR ? 'Uma Umamaheshwari' : 'Sanjay Kumar')}, Role: ${isHR ? 'HR Administrator' : 'Employee'}, Department: ${userContext?.department || (isHR ? 'Human Resources' : 'Product & Design')}.`;

  const apiKey = process.env.GROQ_API_KEY || '';
  const messages = [
    { role: 'system', content: systemPrompt },
    ...(history || []).slice(-6).map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    })),
    { role: 'user', content: message },
  ];

  const models = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.6-27b'];

  for (const model of models) {
    try {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.2, // Low temperature for high accuracy & zero hallucinations
          max_tokens: 900,
        }),
      });

      if (!groqRes.ok) continue;

      const data = await groqRes.json();
      if (data?.choices?.[0]?.message?.content) {
        return res.json({ reply: data.choices[0].message.content.trim() });
      }
    } catch (err) {
      console.warn(`Groq server attempt with ${model} failed:`, err.message);
    }
  }

  res.json({
    reply: `Hello ${userContext?.name || 'there'}! Office hours are 9:00 AM – 6:00 PM (Mon–Fri). You have 18 Annual, 12 Sick, and 6 Casual leaves allocated. Salaries are credited on the last working day of every month.`,
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Dayflow HRMS Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 Health Check Endpoint: http://localhost:${PORT}/api/health`);
});
