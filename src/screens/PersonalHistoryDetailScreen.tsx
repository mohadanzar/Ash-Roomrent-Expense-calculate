import { Layout } from '../components/Layout'
import { Button } from '../components/Button'
import type { PersonalBudget } from '../types'
import { formatCurrency, formatMonth } from '../utils/calculations'
import { calculatePersonalBudget } from '../utils/personalStorage'

interface PersonalHistoryDetailScreenProps {
  record: PersonalBudget
  onBack: () => void
  onHome: () => void
  onDelete: () => void
}

export function PersonalHistoryDetailScreen({ record, onBack, onHome, onDelete }: PersonalHistoryDetailScreenProps) {
  const { totalExpenses, remaining, usedPercent } = calculatePersonalBudget(record.salary, record.expenses)

  return (
    <Layout
      title="Expense Detail"
      onBack={onBack}
      onHome={onHome}
      footer={<Button variant="danger" onClick={onDelete}>Delete Record</Button>}
    >
      <div className="space-y-4">
        <div className="result-banner">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Monthly Summary</p>
          <h2 className="mt-1 text-lg font-bold tracking-tight">{formatMonth(record.month)}</h2>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="stat-pill">
            <p className="stat-pill-label">Salary</p>
            <p className="stat-pill-value">{formatCurrency(record.salary)}</p>
          </div>
          <div className="stat-pill">
            <p className="stat-pill-label">Spent</p>
            <p className="stat-pill-value">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="stat-pill">
            <p className="stat-pill-label">Remaining</p>
            <p className={`stat-pill-value ${remaining < 0 ? 'text-danger' : 'text-success'}`}>
              {formatCurrency(remaining)}
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-text-muted">{usedPercent.toFixed(0)}% of salary used</p>

        {record.expenses.length > 0 && (
          <div className="card p-4">
            <h3 className="section-title">Expenses</h3>
            <ul className="mt-3 space-y-2">
              {record.expenses.map((e) => (
                <li key={e.id} className="flex justify-between border-b border-border pb-2 text-sm last:border-0 last:pb-0">
                  <span className="text-text-muted">{e.label}</span>
                  <span className="font-semibold text-text">{formatCurrency(e.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  )
}
