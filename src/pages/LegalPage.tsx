import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Compass } from 'lucide-react';

interface LegalPageProps {
  pageType: 'about' | 'privacy' | 'terms' | 'refund' | 'contact';
}

export const LegalPage: React.FC<LegalPageProps> = ({ pageType }) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [sentNotice, setSentNotice] = useState(false);

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    setSentNotice(true);
    setTimeout(() => {
      setSentNotice(false);
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMessage('');
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8">
      {pageType === 'about' && (
        <div className="bg-white dark:bg-[#111A2E] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
              About JE WALLAH
            </h1>
          </div>
          <p className="text-sm font-semibold text-blue-600 dark:text-cyan-400">
            "Your Engineering Journey Starts Here."
          </p>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              JE WALLAH is India's dedicated online educational technology platform engineered specifically for Diploma Polytechnic Engineering students across state boards (BTEUP, SBTE Bihar, WBSCTE, MSBTE, DTE, HSBTE, CSVTU, and others).
            </p>
            <p>
              We believe that quality technical education should never be a financial barrier for aspiring engineers. While traditional coaching institutes charge exorbitant fees for diploma tuition, JE WALLAH delivers full semester study packages for just <strong>₹99 for 1st Semester</strong>, <strong>₹299 for 3rd Semester</strong>, and <strong>₹249 for 5th Semester</strong>.
            </p>
            <p>
              Our batches span four primary engineering branches: Electrical Engineering, Mechanical Engineering, Metallurgy Engineering, and Computer Science Engineering. Each course includes step-by-step video derivations, high-yield handwritten chapter summaries, solved 10-year board question papers, and our interactive 24/7 JE AI Doubt Assistant.
            </p>
          </div>
        </div>
      )}

      {pageType === 'privacy' && (
        <div className="bg-white dark:bg-[#111A2E] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-cyan-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
              Privacy Policy
            </h1>
          </div>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p><strong>Effective Date: January 1, 2026</strong></p>
            <p>
              At JE WALLAH, we take your personal data privacy seriously. This Privacy Policy details how we collect, store, and protect student information in compliance with the Information Technology Act, 2000 of India.
            </p>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">1. Information We Collect</h3>
            <p>
              When registering an account on JE WALLAH, we collect your first name, last name, email address, mobile number, and optional college details. We use this strictly to deliver your enrolled semester batches and send lecture updates.
            </p>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">2. Payment & Card Data Security</h3>
            <p>
              All online payments are processed through Razorpay's PCI-DSS compliant secure infrastructure. JE WALLAH never collects, views, or stores your debit card numbers, credit card CVV, or UPI PIN on our servers.
            </p>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">3. Zero Third-Party Advertising</h3>
            <p>
              We do not sell, rent, or trade your contact information to third-party telemarketers or external advertisers.
            </p>
          </div>
        </div>
      )}

      {pageType === 'terms' && (
        <div className="bg-white dark:bg-[#111A2E] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
            Terms and Conditions
          </h1>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p><strong>Last Updated: January 2026</strong></p>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">1. Acceptance of Terms</h3>
            <p>
              By accessing or creating an account on JE WALLAH, you agree to comply with and be bound by these Terms and Conditions.
            </p>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">2. Course Batch Access</h3>
            <p>
              Enrolled students receive single-user personal access to the designated batch video lectures, downloadable notes, and AI doubt assistant for the duration of their semester examination cycle. Account sharing or unauthorized redistribution of proprietary handwritten notes is strictly prohibited.
            </p>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">3. Semester Batch Pricing</h3>
            <p>
              Course prices are fixed as published: 1st Semester at ₹99, 3rd Semester at ₹299, and 5th Semester at ₹249. Pricing is per complete semester batch and covers all departmental subjects included in the package.
            </p>
          </div>
        </div>
      )}

      {pageType === 'refund' && (
        <div className="bg-white dark:bg-[#111A2E] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
            Refund & Cancellation Policy
          </h1>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              We strive to offer top-tier diploma educational content at the most affordable price point in India.
            </p>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">1. Accidental Duplicate Transactions</h3>
            <p>
              If a student is charged twice for the same batch due to a banking network glitch or multiple clicks, the duplicate charge will be refunded 100% within 4-7 business days back to the original payment source.
            </p>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">2. Course Content Support</h3>
            <p>
              Students who face technical streaming issues or login difficulties can contact our dedicated student support team at <strong>support@jewallah.in</strong> with their Order ID for immediate resolution.
            </p>
          </div>
        </div>
      )}

      {pageType === 'contact' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 bg-white dark:bg-[#111A2E] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                Contact JE WALLAH
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Have questions about a diploma batch, syllabus, or payment? Our student support team is here to assist.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Email Support</p>
                  <p className="text-slate-500">support@jewallah.in</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Student Helpline</p>
                  <p className="text-slate-500">+91 98765 43210 (Mon-Sat, 9 AM - 7 PM)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Location</p>
                  <p className="text-slate-500">Engineering EdTech Hub, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 bg-white dark:bg-[#111A2E] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
              Send Us a Message
            </h2>

            {sentNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Message sent successfully! Our academic team will respond within 24 hours.</span>
              </div>
            )}

            <form onSubmit={handleSubmitContact} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Vikas Verma"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="vikas@example.com"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Query or Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Tell us about the batch or technical issue you need assistance with..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Query</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
