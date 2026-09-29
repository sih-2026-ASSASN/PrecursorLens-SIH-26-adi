from pymongo import MongoClient
from datetime import datetime, timedelta, timezone
import sys, os

sys.path.insert(0, os.path.dirname(__file__))
from app.config import settings

client = MongoClient(settings.mongodb_url)
db = client[settings.mongodb_database]

reports = list(db.reports.find().sort("id", 1))
if not reports:
    print("No reports found.")
    sys.exit()

months_back = 6
start = datetime.now(timezone.utc) - timedelta(days=30 * months_back)
span_days = 30 * months_back

for i, r in enumerate(reports):
    offset_days = int(i * span_days / len(reports))
    new_date = (start + timedelta(days=offset_days)).isoformat()
    db.reports.update_one({"_id": r["_id"]}, {"$set": {"submitted_at": new_date}})

print(f"Backdated {len(reports)} reports across {months_back} months.")