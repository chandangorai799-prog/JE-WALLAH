import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Play,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Receipt,
  Download,
  AlertCircle,
} from 'lucide-react';
import { Course, Order, Purchase, StudentProgress } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { getUserOrders, getUserPurchases, getStudentProgress } from '../firebase/services.ts';

interface MyLearningProps {
  courses: Course[];
  onOpenCoursePlayer: (courseId: string, lessonId?: string) => void;
  onExploreCourses: () => void;
  onOpenAIAssistant: () => void;
  onOpenSettings: () => void;
}

export const MyLearning: React.FC<MyLearningProps> = ({
  courses,
  onOpenCoursePlayer,
  onExploreCourses,
  onOpenAIAssistant,
  onOpenSettings,
}) => {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'batches' | 'history' | 'assistant'>('batches');
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, StudentProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      setLoading(true);
      try {
        const [userPurchases, userOrders] = await Promise.all([
          getUserPurchases(currentUser.uid),
          getUserOrders(currentUser.uid),
        ]);
        setPurchases(userPurchases);
        setOrders(userOrders);

        // Load progress for purchased courses
        const progressResults: Record<string, StudentProgress> = {};
        for (const p of userPurchases) {
          const prog = await getStudentProgress(currentUser.uid, p.courseId);
          if (prog) {
            progressResults[p.courseId] = prog;
          }
        }
        setProgressMap(progressResults);
      } catch (err) {
        console.error('Error loading student dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [currentUser]);

  // Map purchases to course items
  const enrolledBatches = purchases
    .map((p) => {
      const course = courses.find((c) => c.courseId === p.courseId);
      const order = orders.find((o) => o.orderId === p.orderId);
      const progress = progressMap[p.courseId];
      return {
        purchase: p,
        course,
        order,
        progress,
      };
    })
    .filter((item) => item.course !== undefined);

  // Calculate stats
  const totalCompletedLessons = Object.values(progressMap).reduce(
    (acc, curr) => acc + (curr.completedLessons?.length || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Welcome Hero Strip as Specified */}
      <div className="bg-gradient-to-r from-[#0B1220] via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-blue-900/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-bold border border-cyan-400/30">
            <GraduationCap className="w-4 h-4" />
            <span>Student Dashboard</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight font-['Plus_Jakarta_Sans']">
            Welcome back, {userProfile?.firstName || 'Student'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Track your semester study progress, resume video lectures, download formula cheat sheets, and solve doubts 24/7.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-3xl">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xl sm:text-2xl font-black text-cyan-400">{enrolledBatches.length}</p>
              <p className="text-[11px] text-slate-300">Enrolled Batches</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xl sm:text-2xl font-black text-emerald-400">{totalCompletedLessons}</p>
              <p className="text-[11px] text-slate-300">Completed Lessons</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xl sm:text-2xl font-black text-amber-400">100%</p>
              <p className="text-[11px] text-slate-300">Syllabus Access</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xl sm:text-2xl font-black text-purple-400">24/7</p>
              <p className="text-[11px] text-slate-300">AI Study Tutor</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 sm:gap-8 text-sm font-bold">
        <button
          onClick={() => setActiveTab('batches')}
          className={`pb-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'batches'
              ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>My Purchased Batches ({enrolledBatches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Purchase History</span>
        </button>
      </div>

      {/* TAB CONTENT: MY PURCHASED BATCHES */}
      {activeTab === 'batches' && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              Loading your purchased batches...
            </div>
          ) : enrolledBatches.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 px-4 bg-white dark:bg-[#111A2E] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                  No Active Batches Yet
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  You haven't enrolled in any semester batches yet. Explore our affordable diploma courses starting at just ₹99.
                </p>
              </div>
              <button
                onClick={onExploreCourses}
                className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 cursor-pointer transition-all"
              >
                Browse Semester Batches &rarr;
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledBatches.map(({ course, purchase, order, progress }) => {
                if (!course) return null;
                const totalLessons = course.lessons.length || 1;
                const completedCount = progress?.completedLessons?.length || 0;
                const percent = Math.min(100, Math.round((completedCount / totalLessons) * 100));

                return (
                  <div
                    key={course.courseId}
                    className="bg-white dark:bg-[#111A2E] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between group hover:shadow-xl transition-all"
                  >
                    <div>
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                            {course.branch}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-xs">
                            {course.semester}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active Access</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-4">
                        <div>
                          <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 font-['Plus_Jakarta_Sans']">
                            {course.title}
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            Purchased on:{' '}
                            {new Date(purchase.purchaseDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}{' '}
                            • Paid ₹{order?.amount || course.price}
                          </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-600 dark:text-slate-400">Course Progress</span>
                            <span className="text-blue-600 dark:text-cyan-400">{percent}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {completedCount} of {course.lessons.length} lessons completed
                          </p>
                        </div>

                        {/* Subject Chips */}
                        <div className="flex flex-wrap gap-1">
                          {course.subjects.slice(0, 3).map((s) => (
                            <span
                              key={s.id}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="p-5 pt-0">
                      <button
                        onClick={() => onOpenCoursePlayer(course.courseId, progress?.lastLessonId)}
                        className="w-full py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 cursor-pointer transition-all flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>{completedCount > 0 ? 'Resume Learning' : 'Start Learning'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: PURCHASE HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-[#111A2E] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
            Your Orders & Receipts
          </h3>

          {orders.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No orders recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Course / Batch</th>
                    <th className="pb-3">Branch & Semester</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((o) => (
                    <tr key={o.orderId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                        {o.orderId}
                      </td>
                      <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                        {o.courseTitle}
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">
                        {o.branch} • {o.semester}
                      </td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">
                        ₹{o.amount}
                      </td>
                      <td className="py-3 text-slate-500">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px]">
                          {o.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
