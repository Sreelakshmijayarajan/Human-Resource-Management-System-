import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Zap,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface CopilotMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  structuredInsight?: {
    insight: string;
    why: string;
    impact: string;
    recommendation: string;
    confidence: number;
  };
}

const initialMessages: CopilotMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: 'Hello Uma, I am your Dayflow Workforce Decision Copilot. I analyze real-time attendance telemetry, skill redundancies, and leave approval impacts. How can I assist your organizational decisions today?',
    timestamp: 'Just now',
  },
];

interface AICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICopilotModal: React.FC<AICopilotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<CopilotMessage[]>(initialMessages);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [isOpen, messages, isThinking]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      let aiResponseText = '';
      let structuredInsight;

      const lower = query.toLowerCase();

      if (lower.includes('leave') || lower.includes('priya') || lower.includes('approval')) {
        aiResponseText = 'Analysis of pending leave requests indicates a critical skill dependency on August 25-26:';
        structuredInsight = {
          insight: 'Engineering capacity is projected to fall below the safe delivery threshold if Priya Sharma\'s 2-day leave is approved unconditionally.',
          why: '2 critical project skills (Next.js App Router & WebGL Visualizer) have zero secondary backups scheduled during that sprint window.',
          impact: 'Sprint velocity will drop from 86% to 71%; skill coverage falls to 63%.',
          recommendation: 'Approve with temporary code-review delegation to Dev Patel.',
          confidence: 96,
        };
      } else if (lower.includes('attendance') || lower.includes('arun') || lower.includes('deviation')) {
        aiResponseText = 'Telemetry review for attendance patterns:';
        structuredInsight = {
          insight: 'Arun Kumar shows a +34% shift deviation towards late morning arrivals over the last 10 days.',
          why: 'Data shows high midnight PR activity on Real-Time Pipeline migration between 11:30 PM – 2:00 AM.',
          impact: 'Productivity remains high (9.4 hrs/day), but chronic fatigue and burnout risk is elevated.',
          recommendation: 'Propose flexible core hours or rebalance late-night release rotations.',
          confidence: 94,
        };
      } else {
        aiResponseText = 'Synthesizing enterprise workforce telemetry:';
        structuredInsight = {
          insight: 'Current overall workforce health is STABLE at 84% capacity with 91% active skill coverage across 248 employees.',
          why: '3 pending attention signals require review before the Friday sprint closure.',
          impact: 'Zero statutory payroll or compliance violations detected.',
          recommendation: 'Review pending leave approvals and proceed with the August payroll disbursement.',
          confidence: 98,
        };
      }

      const aiMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredInsight,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 900);
  };

  const samplePrompts = [
    'Analyze leave impact for Priya Sharma',
    'Investigate attendance deviation for Arun Kumar',
    'Summarize Q3 workforce health & risk factors',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200/80 shadow-elevated overflow-hidden flex flex-col h-[640px] max-h-[90vh] animate-slide-up">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Dayflow AI Copilot</h3>
                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Decision Engine v2.6
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Context: Enterprise Workforce Telemetry</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 space-y-2.5 ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-xs'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs'
                }`}
              >
                <p className="leading-relaxed font-medium">{msg.text}</p>

                {/* Structured AI Decision Card */}
                {msg.structuredInsight && (
                  <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-2.5 text-xs text-slate-800">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        AI INSIGHT
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        Confidence {msg.structuredInsight.confidence}%
                      </span>
                    </div>

                    <p className="text-slate-800 font-semibold leading-relaxed">
                      {msg.structuredInsight.insight}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="font-bold text-slate-400 uppercase tracking-wider block text-[9px]">WHY</span>
                        <p className="text-slate-600 mt-0.5">{msg.structuredInsight.why}</p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="font-bold text-slate-400 uppercase tracking-wider block text-[9px]">IMPACT</span>
                        <p className="text-slate-600 mt-0.5">{msg.structuredInsight.impact}</p>
                      </div>
                    </div>

                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px]">
                      <span className="font-bold text-emerald-800 uppercase tracking-wider block text-[9px]">RECOMMENDATION</span>
                      <p className="text-emerald-950 font-medium mt-0.5">{msg.structuredInsight.recommendation}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end text-[10px] text-slate-400 font-mono">
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  U
                </div>
              )}
            </div>
          ))}

          {/* AI Thinking Animation */}
          {isThinking && (
            <div className="flex items-center gap-2 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs text-indigo-700 animate-pulse">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>Synthesizing workforce telemetry & policy evidence...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-5 py-2 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-1.5">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[11px] font-medium text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:text-slate-900 px-2.5 py-1 rounded-lg transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
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
              placeholder="Ask Copilot about workforce decisions, leave impact, or skill coverage..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isThinking}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-subtle transition-colors flex items-center gap-1.5"
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
