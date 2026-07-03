import { useCallback } from 'react'
import { Layout } from '../components/Layout'
import { MonthlyBudget } from '../components/MonthlyBudget'
import { PersonalBudgetCard } from '../components/PersonalBudgetCard'
import type { PersonalBudget } from '../types'

interface ExpenseScreenProps {
  history: PersonalBudget[]
  onRefreshHistory: () => void
  onViewHistory: (record: PersonalBudget) => void
  onBack: () => void
  onHome: () => void
}

export function ExpenseScreen({ history, onRefreshHistory, onViewHistory, onBack, onHome }: ExpenseScreenProps) {
  const handleSaved = useCallback(() => {
    onRefreshHistory()
  }, [onRefreshHistory])

  return (
    <Layout title="Expense Calculator" onBack={onBack} onHome={onHome}>
      <div className="space-y-6">
        <MonthlyBudget onSaved={handleSaved} />

        <section>
          <div className="mb-3.5 flex items-center justify-between">
            <h2 className="section-title">Expense History</h2>
            <span className="badge badge-accent">{history.length} records</span>
          </div>

          {history.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-title">No saved expense records</p>
              <p className="empty-state-desc">Your last 5 months of expense history will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record) => (
                <PersonalBudgetCard
                  key={record.id}
                  record={record}
                  onClick={() => onViewHistory(record)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  )
}
