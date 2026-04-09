# Poseidon Guardian

Poseidon Guardian is organized as a multi-language project with:

- **Frontend**: React + Vite (TypeScript)
- **Backend (JS)**: Express API server
- **Backend (Python)**: Reserved workspace for future Python services/scripts

## Component Status

- ✅ `frontend/` - active and runnable
- ✅ `backend/js/` - active and runnable
- 🚧 `backend/python/` - scaffolded workspace (not implemented/runnable yet)
- 📦 `docs/legacy-static-demo.html` - legacy static prototype kept for reference

## Repository Structure

```text
.
├── backend/
│   ├── js/
│   │   ├── package.json
│   │   └── src/
│   │       └── server.js
│   └── python/
│       └── README.md
├── docs/
│   └── legacy-static-demo.html
├── frontend/
│   ├── package.json
│   ├── src/
│   └── ...
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 18+
- npm
- Python 3.10+ (for future Python backend work)

## Quick Start

### 1) Install frontend dependencies

```bash
cd frontend
npm install
```

### 2) Install JS backend dependencies

```bash
cd backend/js
npm install
```

### 3) Run frontend (dev server)

```bash
cd frontend
npm run dev
```

### 4) Run JS backend API

```bash
cd backend/js
npm start
```

Backend runs on `http://localhost:3001` and serves frontend build files from `frontend/dist` when available.

## Environment Variables

- Frontend: copy `frontend/.env.example` and set needed values (e.g., API keys)
- Backend: configure model endpoint values directly in `backend/js/src/server.js` or move to env vars later

## Python Backend Workspace

Use `backend/python/` for Python utilities, scripts, or services.
This workspace is currently a scaffold and does not yet include an implemented service.

Recommended setup:

```bash
cd backend/python
python -m venv .venv
source .venv/bin/activate
```

## Notes

- Root `.gitignore` includes both **Node/JS** and **Python** artifacts.
- Keep dependency installs local to each package (`frontend/`, `backend/js/`, and future Python projects).
- The previous single-file static UI is preserved at `docs/legacy-static-demo.html` for reference.

