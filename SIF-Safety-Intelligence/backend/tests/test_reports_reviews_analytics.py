import statistics

from app.database import connection
from tests.conftest import text_report, CRITICAL_TXT, HIGH_TXT, MEDIUM_TXT, LOW_TXT

RANK = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}


def _seed_via_api(client):
    """Submit reports through the real pipeline, deliberately out of risk and date order."""
    rows = [
        (LOW_TXT, "2026-05-01T08:00:00+00:00"), (HIGH_TXT, "2026-03-01T08:00:00+00:00"),
        (CRITICAL_TXT, "2026-01-01T08:00:00+00:00"), (MEDIUM_TXT, "2026-04-01T08:00:00+00:00"),
        (CRITICAL_TXT, "2026-06-01T08:00:00+00:00"), (LOW_TXT, "2026-02-01T08:00:00+00:00"),
    ]
    import json
    data = [{**text_report(t, location=f"Loc {i % 3}", department=f"Dept {i % 2}"), "submitted_at": ts} for i, (t, ts) in enumerate(rows)]
    r = client.post("/api/ingestion/json", files={"file": ("r.json", json.dumps(data).encode(), "application/json")})
    assert r.status_code == 200


def test_reports_sorted_critical_high_medium_low_newest_first(client):
    _seed_via_api(client)
    items = client.get("/api/reports").json()["items"]
    assert [i["risk_level"] for i in items] == ["CRITICAL", "CRITICAL", "HIGH", "MEDIUM", "LOW", "LOW"]
    assert [i["submitted_at"][:7] for i in items] == ["2026-06", "2026-01", "2026-03", "2026-04", "2026-05", "2026-02"]


def test_report_risk_filters_and_existing_filters(client):
    _seed_via_api(client)
    for level, n in [("CRITICAL", 2), ("HIGH", 1), ("MEDIUM", 1), ("LOW", 2)]:
        items = client.get("/api/reports", params={"risk_level": level}).json()["items"]
        assert len(items) == n and all(i["risk_level"] == level for i in items)
    assert client.get("/api/reports", params={"location": "loc 1"}).json()["total"] == 2
    assert client.get("/api/reports", params={"department": "dept 0"}).json()["total"] == 3
    assert client.get("/api/reports", params={"report_type": "Near Miss"}).json()["total"] == 6
    assert client.get("/api/reports", params={"report_type": "Unsafe Act"}).json()["total"] == 0
    assert client.get("/api/reports", params={"search": "hot work"}).json()["total"] == 2
    assert client.get("/api/reports", params={"risk_level": "CRITICAL", "search": "vessel"}).json()["total"] == 0


def test_reviews_sorted_and_filterable_by_risk(client):
    _seed_via_api(client)
    items = client.get("/api/reviews").json()["items"]
    assert [i["risk_level"] for i in items] == ["CRITICAL", "CRITICAL", "HIGH", "MEDIUM", "LOW", "LOW"]
    reports = {r["id"]: r for r in client.get("/api/reports").json()["items"]}
    crit = [reports[i["report_id"]]["submitted_at"][:7] for i in items[:2]]
    assert crit == ["2026-06", "2026-01"]
    high_only = client.get("/api/reviews", params={"risk_level": "HIGH"}).json()["items"]
    assert len(high_only) == 1 and high_only[0]["risk_level"] == "HIGH"


def test_human_review_still_works_and_persists(client):
    _seed_via_api(client)
    rev = client.get("/api/reviews").json()["items"][0]
    res = client.put(f"/api/reviews/{rev['id']}", json={"status": "Confirmed", "comment": "Verified on site"})
    assert res.status_code == 200 and res.json()["status"] == "Confirmed"
    assert client.get(f"/api/reviews/{rev['id']}").json()["comment"] == "Verified on site"
    assert client.get(f"/api/reports/{rev['report_id']}").json()["review_status"] == "Reviewed"
    assert client.put("/api/reviews/99999", json={"status": "Confirmed", "comment": ""}).status_code == 404


def test_dashboard_and_analytics_match_mongodb(client):
    _seed_via_api(client)
    db = connection.get_db()
    analyses = list(db["analyses"].find({}))
    reports = list(db["reports"].find({}))
    o = client.get("/api/analytics/overview").json()
    assert o["total_reports"] == len(reports) == 6
    assert o["sif_precursors"] == sum(1 for r in reports if r["sif_detected"])
    assert o["high_critical_reports"] == sum(1 for r in reports if r["risk_level"] in ("HIGH", "CRITICAL")) == 3
    assert o["active_alerts"] == db["alerts"].count_documents({"status": "Open"}) == 3
    assert o["reviewed_reports"] == db["reports"].count_documents({"review_status": "Reviewed"}) == 0
    assert o["site_risk_index"] == round(statistics.mean(a["risk_score"] for a in analyses))
    assert o["avg_ai_confidence"] == round(statistics.mean(a["confidence"] for a in analyses), 4)
    assert {d["name"]: d["value"] for d in o["risk_distribution"]} == {"CRITICAL": 2, "HIGH": 1, "MEDIUM": 1, "LOW": 2}
    haz = {d["name"]: d["value"] for d in client.get("/api/analytics/hazards").json()["data"]}
    expected = {}
    for a in analyses:
        for h in a["hazards"]:
            expected[h] = expected.get(h, 0) + 1
    assert haz == expected
    trend = {d["period"]: d["risk"] for d in client.get("/api/analytics/risk-trends").json()["data"]}
    by_month = {}
    for r in reports:
        by_month.setdefault(r["submitted_at"][:7], []).append(next(a["risk_score"] for a in analyses if a["report_id"] == r["id"]))
    assert trend == {k: round(statistics.mean(v)) for k, v in by_month.items()}


def test_heatmap_is_computed_from_stored_reports_and_analyses(client):
    _seed_via_api(client)
    db = connection.get_db()
    score = {a["report_id"]: a for a in db["analyses"].find({})}
    heat = client.get("/api/analytics/locations").json()["heatmap"]
    assert set(heat["rows"]) == {r["location"] for r in db["reports"].find({})}
    assert "Ignition Source" in heat["cols"] and "No hazard detected" in heat["cols"]
    for ri, loc in enumerate(heat["rows"]):
        for ci, col in enumerate(heat["cols"]):
            vals = [score[r["id"]]["risk_score"] for r in db["reports"].find({"location": loc})
                    if col in (score[r["id"]]["hazards"] or ["No hazard detected"])]
            if vals:
                assert heat["matrix"][ri][ci] == round(statistics.mean(vals)) and heat["counts"][ri][ci] == len(vals)
            else:
                assert heat["matrix"][ri][ci] is None and heat["counts"][ri][ci] == 0
    assert client.get("/api/analytics/locations").json() == client.get("/api/analytics/locations").json()  # deterministic


def test_report_detail_and_404(client):
    _seed_via_api(client)
    assert client.get("/api/reports/1").status_code == 200
    assert client.get("/api/reports/999999").status_code == 404
    assert client.get("/api/analysis/999999").status_code == 404
    assert client.get("/api/alerts/999999").status_code == 404


def test_no_random_or_seed_code_in_backend():
    import pathlib
    root = pathlib.Path(__file__).resolve().parents[1] / "app"
    for p in root.rglob("*.py"):
        src = p.read_text(encoding="utf-8")
        assert "import random" not in src and "random." not in src, p
        assert "seed_demo_data" not in src, p
