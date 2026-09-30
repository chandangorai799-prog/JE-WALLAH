import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  CheckCircle2,
  Lock,
  Save,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { updateUserProfile } from '../firebase/services.ts';
import { Branch, Semester } from '../types/index.ts';

export const StudentProfile: React.FC = () => {
  const { currentUser, userProfile, refreshProfile, resetPassword } = useAuth();

  const [firstName, setFirstName] = useState(userProfile?.firstName || '');
  const [lastName, setLastName] = useState(userProfile?.lastName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [college, setCollege] = useState(userProfile?.college || '');
  const [branch, setBranch] = useState<Branch>(userProfile?.branch || 'Electrical');
  const [semester, setSemester] = useState<Semester>(userProfile?.semester || '1st Semester');

  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSaving(true);
    setSavedNotice(null);
    try {
      await updateUserProfile(currentUser.uid, {
        firstName,
        lastName,
        phone,
        college,
        branch,
        semester,
      });
      await refreshProfile();
      setSavedNotice('Profile updated successfully!');
      setTimeout(() => setSavedNotice(null), 3000);
    } catch (e) {
      console.error('Error updating profile:', e);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (currentUser?.email) {
      await resetPassword(currentUser.email);
      alert(`Password reset link sent to ${currentUser.email}! Check your inbox.`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
          Student Profile & Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your personal details, polytechnic college, and semester preferences
        </p>
      </div>

      <div className="bg-white dark:bg-[#111A2E] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        {savedNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{savedNotice}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Registered Email (Immutable)
            </label>
            <input
              type="text"
              disabled
              value={currentUser?.email || ''}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              WhatsApp / Mobile Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Polytechnic College / Institute Name
            </label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. Government Polytechnic, Ranchi / Lucknow"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Primary Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value as Branch)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              >
                <option value="Electrical">Electrical</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Metallurgy">Metallurgy</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Current Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value as Semester)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              >
                <option value="1st Semester">1st Semester</option>
                <option value="3rd Semester">3rd Semester</option>
                <option value="5th Semester">5th Semester</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Security & Password</p>
            <p className="text-[11px] text-slate-500">Change your password anytime</p>
          </div>
          <button
            type="button"
            onClick={handlePasswordReset}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            Send Reset Link
          </button>
        </div>
      </div>
    </div>
  );
};
