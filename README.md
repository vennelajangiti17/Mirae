<p align="center">
  <img src="https://ui-avatars.com/api/?name=Mirae&background=FCA311&color=14213D&size=128&bold=true&font-size=0.5" alt="Mirae Logo" width="80" />
</p>

<h1 align="center">Mirae — AI-Powered Career Command Center</h1>

<p align="center">
  <strong>Track every opportunity with clarity, rhythm, and calm.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Chrome-Extension_MV3-4285F4?logo=googlechrome&logoColor=white" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Chrome Extension Setup](#4-chrome-extension-setup)
- [Usage Guide](#-usage-guide)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Mirae** (미래, Korean for "future") is a full-stack AI-powered job application tracking system that combines a **React dashboard**, a **Node.js/Express backend**, and a **Chrome browser extension** into one seamless workflow.

Instead of manually bookmarking job listings or maintaining messy spreadsheets, Mirae lets you:

1. **Clip any job** from LinkedIn, Google Careers, Indeed, or any job site with one click.
2. **AI analyzes it instantly** — extracting skills, salary, location, and calculating a personalized match score against your resume.
3. **Track your pipeline** through a polished Kanban-style dashboard with analytics and calendar views.

---

## 🏗 Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Chrome Extension │────▶│  Node.js Backend  │────▶│   MongoDB Atlas   │
│   (Content Script │     │  (Express + Auth) │     │   (Jobs, Users)   │
│    + Background)  │     │                   │     │                   │
└──────────────────┘     └────────┬──────────┘     └──────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Gemini 2.5 AI   │
                         │  (Match Scoring,  │
                         │   Skill Parsing)  │
                         └──────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     React Dashboard (Vite)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │
│  │Dashboard │  │Analytics │  │ Calendar │  │    Settings      │    │
│  │  (Kanban │  │ (Funnel, │  │(Deadlines│  │(Profile, Resume, │    │
│  │  Cards)  │  │  Charts) │  │ Agenda)  │  │  Social Links)  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User clicks "Save to Mirae"** on a job listing page via the extension popup or right-click menu.
2. `content.js` scrapes the page (title, company, URL, description) and sends data to `background.js`.
3. `background.js` attaches the user's auth token and POSTs to `POST /api/tracker`.
4. The backend fetches the user's resume from MongoDB, sends both the job description and resume to **Gemini 2.5 Flash**.
5. Gemini returns structured JSON: `matchScore`, `matchedSkills`, `missingSkills`, `location`, `salaryRange`, `category`, `deadline`.
6. The enriched job document is saved to MongoDB and returned to the extension.
7. The React dashboard fetches and displays all jobs via authenticated API calls.

---

## ✨ Features

### 🔌 Chrome Extension
- **One-click job saving** from any job site (LinkedIn, Google Careers, Indeed, etc.)
- **Right-click context menu** — "Save to Mirae" on any page
- **Auto token sync** — logs in automatically when you sign into the dashboard
- **Smart scraping** — extracts job title, company, URL, and up to 4,000 characters of description

### 📊 Dashboard
- **Kanban pipeline** — Saved → Applied → Interviewing → Offer → Rejected
- **AI Match Score** on every job card (or "Add resume" prompt if no resume uploaded)
- **Detail drawer** — click any card to see matched/missing skills, full description, and score breakdown
- **Add Manual** — manually add opportunities, hackathons, or other entries
- **Real-time summary** — total jobs, saved, applied, interviewing, offers, rejected counts

### 📈 Analytics
- **Application Funnel** — visual breakdown of your pipeline stages
- **Final Outcomes donut chart** — Offers vs Rejected vs Active
- **Top Skills** — most frequently matched skills across all your applications
- **Status Breakdown** — per-status counts
- **Avg Match Score** — calculated only from jobs with valid AI scores

### 📅 Calendar
- **Visual calendar** with event dots for deadlines, interviews, and follow-ups
- **Click any date** for a detailed event modal
- **Weekly summary** — upcoming interviews, deadlines, and follow-ups
- **Upcoming agenda** with action buttons (Draft Email, View Prep Notes, Open Link)

### ⚙️ Settings
- **Live profile** — name and email pulled from your account (not hardcoded)
- **Theme toggle** — Light/Dark mode
- **Resume management** — upload `.txt` or `.pdf` files that sync to your AI profile
- **Social portfolio** — manage LinkedIn, GitHub, and portfolio links
- **Extension controls** — keyboard shortcuts, notification preferences

### 🔐 Security
- **JWT authentication** on every API endpoint
- **Per-user data isolation** — you only see your own jobs, never anyone else's
- **Protected routes** — frontend enforces both `isLoggedIn` flag and valid token
- **Graceful AI fallback** — jobs are saved even if Gemini fails

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, TypeScript, Framer Motion, Recharts, Radix UI |
| **Backend** | Node.js, Express.js, Mongoose, JWT, bcrypt |
| **Database** | MongoDB Atlas |
| **AI** | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| **Extension** | Chrome Manifest V3 (Service Worker, Content Script) |
| **Styling** | Tailwind CSS, Google Fonts (Playfair Display, Outfit) |

---

## 📁 Project Structure

```
Mirae/
├── src/                          # React Frontend
│   └── app/
│       ├── App.tsx               # Router + Layout
│       ├── components/
│       │   ├── Dashboard.tsx     # Main Kanban dashboard
│       │   ├── Analytics.tsx     # Charts & insights
│       │   ├── CalendarView.tsx  # Calendar & reminders
│       │   ├── Settings.tsx      # User settings
│       │   ├── ApplicationDetail.tsx  # Job detail drawer
│       │   ├── AddManualModal.tsx     # Manual job entry
│       │   ├── LoginModal.tsx    # Login form
│       │   ├── SignupModal.tsx   # Signup form
│       │   ├── Sidebar.tsx       # Navigation sidebar
│       │   ├── ProfilePopover.tsx     # Profile menu
│       │   ├── ManageResumesModal.tsx # Resume upload
│       │   ├── SocialPortfolioModal.tsx # Social links
│       │   └── ProtectedRoute.tsx     # Auth guard
│       ├── services/
│       │   ├── authService.ts         # Auth + Profile API
│       │   ├── dashboardService.ts    # Dashboard API
│       │   └── analyticsService.ts    # Analytics API
│       └── hooks/
│           └── useTheme.ts            # Theme management
│
├── Mirae-Backend/                # Node.js Backend
│   ├── server.js                 # Express entry point
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js               # User schema (name, email, resumeText, socialLinks)
│   │   └── Job.js                # Job schema (title, company, matchScore, skills, etc.)
│   ├── middlewares/
│   │   └── authMiddleware.js     # JWT verification
│   ├── controllers/
│   │   ├── trackerController.js  # AI analysis + job save
│   │   ├── profileController.js  # Profile, resume, social links
│   │   ├── dashboardController.js # Summary + recent jobs
│   │   └── analyticsController.js # Overview, status, trends
│   ├── routes/
│   │   ├── authRoutes.js         # POST /register, /login
│   │   ├── trackerRoutes.js      # POST /tracker, GET /tracker
│   │   ├── profileRoutes.js      # GET/PUT /profile
│   │   ├── dashboardRoutes.js    # GET /dashboard/summary, /recent
│   │   └── analyticsRoutes.js    # GET /analytics/overview, etc.
│   └── .env                      # Environment variables
│
├── Mirae-Extension/              # Chrome Extension (MV3)
│   ├── manifest.json             # Extension config
│   ├── background.js             # Service worker (API calls, token storage)
│   ├── content.js                # Page scraper + token sync
│   ├── popup.html                # Extension popup UI
│   └── popup.js                  # Popup button handlers
│
└── README.md                     # You are here!
```

---

## 📦 Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB Atlas** account (free tier works)
- **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Google Chrome** browser

---

## 🚀 Getting Started (For Teammates)

Follow these steps **exactly in order** after pulling the repo.

### Step 1 — Clone the Repo

```bash
git clone https://github.com/vennelajangiti17/Mirae.git
cd Mirae
```

### Step 2 — Install Frontend Dependencies

```bash
npm install
```

### Step 3 — Install Backend Dependencies

```bash
cd Mirae-Backend
npm install
```

### Step 4 — Create Your `.env` File

While still inside `Mirae-Backend/`, create a file called `.env` and paste this:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mirae?retryWrites=true&w=majority
JWT_SECRET=mirae_super_secret_key_2026
GEMINI_API_KEY=<your_gemini_api_key>
PORT=5000
```

> **How to get each value:**
> - `MONGO_URI` → Ask the team lead for the shared MongoDB Atlas connection string, or create your own free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
> - `JWT_SECRET` → Any random string. All teammates can use the same one to share sessions.
> - `GEMINI_API_KEY` → Get your own free key at [Google AI Studio](https://aistudio.google.com/app/apikey) (takes 30 seconds)

### Step 5 — Start the Backend (Terminal 1)

```bash
cd Mirae-Backend
node server.js
```

✅ You should see:
```
🌟 Mirae Backend is listening on port 5000
🔗 Health check available at http://localhost:5000/health
✅ Successfully connected to MongoDB Database!
```

> ⚠️ If you see a MongoDB connection error, double-check your `MONGO_URI` in `.env`.
> ⚠️ If you see a Gemini error, that's OK — jobs will still save, just without AI analysis.

### Step 6 — Start the Frontend (Terminal 2)

Open a **new/second terminal** (don't close the backend one):

```bash
cd Mirae
npm run dev
```

✅ You should see:
```
  VITE v6.x.x  ready in 500ms

  ➜  Local:   http://localhost:5173/
```

### Step 7 — Load the Chrome Extension

1. Open **Google Chrome**
2. Go to `chrome://extensions` in the address bar
3. Turn on **Developer mode** (toggle in the top-right corner)
4. Click **"Load unpacked"**
5. Navigate to and select the `Mirae-Extension` folder inside the project
6. You'll see "Mirae AI Tracker" appear — **pin it** to your toolbar for easy access

### Step 8 — Create Your Account

1. Open `http://localhost:5173` in Chrome
2. Click **"Sign Up"**
3. Enter your name, email, and password
4. You'll land on the Dashboard — **your token is automatically synced to the extension**

### Step 9 — (Optional) Upload Your Resume

This enables AI Match Scoring on saved jobs:

1. On the dashboard, look at the **bottom-left** of the sidebar — click your name
2. Click **"Manage Resumes"**
3. Click **"Upload Resume"** and select a `.txt` file containing your resume text
4. You'll see "✨ Resume uploaded and AI Profile updated!"

---

## 📖 Usage Guide

### Saving a Job from Any Website

1. Go to **any job listing page** — LinkedIn, Amazon Jobs, Indeed, Google Careers, Glassdoor, etc.
2. **Option A:** Click the **Mirae puzzle icon** in the Chrome toolbar → Click **"✨ Save Job to Mirae"**
3. **Option B:** **Right-click** anywhere on the page → Click **"✨ Save to Mirae"**
4. Wait 3-5 seconds for the AI to analyze the job
5. You'll see a success alert like:
   - With resume: `✨ Success! "Data Engineer" analyzed by AI and saved to Mirae with a Match Score of 78%!`
   - Without resume: `✨ Success! "Data Engineer" analyzed by AI and saved to Mirae. Upload your resume on the dashboard to get a Match Score!`
6. Go to `http://localhost:5173/dashboard` and **refresh** — your job card will appear under "Saved"

### What the AI Does Automatically

When you save a job, Gemini AI extracts:
- 🏢 **Company name** (even if the scraper can't detect it from the page HTML)
- 🛠️ **Required skills** (Python, SQL, AWS, React, etc.) — always extracted
- 📍 **Location** and 💰 **Salary range** (if mentioned)
- 📊 **Match Score** (0-100%) — only if you've uploaded a resume
- ✅ **Matched skills** — skills you have that the job wants
- ❌ **Missing skills** — skills you need to learn

### Viewing Job Details

1. Click any **job card** on the dashboard
2. A detail drawer slides in from the right showing:
   - AI Match Score circle
   - Full job description
   - Required skills (green tags = matched, red tags = missing)
   - Quick links to the original listing

### Dashboard Pages

| Page | What it shows |
|------|--------------|
| **Dashboard** | Your Kanban pipeline — Saved → Applied → Interviewing → Offer → Rejected |
| **Analytics** | Charts, funnel, top skills, avg match score, trends |
| **Calendar** | Upcoming deadlines, interviews, follow-ups |
| **Settings** | Profile info, theme toggle, resume management, social links |

### Adding Jobs Manually

1. Click **"+ Add Manual"** (top-right of dashboard)
2. Fill in the job title, company, URL, skills, etc.
3. Click **Save** — it appears on your dashboard immediately

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create a new account | ❌ |
| POST | `/api/auth/login` | Log in and receive JWT | ❌ |

### Job Tracker
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/tracker` | Save a job with AI analysis | ✅ |
| GET | `/api/tracker` | Get all jobs for the logged-in user | ✅ |

### Profile
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/profile` | Get user profile | ✅ |
| PUT | `/api/profile/resume` | Update resume text | ✅ |
| PUT | `/api/profile/social-links` | Update social links | ✅ |

### Dashboard
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/dashboard/summary` | Get status counts | ✅ |
| GET | `/api/dashboard/recent` | Get recent jobs (up to 50) | ✅ |

### Analytics
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/analytics/overview` | Get overview stats + top skills | ✅ |
| GET | `/api/analytics/status-breakdown` | Get per-status counts | ✅ |
| GET | `/api/analytics/trends` | Get daily job-saving trends | ✅ |

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/mirae` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `my_super_secret_key_123` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `PORT` | Backend server port | `5000` |

> ⚠️ **Important:** Never commit your `.env` file to version control. It's already in `.gitignore`.

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Extension says "You are not logged in" | Open `localhost:5173`, log in, then try saving again. The token syncs automatically. |
| Extension says "Extension disconnected" | Refresh the job listing page and try again. |
| Jobs saved but no match score | Upload your resume via Profile → Manage Resumes. |
| Dashboard shows nothing after saving | Hard refresh with `Ctrl + Shift + R`. |
| Backend crashes with Gemini error | Check that your `GEMINI_API_KEY` in `.env` is valid. Get a new key from [AI Studio](https://aistudio.google.com/app/apikey). |
| "Cannot read properties of null" error | Make sure you've restarted the backend after code changes. |
| CORS errors in the console | The backend is configured with `origin: true`. Make sure the backend is running on port 5000. |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Built with ❤️ by the Mirae Team
</p>
