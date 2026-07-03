import type { PersonalBudget } from '../types'
import { formatCurrency, formatMonth } from '../utils/calculations'
import { calculatePersonalBudget } from '../utils/personalStorage'

interface PersonalBudgetCardProps {
  record: PersonalBudget
  onClick: () => void
}

export function PersonalBudgetCard({ record, onClick }: PersonalBudgetCardProps) {
  const { totalExpenses, remaining } = calculatePersonalBudget(record.salary, record.expenses)

  return (
    <button
      type="button"
      onClick={onClick}
      className="card w-full p-4 text-left transition-all active:scale-[0.99] active:bg-brand-muted/30"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold tracking-tight text-text">{formatMonth(record.month)}</h3>
          <p className="mt-0.5 text-sm text-text-muted">{record.expenses.length} expenses tracked</p>
        </div>
        <span className="badge badge-accent">Saved</span>
      </div>
      <div className="mt-3.5 grid grid-cols-3 gap-3 border-t border-border pt-3 text-sm">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-text-muted">Salary</span>
          <p className="mt-0.5 font-semibold text-text">{formatCurrency(record.salary)}</p>
        </div>
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-text-muted">Spent</span>
          <p className="mt-0.5 font-semibold text-text">{formatCurrency(totalExpenses)}</p>
        </div>
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-text-muted">Left</span>
          <p className={`mt-0.5 font-semibold ${remaining < 0 ? 'text-danger' : 'text-success'}`}>
            {formatCurrency(remaining)}
          </p>
        </div>
      </div>
    </button>
  )
}
