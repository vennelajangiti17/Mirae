<p align="center">
  <img src="mirae-logo.svg" alt="Mirae Logo" width="120" />
</p>

<h1 align="center">Mirae - AI-Powered Career Command Center</h1>

<p align="center">
  <strong>Save opportunities fast, understand them with AI, and track them in one calm workspace.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/AI-Groq%20Llama%203.3-FF6B35" />
  <img src="https://img.shields.io/badge/Extension-Chrome%20MV3-4285F4?logo=googlechrome&logoColor=white" />
</p>

## Overview

Mirae is a full-stack opportunity tracker built around three working pieces:

- a React dashboard for browsing, filtering, and managing saved opportunities
- an Express + MongoDB backend for auth, profile, AI enrichment, analytics, and persistence
- a Chrome extension that clips pages and sends raw content to the backend

The current product supports:

- `Jobs` tracking with full analytics and a detailed side drawer
- `Hackathons/Contests` tracking with saved and registered sections plus a dedicated side panel
- `Others` tracking for workshops, webinars, sessions, fellowships, scholarships, and similar pages
- JWT auth, profile management, resume upload, and social link management
- card deletion from both the dashboard UI and MongoDB

## Current Product Flow

1. A user logs into the Mirae dashboard.
2. The dashboard syncs the JWT token to the Chrome extension.
3. The extension scrapes visible page text and sends it to `POST /api/tracker`.
4. The backend loads the user's resume text, sends the page content to Groq, and extracts:
   - title
   - company
   - description
   - location
   - posted date
   - salary
   - deadline
   - category
   - skills
   - match score
5. The backend normalizes categories into:
   - `Jobs`
   - `Hackathons`
   - `Others`
6. The enriched record is saved in MongoDB with the logged-in user's `userId`.
7. The dashboard loads the latest saved items and splits them by category and status.

## Features

### Dashboard

- Jobs tab with sections for `Saved`, `Applied / Interviewing`, `Offers`, and `Rejected`
- Hackathons/Contests tab with sections for `Saved` and `Registered`
- Others tab with a `Saved` section
- card-level delete menu that removes records from the UI and database
- manual add flow for opportunities
- top summary bar that changes based on the active tab

### Detail Panels

- Jobs open a full `ApplicationDetail` drawer with skill analysis, description, score, and status controls
- Hackathons/Contests and Others open an `OpportunityDetail` drawer with:
  - organizer
  - deadline
  - location
  - status
  - description
  - original source link

### Analytics

- Analytics & Insights is currently scoped to `Jobs` only
- includes:
  - saved / applied / rejected / offers cards
  - application funnel
  - status breakdown
  - final outcomes chart
  - top skills
- Hackathons/Contests and Others do not affect analytics calculations

### Account and Profile

- register and login with JWT
- protected routes on the frontend
- profile fetch for logged-in user
- resume upload and delete
- social portfolio link management
- logout flow with confirmation

### Chrome Extension

- right-click `Save to Mirae` context menu
- page text scraping via content script
- token sync from dashboard to extension
- background worker posts clipped content to the backend

### Calendar

- the calendar screen exists in the frontend and is currently a UI-rich mock view
- it is not yet wired to a live backend route in the running server

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- Motion
- Recharts
- Radix UI
- Lucide React

### Backend

- Node.js
- Express
- Mongoose
- JWT
- bcrypt
- multer
- pdf-parse

### AI and Data

- Groq SDK with `llama-3.3-70b-versatile` for extraction and enrichment
- MongoDB Atlas for persistence

## Project Structure

```text
Mirae/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── CalendarView.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── ApplicationDetail.tsx
│   │   │   ├── OpportunityDetail.tsx
│   │   │   ├── AddManualModal.tsx
│   │   │   ├── ManageResumesModal.tsx
│   │   │   ├── LoginModal.tsx
│   │   │   ├── SignupModal.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── dashboardService.ts
│   │   │   ├── analyticsService.ts
│   │   │   ├── profileService.ts
│   │   │   ├── trackerService.ts
│   │   │   └── settingsService.ts
│   │   └── types/
│   └── styles/
├── Mirae-Backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── profileController.js
│   │   ├── trackerController.js
│   │   └── settingsController.js
│   ├── middlewares/authMiddleware.js
│   ├── models/
│   │   ├── Job.js
│   │   ├── User.js
│   │   └── CalendarEvent.js
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── trackerRoutes.js
│   │   └── settingsRoutes.js
│   └── server.js
├── Mirae-Extension/
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   └── popup.js
└── README.md
```

## Backend Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Profile

- `GET /api/profile`
- `POST /api/profile/resume/upload`
- `PUT /api/profile/resume`
- `DELETE /api/profile/resume`
- `PUT /api/profile/social-links`

### Tracker

- `POST /api/tracker`
- `GET /api/tracker`
- `DELETE /api/tracker/:id`

### Dashboard

- `GET /api/dashboard/summary`
- `GET /api/dashboard/recent`

### Analytics

- `GET /api/analytics/overview`
- `GET /api/analytics/status-breakdown`
- `GET /api/analytics/trends`

## Environment Variables

Create `Mirae-Backend/.env` with:

```env
MONGO_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<your_jwt_secret>
GROQ_API_KEY=<your_groq_api_key>
PORT=5000
```

Notes:

- `GROQ_API_KEY` is required for the tracker analysis flow
- the backend package still includes `@google/generative-ai`, but the current tracker pipeline uses Groq
- frontend services expect the backend on `http://localhost:5000`

## Local Setup

### 1. Install frontend dependencies

```bash
cd /Users/vennelajangiti17/Documents/Mirae
npm install
```

### 2. Install backend dependencies

```bash
cd /Users/vennelajangiti17/Documents/Mirae/Mirae-Backend
npm install
```

### 3. Start the backend

```bash
cd /Users/vennelajangiti17/Documents/Mirae/Mirae-Backend
node server.js
```

### 4. Start the frontend

```bash
cd /Users/vennelajangiti17/Documents/Mirae
npm run dev
```

### 5. Load the extension in Chrome

1. Open `chrome://extensions`
2. Turn on Developer Mode
3. Click `Load unpacked`
4. Select `Mirae-Extension`

## Current Notes and Caveats

- Analytics is intentionally Jobs-only
- the calendar page is currently mock data in the frontend
- category normalization now tries to route all non-job, non-hackathon pages into `Others`
- deadline extraction depends on deadline text being present in the scraped page content
- existing bad records in MongoDB do not auto-fix when classification logic changes

## Team Notes

- pull latest `main` before running the app locally
- if backend dependencies change, rerun `npm install` inside `Mirae-Backend`
- if the extension saves fail, check:
  - dashboard login state
  - token sync
  - backend server running on port `5000`
  - `GROQ_API_KEY` present in `Mirae-Backend/.env`
