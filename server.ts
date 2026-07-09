import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create local uploads directories if they don't exist
const uploadDirs = [
  'uploads',
  'uploads/videos',
  'uploads/images',
  'uploads/documents'
];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Helper for lazy Gemini initialization
let aiClient: GoogleGenAI | null = null;
function getGemini() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// ----------------- MULTER FILE UPLOAD SETUP -----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, 'uploads/videos');
    } else if (file.mimetype.startsWith('image/')) {
      cb(null, 'uploads/images');
    } else if (file.mimetype === 'application/pdf') {
      cb(null, 'uploads/documents');
    } else {
      cb(null, 'uploads');
    }
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `${Date.now()}_${cleanName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'video/mp4', 'video/quicktime',
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP4 videos, JPEG/PNG images, and PDF documents are allowed.'));
    }
  }
});

// ----------------- API ENDPOINTS -----------------

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Zambian Cybersecurity Platform API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Upload API for Admin (handles file upload and returns paths)
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const relativePath = `/uploads/${req.file.destination.split('/').pop()}/${req.file.filename}`;
    res.json({
      success: true,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: relativePath
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'File upload failed.' });
  }
});

// AI Chatbot with Gemini API (Models: gemini-3.5-flash)
app.post('/api/chat', async (req, res) => {
  const { messages, language } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages array provided.' });
  }

  try {
    const ai = getGemini();

    const isBemba = language === 'bm';
    const systemInstruction = `
      You are "Ba Cyber Advisor", an experienced, extremely warm, helpful, and friendly cybersecurity awareness consultant specializing in protecting people in Zambia.
      Your goal is to educate Zambian citizens about cybersecurity in both English and Bemba.
      Always be respectful and highly encouraging.
      Focus heavily on common local threats such as:
      1. Mobile Money (MoMo) social engineering fraud on MTN or Airtel. Warn users: Never share your 4-digit PIN! No legitimate support agent will ask for it.
      2. Social media hacking (WhatsApp/Facebook takeover) where scammers hijack accounts and message friends asking for urgent soft loans or MoMo transfers.
      3. Phishing links claiming free bundles, job opportunities, or cash prizes from the government, ZICTA, or commercial banks (e.g. Zanaco, Atlas Mara).
      
      Respond in the requested language: ${isBemba ? 'Bemba (Ichibemba)' : 'English'}.
      If the user is asking in Bemba, translate technical terms into easy-to-understand explanations in Bemba, or use common hybrid Bemba-English terms where natural.
      Keep answers clear, highly structured, actionable, and visually clean (use bolding and simple bullet points).
    `;

    // Map messages history to Gemini GenAI Content structure
    const contents = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Standard robust flash model
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1020
      }
    });

    res.json({
      success: true,
      reply: response.text || (isBemba ? 'Mpeeleleko ubwafya, nshaswike bwino.' : 'Sorry, I could not generate a response. Please try again.')
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: 'Failed to generate response. Ensure GEMINI_API_KEY is configured in your secrets.',
      details: error.message
    });
  }
});

// AI Tip Generator (Bilingual)
app.get('/api/tips', async (req, res) => {
  const language = req.query.lang || 'en';
  try {
    const ai = getGemini();
    const isBemba = language === 'bm';

    const prompt = isBemba
      ? "Pangila icebo ca kusambilila ica kacingilila ifya pa foni nangu pa Intaneti icawama mu Zambia. Cilingile ukuba fye ulupapulo lumo, ulwakosa, nelyo ulwasuma (maximum 2-3 sentences). Lembela mu Ichibemba."
      : "Generate a short, actionable daily cybersecurity awareness tip specific to the Zambian context (e.g. mobile money, social media hijack, ATM safety, public Wi-Fi). Keep it engaging and concise (maximum 2-3 sentences).";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 200
      }
    });

    res.json({
      success: true,
      tip: response.text?.trim()
    });
  } catch (error) {
    // Elegant fallback tips if API fails
    const fallbackEn = [
      "Keep your MTN/Airtel MoMo PIN strictly to yourself. No mobile network operator will ever call to ask for your PIN to resolve a transaction error.",
      "Activate Two-Factor Authentication (2FA) on your WhatsApp. This simple setup stops hackers from taking over your account and begging your contacts for money.",
      "Beware of WhatsApp messages or Facebook links promising free government grants, free airtime, or free bundles. These are phishing scams designed to steal your credentials."
    ];
    const fallbackBm = [
      "Inshila isuma iya kucingilila MoMo yenu ya kulasunga PIN muli mwebe bene. Kampani ya MTN nelyo Airtel te kuti imulile foni ukwipusha PIN yenu iyasuka.",
      "Bomfyeni Two-Factor Authentication (2FA) pali WhatsApp yenu. Ii inshila ilatwala ubuseko mukucingilila ifyasuka fya kwingilila kuli bashipula.",
      "Mwilatinya ama links ya pa WhatsApp nelyo Facebook aya fwaya ukumushilako amashiku ya fye nangu bundles sha fye. Ubu bufi ubwapangwa ukwiba ifya muli foni."
    ];

    const fallbackList = language === 'bm' ? fallbackBm : fallbackEn;
    const randomIndex = Math.floor(Math.random() * fallbackList.length);

    res.json({
      success: true,
      tip: fallbackList[randomIndex]
    });
  }
});

// ----------------- VITE DEVELOPMENT / PRODUCTION MIDDLEWARE -----------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve SPA index.html for any remaining requests
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Zambian Cybersecurity Academy running on http://localhost:${PORT}`);
  });
}

start();
