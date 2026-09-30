import React from 'react';
import {
  Compass,
  Zap,
  Cog,
  Cpu,
  Layers,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Award,
  BookOpen,
  GraduationCap,
  Play,
  TrendingUp,
  Tag,
  Clock,
  UserPlus,
} from 'lucide-react';
import { Branch, Course, Semester } from '../types/index.ts';

interface HomeProps {
  courses: Course[];
  onNavigate: (tab: string, extra?: any) => void;
  onSelectCourse: (course: Course) => void;
  onSelectBranch: (branch: Branch) => void;
  onSelectSemester: (semester: Semester) => void;
}

export const Home: React.FC<HomeProps> = ({
  courses,
  onNavigate,
  onSelectCourse,
  onSelectBranch,
  onSelectSemester,
}) => {
  const branches: {
    id: Branch;
    name: string;
    badge: string;
    icon: React.ReactNode;
    color: string;
    accentBg: string;
    description: string;
    students: string;
  }[] = [
    {
      id: 'Electrical',
      name: 'Electrical Engineering',
      badge: 'EE',
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      color: 'border-amber-500/30 hover:border-amber-500 shadow-amber-500/5',
      accentBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      description: 'Master AC/DC Circuits, Transformers, Power Systems, Switchgear & Microcontrollers with board-specific numerical problem sets.',
      students: '7,400+ Enrolled',
    },
    {
      id: 'Mechanical',
      name: 'Mechanical Engineering',
      badge: 'ME',
      icon: <Cog className="w-6 h-6 text-blue-500" />,
      color: 'border-blue-500/30 hover:border-blue-500 shadow-blue-500/5',
      accentBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      description: 'Deep dive into Strength of Materials (SOM), Engineering Thermodynamics, Machine Design & Manufacturing processes.',
      students: '8,200+ Enrolled',
    },
    {
      id: 'Metallurgy',
      name: 'Metallurgy Engineering',
      badge: 'MTE',
      icon: <Layers className="w-6 h-6 text-emerald-500" />,
      color: 'border-emerald-500/30 hover:border-emerald-500 shadow-emerald-500/5',
      accentBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      description: 'Specialized batches for Physical Metallurgy, Iron-Carbon Diagram, Extractive Metallurgy & Steel Plant industrial operations.',
      students: '3,800+ Enrolled',
    },
    {
      id: 'Computer Science',
      name: 'Computer Science Engineering',
      badge: 'CSE',
      icon: <Cpu className="w-6 h-6 text-cyan-500" />,
      color: 'border-cyan-500/30 hover:border-cyan-500 shadow-cyan-500/5',
      accentBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      description: 'C Programming, Data Structures & Algorithms (DSA), Relational DBMS, Computer Networks & Full-Stack Web Development.',
      students: '11,500+ Enrolled',
    },
  ];

  const semesters: {
    sem: Semester;
    price: number;
    title: string;
    subtitle: string;
    badge: string;
    popular?: boolean;
  }[] = [
    {
      sem: '1st Semester',
      price: 99,
      title: '1st Semester Foundation Batch',
      subtitle: 'Applied Maths-I, Applied Physics, Chemistry & Basic Engg',
      badge: 'Best Value Foundation',
    },
    {
      sem: '3rd Semester',
      price: 299,
      title: '3rd Semester Core Specialization',
      subtitle: 'Core departmental subjects, circuit & machine theories, DSA & SOM',
      badge: 'Most Enrolled',
      popular: true,
    },
    {
      sem: '5th Semester',
      price: 249,
      title: '5th Semester Advanced Engineering',
      subtitle: 'Advanced design, power systems, project prep & exam question banks',
      badge: 'Final Lap Special',
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden flex flex-col">
      {/* ================= SECTION 1: HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-white dark:bg-[#070D18] pt-8 sm:pt-14 pb-14 sm:pb-20 border-b border-slate-200 dark:border-slate-800">
        {/* Engineering Mesh Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-[480px] h-48 sm:h-72 bg-gradient-to-tr from-blue-600/15 via-cyan-500/15 to-indigo-600/15 blur-3xl rounded-full pointer-events-none -z-10"></div>
        <div className="absolute -top-10 right-0 w-48 sm:w-72 h-48 sm:h-72 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Hero Left Copy */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-cyan-300 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-cyan-500 shrink-0 animate-spin-slow" />
                <span>Trusted by 25,000+ Diploma Students Across India</span>
              </div>

              {/* Main Heading as Specified */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] font-['Plus_Jakarta_Sans']">
                Your Engineering <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
                  Success Starts Here
                </span>
              </h1>

              {/* Subheading as Specified */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Affordable, semester-wise courses for Diploma Engineering students. Learn smarter, prepare better, and move closer to your goals.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('courses')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <span>Explore Batches</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('register')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-900 dark:text-white bg-amber-400 hover:bg-amber-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-slate-950" />
                  <span>Register Free Account</span>
                </button>

                <button
                  onClick={() => onNavigate('mylearning')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 text-blue-600 dark:text-cyan-400 fill-current" />
                  <span>Start Learning</span>
                </button>
              </div>

              {/* Quick Proof Badges */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200/80 dark:border-slate-800 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                    ₹99
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Batches starting from
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-cyan-400 font-['Plus_Jakarta_Sans']">
                    12+
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Semester Batches
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-['Plus_Jakarta_Sans']">
                    98.4%
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Exam Pass Rate
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Right Visual: Technical Education Studio Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl blur-2xl opacity-20 -rotate-2 transform"></div>

                <div className="relative bg-white dark:bg-[#111A2E] rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
                  {/* Top card bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2.5 py-0.5 rounded-full font-bold">
                      POLYTECHNIC_SEMESTER_2026.cpp
                    </span>
                  </div>

                  {/* Illustrated Engineering Graphics */}
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-gradient-to-br from-slate-900 via-blue-950 to-[#0B1220] p-5 flex flex-col justify-between text-white border border-slate-700/60">
                    <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-xs font-mono text-cyan-300 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-cyan-400" /> JE WALLAH STUDIO
                      </span>
                      <span className="text-[10px] bg-red-600 font-bold px-2 py-0.5 rounded text-white uppercase tracking-wider animate-pulse">
                        LIVE BATCH
                      </span>
                    </div>

                    <div className="relative z-10 my-auto text-center space-y-1">
                      <p className="text-xs text-slate-300 font-mono">DIPLOMA SPECIALIZED BATCHES</p>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                        EE • ME • MTE • CSE
                      </h3>
                      <p className="text-[11px] text-cyan-300 font-medium">Animated 3D Visuals & Handwritten Notes</p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <span>✓ 10-Yr PYQs Solved</span>
                      <span>✓ Formula Cheat Sheets</span>
                      <span>✓ 24/7 AI Doubts</span>
                    </div>
                  </div>

                  {/* Quick Student Floating Stat */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-cyan-400 font-bold">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">State Board Syllabus</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">BTEUP, SBTE, MSBTE, WBSCTE</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded">
                      Verified 100%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: 4 ENGINEERING BRANCHES ================= */}
      <section className="w-full bg-[#F4F7FB] dark:bg-[#0A101D] py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-xs">
              <Tag className="w-3.5 h-3.5" />
              <span>SECTION 01 • BRANCH SELECTION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-['Plus_Jakarta_Sans']">
              Choose Your Engineering Discipline
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Dedicated semester study materials, handwritten formulas, and animated lectures designed specifically for your diploma branch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {branches.map((b) => (
              <div
                key={b.id}
                className={`rounded-2xl p-6 bg-white dark:bg-[#111A2E] border ${b.color} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {b.icon}
                    </div>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${b.accentBg}`}>
                      {b.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                      {b.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {b.students}
                  </span>
                  <button
                    onClick={() => onSelectBranch(b.id)}
                    className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Explore Courses</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: SEMESTER PRICING ================= */}
      <section className="w-full bg-white dark:bg-[#070D18] py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-xs">
              <Award className="w-3.5 h-3.5" />
              <span>SECTION 02 • SEMESTER PRICING PACKAGES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-['Plus_Jakarta_Sans']">
              Clear & Transparent Semester Pricing
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              One single fee per semester covers all required departmental subjects until final exam completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {semesters.map((s) => (
              <div
                key={s.sem}
                className={`relative rounded-3xl p-7 sm:p-8 border transition-all duration-300 flex flex-col justify-between ${
                  s.popular
                    ? 'border-blue-500 dark:border-cyan-500 shadow-2xl shadow-blue-500/15 md:-translate-y-2 ring-2 ring-blue-500/20 bg-white dark:bg-[#111A2E]'
                    : 'border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl bg-slate-50/70 dark:bg-[#111A2E]'
                }`}
              >
                {s.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md whitespace-nowrap">
                    {s.badge}
                  </div>
                )}

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400">
                      {s.sem}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Per Full Batch</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {s.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                      ₹{s.price}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      ₹{s.price === 99 ? '999' : s.price === 299 ? '1,999' : '1,799'}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-auto bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                      Save {s.price === 99 ? '90%' : s.price === 299 ? '85%' : '86%'}
                    </span>
                  </div>

                  <ul className="space-y-2.5 pt-2 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Full syllabus video lectures & derivations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Chapter-wise downloadable PDF notes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>10-Year Board PYQs with model answers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>24/7 Doubt solving via JE AI Assistant</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => onSelectSemester(s.sem)}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-md ${
                      s.popular
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-blue-500/25'
                        : 'bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-white'
                    }`}
                  >
                    View {s.sem} Batches &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: FEATURED BATCHES ================= */}
      <section className="w-full bg-[#F4F7FB] dark:bg-[#0A101D] py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-xs">
                <BookOpen className="w-3.5 h-3.5" />
                <span>SECTION 03 • FEATURED BATCH CATALOG</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                Explore Top Recommended Batches
              </h2>
            </div>
            <button
              onClick={() => onNavigate('courses')}
              className="text-xs sm:text-sm font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
            >
              <span>View All 12 Batches</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {courses.slice(0, 3).map((c) => (
              <div
                key={c.courseId}
                className="bg-white dark:bg-[#111A2E] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white shadow-xs">
                        {c.branch}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-xs">
                        {c.semester}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-amber-400 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{c.rating}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 font-['Plus_Jakarta_Sans']">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {c.subjects.slice(0, 3).map((sub) => (
                        <span
                          key={sub.id}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                        >
                          {sub.name}
                        </span>
                      ))}
                      {c.subjects.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-slate-400 font-medium">
                          +{c.subjects.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Fee</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                      ₹{c.price}
                    </p>
                  </div>
                  <button
                    onClick={() => onSelectCourse(c)}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 cursor-pointer transition-colors"
                  >
                    Buy Now &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: WHY CHOOSE JE WALLAH ================= */}
      <section className="w-full bg-[#080E1A] py-16 sm:py-24 border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#0B1220] via-slate-900 to-[#131D33] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl border border-blue-900/40">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-cyan-400/30 text-cyan-300 text-[11px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>SECTION 04 • PLATFORM ADVANTAGES</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
                Why Diploma Engineers Choose JE WALLAH
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                We built JE WALLAH because diploma students deserve world-class technical education without exorbitant coaching fees. Every batch is crafted to help you score 80%+ in your semester exams and prepare for junior engineer competitive exams.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  ₹
                </div>
                <h4 className="font-bold text-white text-base">Affordable Course Fees</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Semester fees starting at just ₹99, ₹299, and ₹249. Quality education is accessible to every single diploma student in India.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-base">Semester-Wise Learning</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Step-by-step syllabus coverage aligned directly with your state board exam pattern and marking scheme.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-base">Engineering-Focused Content</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Detailed circuit diagrams, mechanical derivations, phase diagrams, and code snippets explained with precision.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-base">AI-Powered Study Assistance</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Instant doubt clearing with JE AI Assistant in English and Hinglish, complete with 7-day exam revision roadmaps.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-base">Access to Purchased Batches</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Instant enrollment verification. Re-watch recorded lectures anytime, download notes, and track your syllabus progress.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-base">SSC JE & RRB JE Bridge</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Strong foundational knowledge that equips you for future Junior Engineer government competitive exams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: STUDENT TESTIMONIALS ================= */}
      <section className="w-full bg-white dark:bg-[#070D18] py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-900 text-[11px] font-extrabold uppercase tracking-wider shadow-xs">
              <Star className="w-3.5 h-3.5 fill-slate-900" />
              <span>SECTION 05 • STUDENT SUCCESS STORIES</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
              Trusted by Polytechnic Toppers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Real feedback from diploma students preparing for semester examinations across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#111A2E] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                "The Electrical 3rd Sem batch (VIJETA) for ₹299 was unbelievable. The single-phase transformer derivation and Thevenin theorem numericals appeared verbatim in our board exam. Scored 86%!"
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  AK
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Aman Kumar</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">BTEUP Diploma Electrical (Rank 4)</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#111A2E] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                "Metallurgy courses are so rare online, but JE WALLAH's Fe-C diagram lecture was pure gold. The handwritten notes saved me during last-minute semester revision. Thank you JE WALLAH team!"
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  SP
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Sneha Patel</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">SBTE Bihar Diploma Metallurgy</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#111A2E] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                "For Computer Science 5th sem at ₹249, the web development notes and computer networks OSI model explanations were crystal clear. Plus, JE AI Assistant helped me plan a 7-day revision schedule."
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-xs">
                  RD
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Rohan Das</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">WBSCTE Diploma CS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: FINAL CTA STRIP ================= */}
      <section className="w-full bg-[#F4F7FB] dark:bg-[#0A101D] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-cyan-600 p-8 sm:p-14 text-white text-center space-y-6 shadow-xl shadow-blue-500/20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider mx-auto">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>SECTION 06 • ENROLL TODAY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans']">
              Ready to Ace Your Semester Exams?
            </h2>
            <p className="text-cyan-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Join thousands of diploma students preparing with JE WALLAH. Enroll today with batches starting from just ₹99.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={() => onNavigate('courses')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-white text-blue-700 hover:bg-cyan-50 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                Explore All Batches
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-slate-950" />
                <span>Create Free Account</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
