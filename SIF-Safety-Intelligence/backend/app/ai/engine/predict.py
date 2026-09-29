import os
import joblib

# Load the trained ML model
_MODEL_PATH = os.path.join(os.path.dirname(__file__), "sif_model.joblib")
model = joblib.load(_MODEL_PATH)

# spaCy/thinc pin a numpy ABI that conflicts with scikit-learn/scipy's numpy
# requirement in this environment. `nlp` is loaded for future NLP use but is
# not referenced anywhere in analyze_report()/prioritize_reports() below, so
# it is loaded lazily/optionally and a failed load does not change this
# file's behavior or output.
try:
    import spacy
    nlp = spacy.load("en_core_web_sm")
except Exception:
    nlp = None

HAZARD = {
    "hazardous atmosphere": ["confined space", "tank", "vessel", "h2s", "gas", "oxygen", "purge"],
    "ignition source": ["hot work", "welding", "torch", "cutting", "spark", "flame"],
    "gravitational": ["height", "scaffold", "ladder", "roof", "suspended", "crane", "load", "dropped", "fall"],
    "stored energy": ["pressure", "electrical", "live", "panel", "valve", "pipeline", "hydraulic"],
    "vehicle": ["vehicle", "truck", "reversing", "forklift", "speeding", "driving"]
}

BARRIER = {
    "atmospheric gas test": ["gas test", "atmospheric test", "testing", "gas monitor", "lel"],
    "permit to work": ["permit", "authorisation", "ptw", "authorization"],
    "energy isolation": ["isolation", "loto", "lockout", "tagout", "de-energized"],
    "fall protection": ["harness", "guardrails", "lifeline", "fall protection"],
    "exclusion zone": ["spotter", "barricade", "exclusion zone", "banksman"],
    "fire watch": ["fire watch", "fire blanket", "extinguisher"]
}

NEGATION = ["without", "no", "not", "absent", "missing", "bypassed", "failed", "skipped", "ignored"]

def map_life_saving_rules(hazard, barrier, text_lower):
    rules = set()
    if hazard == "hazardous atmosphere" or "confined" in text_lower or "tank" in text_lower:
        rules.add("Confined Space")
    if hazard == "ignition source" or "welding" in text_lower or "cutting" in text_lower:
        rules.add("Hot Work")
    if hazard == "gravitational":
        if any(w in text_lower for w in ["crane", "lift", "sling", "suspended"]):
            rules.add("Safe Mechanical Lifting")
            rules.add("Line of Fire")
        if any(w in text_lower for w in ["height", "scaffold", "ladder", "fall"]):
            rules.add("Working at Height")
    if hazard == "stored energy" or barrier == "energy isolation":
        rules.add("Energy Isolation")
    if hazard == "vehicle":
        rules.add("Driving")
    if barrier == "permit to work" or "permit" in text_lower:
        rules.add("Work Authorization")
    if any(w in text_lower for w in ["bypassed", "disabled", "tampered", "safety switch"]):
        rules.add("Bypassing Safety Controls")
    return list(rules)

def analyze_report(text, site="Main Field"):
    text_lower = text.lower()
    
    # 1. ML Probability
    prob = float(model.predict_proba([text])[0][1])
    
    # 2. Extract hazard & human exposure
    found_hazard = next((h for h, kws in HAZARD.items() if any(k in text_lower for k in kws)), None)
    human_exposure = any(w in text_lower for w in ["contractor", "worker", "technician", "staff", "crew", "person", "operator", "man"])
    
    # 3. Extract missing barriers using a proximity window
    found_barrier, barrier_failed = None, False
    for b, kws in BARRIER.items():
        for k in kws:
            if k in text_lower:
                found_barrier = b
                idx = text_lower.find(k)
                window = text_lower[max(0, idx - 45): idx + len(k) + 20]
                barrier_failed = any(n in window for n in NEGATION)
                break
        if found_barrier:
            break

    # 4. Map to IOGP Life-Saving Rules
    matched_lsr = map_life_saving_rules(found_hazard, found_barrier, text_lower)

    # 5. Composite SIF Risk Score (0 - 100)
    score_components = (
        (3.0 * prob) +
        (2.0 * (1.0 if found_hazard else 0.0)) +
        (2.0 * (1.0 if human_exposure else 0.0)) +
        (2.5 * (1.0 if barrier_failed else 0.0)) +
        (0.5 * min(len(matched_lsr), 2))
    )
    final_score = round(float((score_components / 10.5) * 100), 1)
    is_sif = bool(prob >= 0.45 or final_score >= 60.0)

    # 6. Structured Evidence Summary
    reasons = []
    if found_hazard:
        reasons.append(f"Hazard detected: {found_hazard.title()}")
    if human_exposure:
        reasons.append("Personnel exposure verified in danger zone")
    if barrier_failed:
        reasons.append(f"Critical barrier failure: {found_barrier.title()} absent or bypassed")
    if not reasons:
        reasons.append("Routine operational observation")

    return {
        "text": text,
        "site": site,
        "is_sif_potential": is_sif,
        "ai_confidence": round(prob, 2),
        "sif_risk_score": final_score,
        "hazard": found_hazard,
        "barrier_failed": found_barrier if barrier_failed else None,
        "life_saving_rules": matched_lsr,
        "evidence_reasons": reasons
    }

def prioritize_reports(report_list):
    analyzed_batch = [analyze_report(text) for text in report_list]
    # Sort descending by score
    return sorted(analyzed_batch, key=lambda x: x["sif_risk_score"], reverse=True)