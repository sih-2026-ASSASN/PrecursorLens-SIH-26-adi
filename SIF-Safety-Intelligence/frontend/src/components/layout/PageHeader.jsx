export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 animate-slide-in">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-ink-primary">{title}</h1>
        {subtitle && <p className="text-sm text-ink-secondary mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
