


# Focus Sense

A minimal, distraction-aware focus timer and session tracker with a React + Vite frontend and Node.js/Express backend. Built to track focus sessions, display live session state, and provide a clean dashboard to review session summaries.

---

**Table of Contents**
- **Overview:** Short project purpose and main features
- **Architecture:** Frontend and backend outline
- **Getting Started:** Install, run, and environment variables
- **Project Structure:** High-level file map
- **API:** Main endpoints
- **Contributing:** How to help
- **Next Steps & Ideas:** Suggested improvements

---

**Overview**: Focus Sense is a lightweight productivity app to help users start timed focus sessions, monitor session state live, and review summaries. It focuses on clarity and simplicity so you can integrate it into a personal workflow or extend it with persistence, authentication, or analytics.

**Main Features**
- Start/stop focus sessions with a responsive UI
- Live session state indicators and stats
- Dashboard for reviewing session summaries
- Clear separation between frontend (UI) and backend (API)

**Architecture**
- Frontend: React + Vite, Tailwind CSS for styling. Core UI lives in the `frontend/src` folder.
- Backend: Node.js + Express API that serves session data. Minimal data model in `backend/src/models` and controllers under `backend/src/controllers`.

**Tech Stack**
- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Dev tools: ESLint, PostCSS

**Getting Started (development)**
Prerequisites:
- Node.js (16+ recommended)
- Git

1. Clone the repo and install dependencies for each side.

Backend:
```bash
cd backend
npm install
```
Create a `.env` in `backend/` (sample env variables below) and run the API:
```bash
# from backend/
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite dev URL (usually `http://localhost:5173`) to view the app.

**Environment Variables (backend)**
- `PORT` — server port (default 3000)
- Any DB connection string if you integrate persistence (look to `backend/src/config/db.js`)

**Project Structure (high-level)**
- `backend/`
  - `src/index.js` — API server entry
  - `src/routes/session.routes.js` — session routes
  - `src/controllers/session.controller.js` — handler logic
  - `src/models/Session.model.js` — session model
  - `src/config/db.js` — DB connection helper
- `frontend/`
  - `src/main.jsx` — app entry
  - `src/App.jsx` — root component
  - `src/components/` — UI components (`Timer.jsx`, `FocusStatus.jsx`, `Toast.jsx`, etc.)
  - `src/pages/` — page views (Dashboard, FocusSession, Summary, Landing)

**API (quick reference)**
- POST /sessions — create/start a session
- PATCH /sessions/:id — update/stop a session
- GET /sessions — list sessions
(See `backend/src/routes/session.routes.js` for exact route signatures.)

**Development Notes**
- The frontend is pure client-side and communicates with the backend API.
- The backend currently uses a minimal model for sessions; persistence can be added via `backend/src/config/db.js`.

**Contributing**
- Fork the repo or create a branch from `main`.
- Follow code style in each area (frontend uses ESLint + Tailwind patterns).
- Open PRs with a clear summary and test steps.

**Next Steps & Ideas**
- Add persistent storage (Postgres / MongoDB) and wire `backend/src/config/db.js` to a real datastore.
- Add authentication so sessions are per-user.
- Add tests (Jest / React Testing Library) and CI pipeline.
- Add screenshots or a short demo GIF to the README for visual appeal.

---

If you'd like, I can:
- Add a sample `.env.example` to `backend/`.
- Wire a simple in-memory persistence to illustrate API usage.
- Add a demo screenshot and refine wording for a public README.

Enjoy experimenting with Focus Sense — tell me which next step you want and I’ll implement it.
