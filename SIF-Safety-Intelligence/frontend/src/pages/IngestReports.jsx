import { useState } from 'react'
import { UploadCloud, FileText, Braces, CheckCircle2, XCircle } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/common/Button'
import { REPORT_TYPES } from '../utils/constants'
import { validateCSVFile, validateJSONFile, isValidJSON } from '../utils/validators'
import { reportApi } from '../services/reportApi'

const TABS = [
  { id: 'text', label: 'Text Entry', icon: FileText },
  { id: 'csv', label: 'CSV Upload', icon: UploadCloud },
  { id: 'json', label: 'JSON Upload', icon: Braces },
]

export default function IngestReports() {
  const [tab, setTab] = useState('text')

  return (
    <div>
      <PageHeader title="Report Intake" subtitle="Submit unsafe act, unsafe condition, or near-miss reports" />

      <div className="flex gap-2 mb-6">
        {TABS.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id ? 'bg-brand-blue text-white' : 'glass text-ink-secondary hover:bg-slate-50'
              }`}
            >
              <Icon size={15} /> {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'text' && <TextIntake />}
      {tab === 'csv' && <FileIntake type="csv" />}
      {tab === 'json' && <FileIntake type="json" />}
    </div>
  )
}

function TextIntake() {
  const [form, setForm] = useState({ report_type: REPORT_TYPES[0], location: '', department: '', description: '' })
  const [status, setStatus] = useState(null)

  const submit = async () => {
    setStatus({ state: 'loading' })
    try {
      const res = await reportApi.submitText(form)
      setStatus({ state: 'success', message: `Report submitted successfully (ID #${res.id ?? res.report?.id ?? '—'})` })
      setForm({ report_type: REPORT_TYPES[0], location: '', department: '', description: '' })
      window.dispatchEvent(new Event('precursorlens:data-changed'))
    } catch (e) {
      setStatus({ state: 'error', message: e.message })
    }
  }

  const inputCls = "w-full bg-white border border-line rounded-lg px-3 py-2.5 text-sm text-ink-primary focus:outline-none focus:border-brand-blue"

  return (
    <div className="glass rounded-xl p-6 max-w-2xl animate-fade-in">
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-ink-secondary mb-1.5 block">Report Type</label>
          <select className={inputCls} value={form.report_type} onChange={(e) => setForm({ ...form, report_type: e.target.value })}>
            {REPORT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-ink-secondary mb-1.5 block">Location</label>
          <input className={inputCls} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Drilling Site A" />
        </div>
        <div>
          <label className="text-xs text-ink-secondary mb-1.5 block">Department</label>
          <input className={inputCls} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="e.g. Operations" />
        </div>
      </div>
      <div className="mb-4">
        <label className="text-xs text-ink-secondary mb-1.5 block">Description</label>
        <textarea rows={5} className={inputCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the unsafe act, unsafe condition, or near-miss..." />
      </div>
      <Button onClick={submit} disabled={status?.state === 'loading' || !form.location || !form.description}>
        {status?.state === 'loading' ? 'Submitting...' : 'Submit Report'}
      </Button>
      {status?.state === 'success' && <StatusMsg ok text={status.message} />}
      {status?.state === 'error' && <StatusMsg text={status.message} />}
    </div>
  )
}

function FileIntake({ type }) {
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState([])
  const [preview, setPreview] = useState(null)
  const [status, setStatus] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = (f) => {
    const errs = type === 'csv' ? validateCSVFile(f) : validateJSONFile(f)
    setErrors(errs)
    setFile(f)
    setPreview(null)
    setStatus(null)
    if (!errs.length) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target.result
        if (type === 'csv') {
          const lines = text.trim().split('\n')
          setPreview({ recordCount: Math.max(lines.length - 1, 0), sample: lines.slice(0, 4).join('\n') })
        } else {
          if (isValidJSON(text)) {
            const parsed = JSON.parse(text)
            const count = Array.isArray(parsed) ? parsed.length : 1
            setPreview({ recordCount: count, sample: JSON.stringify(parsed, null, 2).slice(0, 400) })
          } else {
            setErrors(['Invalid JSON syntax'])
          }
        }
      }
      reader.readAsText(f)
    }
  }

  const submit = async () => {
    setStatus({ state: 'loading' })
    try {
      const res = type === 'csv' ? await reportApi.uploadCSV(file) : await reportApi.uploadJSON(file)
      setStatus({ state: 'success', message: `Imported ${res.imported ?? res.count ?? preview?.recordCount ?? ''} record(s) successfully.` })
      window.dispatchEvent(new Event('precursorlens:data-changed'))
    } catch (e) {
      setStatus({ state: 'error', message: e.message })
    }
  }

  return (
    <div className="glass rounded-xl p-6 max-w-2xl animate-fade-in">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]) }}
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${dragOver ? 'border-safety-amber bg-safety-amber/5' : 'border-line'}`}
      >
        <UploadCloud size={32} className="mx-auto text-ink-secondary mb-3" />
        <p className="text-sm text-ink-primary mb-1">Drag & drop your {type.toUpperCase()} file here</p>
        <p className="text-xs text-ink-secondary mb-4">or</p>
        <label className="inline-block cursor-pointer">
          <span className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-50 text-sm text-ink-primary transition">Browse Files</span>
          <input type="file" accept={type === 'csv' ? '.csv' : '.json'} className="hidden" onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
        </label>
        {file && <p className="text-xs text-ink-secondary mt-4">{file.name}</p>}
      </div>

      {errors.length > 0 && (
        <div className="mt-4 space-y-1">
          {errors.map((e, i) => <StatusMsg key={i} text={e} />)}
        </div>
      )}

      {preview && !errors.length && (
        <div className="mt-4 bg-slate-50 border border-line rounded-lg p-4">
          <p className="text-xs text-ink-secondary mb-2">Preview — {preview.recordCount} record(s) detected</p>
          <pre className="text-[11px] text-ink-primary overflow-x-auto whitespace-pre-wrap max-h-40">{preview.sample}</pre>
        </div>
      )}

      <Button className="mt-4" onClick={submit} disabled={!file || errors.length > 0 || status?.state === 'loading'}>
        {status?.state === 'loading' ? 'Importing...' : 'Import'}
      </Button>
      {status?.state === 'success' && <StatusMsg ok text={status.message} />}
      {status?.state === 'error' && <StatusMsg text={status.message} />}
    </div>
  )
}

function StatusMsg({ ok, text }) {
  const Icon = ok ? CheckCircle2 : XCircle
  return (
    <p className={`flex items-center gap-1.5 text-xs mt-2 ${ok ? 'text-safety-green' : 'text-safety-red'}`}>
      <Icon size={14} /> {text}
    </p>
  )
}
