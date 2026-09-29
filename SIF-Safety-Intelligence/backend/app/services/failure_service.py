from app.analytics import failure_metrics


def failures():
    return failure_metrics.failure_categories()


def control_gaps():
    return failure_metrics.control_gap_frequency()
