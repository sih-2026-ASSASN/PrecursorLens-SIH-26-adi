import api from './api'

export const reviewApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString()
    return api.request(`/api/reviews${qs ? `?${qs}` : ''}`)
  },
  get: (id) => api.request(`/api/reviews/${id}`),
  update: (id, payload) => api.request(`/api/reviews/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
}
