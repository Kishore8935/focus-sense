# 🎯 Focus Sense

**Focus Sense** is a distraction-aware focus timer and session tracking web application built with **React + Vite** on the frontend and **Node.js / Express** on the backend.  
It helps users **start focus sessions, monitor attention in real time, and review session summaries** through a clean and minimal interface.

> Designed with clarity, extensibility, and real-world usage in mind.

---


## 📌 Table of Contents
- 🔍 Overview  
- 🧠 Key Features  
- 🏗️ Architecture  
- 🧰 Tech Stack  
- 🚀 Getting Started  
- 🗂️ Project Structure  
- 🔌 API Reference  
- 🛠️ Development Notes  
- 🤝 Contributing  
- 🔮 Next Steps & Ideas  

---

## 🔍 Overview

**Focus Sense** is a lightweight productivity application that helps users:
- Start and manage timed focus sessions  
- Monitor session status in real time  
- Review session summaries via a clean dashboard  

The project prioritizes **clarity, modularity, and scalability**, making it suitable for personal productivity workflows or as a foundation for more advanced analytics-driven focus tools.

---

## 🧠 Key Features

✔️ Start / stop focus sessions with a responsive UI  
✔️ Live session state indicators and statistics  
✔️ Dashboard view for reviewing past sessions  
✔️ Clear separation of concerns (Frontend UI ↔ Backend API)  
✔️ Easy to extend with persistence, auth, or analytics  

---
## 📸 Screenshots & Demo

<img width="1800" height="1000" alt="image" src="https://github.com/user-attachments/assets/f651110f-9de2-476f-a92d-8ef340da0219" />
<img width="1888" height="1057" alt="image" src="https://github.com/user-attachments/assets/1c4b1fba-76d5-49ec-86b4-1505083efb89" />
<img width="1888" height="1064" alt="image" src="https://github.com/user-attachments/assets/9a17c9fa-0078-4e97-9cd7-112f2d2aa400" />
<img width="1891" height="1070" alt="image" src="https://github.com/user-attachments/assets/3aa4f2f1-efb3-4cd5-81d1-56e952d53199" />
<img width="1084" height="946" alt="image" src="https://github.com/user-attachments/assets/896d74d6-eab5-4a26-8482-b805e7f0fa47" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/b7cdbe2f-5f34-4ac8-8442-76e714405be9" />
<img width="1895" height="1001" alt="image" src="https://github.com/user-attachments/assets/606f6e64-2e96-426e-901f-829f29d9916d" />


## 🏗️ Architecture

```
Client (React + Vite)
        ↓
 REST API (Node.js + Express)
        ↓
 Session Logic (Controllers & Models)
```

- **Frontend** handles UI, timers, and state visualization  
- **Backend** exposes REST endpoints for session lifecycle management  

---

## 🔒 Privacy & Data Usage

Your privacy comes first. Focus Sense is built with privacy-by-design.

**📹 Webcam Usage**

- Webcam is used only to detect on-screen focus during a session

- All processing happens locally in your browser

- ❌ No video, images, or frames are recorded, stored, or transmitted

**🌐 Website & YouTube Tracking**

- Activity categorization runs locally via a browser extension

- ❌ No URLs, page content, browsing history, or video titles are stored

- ✅ Only aggregated time spent on productive vs distracting categories is saved

**💾 Data We Store**

- Total focused time

- Total distracted time

- Session duration

- Aggregated productivity statistics

**🚫 Data We Do NOT Collect**

- Webcam images or video

- Exact websites or URLs

- YouTube watch history or titles

- Personal messages or private content

**⚙️ User Control**

- All tracking features are optional

- Webcam and website tracking can be paused or disabled anytime

**🛡️ 100% Local Processing**

- Face detection and focus analysis run entirely on your device

- No raw data leaves your computer

## 🧰 Tech Stack

### 🎨 Frontend
- React  
- Vite  
- Tailwind CSS  

### ⚙️ Backend
- Node.js  
- Express.js  

### 🛠️ Dev & Tooling
- ESLint  
- PostCSS  
- Git  

---

## 🚀 Getting Started (Development)

### ✅ Prerequisites
- Node.js v16+  
- Git  

---

### 🔧 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` and start the server:

```bash
npm run dev
```

---

### 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open the Vite dev server (usually):
```
http://localhost:5173
```

---

## 🔐 Environment Variables (Backend)

```env
PORT=3000
# Add DB connection string here if persistence is enabled
```

Persistence hooks are prepared in:
`backend/src/config/db.js`

---

## 🗂️ Project Structure (High-Level)

```
backend/
 ├─ src/
 │  ├─ index.js
 │  ├─ routes/
 │  │   └─ session.routes.js
 │  ├─ controllers/
 │  │   └─ session.controller.js
 │  ├─ models/
 │  │   └─ Session.model.js
 │  └─ config/
 │      └─ db.js
frontend/
 ├─ src/
 │  ├─ main.jsx
 │  ├─ App.jsx
 │  ├─ components/
 │  └─ pages/
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|------|---------|------------|
| POST | /sessions | Start a focus session |
| PATCH | /sessions/:id | Update / stop session |
| GET | /sessions | Fetch all sessions |

Full definitions available in:
`backend/src/routes/session.routes.js`

---

## 🛠️ Development Notes

- Frontend is pure client-side and communicates via REST API  
- Backend uses a minimal session model  
- Persistence, authentication, and analytics can be added without refactoring core logic  

---

## 🤝 Contributing

1. Fork the repository or create a feature branch  
2. Follow existing code style and folder conventions  
3. Submit a PR with a clear summary and test steps  

---

## 🔮 Next Steps & Ideas

✨ Add persistent storage (Postgres / MongoDB)  
✨ Introduce authentication for per-user sessions  
✨ Add automated testing (Jest / React Testing Library)  
✨ CI pipeline (GitHub Actions)  
✨ Demo GIF or screenshots  
✨ Advanced analytics (focus score, trends)

---

Built as a clean, extensible productivity tool and portfolio-ready full‑stack project.

