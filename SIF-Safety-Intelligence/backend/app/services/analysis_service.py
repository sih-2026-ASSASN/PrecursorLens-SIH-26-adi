from app.services import report_service


def get_analysis_for_report(report_id: int):
    return report_service.get_analysis(report_id)


def list_all_analyses():
    return report_service.list_analyses()
