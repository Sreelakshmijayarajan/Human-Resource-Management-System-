import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Minus, 
  Sparkles, 
  Trash2, 
  ShieldCheck, 
  User, 
  Loader2, 
  HelpCircle,
  Clock,
  Calendar,
  DollarSign,
  Megaphone
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { askDayflowAI, ChatMessage } from '../../services/groqChat';

export const AIChatbotWidget: React.FC = () => {
  const { user } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isHR = user?.role === 'hr_admin';

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-1',
      sender: 'assistant',
      text: isHR
        ? `Hello **${user?.firstName || 'Uma'}**! 👋 I am your Dayflow HR Admin AI assistant. I can help you draft broadcast announcements, review statutory leave compliance, inspect employee metrics, and formulate corporate policies. How may I assist you today?`
        : `Hello **${user?.firstName || 'Sanjay'}**! 👋 I'm Dayflow AI, your workplace assistant. Ask me anything about your leave balance, payroll dates, company holidays, attendance rules, or benefits!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  // Quick Suggestion Chips based on Role
  const employeeChips = [
    { label: 'Leave Allowances', icon: Calendar, prompt: 'How many days of Annual, Sick, and Casual leave do I get per year?' },
    { label: 'Office Timings', icon: Clock, prompt: 'What are the company working hours and weekend off days?' },
    { label: 'Salary Credit Date', icon: DollarSign, prompt: 'When is payroll disbursed each month and what are the components?' },
    { label: 'Sick Leave Process', icon: HelpCircle, prompt: 'What is the procedure for taking urgent medical / sick leave?' },
  ];

  const hrChips = [
    { label: 'Draft All-Hands Memo', icon: Megaphone, prompt: 'Draft a professional company-wide all-hands meeting announcement for next Friday.' },
    { label: 'Maternity Policy', icon: ShieldCheck, prompt: 'Summarize statutory maternity leave policy and compensation guidelines.' },
    { label: 'Attendance Rules', icon: Clock, prompt: 'What are the rules regarding grace period for employee check-ins and late anomalies?' },
    { label: 'Department Structure', icon: User, prompt: 'List the key corporate departments and their operational scopes.' },
  ];

  const suggestionChips = isHR ? hrChips : employeeChips;

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputMessage.trim();
    if (!message || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiReply = await askDayflowAI(
        message,
        messages,
        {
          name: user?.name || (isHR ? 'Uma Umamaheshwari' : 'Sanjay Kumar'),
          role: user?.role || 'employee',
        }
      );

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error querying Dayflow AI:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry, I encountered a temporary connection issue. Please try asking again in a moment!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'assistant',
        text: `Chat cleared! How can I assist you right now?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Basic formatting helper for markdown bold & bullets
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const content = line.trim().substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-xs sm:text-sm leading-relaxed my-0.5">
            {formatBold(content)}
          </li>
        );
      }
      // Numbered list
      if (/^\d+\.\s/.test(line.trim())) {
        const content = line.trim().replace(/^\d+\.\s/, '');
        return (
          <li key={idx} className="ml-4 list-decimal text-xs sm:text-sm leading-relaxed my-0.5">
            {formatBold(content)}
          </li>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs sm:text-sm leading-relaxed my-0.5">
          {formatBold(line)}
        </p>
      );
    });
  };

  const formatBold = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded / Open Chat Window */}
      {isOpen && (
        <div
          className={`
            w-[92vw] sm:w-[410px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden transition-all duration-300 mb-3 animate-scale-up
            ${isMinimized ? 'h-[70px]' : 'h-[550px] max-h-[82vh]'}
          `}
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white flex items-center justify-between shadow-sm select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white tracking-tight">Dayflow AI</h3>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                    Groq LLM
                  </span>
                </div>
                <p className="text-[11px] text-indigo-100/80 font-medium">
                  {isHR ? 'HR Operations & Compliance' : 'Employee Self-Service'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title="Clear conversation"
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body when not minimized */}
          {!isMinimized && (
            <>
              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-950/40 custom-scrollbar">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`
                          max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs transition-all
                          ${
                            isUser
                              ? 'bg-blue-600 text-white rounded-tr-xs font-medium'
                              : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-xs'
                          }
                        `}
                      >
                        {renderFormattedText(msg.text)}
                        <span
                          className={`
                            block text-[9px] mt-1 text-right font-medium
                            ${isUser ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500'}
                          `}
                        >
                          {msg.timestamp}
                        </span>
                      </div>

                      {isUser && (
                        <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800 mt-0.5">
                          {user?.avatarInitials || 'ME'}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-2.5 justify-start items-center">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Bot className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="px-3.5 py-2.5 bg-white dark:bg-slate-800 rounded-2xl rounded-tl-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
                      <span>Dayflow AI is thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Carousel */}
              <div className="px-3 py-2 bg-slate-100/80 dark:bg-slate-850/80 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {suggestionChips.map((chip, i) => {
                  const Icon = chip.icon;
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleSendMessage(chip.prompt)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600 text-[11px] font-semibold whitespace-nowrap shrink-0 transition-all shadow-2xs active:scale-95"
                    >
                      <Icon className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Input Footer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={isHR ? 'Ask about HR policy, draft memos...' : 'Ask about leave, timings, payslip...'}
                  disabled={isLoading}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl shadow-md shadow-indigo-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-700 text-white rounded-full shadow-xl shadow-indigo-500/35 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
        >
          {/* Pulsing Aura */}
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 opacity-40 blur-sm group-hover:opacity-75 animate-pulse" />

          <div className="relative flex items-center gap-2 font-bold text-xs sm:text-sm tracking-tight">
            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
            </div>
            <span>Dayflow AI</span>
          </div>

          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
        </button>
      )}
    </div>
  );
};
