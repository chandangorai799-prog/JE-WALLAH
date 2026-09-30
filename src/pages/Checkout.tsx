import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  QrCode,
  CreditCard,
  Building,
  ArrowLeft,
  AlertTriangle,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Course, Order, Purchase } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { recordOrder, grantCoursePurchase } from '../firebase/services.ts';

interface CheckoutProps {
  course: Course;
  onBack: () => void;
  onSuccess: (order: Order) => void;
  onFailure: (errorMessage: string) => void;
}

type PaymentMethodType = 'upi' | 'card' | 'netbanking';
type PaymentModeType = 'demo' | 'real';

export const Checkout: React.FC<CheckoutProps> = ({
  course,
  onBack,
  onSuccess,
  onFailure,
}) => {
  const { currentUser, userProfile } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');
  const [paymentMode, setPaymentMode] = useState<PaymentModeType>('demo');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('sbi');

  const finalAmount = course.price;

  // Process payment simulation or real Razorpay checkout
  const handleProceedPayment = async (forceSimulateFailure = false) => {
    if (!currentUser) return;
    setIsProcessing(true);

    try {
      if (paymentMode === 'demo') {
        // Simulated network delay
        await new Promise((resolve) => setTimeout(resolve, 1200));

        if (forceSimulateFailure) {
          setIsProcessing(false);
          onFailure('Demo Payment was simulated as failed (Insufficient Balance or User Cancelled).');
          return;
        }

        const demoOrderId = `ORD_DEMO_${Date.now()}`;
        const demoPaymentRef = `PAY_DEMO_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        const verifiedOrder: Order = {
          orderId: demoOrderId,
          uid: currentUser.uid,
          courseId: course.courseId,
          courseTitle: course.title,
          branch: course.branch,
          semester: course.semester,
          amount: finalAmount,
          currency: 'INR',
          paymentProvider: 'demo',
          paymentReference: demoPaymentRef,
          paymentStatus: 'Paid',
          paymentMethod: paymentMethod === 'upi' ? 'UPI (Demo)' : paymentMethod === 'card' ? 'Card (Demo)' : 'Net Banking (Demo)',
          createdAt: new Date().toISOString(),
          verifiedAt: new Date().toISOString(),
        };

        const newPurchase: Purchase = {
          purchaseId: `PURCHASE_${Date.now()}`,
          uid: currentUser.uid,
          courseId: course.courseId,
          orderId: demoOrderId,
          purchaseDate: new Date().toISOString(),
          accessStatus: 'active',
        };

        // Record securely
        await recordOrder(verifiedOrder);
        await grantCoursePurchase(newPurchase);

        setIsProcessing(false);
        onSuccess(verifiedOrder);
        return;
      }

      // MODE B: Real Razorpay Payment Call
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.courseId,
          branch: course.branch,
          semester: course.semester,
          amount: finalAmount,
          uid: currentUser.uid,
        }),
      });

      const orderData = await orderRes.json();

      if (orderData.mode === 'demo') {
        // Server signaled that Razorpay keys are not configured, fallback gracefully to demo mode
        const demoOrderId = orderData.orderId || `ORD_DEMO_${Date.now()}`;
        const verifiedOrder: Order = {
          orderId: demoOrderId,
          uid: currentUser.uid,
          courseId: course.courseId,
          courseTitle: course.title,
          branch: course.branch,
          semester: course.semester,
          amount: finalAmount,
          currency: 'INR',
          paymentProvider: 'demo',
          paymentReference: `DEMO_GATEWAY_NOT_CONFIGURED_${Date.now()}`,
          paymentStatus: 'Paid',
          paymentMethod: 'Demo Gateway Mode',
          createdAt: new Date().toISOString(),
          verifiedAt: new Date().toISOString(),
        };

        const newPurchase: Purchase = {
          purchaseId: `PURCHASE_${Date.now()}`,
          uid: currentUser.uid,
          courseId: course.courseId,
          orderId: demoOrderId,
          purchaseDate: new Date().toISOString(),
          accessStatus: 'active',
        };

        await recordOrder(verifiedOrder);
        await grantCoursePurchase(newPurchase);
        setIsProcessing(false);
        onSuccess(verifiedOrder);
        return;
      }

      // Check for Razorpay script on window
      if (!(window as any).Razorpay) {
        // Load razorpay script dynamically
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'JE WALLAH',
        description: `${course.title} (${course.semester})`,
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=128&q=80',
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify server-side
            const verifyRes = await fetch('/api/payment/verify-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                mode: 'real',
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.verified) {
              const realOrder: Order = {
                orderId: response.razorpay_order_id,
                uid: currentUser.uid,
                courseId: course.courseId,
                courseTitle: course.title,
                branch: course.branch,
                semester: course.semester,
                amount: finalAmount,
                currency: 'INR',
                paymentProvider: 'razorpay',
                paymentReference: response.razorpay_payment_id,
                paymentStatus: 'Paid',
                paymentMethod: 'Razorpay Verified',
                createdAt: new Date().toISOString(),
                verifiedAt: new Date().toISOString(),
              };

              const newPurchase: Purchase = {
                purchaseId: `PURCHASE_${Date.now()}`,
                uid: currentUser.uid,
                courseId: course.courseId,
                orderId: response.razorpay_order_id,
                purchaseDate: new Date().toISOString(),
                accessStatus: 'active',
              };

              await recordOrder(realOrder);
              await grantCoursePurchase(newPurchase);

              setIsProcessing(false);
              onSuccess(realOrder);
            } else {
              setIsProcessing(false);
              onFailure('Server verification failed for this transaction.');
            }
          } catch (e: any) {
            setIsProcessing(false);
            onFailure(e.message || 'Error communicating with verification server.');
          }
        },
        prefill: {
          name: `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim(),
          email: currentUser.email || '',
          contact: userProfile?.phone || '',
        },
        theme: {
          color: '#2563EB',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (resp: any) => {
        setIsProcessing(false);
        onFailure(resp.error?.description || 'Payment failed or was cancelled by user.');
      });
      rzp.open();
    } catch (err: any) {
      console.error('Checkout processing error:', err);
      setIsProcessing(false);
      onFailure(err.message || 'Payment initiation failed.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Batch Details</span>
      </button>

      {/* Main Heading as Specified */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
          Complete Your Purchase
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Unlock instant access to video lectures, notes, derivations, and question banks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Payment Mode & Methods (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Payment Mode Selector Box (Demo vs Real) */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Payment Environment Mode:</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                {paymentMode === 'demo' ? 'MODE A: DEMO' : 'MODE B: REAL'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMode('demo')}
                className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                  paymentMode === 'demo'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-amber-200 dark:border-amber-800'
                }`}
              >
                <div>Mode A: Demo Payment</div>
                <div className="text-[10px] font-normal opacity-90">Instant testing & simulation</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('real')}
                className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                  paymentMode === 'real'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-amber-200 dark:border-amber-800'
                }`}
              >
                <div>Mode B: Razorpay Real</div>
                <div className="text-[10px] font-normal opacity-90">UPI, Cards, NetBanking</div>
              </button>
            </div>

            {paymentMode === 'demo' && (
              <div className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                <strong>DEMO PAYMENT — No real money will be charged.</strong> This mode allows developers and reviewers to test the complete enrollment workflow safely.
              </div>
            )}
          </div>

          {/* Payment Method Selection Cards */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block">
              Select Payment Method:
            </label>

            {/* 1. UPI / QR */}
            <div
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                paymentMethod === 'upi'
                  ? 'border-blue-600 dark:border-cyan-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    UPI / QR Code
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Google Pay, PhonePe, Paytm, BHIM UPI
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'upi'
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {paymentMethod === 'upi' && <div className="w-2 h-2 rounded-full bg-white"></div>}
              </div>
            </div>

            {/* 2. Debit / Credit Card */}
            <div
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                paymentMethod === 'card'
                  ? 'border-blue-600 dark:border-cyan-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Debit or Credit Card
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Visa, MasterCard, RuPay, Maestro
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-white"></div>}
              </div>
            </div>

            {/* 3. Net Banking */}
            <div
              onClick={() => setPaymentMethod('netbanking')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                paymentMethod === 'netbanking'
                  ? 'border-blue-600 dark:border-cyan-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111A2E] hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Net Banking
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    SBI, HDFC, ICICI, Axis, PNB & 50+ Banks
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'netbanking'
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {paymentMethod === 'netbanking' && <div className="w-2 h-2 rounded-full bg-white"></div>}
              </div>
            </div>
          </div>

          {/* Contextual subform inputs */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            {paymentMethod === 'upi' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Virtual Payment Address (UPI ID):
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@okhdfcbank or yourname@paytm"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  You will receive a collect request on your UPI app or scan the QR code via Razorpay hosted checkout.
                </p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Card details are securely captured via Razorpay's PCI-DSS compliant checkout. JE WALLAH does not store or process your card numbers.
              </p>
            )}

            {paymentMethod === 'netbanking' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Popular Bank:
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                >
                  <option value="sbi">State Bank of India (SBI)</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
                  <option value="pnb">Punjab National Bank (PNB)</option>
                  <option value="bob">Bank of Baroda</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Order Summary & Execution Buttons (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-[#111A2E] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
              Order Summary
            </h3>

            {/* Course mini item */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex gap-3">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-16 h-14 rounded-lg object-cover shrink-0"
                />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400">
                    {course.branch} • {course.semester}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                    {course.title}
                  </h4>
                </div>
              </div>
            </div>

            {/* Bill Breakdown */}
            <div className="space-y-2 text-xs border-y border-slate-100 dark:border-slate-800 py-4">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Batch MRP</span>
                <span className="line-through">₹{course.originalPrice}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Special Diploma Discount</span>
                <span>-₹{course.originalPrice - course.price}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GST (18% inclusive)</span>
                <span>₹0 (Included)</span>
              </div>
              <div className="flex justify-between text-slate-900 dark:text-white font-extrabold text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Final Amount Payable</span>
                <span className="text-xl text-blue-600 dark:text-cyan-400 font-black">
                  ₹{finalAmount}
                </span>
              </div>
            </div>

            {/* Student confirmation info */}
            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <p>Purchasing as: <strong>{userProfile?.firstName || 'Student'} ({currentUser?.email})</strong></p>
              <p>Access: Instant unlock across Web & Mobile</p>
            </div>

            {/* Main Action Button */}
            <button
              onClick={() => handleProceedPayment(false)}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg shadow-blue-500/25 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Securing Transaction & Verifying...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    Pay ₹{finalAmount} {paymentMode === 'demo' ? '(Demo Simulation)' : 'via Razorpay'}
                  </span>
                </>
              )}
            </button>

            {/* Demo Mode Testing Helper */}
            {paymentMode === 'demo' && (
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleProceedPayment(true)}
                  disabled={isProcessing}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 cursor-pointer transition-colors"
                >
                  Simulate Failed Payment (Test Failure State)
                </button>
              </div>
            )}

            <div className="text-center">
              <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-Bit SSL Encrypted • Zero Data Exposure</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
