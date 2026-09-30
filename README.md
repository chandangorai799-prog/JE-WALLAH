# JE WALLAH - Diploma Engineering Online Learning Platform

> **"Your Engineering Journey Starts Here."**

JE WALLAH is India's dedicated, modern, responsive EdTech platform engineered specifically for **Diploma Polytechnic Engineering students**. It provides affordable, semester-wise study batches covering core theory derivations, handwritten high-yield formula notes, 10-year previous year questions (PYQs) with model answers, and a 24/7 AI Doubt Assistant.

---

## 🚀 Key Features

1. **Semester-Wise Pricing Aligned to Student Budgets**:
   - **1st Semester Batch**: ₹99 (Foundation & Core Applied Sciences)
   - **3rd Semester Batch**: ₹299 (Departmental Specialization & Core Circuit/Mechanics)
   - **5th Semester Batch**: ₹249 (Advanced Machine/Power/Web Design & Project Prep)
   - *Pricing is per complete semester batch, not per individual subject.*

2. **4 Core Engineering Branches**:
   - **Electrical Engineering (EE)**
   - **Mechanical Engineering (ME)**
   - **Metallurgy Engineering (MTE)**
   - **Computer Science Engineering (CSE)**
   - Total 12 comprehensive course batch combinations with authentic curricula.

3. **Dual Payment Engine**:
   - **Mode A: Demo Payment Mode**: When gateway keys are not provided, allows developers and reviewers to safely test order creation, transaction verification, and instant batch access with zero financial commitment. Clearly labeled: `DEMO PAYMENT — No real money will be charged.`
   - **Mode B: Real Payment Mode**: Seamless integration with Razorpay supporting UPI, QR code, Debit/Credit Cards, and Net Banking across 50+ Indian banks with server-side HMAC-SHA256 signature verification.

4. **JE AI Assistant**:
   - Built on Google's **Gemini 3.8 Flash** model via a secure server proxy (`/api/chat`).
   - Explains complex engineering derivations (Thevenin's theorem, Stress-strain curve, Fe-C diagram, DBMS normalization) in simple English and relatable Hinglish.
   - Generates custom 7-day or 14-day board exam revision schedules.
   - Available via both a floating widget and a dedicated full-screen study portal.

5. **Student Dashboard & Course Player**:
   - Welcome banner personalized with the student's name.
   - Enrolled batches list with progress percentage tracker.
   - Course Player with video lectures, playback speed controls (1x, 1.25x, 1.5x, 2x), downloadable PDF notes, formula cheat sheets, and "Mark as Completed" tracking.
   - Purchase history table with downloadable payment receipts.

6. **Admin Dashboard**:
   - Protected super-admin portal.
   - Batch creation, editing, active/inactive toggling, and thumbnail URL management.
   - Subject & lecture upload tools.
   - Real-time revenue analytics and verified order log.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4, Lucide React, Framer Motion / Canvas Confetti.
- **Backend**: Node.js, Express, tsx.
- **Database & Auth**: Firebase Authentication & Cloud Firestore Enterprise.
- **AI Engine**: `@google/genai` TypeScript SDK (`gemini-3.8-flash`).
- **Payments**: Razorpay Checkout SDK + Node.js HMAC verification.

---

## 📦 Environment Variables Configuration

Copy `.env.example` to `.env`:

```bash
# Gemini AI API Key (Injected automatically in AI Studio or from Google AI Studio)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Application Hosted URL
APP_URL="http://localhost:3000"

# Server Port
PORT=3000

# Optional: Razorpay Payment Gateway Credentials
# When omitted, JE WALLAH automatically runs in Mode A (Demo Mode)
RAZORPAY_KEY_ID="rzp_test_YOUR_KEY_ID"
RAZORPAY_KEY_SECRET="YOUR_RAZORPAY_SECRET"
```

---

## 💻 Local Setup & Development (VS Code)

### 1. Prerequisites
- Node.js version 20 or higher.
- npm or bun.

### 2. Installation
Clone or open the project folder in VS Code, then install dependencies:

```bash
npm install
```

### 3. Running the Development Server
Run the unified full-stack server (hosts both Express API proxy and Vite middleware):

```bash
npm run dev
```

Visit `http://localhost:3000` in your web browser.

### 4. Building for Production
```bash
npm run build
npm start
```

---

## 🔒 Firebase Security Rules & Architecture

- Intermediate representation defined in `firebase-blueprint.json`.
- Hardened Attribute-Based Access Control (ABAC) in `firestore.rules`.
- Students can only read and write their own profile and order records.
- Course batches are publicly viewable by prospective students, but writable only by verified administrators.
- Admin verification enforces role checking on `admins/{uid}` and bootstrapped master owner email `chandangorai799@gmail.com`.

---

## 🛡️ License & Copyright

© 2026 **JE WALLAH**. All rights reserved.
Built specifically for Indian Diploma Engineering students.
