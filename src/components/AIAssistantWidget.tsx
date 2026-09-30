import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Maximize2,
  Minimize2,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { ChatMessage } from '../types/index.ts';

const DEFAULT_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-1',
  role: 'model',
  text: "Namaste Engineer! 🙏 I am **JE AI Assistant**, your official 24/7 study tutor and guide for JE WALLAH.\n\nAsk me anything about our Diploma semester batches, subject syllabus, course pricing (1st Sem ₹99 | 3rd Sem ₹299 | 5th Sem ₹249), or ask me to explain any difficult technical concept in English or Hinglish!",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const SUGGESTED_QUESTIONS = [
  'CS 5th semester ka price kya hai?',
  'How do I purchase a course?',
  'Explain DBMS in simple language',
  'Make a 7-day revision plan for exam',
  'What is Thevenin Theorem in EE?',
];

export const AIAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('jewallah_ai_chat');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [DEFAULT_WELCOME_MESSAGE];
  });
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('jewallah_ai_chat', JSON.stringify(messages));
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Server error while generating response');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'model',
        text: data.reply || "I'm here to assist you with your Diploma engineering studies! How else can I help?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMsg: ChatMessage = {
        id: `bot_err_${Date.now()}`,
        role: 'model',
        text: "I am having trouble connecting to the network right now. Here is quick guidance:\n• 1st Sem Batch: ₹99\n• 3rd Sem Batch: ₹299\n• 5th Sem Batch: ₹249\nYou can browse our batches in the Explore Courses section!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([DEFAULT_WELCOME_MESSAGE]);
    localStorage.removeItem('jewallah_ai_chat');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open JE AI Assistant"
            className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-cyan-400/30"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-spin-slow" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0B1220] animate-pulse"></span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold leading-tight flex items-center gap-1">
                <span>JE AI Assistant</span>
                <span className="bg-white/20 text-[9px] px-1 rounded uppercase tracking-wider font-extrabold">24/7</span>
              </p>
              <p className="text-[10px] text-cyan-100 font-medium">Ask Doubts & Pricing</p>
            </div>
          </button>
        )}
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 flex flex-col bg-white dark:bg-[#0E1729] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden ${
            isExpanded
              ? 'inset-2 sm:inset-10'
              : 'bottom-20 md:bottom-6 right-3 sm:right-6 w-[calc(100vw-24px)] sm:w-[400px] max-w-[420px] h-[540px] max-h-[78vh]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-[#0B1220] via-blue-900 to-indigo-900 text-white flex items-center justify-between border-b border-blue-800/40 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight">JE AI Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[10px] text-cyan-200">Powered by Gemini 3.8 Flash • Diploma Study Tutor</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear conversation"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                title={isExpanded ? 'Minimize' : 'Maximize'}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Suggestions Strip */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-500" /> Prompts:
            </span>
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 shrink-0 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-[#0A101D]">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white dark:bg-[#131D33] text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/80 dark:border-slate-800 shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-normal">
                      {msg.text}
                    </div>
                    <div
                      className={`text-[9px] mt-1 text-right font-medium ${
                        isUser ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin-slow" />
                </div>
                <div className="bg-white dark:bg-[#131D33] rounded-2xl rounded-bl-xs px-4 py-3 border border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-cyan-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] text-slate-400 ml-1.5 font-medium">Assistant thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-[#0E1729] border-t border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about batches, exams, or engineering concepts..."
                className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                aria-label="Send message"
                className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 cursor-pointer transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-1.5">
              Verified syllabus information • State Polytechnic Board aligned
            </p>
          </div>
        </div>
      )}
    </>
  );
};
