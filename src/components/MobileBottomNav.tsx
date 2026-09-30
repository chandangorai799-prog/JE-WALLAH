import React from 'react';
import { Compass, BookOpen, GraduationCap, Sparkles } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentTab, setCurrentTab }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 px-3 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setCurrentTab('home')}
        className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
          currentTab === 'home'
            ? 'text-blue-600 dark:text-cyan-400 font-bold'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        onClick={() => setCurrentTab('courses')}
        className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
          currentTab === 'courses'
            ? 'text-blue-600 dark:text-cyan-400 font-bold'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <BookOpen className="w-5 h-5" />
        <span className="text-[10px]">Courses</span>
      </button>

      <button
        onClick={() => setCurrentTab('mylearning')}
        className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
          currentTab === 'mylearning'
            ? 'text-blue-600 dark:text-cyan-400 font-bold'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <GraduationCap className="w-5 h-5" />
        <span className="text-[10px]">My Learning</span>
      </button>

      <button
        onClick={() => setCurrentTab('ai-assistant')}
        className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
          currentTab === 'ai-assistant'
            ? 'text-cyan-600 dark:text-cyan-400 font-bold'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Sparkles className="w-5 h-5 text-cyan-500" />
        <span className="text-[10px]">JE AI</span>
      </button>
    </div>
  );
};
