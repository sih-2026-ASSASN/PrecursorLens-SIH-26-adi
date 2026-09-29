from collections import defaultdict
from app.services.report_service import all_reports, all_analyses

FAILURE_CATEGORY_MAP = {
    "Confined Space": "Monitoring/Testing Failure",
    "Hot Work": "Permit/Control Failure",
    "Energy Isolation": "Isolation Failure",
    "Working at Height": "Equipment/Control Failure",
    "Safe Mechanical Lifting": "Equipment/Control Failure",
    "Line of Fire": "Procedure Failure",
    "Driving": "Procedure Failure",
    "Work Authorization": "Permit/Control Failure",
    "Bypassing Safety Controls": "Isolation Failure",
}


def failure_categories() -> dict:
    counts = defaultdict(int)
    for a in all_analyses().values():
        for p in a.precursors:
            cat = FAILURE_CATEGORY_MAP.get(p, "Human/Operational Factor")
            counts[cat] += 1
    categories = [{"name": k, "value": v} for k, v in counts.items()]

    loc_counts = defaultdict(int)
    for r in all_reports():
        if r.sif_detected:
            loc_counts[r.location] += 1
    repeated_locations = [{"name": k, "count": v} for k, v in loc_counts.items() if v > 1]

    combo_counts = defaultdict(int)
    for a in all_analyses().values():
        if len(a.precursors) >= 2:
            combo = tuple(sorted(a.precursors[:2]))
            combo_counts[combo] += 1
    repeated_combinations = [{"combo": list(k), "count": v} for k, v in combo_counts.items() if v > 1]

    return {
        "categories": categories,
        "repeated_locations": repeated_locations,
        "repeated_combinations": repeated_combinations,
    }


def control_gap_frequency() -> dict:
    counts = defaultdict(int)
    for a in all_analyses().values():
        for g in a.control_gaps:
            counts[g] += 1
    return {"data": [{"name": k, "value": v} for k, v in counts.items()]}
