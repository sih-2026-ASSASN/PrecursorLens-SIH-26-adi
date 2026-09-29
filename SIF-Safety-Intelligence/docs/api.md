# PrecursorLens — API Reference

Base URL (dev): `http://localhost:8000`

All responses are JSON. Interactive docs available at `/docs` (Swagger UI)
once the backend is running.

## Ingestion
| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/api/ingestion/text` | `{report_type, location, department, description}` | Submit one manually entered report |
| POST | `/api/ingestion/csv` | multipart file | Upload a CSV of reports |
| POST | `/api/ingestion/json` | multipart file | Upload a JSON file/array of reports |

## Reports
| Method | Path | Description |
|---|---|---|
| GET | `/api/reports` | List reports, sorted CRITICAL > HIGH > MEDIUM > LOW, newest first within a level. Query params: `report_type`, `department`, `location`, `risk_level`, `search` |
| GET | `/api/reports/{id}` | Get one report |

## Analysis
| Method | Path | Description |
|---|---|---|
| GET | `/api/analysis` | List all analyses |
| GET | `/api/analysis/{report_id}` | Get AI analysis for a report |

## Analytics
| Method | Path |
|---|---|
| GET | `/api/analytics/overview` |
| GET | `/api/analytics/risk-trends` |
| GET | `/api/analytics/sif-trends` |
| GET | `/api/analytics/hazards` |
| GET | `/api/analytics/departments` |
| GET | `/api/analytics/locations` |
| GET | `/api/analytics/control-gaps` |

## Risk
| Method | Path |
|---|---|
| GET | `/api/risk/overall` |
| GET | `/api/risk/locations` |
| GET | `/api/risk/departments` |

## Failures
| Method | Path |
|---|---|
| GET | `/api/failures` |
| GET | `/api/failures/trends` |
| GET | `/api/failures/control-gaps` |

## Reviews
| Method | Path | Body |
|---|---|---|
| GET | `/api/reviews?risk_level=` | — (same risk ordering; optional `risk_level` filter) |
| GET | `/api/reviews/{id}` | — |
| PUT | `/api/reviews/{id}` | `{status, comment}` |

## Alerts
| Method | Path |
|---|---|
| GET | `/api/alerts` |
| GET | `/api/alerts/{id}` |

## System
| Method | Path |
|---|---|
| GET | `/api/health` |
| GET | `/api/status` (live MongoDB + AI engine status) |
