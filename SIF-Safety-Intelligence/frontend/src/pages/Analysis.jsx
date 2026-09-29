import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import EmptyState from '../components/common/EmptyState'
import RiskScore from '../components/analysis/RiskScore'
import PrecursorList from '../components/analysis/PrecursorList'
import HazardList from '../components/analysis/HazardList'
import ControlGap from '../components/analysis/ControlGap'
import EvidencePanel from '../components/analysis/EvidencePanel'
import RecommendationCard from '../components/analysis/RecommendationCard'
import { analysisApi } from '../services/analysisApi'
import { reportApi } from '../services/reportApi'

export default function Analysis() {
  const { reportId } = useParams()
  const [reports, setReports] = useState([])
  const [selected, setSelected] = useState(reportId || '')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    reportApi.list().then((data) => {
      const items = data.items || data
      setReports(items)
      if (!selected && items.length) setSelected(String(items[0].id))
    }).catch(() => {})
  }, [])

  const load = (id) => {
    if (!id) return
    setLoading(true)
    setError(null)
    analysisApi.get(id).then(setAnalysis).catch((e) => setError(e.message)).finally(() => setLoading(false))
  }

  useEffect(() => { if (selected) load(selected) }, [selected])

  return (
    <div>
      <PageHeader
        title="AI Analysis"
        subtitle="Explainable SIF precursor detection results — for safety review, not automated determination"
        actions={
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="bg-white border border-line rounded-lg px-3 py-2 text-sm text-ink-primary"
          >
            {reports.map((r) => <option key={r.id} value={r.id}>Report #{r.id} — {r.location}</option>)}
          </select>
        }
      />

      {loading ? <Loader /> : error ? <ErrorMessage onRetry={() => load(selected)} /> : !analysis ? (
        <EmptyState message="Select a report to view its AI analysis." />
      ) : (
        <div className="space-y-5 animate-fade-in">
          <div className={`glass rounded-xl p-5 flex items-center gap-3 ${analysis.sif_detected ? 'border-safety-red/30' : ''}`}>
            {analysis.sif_detected ? (
              <ShieldAlert className="text-safety-red" size={24} />
            ) : (
              <ShieldCheck className="text-safety-green" size={24} />
            )}
            <div>
              <p className={`text-sm font-bold ${analysis.sif_detected ? 'text-safety-red' : 'text-safety-green'}`}>
                {analysis.sif_detected ? 'SIF PRECURSOR DETECTED' : 'NO SIF PRECURSOR DETECTED'}
              </p>
              <p className="text-xs text-ink-secondary">AI-detected indicator — requires safety review before action.</p>
            </div>
          </div>

          <RiskScore score={analysis.risk_score} level={analysis.risk_level} confidence={analysis.confidence} />

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="glass rounded-xl p-5">
              <p className="text-xs text-ink-secondary mb-3">Detected Hazards</p>
              <HazardList items={analysis.hazards} />
            </div>
            <div className="glass rounded-xl p-5">
              <p className="text-xs text-ink-secondary mb-3">SIF Precursors</p>
              <PrecursorList items={analysis.precursors} />
            </div>
          </div>

          <div className="glass rounded-xl p-5">
            <p className="text-xs text-ink-secondary mb-3">Evidence</p>
            <EvidencePanel items={analysis.evidence} />
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="glass rounded-xl p-5">
              <p className="text-xs text-ink-secondary mb-3">Control Gaps</p>
              <ControlGap items={analysis.control_gaps} />
            </div>
            <div className="glass rounded-xl p-5">
              <p className="text-xs text-ink-secondary mb-3">Recommendations</p>
              <RecommendationCard items={analysis.recommendations} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
