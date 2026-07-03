import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-text">
        {label}
      </label>
      <input
        id={inputId}
        className={`h-12 w-full rounded-xl border bg-white px-4 text-base text-text placeholder:text-slate-400 transition-colors focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15 ${error ? 'border-danger' : 'border-border'} ${className}`}
        {...props}
      />
      {error && <p className="text-sm font-medium text-danger">{error}</p>}
    </div>
  )
}

interface SelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
}

export function Select({ label, value, onChange, children }: SelectProps) {
  const id = label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-text">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-border bg-white px-4 text-base text-text transition-colors focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15"
      >
        {children}
      </select>
    </div>
  )
}
