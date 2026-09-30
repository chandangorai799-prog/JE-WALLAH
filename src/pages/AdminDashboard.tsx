import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  DollarSign,
  Users,
  ShoppingCart,
  BookOpen,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Save,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { Course, Order, Branch, Semester, Lesson, Subject } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  getAllOrders,
  saveCourse,
  deleteCourse,
  resetCoursesToDefault,
} from '../firebase/services.ts';

interface AdminDashboardProps {
  courses: Course[];
  onRefreshCourses: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  courses,
  onRefreshCourses,
}) => {
  const { currentUser, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'courses' | 'orders' | 'guide'>('courses');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Edit / Create course modal state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingCourse, setSavingCourse] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      setLoadingOrders(true);
      try {
        const all = await getAllOrders();
        setOrders(all);
      } catch (e) {
        console.error('Error fetching admin orders:', e);
      } finally {
        setLoadingOrders(false);
      }
    }
    fetchOrders();
  }, []);

  // Compute stats
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const totalPaidOrders = orders.filter((o) => o.paymentStatus === 'Paid').length;
  const uniqueStudentUids = new Set(orders.map((o) => o.uid)).size;

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(JSON.parse(JSON.stringify(course)));
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    const newCourse: Course = {
      courseId: `course_${Date.now()}`,
      title: 'New Semester Batch',
      branch: 'Electrical',
      semester: '1st Semester',
      price: 99,
      originalPrice: 999,
      description: 'Comprehensive polytechnic engineering syllabus batch.',
      thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      enrolledCount: 0,
      active: true,
      validity: 'Full Semester Exam Cycle',
      targetBoard: 'All State Technical Boards',
      highlights: [
        'Complete video lectures',
        'Handwritten PDF notes',
        'Solved previous 5 year question papers',
      ],
      subjects: [
        {
          id: `sub_${Date.now()}`,
          name: 'Core Subject 1',
          code: 'EE101',
          credits: 4,
          topicsCount: 15,
        },
      ],
      lessons: [
        {
          id: `les_${Date.now()}`,
          subjectId: `sub_${Date.now()}`,
          title: 'Lecture 01: Introduction & Fundamental Laws',
          duration: '45 mins',
          order: 1,
          isFreePreview: true,
          notesTitle: 'Fundamental Formula Summary',
          notesContent: 'Key highlights and derivations.',
        },
      ],
    };
    setEditingCourse(newCourse);
    setIsModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    setSavingCourse(true);
    try {
      await saveCourse(editingCourse);
      setIsModalOpen(false);
      onRefreshCourses();
      alert('Batch saved successfully!');
    } catch (e: any) {
      alert('Error saving batch: ' + e.message);
    } finally {
      setSavingCourse(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course batch? This cannot be undone.')) {
      await deleteCourse(courseId);
      onRefreshCourses();
    }
  };

  const handleResetDefaults = async () => {
    if (confirm('Reset catalog to the authentic 12 initial diploma engineering batches?')) {
      await resetCoursesToDefault();
      onRefreshCourses();
      alert('Courses reset to default 12 combinations.');
    }
  };

  // If not admin, display restricted notice
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Privileges Required</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          The current logged-in account (<strong>{currentUser?.email || 'Guest'}</strong>) does not have verified administrative credentials for JE WALLAH.
        </p>
        <p className="text-xs text-blue-600 dark:text-cyan-400 font-semibold">
          Primary Platform Admin: chandangorai799@gmail.com
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Admin Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                JE WALLAH Admin Portal
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage batches, upload syllabus notes, view student enrollments & payment revenue
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset 12 Default Batches</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Batch</span>
          </button>
        </div>
      </div>

      {/* KPI Revenue Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Revenue</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Paid Orders</p>
            <p className="text-2xl font-black text-blue-600 dark:text-cyan-400 mt-1">
              {totalPaidOrders}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Enrolled Students</p>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
              {uniqueStudentUids}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111A2E] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Active Batches</p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {courses.filter((c) => c.active).length} / {courses.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('courses')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'courses'
              ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400'
              : 'border-transparent text-slate-500'
          }`}
        >
          Manage Batches & Lectures ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'orders'
              ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400'
              : 'border-transparent text-slate-500'
          }`}
        >
          Verified Orders & Revenue ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`pb-3 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'guide'
              ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400'
              : 'border-transparent text-slate-500'
          }`}
        >
          Admin Security & Setup Guide
        </button>
      </div>

      {/* TAB 1: MANAGE COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#111A2E] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="p-4">Batch Title</th>
                    <th className="p-4">Branch</th>
                    <th className="p-4">Semester</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Subjects</th>
                    <th className="p-4">Lectures</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {courses.map((c) => (
                    <tr key={c.courseId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                        {c.title}
                      </td>
                      <td className="p-4 font-semibold text-blue-600 dark:text-cyan-400">
                        {c.branch}
                      </td>
                      <td className="p-4 text-slate-700 dark:text-slate-300">
                        {c.semester}
                      </td>
                      <td className="p-4 font-black text-slate-900 dark:text-white">
                        ₹{c.price}
                      </td>
                      <td className="p-4 text-slate-500">
                        {c.subjects.length} Subjects
                      </td>
                      <td className="p-4 text-slate-500">
                        {c.lessons.length} Lectures
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.active
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {c.active ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 hover:bg-blue-100 cursor-pointer"
                          title="Edit Batch & Lectures"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(c.courseId)}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                          title="Delete Batch"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VERIFIED ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-[#111A2E] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
            All Verified Platform Orders
          </h3>

          {loadingOrders ? (
            <p className="text-xs text-slate-400 py-6 text-center">Loading transactions...</p>
          ) : orders.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No orders recorded in the system yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Student UID</th>
                    <th className="pb-3">Batch Name</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Provider</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((o) => (
                    <tr key={o.orderId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                        {o.orderId}
                      </td>
                      <td className="py-3 font-mono text-[11px] text-slate-500 truncate max-w-[120px]">
                        {o.uid}
                      </td>
                      <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                        {o.courseTitle}
                      </td>
                      <td className="py-3 font-black text-slate-900 dark:text-white">
                        ₹{o.amount}
                      </td>
                      <td className="py-3 text-slate-500 uppercase text-[10px] font-bold">
                        {o.paymentProvider}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px]">
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500 text-[11px]">
                        {new Date(o.createdAt).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ADMIN SECURITY GUIDE */}
      {activeTab === 'guide' && (
        <div className="bg-white dark:bg-[#111A2E] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="font-black text-lg text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
              Initial Admin Account Configuration Guide
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              How the owner securely manages administrator privileges for JE WALLAH:
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <h4 className="font-bold text-blue-900 dark:text-cyan-300 text-sm mb-1">
                1. Bootstrapped Super Admin Email
              </h4>
              <p>
                The primary platform owner email (<strong>chandangorai799@gmail.com</strong>) is cryptographically baked into both the client-side role check and the Firestore Security Rules (`isAdmin()` logic). When you sign in with this email, full admin rights are instantly unlocked.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                2. Adding Additional Administrators via Firestore
              </h4>
              <p>
                To grant admin privileges to another staff member or faculty member:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Have the faculty member register a normal account via the Register page.</li>
                <li>In the Firebase Console, open Firestore database: <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">ai-studio-jewallah</code>.</li>
                <li>Go to the <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">admins</code> collection.</li>
                <li>Add a document with the Document ID set to the user's <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">uid</code>.</li>
                <li>Security rules automatically recognize them via <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">exists(/databases/$(database)/documents/admins/$(request.auth.uid))</code>.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                3. Zero Public Admin Registration
              </h4>
              <p>
                Notice there is no public admin registration form on the website. This prevents unauthorized privilege escalation attacks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / CREATE BATCH MODAL */}
      {isModalOpen && editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#111A2E] rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                {editingCourse.title}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Batch Title
                </label>
                <input
                  type="text"
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Branch
                  </label>
                  <select
                    value={editingCourse.branch}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, branch: e.target.value as Branch })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="Electrical">Electrical</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Metallurgy">Metallurgy</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Semester
                  </label>
                  <select
                    value={editingCourse.semester}
                    onChange={(e) => {
                      const sem = e.target.value as Semester;
                      // Set default price according to policy: 1st ₹99, 3rd ₹299, 5th ₹249
                      const standardPrice = sem === '1st Semester' ? 99 : sem === '3rd Semester' ? 299 : 249;
                      setEditingCourse({ ...editingCourse, semester: sem, price: standardPrice });
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="1st Semester">1st Semester (₹99)</option>
                    <option value="3rd Semester">3rd Semester (₹299)</option>
                    <option value="5th Semester">5th Semester (₹249)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Batch Fee (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={editingCourse.price}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, price: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Original Strike-through MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={editingCourse.originalPrice}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, originalPrice: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Thumbnail Image URL
                </label>
                <input
                  type="text"
                  value={editingCourse.thumbnail}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, thumbnail: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingCourse.description}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, description: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              {/* Status checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activeBatch"
                  checked={editingCourse.active}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, active: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="activeBatch" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Batch is Active & Available for Student Enrollment
                </label>
              </div>

              {/* Lesson adding mock helper */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Lectures ({editingCourse.lessons.length}):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newLesson: Lesson = {
                        id: `les_${Date.now()}`,
                        subjectId: editingCourse.subjects[0]?.id || '',
                        title: `Lecture 0${editingCourse.lessons.length + 1}: New Topic Derivations`,
                        duration: '45 mins',
                        order: editingCourse.lessons.length + 1,
                        notesTitle: 'Lecture Notes Summary',
                        notesContent: 'Key highlights from this lecture.',
                      };
                      setEditingCourse({
                        ...editingCourse,
                        lessons: [...editingCourse.lessons, newLesson],
                      });
                    }}
                    className="text-blue-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer"
                  >
                    + Add Lecture
                  </button>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {editingCourse.lessons.map((les, i) => (
                    <div
                      key={les.id}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-between"
                    >
                      <span className="truncate max-w-xs">{les.title}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = editingCourse.lessons.filter((l) => l.id !== les.id);
                          setEditingCourse({ ...editingCourse, lessons: filtered });
                        }}
                        className="text-rose-500 hover:text-rose-700 font-bold ml-2 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCourse}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md cursor-pointer transition-colors"
                >
                  {savingCourse ? 'Saving Batch...' : 'Save Course Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
