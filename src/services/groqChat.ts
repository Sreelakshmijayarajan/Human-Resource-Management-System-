export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
}

const GROQ_API_KEY =
  (import.meta as any).env?.VITE_GROQ_API_KEY || '';

export const askDayflowAI = async (
  userMessage: string,
  history: ChatMessage[],
  userContext: {
    name: string;
    role: 'employee' | 'hr_admin';
    department?: string;
  }
): Promise<string> => {
  const isHR = userContext.role === 'hr_admin';

  // Role-Aware Comprehensive HR System Prompt
  const systemPrompt = `You are "Dayflow AI", an intelligent, polite, and highly knowledgeable HR assistant embedded inside Dayflow — a modern enterprise HR Management System (HRMS).

CURRENT USER CONTEXT:
- Name: ${userContext.name || (isHR ? 'Uma Umamaheshwari' : 'Sanjay Kumar')}
- Role: ${isHR ? 'HR Administrator / Head of People Ops' : 'Employee (Senior Product Designer)'}
- Department: ${userContext.department || (isHR ? 'Human Resources' : 'Product & Design')}
- Company: Dayflow Technologies India Pvt Ltd (Bengaluru, Karnataka)

COMPANY POLICIES & KNOWLEDGE BASE:
1. Working Hours: 09:00 AM to 06:00 PM (Monday to Friday). Saturday & Sunday are weekly offs.
2. Statutory Leave Allocations:
   - Annual Leave: 18 days/year (Carry forward max: 5 days)
   - Sick / Medical Leave: 12 days/year
   - Casual Leave: 6 days/year
   - Maternity Leave: 182 days (26 weeks, fully paid)
   - Paternity Leave: 14 days (2 weeks, fully paid)
   - Bereavement Leave: 5 days (immediate family)
3. Payroll Disbursement: Salaries are calculated by the 25th and credited directly on the last working day of every month. Basic salary, HRA, special allowances, PF (12%), and professional tax apply.
4. Attendance & Anomalies: Employees check in via the Dayflow portal before 09:30 AM. After 09:30 AM is marked as 'Late'. Less than 4 hours is marked as 'Half Day'.
5. HR Admin Capabilities (if user is HR Admin):
   - Manage employee profiles, departments, statutory leave rules, payroll processing, system notifications, broadcast announcements, and role access permissions.
   - You can assist HR Admins in drafting professional company-wide announcements, policy amendments, and performance reviews.

GUIDELINES FOR YOUR RESPONSES:
- Be concise, friendly, professional, and clear.
- Use clean Markdown formatting (bullet points, bold text, numbered lists) for readability.
- If asked to draft an announcement or email, provide a polished, ready-to-use template.
- If the user asks about leave or attendance, provide exact figures and next steps.`;

  // Format messages for Groq API
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6).map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    })),
    { role: 'user', content: userMessage },
  ];

  const candidateModels = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.6-27b'];

  for (const model of candidateModels) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.6,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      if (data?.choices?.[0]?.message?.content) {
        return data.choices[0].message.content.trim();
      }
    } catch (err) {
      console.warn(`Groq API attempt with model ${model} failed:`, err);
    }
  }

  // Graceful fallback response
  return `Hello ${userContext.name || 'there'}! As your Dayflow HR Assistant, I can confirm that standard office hours are 9:00 AM – 6:00 PM (Mon–Fri). You have standard statutory leave allocations (18 Annual, 12 Sick, 6 Casual). If you need further details or assistance with requests, feel free to ask!`;
};
