import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google Gemini AI with recommended telemetry header
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instruction for JE WALLAH AI Assistant
const JE_WALLAH_SYSTEM_INSTRUCTION = `
You are "JE AI Assistant", the official expert AI tutor and study guide for "JE WALLAH" - India's premier Diploma Engineering online learning platform.
Tagline: "Your Engineering Journey Starts Here."

Platform Knowledge:
- Branches offered: Electrical Engineering (EE), Mechanical Engineering (ME), Metallurgy Engineering (MTE), Computer Science Engineering (CSE).
- Semesters offered & exact pricing:
  * 1st Semester Batch (All Branches / Common foundation): ₹99
  * 3rd Semester Batch: ₹299
  * 5th Semester Batch: ₹249
- Batch features: Semester-wise video lectures, high-yield revision PDF notes, previous year question paper solutions (PYQs), formula cheat sheets, 24/7 AI doubt solving, diploma board exam strategies.
- Target audience: Diploma engineering students in India across state boards (BTEUP, SBTE Bihar, MSBTE, WBSCTE, HSBTE, DTE Karnataka, CSVTU, etc.).

Your Persona & Capabilities:
1. Warm, encouraging, mentor-like persona ("Bhai/Dear student, let's crack your semester exams!").
2. Bilingual: Comfortably answer in clear English or natural, relatable Hinglish (e.g., "Yeh topic exam point of view se 8 marks ka ata hai...").
3. Engineering Concept Explanations: Explain technical concepts (DBMS, Thermodynamics, Electrical Machines, Metallurgy crystal lattices, Fourier series, etc.) simply with real-world analogies, step-by-step points, and exam answer tips.
4. Study Schedules: Create customized 7-day or 14-day study revision plans when students ask.
5. Navigation & Pricing: Guide users on how to register, login, click "Buy Now" on the batch card, choose Demo Payment or Razorpay UPI/Card, and access content in "My Learning".
6. Trust & Honesty: If asked whether an individual student's payment went through or specific order ID status, advise them to check their "My Learning" -> "Purchase History" tab or contact support. Never fabricate fake transaction completions.
`;

// AI Assistant Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message text is required.' });
      return;
    }

    if (!aiClient) {
      // Provide an authentic educational fallback if Gemini API key is not yet configured
      res.json({
        reply: `Hello future Engineer! 🎓 I am JE AI Assistant. Currently, GEMINI_API_KEY is not configured in this environment, but here is quick info for you:\n\n` +
          `• 1st Semester Batch: ₹99\n` +
          `• 3rd Semester Batch: ₹299\n` +
          `• 5th Semester Batch: ₹249\n\n` +
          `Available branches: Electrical, Mechanical, Metallurgy, and Computer Science Engineering. To start learning, head over to "Explore Courses" and click "Buy Now"!`,
      });
      return;
    }

    // Build chat contents from history and current message
    const formattedContents: Array<{ role: 'user' | 'model'; parts: [{ text: string }] }> = [];

    // Include last few messages for context (up to 8 messages)
    const recentHistory = conversationHistory.slice(-8);
    for (const msg of recentHistory) {
      if (msg.role === 'user' || msg.role === 'model') {
        formattedContents.push({
          role: msg.role,
          parts: [{ text: String(msg.text || '') }],
        });
      }
    }

    formattedContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: JE_WALLAH_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I'm here to help you crack your diploma engineering exams! Could you rephrase your question?";
    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: 'Failed to generate response from JE AI Assistant.',
      details: error?.message || 'Internal error',
    });
  }
});

// Razorpay Order Creation & Verification Endpoints
app.post('/api/payment/create-order', async (req: Request, res: Response) => {
  try {
    const { courseId, branch, semester, amount, uid } = req.body;

    if (!courseId || !amount || !uid) {
      res.status(400).json({ error: 'Missing required order parameters.' });
      return;
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If Razorpay keys are not configured, signal client to use Mode A (Demo Mode)
    if (!keyId || !keySecret) {
      const demoOrderId = `demo_ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      res.json({
        mode: 'demo',
        orderId: demoOrderId,
        amount,
        currency: 'INR',
        message: 'Razorpay keys not configured. Running in DEMO PAYMENT mode.',
      });
      return;
    }

    // When real Razorpay keys are present
    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Razorpay accepts amounts in paise
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        notes: {
          courseId,
          branch,
          semester,
          userId: uid,
        },
      }),
    });

    if (!razorpayResponse.ok) {
      const errData = await razorpayResponse.json();
      res.status(502).json({ error: 'Failed to create Razorpay order', details: errData });
      return;
    }

    const orderData = await razorpayResponse.json();
    res.json({
      mode: 'real',
      keyId,
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
    });
  } catch (error: any) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ error: 'Internal server error creating payment order.' });
  }
});

app.post('/api/payment/verify-order', async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, mode } = req.body;

    // Handle Demo mode verification
    if (mode === 'demo') {
      res.json({
        verified: true,
        mode: 'demo',
        paymentReference: `DEMO_PAY_${Date.now()}`,
        message: 'Demo transaction verified successfully.',
      });
      return;
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      res.status(400).json({ error: 'Razorpay secret key is not configured on the server.' });
      return;
    }

    // Verify Razorpay HMAC signature
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
      res.json({
        verified: true,
        mode: 'real',
        paymentReference: razorpay_payment_id,
        message: 'Razorpay payment verified successfully.',
      });
    } else {
      res.status(400).json({
        verified: false,
        error: 'Invalid payment signature. Verification failed.',
      });
    }
  } catch (error: any) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment.' });
  }
});

// App Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    platform: 'JE WALLAH',
    geminiConfigured: !!geminiApiKey,
    razorpayConfigured: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
  });
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[JE WALLAH] Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
