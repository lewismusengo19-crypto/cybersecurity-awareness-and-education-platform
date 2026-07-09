# Cybersecurity Awareness and Education Platform (Zambia)

Welcome to the **Zambian Cybersecurity Awareness and Education Platform**—a production-ready, highly secure, full-stack bimodal education system. This platform is designed to educate Zambian citizens on cybersecurity best practices, specializing in native **Bemba (Ichibemba)** and **English** instruction. It focuses heavily on preventing common local social engineering schemes like Mobile Money (MoMo) scams and social media hijackings.

---

## 1. FULL FOLDER STRUCTURE

```text
/
├── .env.example                # Environment variables blueprint
├── .gitignore                  # Git untracked path rules
├── README.md                   # Full system documentation (this file)
├── firebase-applet-config.json # Auto-provisioned Firebase credentials
├── firestore.rules             # Secure, role-based Firestore security rules
├── index.html                  # Standard Single Page Application entrypoint
├── metadata.json               # Platform configuration metadata
├── package.json                # Project dependencies and deployment scripts
├── server.ts                   # Express.js back-end with Gemini API & Multer
├── tsconfig.json               # TypeScript compiler configurations
├── vite.config.ts              # Vite server & asset compiler configurations
└── src/
    ├── App.tsx                 # Main application root & layout coordinator
    ├── firebase.ts             # Client-side Firebase SDK configuration
    ├── index.css               # Global Tailwind CSS imports & theme configurations
    ├── main.tsx                # Client-side React 19 entrypoint
    ├── sampleData.ts           # Pre-loaded English & Bemba educational content
    ├── types.ts                # TypeScript types & role interfaces
    └── components/
        ├── Navbar.tsx          # Accessible header with login, sizing, and contrast toggles
        ├── HomeSection.tsx     # Homepage featuring stats, alerts, and daily tip generator
        ├── LearnSection.tsx    # Secure video player, downloads, and PDF library
        ├── GallerySection.tsx  # Cybersecurity infographics gallery with zoom lightbox
        ├── QuizSection.tsx     # Interactive quiz taking engine with scores tracking
        ├── ChatbotSection.tsx  # "Ba Cyber Advisor" bimodal AI chatbot using Gemini API
        ├── AboutSection.tsx    # Research description & importance of local security
        └── ContactSection.tsx  # Feedback submissions, coordinator contacts, and FAQ accordions
```

---

## 2. DATABASE SCHEMA (FIRESTORE COLLECTIONS)

The platform utilizes **Google Firebase Firestore** with structured collections:

### `users`
- **uid** (`string`, primary key)
- **email** (`string`)
- **displayName** (`string`)
- **role** (`'admin' | 'learner'`)
- **createdAt** (`string`, ISO date)
- **phone** (`string`, optional)

### `videos`
- **id** (`string`, primary key)
- **title_en** (`string`)
- **title_bm** (`string`)
- **description_en** (`string`)
- **description_bm** (`string`)
- **url** (`string`) - File binary path (e.g., `/uploads/videos/...`)
- **thumbnailUrl** (`string`)
- **duration** (`string`)
- **views** (`number`)
- **downloads** (`number`)
- **createdAt** (`string`, ISO date)

### `images`
- **id** (`string`, primary key)
- **title_en** (`string`)
- **title_bm** (`string`)
- **description_en** (`string`)
- **description_bm** (`string`)
- **url** (`string`) - Infographic image path (e.g., `/uploads/images/...`)
- **views** (`number`)
- **downloads** (`number`)
- **createdAt** (`string`, ISO date)

### `pdfs`
- **id** (`string`, primary key)
- **title_en** (`string`)
- **title_bm** (`string`)
- **description_en** (`string`)
- **description_bm** (`string`)
- **url** (`string`) - Document binary path (e.g., `/uploads/documents/...`)
- **downloads** (`number`)
- **createdAt** (`string`, ISO date)

### `quizzes`
- **id** (`string`, primary key)
- **title_en** (`string`)
- **title_bm** (`string`)
- **description_en** (`string`)
- **description_bm** (`string`)
- **createdAt** (`string`, ISO date)
- **questions** (`array` of objects):
  - **id** (`string`)
  - **question_en** (`string`)
  - **question_bm** (`string`)
  - **options_en** (`array` of strings)
  - **options_bm** (`array` of strings)
  - **correctAnswerIndex** (`number`)

### `quiz_attempts`
- **id** (`string`, primary key)
- **userId** (`string`)
- **userEmail** (`string`)
- **userName** (`string`)
- **quizId** (`string`)
- **quizTitle_en** (`string`)
- **quizTitle_bm** (`string`)
- **score** (`number`)
- **totalQuestions** (`number`)
- **completedAt** (`string`, ISO date)

### `notifications`
- **id** (`string`, primary key)
- **title_en** (`string`)
- **title_bm** (`string`)
- **message_en** (`string`)
- **message_bm** (`string`)
- **type** (`'announcement' | 'lesson'`)
- **createdAt** (`string`, ISO date)

### `audit_logs`
- **id** (`string`, primary key)
- **userId** (`string`)
- **email** (`string`)
- **action** (`string`)
- **details** (`string`)
- **ipAddress** (`string`)
- **device** (`string`)
- **timestamp** (`string`, ISO date)

---

## 3. API DOCUMENTATION

### 1. File Upload API
- **Endpoint**: `POST /api/upload`
- **Content-Type**: `multipart/form-data`
- **Payload**: `file` (Binary payload, supports `.mp4`, `.png`, `.jpeg`, `.pdf`)
- **Security**: Server-side mimetype checking, size limiting (max 100MB), filename sanitization.
- **Response**:
  ```json
  {
    "success": true,
    "filename": "178333200_momo_safety.mp4",
    "originalName": "momo_safety.mp4",
    "mimeType": "video/mp4",
    "size": 3410500,
    "path": "/uploads/videos/178333200_momo_safety.mp4"
  }
  ```

### 2. Gemini Bilingual AI Chat API
- **Endpoint**: `POST /api/chat`
- **Content-Type**: `application/json`
- **Payload**:
  ```json
  {
    "messages": [
      { "role": "user", "content": "How do I secure my MoMo PIN?" }
    ],
    "language": "en" // or "bm" for Bemba
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "reply": "Ba Cyber Advisor: Legitimate support representatives will never ask for your PIN. To secure your MoMo PIN..."
  }
  ```

### 3. Daily AI tip generator API
- **Endpoint**: `GET /api/tips`
- **Parameters**: `lang` (`en` or `bm`)
- **Response**:
  ```json
  {
    "success": true,
    "tip": "Never send processing fees to claim promo prizes. Legitimate MTN or Airtel campaigns never ask you for money first."
  }
  ```

---

## 4. DEPLOYMENT INSTRUCTIONS

The platform is fully ready for containerized server deployments (Google Cloud Run, AWS EC2, or AWS S3 + ECS):

### Step 1: Clone and Configure Environment Variables
Create a production `.env` file containing the Gemini API key from Google AI Studio:
```env
GEMINI_API_KEY="AIzaSyYourGeminiAPIKeyHere"
NODE_ENV="production"
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Compile assets for production
```bash
npm run build
```
This builds static SPA assets in `dist/` and bundles `server.ts` into a standalone, ultra-fast `dist/server.cjs` Node bundle using `esbuild`.

### Step 4: Run production server
```bash
npm run start
```
The server will boot on port `3000` (host `0.0.0.0`) and securely handle static files, Gemini requests, and multer uploads!

---

## 5. SECURITY ARCHITECTURE DIAGRAM

```text
               +-------------------------------------------+
               |             Learner's Browser             |
               +-----+-------------------+-----------+-----+
                     |                   |           |
       HTTPS (JSON)  |     Direct Auth   |           | HTTPS (Media Upload)
       & Chat API    |   & Firestore     |           | to Local /uploads/
                     v                   v           v
               +-----+-----+       +-----+-----------+-----+
               |  Express  |       | Google Firebase Cloud |
               |  Server   |       | Auth & Firestore DB   |
               +-----+-----+       +-----------------------+
                     |
                     | Secure SSL Channel (process.env.GEMINI_API_KEY)
                     v
               +-----+-----+
               | Google AI |
               |  Gemini   |
               +-----------+
```

---

## 6. USER WORKFLOW DIAGRAM

### Learner/Student workflow:
1. Opens homepage -> Switch language between English and Bemba seamlessly.
2. Selects **Learn** -> Watch educational videos or download PDF Handbooks.
3. Selects **Quizzes** -> Takes bimodal interactive quizzes, scoring responses, and saving scores to Firestore history.
4. Selects **Ba Cyber Advisor** -> Chat in English or Bemba with the AI Cybersecurity consultant to ask questions.

### Administrator workflow:
1. Log in securely through the Navbar modal.
2. Navigate to **Admin Portal**.
3. Use **Media Upload** tab to upload local files. Fill out bilingual details (English/Bemba titles and descriptions), and save!
4. Use **Quiz Maker** to draft questions and correct answers in both languages.
5. Send custom alerts and announcements.
6. Check **Security Logs** to monitor user actions and device IP signatures.

---

## 7. ENTITY RELATIONSHIP (ER) DIAGRAM

```text
  [users] 1 -------- 0..* [quiz_attempts]
    | uid                      | userId
    |                          | quizId -------- 1 [quizzes]
    |                                                 | id
    +--------- 0..* [audit_logs]                      | (composed of questions)
    |                  | userId
    |
    +--------- 0..* [bookmarks] (Watch Later)
                       | userId
                       | itemId (references videos/images)
```

---

## 8. WIREFRAMES (MINIMAL REPRESENTATION)

```text
+--------------------------------------------------------------+
| [Academy Logo]   Home  Learn  Infographics  Quizzes  [EN/BM] |
+--------------------------------------------------------------+
|                                                              |
|   [SHIELD] PROTECT YOUR MONEY AND IDENTITY IN ZAMBIA         |
|   Start Learning [Button]      Talk to Cyber Advisor [Button] |
|                                                              |
|   +-----------------------+     +------------------------+   |
|   | Daily Smart Tip Card  |     | Announcements Alerts   |   |
|   | "Never share your PIN"|     | "New lesson on Airtel" |   |
|   +-----------------------+     +------------------------+   |
|                                                              |
|   [Featured Videos]                                          |
|   +---------------+  +---------------+  +---------------+    |
|   |  MoMo Safety  |  |   Phishing    |  |  Passwords    |    |
|   +---------------+  +---------------+  +---------------+    |
|                                                              |
+--------------------------------------------------------------+
```

---

## 9. SAMPLE BILINGUAL CONTENT PREVIEW

### English:
- **Title**: Protecting Your Mobile Money (MoMo) Wallet
- **Description**: Learn how to secure your MTN and Airtel Mobile Money wallets from common social engineering scams in Zambia. Never share your 4-digit PIN with anyone, even those claiming to be agents.

### Bemba (Ichibemba):
- **Title**: Ukuicingilila Kuli Ifya Kufumya Imparian ya pa Foni (MoMo)
- **Description**: Sambilileni ifyo mwingasunga imparian ya pa foni yenu (MTN na Airtel) ukuti mwilasenda kuli bampulamafunde aba bufi. Mwilaeba umuntu uuli onse inshila yenu iya kufisa (PIN), nangu fye abaicefya ukuti bamebenshi.

---

## 10. RUNNING LOCAL INSTRUCTIONS

To launch the system on your developer computer:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure your `GEMINI_API_KEY` in `.env`:
   ```env
   GEMINI_API_KEY="AIzaSy..."
   ```
3. Boot development server (Express server handles backend while serving Vite client concurrently):
   ```bash
   npm run dev
   ```
4. Open the application in your browser: `http://localhost:3000`. Enjoy the fully bimodal secure workspace!
