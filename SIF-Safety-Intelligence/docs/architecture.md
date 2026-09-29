# PrecursorLens — Architecture

SIH PS 26165 — AI/NLP engine to detect Serious Injury and Fatality (SIF)
precursors in Oil India Limited unsafe act, unsafe condition and near-miss
reports.

This document covers the **frontend + backend scope** (the AI/NLP model
itself is owned by another team and connects through the integration layer
described below).

## High-level flow

```
React Frontend (Vite, Tailwind, Recharts)
        │  REST/JSON over HTTPS
        ▼
FastAPI Backend (Python)
        │  normalized report dict
        ▼
AI/NLP Integration Layer (app/ai/client.py)
        │  swap this file only
        ▼
AI/NLP Engine (owned by AI/NLP team, not built here)
```

The frontend **never** talks to the AI engine directly — everything flows
through the FastAPI backend's `/api/analysis/*` routes, which call
`app/ai/client.py::analyze_report()`.

## Backend layers

- `app/api/` — FastAPI routers (HTTP layer only, no business logic)
- `app/services/` — business logic; `report_service.py` reads/writes MongoDB (pymongo)
- `app/ingestion/` — text/CSV/JSON parsing, validation, normalization
- `app/ai/` — the integration boundary with the AI/NLP engine
- `app/analytics/` — pure computation functions over report data
- `app/database/` — MongoDB connection, Pydantic schemas, dataclass models (one per collection)

## Storage: MongoDB

`app/services/report_service.py` persists everything in MongoDB (database
`MONGODB_DATABASE`, server `MONGODB_URL`): collections `reports`, `analyses`,
`reviews`, `alerts` and `counters` (auto-increment integer ids, so API ids are
unchanged). There is no in-memory copy and no fallback: if MongoDB is down the
API answers HTTP 503. The app never inserts demo data; every dashboard number,
chart, trend and heatmap is computed from the stored reports and their stored
AI analyses (`app/analytics/`).

## Normalized report format

Every ingestion path (text form, CSV upload, JSON upload) converges on:

```json
{
  "report_type": "Near Miss",
  "location": "Drilling Site A",
  "department": "Operations",
  "description": "Worker entered vessel without gas testing",
  "source_format": "csv",
  "submitted_at": "2026-09-01T10:00:00+00:00"
}
```

## AI/NLP integration

Flow: report intake -> FastAPI -> `app/ai/client.py::analyze_report()` (adapter)
-> real engine `app/ai/engine/predict.py::analyze_report(text, site)` (TF-IDF +
LogisticRegression model `sif_model.joblib`, plus hazard/barrier/Life-Saving-Rule
rules) -> `response_mapper.py` -> MongoDB. The engine is used exactly as
delivered; the adapter only maps its output to the `Analysis` shape and derives
the risk level from the engine's score (>=85 CRITICAL, >=65 HIGH, >=35 MEDIUM).
If the engine raises, the API returns HTTP 502 and stores nothing.
`GET /api/status` reports live MongoDB connectivity and engine status.
