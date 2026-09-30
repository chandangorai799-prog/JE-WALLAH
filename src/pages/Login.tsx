import React, { useState } from 'react';
import {
  Compass,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface LoginProps {
  onSuccess: () => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  redirectNotice?: string;
}

export const Login: React.FC<LoginProps> = ({
  onSuccess,
  onNavigateToRegister,
  onNavigateToForgotPassword,
  redirectNotice,
}) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both your registered email address and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      console.error('Login error:', err);
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        setError('Invalid email or password. Please verify your credentials or click Forgot Password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please reset your password or try again in a few minutes.');
      } else {
        setError(err.message || 'Unable to log in. Please check your internet connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-16">
      <div className="bg-white dark:bg-[#111A2E] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            <Compass className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Login to access your diploma semester batches & lectures
          </p>
        </div>

        {/* Redirect Notice if routed from Buy Now */}
        {redirectNotice && (
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-cyan-300 text-xs font-medium">
            {redirectNotice}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Registered Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Password *
              </label>
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md shadow-blue-500/25 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Fill for Reviewers */}
        <div className="pt-2 pb-1 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 mb-2">Need a quick test account?</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('student@jewallah.in');
                setPassword('Diploma2026!');
              }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
            >
              Fill Sample Student
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('chandangorai799@gmail.com');
                setPassword('Admin2026!');
              }}
              className="px-2.5 py-1 rounded bg-purple-50 dark:bg-purple-950/50 text-[10px] font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-100 cursor-pointer"
            >
              Fill Admin Email
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <span>New to JE WALLAH? </span>
          <button
            onClick={onNavigateToRegister}
            className="text-blue-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer"
          >
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
};
