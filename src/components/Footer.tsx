import React from 'react';
import { Compass, Mail, Phone, MapPin, ShieldCheck, Award, BookCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0B1220] text-slate-300 border-t border-slate-800 transition-colors">
      {/* Platform Value Highlights */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Affordable Fees</h4>
                <p className="text-xs text-slate-400">1st Sem ₹99 | 3rd Sem ₹299 | 5th Sem ₹249</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <BookCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Semester-Wise Syllabus</h4>
                <p className="text-xs text-slate-400">Mapped to State Polytechnic Boards</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Engineering-Focused</h4>
                <p className="text-xs text-slate-400">EE, ME, Metallurgy & Computer Science</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">24/7 AI Doubt Solver</h4>
                <p className="text-xs text-slate-400">Instant explanations in English & Hinglish</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-700 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white font-['Plus_Jakarta_Sans']">
                JE <span className="text-cyan-400">WALLAH</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              "Your Engineering Journey Starts Here." JE WALLAH is India’s dedicated online EdTech platform for Diploma Engineering students, offering structured semester batches, animated lectures, handwritten notes, and AI assistance.
            </p>
            <div className="pt-2 flex flex-col space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>support@jewallah.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>+91 98765 43210 (Mon-Sat, 9 AM - 7 PM IST)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Engineering Education Hub, India</span>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div className="space-y-3">
            <h5 className="text-white font-bold text-sm tracking-wider uppercase font-['Plus_Jakarta_Sans']">
              Engineering Branches
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Electrical Engineering (EE)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Mechanical Engineering (ME)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Metallurgy Engineering (MTE)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Computer Science (CSE)
                </button>
              </li>
            </ul>
          </div>

          {/* Semesters & Pricing */}
          <div className="space-y-3">
            <h5 className="text-white font-bold text-sm tracking-wider uppercase font-['Plus_Jakarta_Sans']">
              Semester Batches
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left flex items-center justify-between w-full"
                >
                  <span>1st Semester Foundation</span>
                  <span className="font-bold text-cyan-400">₹99</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left flex items-center justify-between w-full"
                >
                  <span>3rd Semester Core</span>
                  <span className="font-bold text-cyan-400">₹299</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left flex items-center justify-between w-full"
                >
                  <span>5th Semester Advanced</span>
                  <span className="font-bold text-cyan-400">₹249</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-assistant')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  JE AI Study Tutor
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div className="space-y-3">
            <h5 className="text-white font-bold text-sm tracking-wider uppercase font-['Plus_Jakarta_Sans']">
              Information & Legal
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('legal-about')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  About JE WALLAH
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('legal-contact')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('legal-privacy')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('legal-terms')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Terms and Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('legal-refund')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Refund Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 JE WALLAH. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5" />
            <span>for Indian Diploma Engineers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
