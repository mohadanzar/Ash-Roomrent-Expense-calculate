import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost'
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-brand text-white shadow-sm active:bg-brand-dark',
  secondary: 'bg-slate-100 text-text border border-border active:bg-slate-200',
  success: 'bg-success text-white shadow-sm active:opacity-90',
  danger: 'bg-danger text-white shadow-sm active:opacity-90',
  outline: 'border-2 border-brand text-brand bg-white active:bg-brand-muted',
  ghost: 'bg-white text-brand border border-border active:bg-brand-muted',
}

export function Button({
  variant = 'primary',
  fullWidth = true,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`h-12 rounded-xl px-4 text-[0.9375rem] font-semibold tracking-tight transition-all duration-150 disabled:opacity-45 disabled:shadow-none ${fullWidth ? 'w-full' : ''} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
