import React from 'react';
import { AlertCircle, RefreshCw, MessageSquare, ArrowLeft } from 'lucide-react';

interface PaymentFailedProps {
  errorMessage: string;
  onRetry: () => void;
  onBackToCourses: () => void;
  onOpenAssistant: () => void;
}

export const PaymentFailed: React.FC<PaymentFailedProps> = ({
  errorMessage,
  onRetry,
  onBackToCourses,
  onOpenAssistant,
}) => {
  return (
    <div className="max-w-lg mx-auto px-4 py-8 sm:py-16">
      <div className="bg-white dark:bg-[#111A2E] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto ring-8 ring-rose-50 dark:ring-rose-950/30">
          <AlertCircle className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            PAYMENT UNCONFIRMED
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
            Transaction Incomplete
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {errorMessage || 'Your payment was declined or interrupted before gateway verification.'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs text-left space-y-2 text-slate-600 dark:text-slate-300">
          <p className="font-bold text-slate-900 dark:text-white">Did your account get debited?</p>
          <p>
            If money was deducted from your bank account, it will automatically refund within 2-4 business days, or contact our support team with your UPI reference.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onRetry}
            className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Payment Again</span>
          </button>

          <button
            onClick={onOpenAssistant}
            className="px-5 py-3.5 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-cyan-500" />
            <span>Ask JE AI</span>
          </button>
        </div>

        <div>
          <button
            onClick={onBackToCourses}
            className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline cursor-pointer"
          >
            Back to Course Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
