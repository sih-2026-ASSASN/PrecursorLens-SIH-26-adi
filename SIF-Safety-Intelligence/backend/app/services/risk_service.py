from app.analytics import risk_metrics


def overall():
    return risk_metrics.overall_site_risk_index()


def by_location():
    return risk_metrics.risk_by_location()


def by_department():
    return risk_metrics.risk_by_department()
