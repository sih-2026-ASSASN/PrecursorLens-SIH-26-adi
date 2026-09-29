from app.database import connection


def test_fresh_database_starts_empty_no_seed(client):
    assert client.get("/api/reports").json() == {"items": [], "total": 0}
    assert client.get("/api/alerts").json()["total"] == 0
    assert client.get("/api/reviews").json()["total"] == 0
    assert client.get("/api/analysis").json() == []
    db = connection.get_db()
    assert all(db[c].count_documents({}) == 0 for c in ("reports", "analyses", "reviews", "alerts"))


def test_empty_analytics_are_zero_or_empty(client):
    o = client.get("/api/analytics/overview").json()
    assert o["total_reports"] == 0 and o["sif_precursors"] == 0 and o["high_critical_reports"] == 0
    assert o["active_alerts"] == 0 and o["site_risk_index"] == 0 and o["site_risk_level"] is None
    assert o["avg_ai_confidence"] is None and o["risk_distribution"] == [] and o["report_type_distribution"] == []
    assert client.get("/api/analytics/risk-trends").json()["data"] == []
    assert client.get("/api/analytics/hazards").json()["data"] == []
    heat = client.get("/api/analytics/locations").json()["heatmap"]
    assert heat["rows"] == [] and heat["cols"] == [] and heat["matrix"] == []
    assert client.get("/api/failures").json()["categories"] == []


def test_health(client):
    r = client.get("/api/health")
    assert r.status_code == 200 and r.json()["status"] == "ok"


def test_status_reports_real_mongodb_and_ai_engine(client):
    s = client.get("/api/status").json()
    assert s["status"] == "ok"
    assert s["mongodb"]["connected"] is True and s["mongodb"]["database"] == "precursorlens_test"
    assert s["mongodb"]["server_version"]
    assert s["ai_engine"]["active"] is True and s["ai_engine"]["model_loaded"] is True
    assert s["ai_engine"]["entry_point"] == "app.ai.engine.predict.analyze_report"


def test_mongodb_down_gives_503_not_fake_data(client):
    from pymongo import MongoClient
    connection._client = MongoClient("mongodb://127.0.0.1:1", serverSelectionTimeoutMS=300)
    assert client.get("/api/reports").status_code == 503
    assert client.get("/api/analytics/overview").status_code == 503
    s = client.get("/api/status").json()
    assert s["status"] == "degraded" and s["mongodb"]["connected"] is False
