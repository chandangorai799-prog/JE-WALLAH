import React, { useEffect } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  Download,
  Calendar,
  CreditCard,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order } from '../types/index.ts';

interface PaymentSuccessProps {
  order: Order;
  onGoToLearning: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ order, onGoToLearning }) => {
  useEffect(() => {
    // Celebration confetti burst
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#22D3EE', '#10B981', '#F59E0B'],
      });
    } catch {
      // ignore
    }
  }, []);

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-16">
      <div className="bg-white dark:bg-[#111A2E] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6">
        {/* Animated Green Tick */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/30 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        {/* Success Headings */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            TRANSACTION VERIFIED & COMPLETED
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
            Payment Successful!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Payment Successful! Your batch has been purchased successfully. Start learning now.
          </p>
        </div>

        {/* Transaction Receipt Card */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-left space-y-3.5 text-xs">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Order ID:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{order.orderId}</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Batch Name:</span>
            <span className="font-bold text-slate-900 dark:text-white text-right max-w-[65%] truncate">
              {order.courseTitle}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Branch & Semester:</span>
            <span className="font-semibold text-blue-600 dark:text-cyan-400">
              {order.branch} • {order.semester}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Amount Paid:</span>
            <span className="font-black text-base text-slate-900 dark:text-white">
              ₹{order.amount} ({order.currency})
            </span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Payment Date:</span>
            <span className="text-slate-700 dark:text-slate-300">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Verification Status:</span>
            <span className="font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {order.paymentStatus} ({order.paymentMethod})
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onGoToLearning}
            className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg shadow-blue-500/25 cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <span>Go to My Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrintReceipt}
            className="px-5 py-3.5 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
