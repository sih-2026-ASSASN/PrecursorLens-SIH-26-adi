# PrecursorLens — Data Format

## Normalized report

Every report — regardless of how it entered the system — is stored in this
shape:

```json
{
  "report_type": "Near Miss | Unsafe Act | Unsafe Condition",
  "location": "string",
  "department": "string",
  "description": "string",
  "source_format": "text | csv | json",
  "submitted_at": "ISO-8601 timestamp"
}
```

## CSV upload format

Header row required, one report per row:

```
report_type,location,department,description
Near Miss,Drilling Site A,Operations,Worker entered vessel without gas testing
```

## JSON upload format

A single object or an array of objects, each matching the fields above
(minus `source_format`/`submitted_at`, which the backend fills in):

```json
[
  { "report_type": "Near Miss", "location": "Drilling Site A", "department": "Operations", "description": "..." }
]
```

## Mock AI analysis response shape

Returned by `app/ai/client.py::analyze_report()` and displayed on the
AI Analysis page:

```json
{
  "sif_detected": true,
  "risk_level": "HIGH",
  "risk_score": 91,
  "confidence": 0.94,
  "precursors": ["Confined Space", "No Gas Testing"],
  "hazards": ["Atmospheric Hazard"],
  "control_gaps": ["Atmospheric Testing", "Standby Attendant"],
  "evidence": ["..."],
  "recommendations": ["..."]
}
```
