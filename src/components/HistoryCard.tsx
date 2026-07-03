import type { RoomRecord } from '../types'
import { formatCurrency, formatMonth } from '../utils/calculations'

interface HistoryCardProps {
  record: RoomRecord
  onClick: () => void
}

export function HistoryCard({ record, onClick }: HistoryCardProps) {
  const totalExpenses = record.expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <button
      type="button"
      onClick={onClick}
      className="card w-full p-4 text-left transition-all active:scale-[0.99] active:bg-brand-muted/30"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold tracking-tight text-text">{record.roomName}</h3>
          <p className="mt-0.5 text-sm text-text-muted">{formatMonth(record.month)}</p>
        </div>
        <span className="badge badge-brand">
          {record.members.length} members
        </span>
      </div>
      <div className="mt-3.5 flex gap-5 border-t border-border pt-3 text-sm">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-text-muted">Rent</span>
          <p className="mt-0.5 font-semibold text-text">{formatCurrency(record.rentAmount)}</p>
        </div>
        {totalExpenses > 0 && (
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-text-muted">Expenses</span>
            <p className="mt-0.5 font-semibold text-text">{formatCurrency(totalExpenses)}</p>
          </div>
        )}
      </div>
    </button>
  )
}
