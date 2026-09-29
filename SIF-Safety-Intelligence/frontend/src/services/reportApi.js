import api from './api'

export const reportApi = {
  submitText: (payload) => api.request('/api/ingestion/text', { method: 'POST', body: JSON.stringify(payload) }),
  uploadCSV: (file) => { const fd = new FormData(); fd.append('file', file); return api.upload('/api/ingestion/csv', fd) },
  uploadJSON: (file) => { const fd = new FormData(); fd.append('file', file); return api.upload('/api/ingestion/json', fd) },
  submitJSONText: (payload) => api.request('/api/ingestion/json', { method: 'POST', body: JSON.stringify(payload) }),
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return api.request(`/api/reports${qs ? `?${qs}` : ''}`)
  },
  get: (id) => api.request(`/api/reports/${id}`),
}
