import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  User,
  Send,
  Trash2,
  BookOpen,
  Calendar,
  Layers,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { ChatMessage } from '../types/index.ts';

const DEFAULT_WELCOME: ChatMessage = {
  id: 'full_welcome',
  role: 'model',
  text: "Namaste Engineer! 🙏 Welcome to the dedicated **JE AI Assistant** portal.\n\nI can help you with:\n1. **Semester Exam Doubts**: Explain technical concepts in simple English or relatable Hinglish.\n2. **Curriculum & Pricing**: 1st Sem (₹99), 3rd Sem (₹299), 5th Sem (₹249) for EE, ME, Metallurgy, and CSE.\n3. **7-Day Revision Roadmaps**: Custom timetables to crack your board exams.\n4. **Important PYQ Topics**: High-yield 8 to 14 mark questions.\n\nType your question below or click one of the quick prompts to get started!",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const FEATURED_PROMPTS = [
  {
    category: 'Computer Science',
    icon: <BookOpen className="w-3.5 h-3.5 text-cyan-500" />,
    text: 'Explain DBMS Normalization (1NF, 2NF, 3NF) with a simple student table example.',
  },
  {
    category: 'Electrical Engg',
    icon: <Zap className="w-3.5 h-3.5 text-amber-500" />,
    text: "Explain Thevenin's Theorem and how to calculate Vth and Rth in simple Hinglish.",
  },
  {
    category: 'Mechanical Engg',
    icon: <Layers className="w-3.5 h-3.5 text-blue-500" />,
    text: 'Explain the Stress-Strain diagram for mild steel and all critical points.',
  },
  {
    category: 'Study Strategy',
    icon: <Calendar className="w-3.5 h-3.5 text-emerald-500" />,
    text: 'Make a 7-day revision plan for my semester exam covering 4 difficult subjects.',
  },
  {
    category: 'Batch Pricing',
    icon: <HelpCircle className="w-3.5 h-3.5 text-purple-500" />,
    text: 'Computer Science 5th semester batch ka price kya hai aur kya kya milega?',
  },
];

export const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('jewallah_ai_chat');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [DEFAULT_WELCOME];
  });
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('jewallah_ai_chat', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (customPrompt?: string) => {
    const msgText = (customPrompt || inputText).trim();
    if (!msgText || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msgText,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'model',
        text: data.reply || "I'm ready to answer any questions about your diploma syllabus!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallback: ChatMessage = {
        id: `bot_err_${Date.now()}`,
        role: 'model',
        text: "I am having temporary network trouble. Batch fees reminder: 1st Sem ₹99, 3rd Sem ₹299, 5th Sem ₹249. Check 'Explore Courses' for full syllabus details!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([DEFAULT_WELCOME]);
    localStorage.removeItem('jewallah_ai_chat');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                JE AI Assistant
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                24/7 Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Powered by Gemini 3.8 Flash • Specialized Diploma Engineering Knowledge Base
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
          <span>Clear Conversation</span>
        </button>
      </div>

      {/* Suggested Quick Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {FEATURED_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p.text)}
            className="p-3 rounded-xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-500 text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-cyan-500 mb-1">
              {p.icon}
              <span>{p.category}</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-2">
              {p.text}
            </p>
          </button>
        ))}
      </div>

      {/* Main Chat Container */}
      <div className="bg-white dark:bg-[#0E1729] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[600px]">
        {/* Messages Feed */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/40 dark:bg-[#090E18]">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-md'
                      : 'bg-white dark:bg-[#131D33] text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/80 dark:border-slate-800 shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  <p
                    className={`text-[10px] mt-1.5 text-right ${
                      isUser ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </p>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start max-w-xl">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4 animate-spin-slow" />
              </div>
              <div className="bg-white dark:bg-[#131D33] rounded-2xl rounded-bl-xs px-4 py-3 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs text-slate-400 ml-1">Analyzing syllabus and formulating response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Dock */}
        <div className="p-4 bg-white dark:bg-[#0E1729] border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type any engineering question, derivation doubt, or study query..."
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isLoading}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 cursor-pointer transition-all disabled:opacity-40 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-2">
            Supports both clear English and natural Hinglish for polytechnic state board students.
          </p>
        </div>
      </div>
    </div>
  );
};
