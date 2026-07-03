interface StepBadgeProps {
  step: number
  total: number
  label: string
}

export function StepBadge({ step, total, label }: StepBadgeProps) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
        {step}
      </span>
      <p className="step-label">
        Step {step} of {total} — {label}
      </p>
    </div>
  )
}
