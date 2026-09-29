"""
Tests run against a REAL MongoDB server (MONGODB_URL, default localhost:27017)
using a dedicated database, `precursorlens_test`, which is dropped before every
test. Your real `precursorlens` database is never touched.
Start MongoDB first (see README), then:  pytest
"""
import os

# Must be set before app.config is imported.
os.environ["MONGODB_DATABASE"] = "precursorlens_test"

import pytest
from fastapi.testclient import TestClient
from pymongo.errors import PyMongoError

from app.main import app
from app.database import connection


def pytest_sessionstart(session):
    try:
        connection.ping()
    except PyMongoError as exc:
        pytest.exit(f"MongoDB is not reachable ({type(exc).__name__}). Start MongoDB and check MONGODB_URL, then re-run pytest.", returncode=2)


@pytest.fixture(autouse=True)
def fresh_database():
    connection._client = None  # new client each test (also recovers from the "MongoDB down" test)
    db = connection.get_db()
    assert db.name == "precursorlens_test", "refusing to drop a non-test database"
    connection.get_client().drop_database(db.name)
    connection.ensure_indexes()
    yield
    connection._client = None  # a test may have swapped in a broken client
    connection.get_client().drop_database(db.name)


@pytest.fixture
def client():
    with TestClient(app) as c:  # runs the startup handler (must not seed anything)
        yield c


def text_report(description, location="Test Site", department="Ops", report_type="Near Miss"):
    return {"report_type": report_type, "location": location, "department": department, "description": description}


# Descriptions whose real-engine levels were observed: CRITICAL, HIGH, MEDIUM, LOW.
CRITICAL_TXT = "Technician performed hot work near flammable storage without a hot work permit."
HIGH_TXT = "Worker entered vessel without gas testing during scheduled maintenance."
MEDIUM_TXT = "Vehicle reversed in an active work zone without a spotter, line of fire exposure."
LOW_TXT = "Routine housekeeping issue noted, walkway partially obstructed by equipment."
