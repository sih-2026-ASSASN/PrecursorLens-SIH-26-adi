import api from './api'

export const analysisApi = {
  list: () => api.request('/api/analysis'),
  get: (reportId) => api.request(`/api/analysis/${reportId}`),
}
