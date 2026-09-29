import io
import json

from app.ai.engine import predict
from app.database import connection
from tests.conftest import text_report, CRITICAL_TXT, HIGH_TXT, MEDIUM_TXT, LOW_TXT


def test_text_report_goes_through_real_engine_and_is_stored_in_mongodb(client):
    res = client.post("/api/ingestion/text", json=text_report(HIGH_TXT, location="Tank Farm 1"))
    assert res.status_code == 200
    rid = res.json()["id"]

    raw = predict.analyze_report(HIGH_TXT, site="Tank Farm 1")  # the engine, called directly
    db = connection.get_db()
    report, analysis = db["reports"].find_one({"id": rid}), db["analyses"].find_one({"report_id": rid})
    assert report and analysis and db["reviews"].find_one({"report_id": rid})
    assert analysis["risk_score"] == int(round(raw["sif_risk_score"]))
    assert analysis["confidence"] == raw["ai_confidence"]
    assert analysis["hazards"] == [raw["hazard"].title()]
    assert analysis["precursors"] == raw["life_saving_rules"]
    assert analysis["evidence"] == raw["evidence_reasons"]
    assert report["sif_detected"] == raw["is_sif_potential"]
    # API returns the stored analysis
    assert client.get(f"/api/analysis/{rid}").json()["risk_score"] == analysis["risk_score"]


def test_csv_import_analyzes_every_row(client):
    csv = "report_type,location,department,description\n" + "\n".join(
        f"Near Miss,Site {i},Ops,\"{t}\"" for i, t in enumerate([CRITICAL_TXT, HIGH_TXT, MEDIUM_TXT, LOW_TXT])
    )
    res = client.post("/api/ingestion/csv", files={"file": ("r.csv", csv.encode(), "text/csv")})
    assert res.status_code == 200 and res.json()["imported"] == 4
    db = connection.get_db()
    assert db["reports"].count_documents({}) == db["analyses"].count_documents({}) == db["reviews"].count_documents({}) == 4
    for row in db["analyses"].find({}):
        rep = db["reports"].find_one({"id": row["report_id"]})
        assert row["risk_score"] == int(round(predict.analyze_report(rep["description"], site=rep["location"])["sif_risk_score"]))


def test_json_import_analyzes_every_row(client):
    data = [text_report(t, location=f"Loc {i}") for i, t in enumerate([CRITICAL_TXT, MEDIUM_TXT, LOW_TXT])]
    res = client.post("/api/ingestion/json", files={"file": ("r.json", json.dumps(data).encode(), "application/json")})
    assert res.status_code == 200 and res.json()["imported"] == 3
    db = connection.get_db()
    assert db["reports"].count_documents({}) == db["analyses"].count_documents({}) == 3


def test_csv_blank_description_is_rejected_not_analyzed_as_nan(client):
    csv = b"report_type,location,department,description\nNear Miss,A,Ops,\n"
    assert client.post("/api/ingestion/csv", files={"file": ("r.csv", csv, "text/csv")}).status_code == 422
    assert connection.get_db()["reports"].count_documents({}) == 0


def test_data_survives_backend_restart(client):
    client.post("/api/ingestion/text", json=text_report(CRITICAL_TXT))
    before = client.get("/api/reports").json()
    connection._client = None  # drop the connection = process restart
    from fastapi.testclient import TestClient
    from app.main import app
    with TestClient(app) as restarted:
        assert restarted.get("/api/reports").json() == before
        assert restarted.get("/api/analytics/overview").json()["total_reports"] == 1
        # counters are persisted too: the next id continues, it does not restart at 1
        nid = restarted.post("/api/ingestion/text", json=text_report(LOW_TXT)).json()["id"]
        assert nid == before["items"][0]["id"] + 1


def test_high_and_critical_create_alerts_low_and_medium_do_not(client):
    ids = {n: client.post("/api/ingestion/text", json=text_report(t, location=n)).json()["id"]
           for n, t in [("crit", CRITICAL_TXT), ("high", HIGH_TXT), ("med", MEDIUM_TXT), ("low", LOW_TXT)]}
    alerts = client.get("/api/alerts").json()["items"]
    assert {a["related_report_id"] for a in alerts} == {ids["crit"], ids["high"]}
    assert {a["severity"] for a in alerts} == {"CRITICAL", "HIGH"}
    assert all(a["status"] == "Open" and a["time"] and a["message"] for a in alerts)
    assert client.get("/api/analytics/overview").json()["active_alerts"] == 2


def test_engine_failure_returns_502_and_stores_nothing(client, monkeypatch):
    from app.services import report_service

    def boom(_):
        raise RuntimeError("engine exploded")

    monkeypatch.setattr(report_service, "analyze_report", boom)
    res = client.post("/api/ingestion/text", json=text_report(HIGH_TXT))
    assert res.status_code == 502 and "AI/NLP engine" in res.json()["detail"]
    csv = f"report_type,location,department,description\nNear Miss,A,Ops,\"{HIGH_TXT}\"\n".encode()
    assert client.post("/api/ingestion/csv", files={"file": ("r.csv", csv, "text/csv")}).status_code == 502
    assert connection.get_db()["reports"].count_documents({}) == 0


def test_text_validation_still_works(client):
    assert client.post("/api/ingestion/text", json=text_report("")).status_code == 422
