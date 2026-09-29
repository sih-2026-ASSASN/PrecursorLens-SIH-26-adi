"""
Risk metrics computed ONLY from stored reports and their stored AI analyses.
Every number is an average/count of the engine's own risk_score, hazards and
precursors — no constant weights, no random values, no placeholders.
"""
from collections import defaultdict
from app.ai.client import _risk_level_from_score
from app.services.report_service import all_reports, all_analyses

NO_HAZARD = "No hazard detected"


def _scored():
    """[(report, analysis)] for every stored report that has its AI analysis."""
    analyses = all_analyses()
    return [(r, analyses[r.id]) for r in all_reports() if r.id in analyses]


def _avg(values):
    return round(sum(values) / len(values))


def overall_site_risk_index() -> dict:
    pairs = _scored()
    if not pairs:
        return {"index": 0, "level": None, "high_risk_areas": [], "hazard_distribution": [], "recurring_precursors": []}

    index = _avg([a.risk_score for _, a in pairs])
    level = _risk_level_from_score(index)

    loc_scores = defaultdict(list)
    hazard_counts = defaultdict(int)
    precursor_counts = defaultdict(int)
    for r, a in pairs:
        loc_scores[r.location].append(a.risk_score)
        for h in a.hazards:
            hazard_counts[h] += 1
        for p in a.precursors:
            precursor_counts[p] += 1

    high_risk_areas = [loc for loc, vals in loc_scores.items() if _risk_level_from_score(_avg(vals)) in ("HIGH", "CRITICAL")]
    hazard_distribution = [{"name": k, "value": v} for k, v in sorted(hazard_counts.items(), key=lambda x: -x[1])][:8]
    recurring_precursors = [{"name": k, "count": v} for k, v in sorted(precursor_counts.items(), key=lambda x: -x[1])][:8]

    return {
        "index": index,
        "level": level,
        "high_risk_areas": high_risk_areas[:6],
        "hazard_distribution": hazard_distribution,
        "recurring_precursors": recurring_precursors,
    }


def risk_by_location() -> dict:
    pairs = _scored()
    loc_scores = defaultdict(list)
    cell_scores = defaultdict(list)
    for r, a in pairs:
        loc_scores[r.location].append(a.risk_score)
        for h in (a.hazards or [NO_HAZARD]):
            cell_scores[(r.location, h)].append(a.risk_score)

    data = [{"name": k, "value": _avg(v)} for k, v in loc_scores.items()]

    # Heatmap: location x AI-detected hazard. Cell = mean AI risk_score of the stored
    # reports at that pair; None (rendered as an empty cell) when there are none.
    rows = list(loc_scores.keys())
    cols = sorted({h for (_, h) in cell_scores})
    matrix = [[_avg(cell_scores[(loc, h)]) if (loc, h) in cell_scores else None for h in cols] for loc in rows]
    counts = [[len(cell_scores.get((loc, h), [])) for h in cols] for loc in rows]
    return {"data": data, "heatmap": {"rows": rows, "cols": cols, "matrix": matrix, "counts": counts}}


def risk_by_department() -> dict:
    dept_scores = defaultdict(list)
    for r, a in _scored():
        dept_scores[r.department].append(a.risk_score)
    return {"data": [{"name": k, "value": _avg(v)} for k, v in dept_scores.items()]}
