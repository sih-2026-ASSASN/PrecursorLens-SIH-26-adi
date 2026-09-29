import api from './api'

export const analyticsApi = {
  overview: () => api.request('/api/analytics/overview'),
  riskTrends: () => api.request('/api/analytics/risk-trends'),
  sifTrends: () => api.request('/api/analytics/sif-trends'),
  hazards: () => api.request('/api/analytics/hazards'),
  departments: () => api.request('/api/analytics/departments'),
  locations: () => api.request('/api/analytics/locations'),
  controlGaps: () => api.request('/api/analytics/control-gaps'),
  riskOverall: () => api.request('/api/risk/overall'),
  riskByLocation: () => api.request('/api/risk/locations'),
  riskByDepartment: () => api.request('/api/risk/departments'),
  failures: () => api.request('/api/failures'),
  failureTrends: () => api.request('/api/failures/trends'),
  failureControlGaps: () => api.request('/api/failures/control-gaps'),
  alerts: () => api.request('/api/alerts'),
  status: () => api.request('/api/status'),
}
