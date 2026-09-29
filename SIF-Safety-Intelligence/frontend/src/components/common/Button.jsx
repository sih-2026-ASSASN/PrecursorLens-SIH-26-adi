const variants = {
  primary: 'bg-brand-blue text-white hover:brightness-110',
  outline: 'border border-line text-ink-primary hover:bg-slate-50',
  danger: 'bg-safety-red/90 text-white hover:brightness-110',
  ghost: 'text-ink-secondary hover:bg-slate-50',
}

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
