import { useEffect, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import EmptyState from '../components/common/EmptyState'
import Modal from '../components/common/Modal'
import ReviewCard from '../components/reviews/ReviewCard'
import ReviewForm from '../components/reviews/ReviewForm'
import EvidencePanel from '../components/analysis/EvidencePanel'
import RiskFilterTabs from '../components/common/RiskFilterTabs'
import { reviewApi } from '../services/reviewApi'

export default function SafetyReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [active, setActive] = useState(null)
  const [riskLevel, setRiskLevel] = useState('')

  const load = () => {
    setLoading(true)
    setError(null)
    reviewApi.list({ risk_level: riskLevel }).then((d) => setReviews(d.items || d)).catch((e) => setError(e.message)).finally(() => setLoading(false))
  }
  useEffect(load, [riskLevel])

  const handleSubmit = async (payload) => {
    await reviewApi.update(active.id, payload)
    setActive(null)
    load()
  }

  return (
    <div>
      <PageHeader title="Safety Reviews" subtitle="Human-in-the-loop confirmation of AI safety assessments" />
      <div className="glass rounded-xl p-4 mb-4">
        <RiskFilterTabs value={riskLevel} onChange={setRiskLevel} />
      </div>
      {loading ? <Loader /> : error ? <ErrorMessage message={error} onRetry={load} /> : !reviews.length ? (
        <EmptyState message={riskLevel ? 'No reviews at this risk level.' : 'No reviews pending.'} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((r) => <ReviewCard key={r.id} review={r} onOpen={setActive} />)}
        </div>
      )}

      <Modal open={!!active} onClose={() => setActive(null)} title={`Review Report #${active?.report_id}`}>
        {active && (
          <div className="space-y-4">
            <p className="text-sm text-ink-primary">{active.description}</p>
            <div>
              <p className="text-xs text-ink-secondary mb-2">AI Evidence</p>
              <EvidencePanel items={active.evidence} />
            </div>
            <ReviewForm review={active} onSubmit={handleSubmit} />
          </div>
        )}
      </Modal>
    </div>
  )
}
