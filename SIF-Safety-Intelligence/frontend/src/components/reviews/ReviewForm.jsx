import { useState } from 'react'
import Button from '../common/Button'

export default function ReviewForm({ review, onSubmit }) {
  const [status, setStatus] = useState(review?.status || 'Pending')
  const [comment, setComment] = useState(review?.comment || '')

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-ink-secondary">Assessment Decision</label>
        <div className="flex gap-2 mt-1.5">
          {['Confirmed', 'Modified'].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                status === s ? 'bg-brand-blue text-white border-brand-blue' : 'border-line text-ink-secondary hover:bg-slate-50'
              }`}
            >
              {s === 'Confirmed' ? 'Confirm AI Assessment' : 'Modify Assessment'}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs text-ink-secondary">Review Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Add your safety review notes..."
          className="w-full mt-1.5 bg-white border border-line rounded-lg px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-brand-blue"
        />
      </div>
      <Button onClick={() => onSubmit({ status, comment })}>Mark Reviewed</Button>
    </div>
  )
}
