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
  // Strategy 1: Call Backend Express /api/chat Proxy (Most accurate & uses server env)
  try {
    const backendRes = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, history, userContext }),
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data?.reply) {
        return data.reply;
      }
    }
  } catch (err) {
    console.warn('Backend chat API offline, attempting direct Groq API...', err);
  }

  // Strategy 2: Direct Groq API Client (Fallback if server is offline)
  const isHR = userContext.role === 'hr_admin';

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
- Current User: ${userContext.name || (isHR ? 'Uma Umamaheshwari' : 'Sanjay Kumar')}, Role: ${isHR ? 'HR Administrator' : 'Employee'}, Department: ${userContext.department || (isHR ? 'Human Resources' : 'Product & Design')}.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6).map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    })),
    { role: 'user', content: userMessage },
  ];

  const candidateModels = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.6-27b'];

  if (GROQ_API_KEY) {
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
            temperature: 0.2,
            max_tokens: 900,
          }),
        });

        if (!response.ok) continue;

        const data = await response.json();
        if (data?.choices?.[0]?.message?.content) {
          return data.choices[0].message.content.trim();
        }
      } catch (err) {
        console.warn(`Direct Groq API attempt with model ${model} failed:`, err);
      }
    }
  }

  // Final fallback
  return `Hello ${userContext.name || 'there'}! Standard office hours are 9:00 AM – 6:00 PM (Mon–Fri). You have 18 Annual, 12 Sick, and 6 Casual leaves allocated. Salaries are credited on the last working day of each month.`;
};
