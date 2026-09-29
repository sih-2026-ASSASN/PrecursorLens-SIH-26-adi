const styles = {
  Pending: 'bg-slate-500/15 text-ink-primary',
  Confirmed: 'bg-safety-green/15 text-safety-green',
  Modified: 'bg-safety-blue/15 text-safety-blue',
}
export default function ReviewStatus({ status = 'Pending' }) {
  return <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${styles[status] || styles.Pending}`}>{status}</span>
}
