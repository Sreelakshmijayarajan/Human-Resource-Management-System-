import React, { useState } from 'react';
import { Sparkles, Bot, Send, User, CheckCircle2, Zap } from 'lucide-react';

export const CopilotPage: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: 'Dayflow AI Copilot is online with active telemetry. How can I assist your organizational decisions or workforce evaluations today?',
      timestamp: 'Just now',
    },
  ]);
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = (text?: string) => {
    const q = text || query;
    if (!q.trim()) return;

    const userMsg = {
      id: String(Date.now()),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsThinking(true);

    setTimeout(() => {
      let responseText = 'Telemetry review indicates:';
      let insight = {
        title: 'Workforce Capacity & Skill Balance',
        detail: 'Current workforce capacity is at 84% with 91% redundancy coverage. 3 attention signals are active in Engineering and Analytics.',
        action: 'Review pending leave approvals to ensure backup code-review delegation.',
      };

      const lower = q.toLowerCase();
      if (lower.includes('leave') || lower.includes('priya')) {
        insight = {
          title: 'Priya Sharma (Frontend Lead) — Leave Impact Analysis',
          detail: 'Pending 2-day leave creates an unhedged coverage hole in Core Frontend Architecture for Next.js and WebGL components.',
          action: 'Approve with temporary code-signing delegation to Dev Patel.',
        };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          insight,
        } as any,
      ]);
      setIsThinking(false);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-8">
      <div className="pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Dayflow AI Copilot
          </h1>
          <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            Decision Assistant
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Conversational workforce intelligence and prescriptive decision analysis.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card flex flex-col h-[580px] overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {messages.map((msg: any) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-4 space-y-2.5 ${msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-xs'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs'
                  }`}
              >
                <p className="leading-relaxed font-medium">{msg.text}</p>

                {msg.insight && (
                  <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-2 text-slate-800">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{msg.insight.title}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{msg.insight.detail}</p>
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 font-medium">
                      <strong>Recommendation:</strong> {msg.insight.action}
                    </div>
                  </div>
                )}

                <div className="flex justify-end text-[10px] text-slate-400 font-mono">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs text-indigo-700 animate-pulse">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>Analyzing organizational telemetry...</span>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Copilot about workforce decisions, leave impacts, capacity..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              disabled={!query.trim() || isThinking}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-subtle flex items-center gap-1.5"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
