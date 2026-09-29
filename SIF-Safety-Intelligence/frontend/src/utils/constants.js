export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const REPORT_TYPES = ['Unsafe Act', 'Unsafe Condition', 'Near Miss']

export const RISK_LEVELS = {
  LOW: { label: 'Low', color: '#20A464' },
  MEDIUM: { label: 'Medium', color: '#F5C563' },
  HIGH: { label: 'High', color: '#F2B233' },
  CRITICAL: { label: 'Critical', color: '#D9363E' },
}

export const NAV_SECTIONS = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
      { label: 'Report Intake', path: '/ingest', icon: 'UploadCloud' },
      { label: 'Reports', path: '/reports', icon: 'FileText' },
      { label: 'AI Analysis', path: '/analysis', icon: 'BrainCircuit' },
    ],
  },
  {
    title: 'Safety Intelligence',
    items: [
      { label: 'Site Risk', path: '/risk', icon: 'Gauge' },
      { label: 'Analytics', path: '/analytics', icon: 'BarChart3' },
      { label: 'Failure Analysis', path: '/failures', icon: 'AlertOctagon' },
    ],
  },
  {
    title: 'Safety Operations',
    items: [
      { label: 'Safety Reviews', path: '/reviews', icon: 'ClipboardCheck' },
      { label: 'Life-Saving Rules', path: '/rules', icon: 'ShieldCheck' },
      { label: 'Alerts', path: '/alerts', icon: 'Bell' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', path: '/settings', icon: 'Settings' },
    ],
  },
]
