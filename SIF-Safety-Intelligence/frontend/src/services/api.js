import { API_BASE_URL } from '../utils/constants'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) {
    let detail = 'Request failed'
    try { const j = await res.json(); detail = j.detail || detail } catch {}
    throw new Error(detail)
  }
  return res.json()
}

async function upload(path, formData) {
  const res = await fetch(`${API_BASE_URL}${path}`, { method: 'POST', body: formData })
  if (!res.ok) {
    let detail = 'Upload failed'
    try { const j = await res.json(); detail = j.detail || detail } catch {}
    throw new Error(detail)
  }
  return res.json()
}

export default { request, upload }
