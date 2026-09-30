import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  ShieldCheck,
  Compass,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { currentUser, userProfile, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentTab('home');
      setProfileDropdownOpen(false);
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs">
      {/* Top Notification Strip - First Line with Crystal-Clear Prominent Register Button */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 text-white text-xs py-2 px-3 sm:px-6 font-medium border-b border-blue-500/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Text with min-w-0 to prevent pushing the right register button */}
          <div className="min-w-0 flex-1 flex items-center gap-1.5 sm:gap-2.5 overflow-hidden">
            <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0 shadow-xs">
              ADMISSION 2026
            </span>
            <div className="truncate text-[11px] sm:text-xs font-semibold text-white">
              <span className="hidden md:inline font-normal text-cyan-100">Semester Batches: </span>
              <span className="text-yellow-300 font-bold">1st Sem ₹99</span>
              <span className="mx-1 opacity-70">•</span>
              <span className="text-yellow-300 font-bold">3rd Sem ₹299</span>
              <span className="mx-1 opacity-70">•</span>
              <span className="text-yellow-300 font-bold">5th Sem ₹249</span>
            </div>
          </div>

          {/* Right Permanent Registration CTA - Always fully visible and prominent */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleNavClick('courses')}
              className="hidden lg:inline-block underline underline-offset-2 hover:text-cyan-200 font-bold text-xs cursor-pointer text-white/90"
            >
              Enroll Now &rarr;
            </button>
            <button
              onClick={() => handleNavClick('register')}
              className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ring-2 ring-amber-300/80 hover:shadow-amber-400/40 whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span>Register Free</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-700 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-[#0B1220] dark:text-white font-['Plus_Jakarta_Sans'] whitespace-nowrap">
                  JE <span className="text-blue-600 dark:text-cyan-400">WALLAH</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-cyan-300 uppercase tracking-wider">
                  Diploma
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight -mt-0.5 hidden lg:block">
                Your Engineering Journey Starts Here
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentTab === 'home'
                  ? 'text-blue-600 dark:text-cyan-400 bg-blue-50/80 dark:bg-blue-950/40'
                  : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('courses')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'courses'
                  ? 'text-blue-600 dark:text-cyan-400 bg-blue-50/80 dark:bg-blue-950/40'
                  : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Courses</span>
            </button>
            <button
              onClick={() => handleNavClick('mylearning')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'mylearning'
                  ? 'text-blue-600 dark:text-cyan-400 bg-blue-50/80 dark:bg-blue-950/40'
                  : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>My Learning</span>
            </button>
            <button
              onClick={() => handleNavClick('ai-assistant')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'ai-assistant'
                  ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50/80 dark:bg-cyan-950/40 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-500 animate-pulse" />
              <span>AI Assistant</span>
            </button>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {currentUser ? (
              /* Authenticated User Menu */
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-cyan-500 bg-slate-50 dark:bg-slate-800/80 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {(userProfile?.firstName?.[0] || currentUser.email?.[0] || 'U').toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                      {userProfile?.firstName || 'Student'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                      {isAdmin ? 'Admin' : 'Student'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111A2E] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        {userProfile?.firstName} {userProfile?.lastName}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {currentUser.email}
                      </p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded">
                          Admin Privileges Active
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleNavClick('mylearning')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <GraduationCap className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                      <span>My Purchased Batches</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>Account Settings</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleNavClick('admin')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Management</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated Buttons */
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md shadow-blue-500/25 hover:shadow-lg transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 active:scale-95 ring-2 ring-blue-500/20"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1220] px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
              currentTab === 'home'
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 font-bold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => handleNavClick('courses')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
              currentTab === 'courses'
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 font-bold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore Courses (All Batches)</span>
          </button>
          <button
            onClick={() => handleNavClick('mylearning')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
              currentTab === 'mylearning'
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 font-bold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>My Learning</span>
          </button>
          <button
            onClick={() => handleNavClick('ai-assistant')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
              currentTab === 'ai-assistant'
                ? 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 font-bold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span>JE AI Study Assistant</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 flex items-center gap-2.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          )}

          {!currentUser && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-2.5 rounded-lg text-sm font-bold text-center border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              >
                Login
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="w-full py-2.5 rounded-lg text-sm font-bold text-center text-white bg-blue-600"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
