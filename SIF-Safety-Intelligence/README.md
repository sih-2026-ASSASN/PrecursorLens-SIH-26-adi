# PrecursorLens

**SIH Problem Statement 26165** — AI/NLP detection of Serious Injury and Fatality (SIF)
precursors in Oil India Limited unsafe-act, unsafe-condition and near-miss reports.

Report intake → FastAPI → **real AI/NLP engine** → MongoDB → dashboard, reports, analytics,
site risk, failure analysis, safety reviews and alerts. Every number and chart comes only from
reports you submit/import and the engine's real analysis of them. The app starts **empty** —
no demo data is ever inserted automatically.

## Prerequisites

- Python 3.11+ · Node.js 18+ · **MongoDB 7.0 Community Server** running on `localhost:27017`
  (free: https://www.mongodb.com/try/download/community — choose *Complete*, keep "Install as a Service")

## 1. MongoDB

Windows (PowerShell/CMD): confirm the service is running — `sc query MongoDB` should say `RUNNING`
(start it once from an **Administrator** terminal with `net start MongoDB`).
Docker alternative: `docker run -d --name precursorlens-mongo -p 27017:27017 mongo:7`

## 2. Backend (terminal 1)

```
cd backend
python -m venv .venv
.venv\Scripts\activate            (macOS/Linux: source .venv/bin/activate)
pip install -r requirements.txt
copy .env.example .env            (macOS/Linux: cp .env.example .env)
uvicorn app.main:app --reload
```

Backend: http://localhost:8000 (API docs `/docs`). Check http://localhost:8000/api/status —
it must show `"mongodb": {"connected": true ...}` and `"ai_engine": {"active": true ...}`.

## 3. Frontend (terminal 2)

```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The top bar shows **AI/NLP Engine Active** when the backend, MongoDB and
the engine are all healthy (otherwise it shows what is wrong).

## Using it

**Report Intake** → submit a text report, or import `data/sample/sample_reports.csv` / `.json`
(optional examples — never loaded automatically). Each report is analyzed by the engine and stored in
MongoDB. HIGH/CRITICAL results create alerts, shown under the bell (top right) and on the Alerts page.
Reports and Safety Reviews are ordered CRITICAL → HIGH → MEDIUM → LOW (newest first within a level) and
can be filtered by risk level.

## Configuration (`backend/.env`)

| Variable | Default | Purpose |
|---|---|---|
| `MONGODB_URL` | `mongodb://localhost:27017` | MongoDB connection string |
| `MONGODB_DATABASE` | `precursorlens` | database name |
| `CORS_ORIGINS` | `http://localhost:5173` | allowed frontend origin(s) |
| `APP_ENV` | `development` | environment label |

Frontend: `VITE_API_BASE_URL` in `frontend/.env` (default `http://localhost:8000`).

## Tests

```
cd backend
pip install -r requirements-dev.txt
pytest
```
Tests need a running MongoDB and use a separate database, `precursorlens_test` (dropped between tests);
your real data is never touched. Frontend production build: `cd frontend && npm run build`.

## Docker (optional)

`docker compose up --build` starts MongoDB, backend and frontend together.

## Where things are

- AI engine: `backend/app/ai/engine/predict.py` (`analyze_report`) + `sif_model.joblib` — used unmodified
- Adapter: `backend/app/ai/client.py` (+ `response_mapper.py`); the frontend never calls the engine
- MongoDB layer: `backend/app/database/connection.py`, `backend/app/services/report_service.py`
- Status endpoint: `GET /api/status`

## Troubleshooting

- **503 "MongoDB is unavailable"** — MongoDB isn't running or `MONGODB_URL` is wrong. There is no fallback data by design.
- **502 "AI/NLP engine failed"** — the engine raised an error; nothing was saved. Check the backend terminal.
- **`net start MongoDB`: Access is denied** — open the terminal as Administrator (needed once).
- **Empty dashboard** — expected on a new database; submit or import reports.

*Prototype — AI output is an indicator that requires human safety review, not a certified safety determination.*
