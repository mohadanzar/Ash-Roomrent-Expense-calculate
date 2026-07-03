import { useEffect, useState } from 'react'
import { Button } from './Button'
import { Input } from './Input'
import { ExpenseTypeCombobox, rememberExpenseType } from './ExpenseTypeCombobox'
import type { PersonalBudget, PersonalExpenseItem } from '../types'
import { formatCurrency, formatMonth, getCurrentMonth } from '../utils/calculations'
import {
  calculatePersonalBudget,
  loadCurrentBudget,
  savePersonalBudget,
} from '../utils/personalStorage'

function generateId(): string {
  return crypto.randomUUID()
}

export function MonthlyBudget({ onSaved }: { onSaved?: () => void }) {
  const [salary, setSalary] = useState('')
  const [expenses, setExpenses] = useState<PersonalExpenseItem[]>([])
  const [budgetId, setBudgetId] = useState<string>(() => crypto.randomUUID())
  const [expenseName, setExpenseName] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const existing = loadCurrentBudget()
    if (existing && existing.month === getCurrentMonth()) {
      setSalary(String(existing.salary))
      setExpenses(existing.expenses)
      setBudgetId(existing.id)
    }
  }, [])

  const salaryNum = parseFloat(salary) || 0
  const { totalExpenses, remaining, usedPercent } = calculatePersonalBudget(salaryNum, expenses)

  const addExpense = () => {
    const label = expenseName.trim()
    const amount = parseFloat(expenseAmount)

    if (!label) {
      setError('Enter or select expense name')
      return
    }
    if (!amount || amount <= 0) {
      setError('Enter valid amount')
      return
    }
    if (salaryNum <= 0) {
      setError('Enter your salary first')
      return
    }

    rememberExpenseType(label)
    setExpenses((prev) => [...prev, { id: generateId(), label, amount }])
    setExpenseName('')
    setExpenseAmount('')
    setError('')
    setSaved(false)
  }

  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
    setSaved(false)
  }

  const handleSave = () => {
    if (salaryNum <= 0) {
      setError('Enter your monthly salary to save')
      return
    }

    const budget: PersonalBudget = {
      id: budgetId,
      salary: salaryNum,
      expenses,
      month: getCurrentMonth(),
      savedAt: Date.now(),
    }

    savePersonalBudget(budget)
    setSaved(true)
    setError('')
    onSaved?.()
  }

  const remainingClass =
    remaining < 0 ? 'text-danger' : remaining === 0 ? 'text-text-muted' : 'text-success'

  return (
    <section className="card-elevated overflow-hidden">
      <div className="border-b border-border bg-brand-muted/50 px-4 py-3.5">
        <h2 className="section-title">Calculate Expenses</h2>
        <p className="mt-0.5 text-xs text-text-muted">{formatMonth(getCurrentMonth())}</p>
      </div>

      <div className="space-y-4 p-4">
        <Input
          label="Monthly Salary (₹)"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 35000"
          value={salary}
          onChange={(e) => {
            setSalary(e.target.value)
            setSaved(false)
          }}
        />

        {salaryNum > 0 && (
          <>
            <div className="rounded-xl border border-border bg-slate-50/80 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Add Expense</p>
              <div className="mt-3 space-y-3">
                <ExpenseTypeCombobox value={expenseName} onChange={setExpenseName} />

                <Input
                  label="Amount (₹)"
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 2000"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                />

                {error && <p className="text-sm font-medium text-danger">{error}</p>}

                <Button variant="outline" onClick={addExpense}>
                  + Add Expense
                </Button>
              </div>
            </div>

            {expenses.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-text">Your Expenses ({expenses.length})</h3>
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-white px-3.5 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-text">{expense.label}</p>
                      <p className="text-sm font-semibold text-brand">{formatCurrency(expense.amount)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExpense(expense.id)}
                      className="ml-3 shrink-0 rounded-lg px-2.5 py-1.5 text-sm font-medium text-danger active:bg-danger-muted"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-xl border border-brand-muted bg-brand-muted/30 p-4">
              <div className="mb-3 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className={`h-full rounded-full transition-all ${usedPercent > 100 ? 'bg-danger' : 'bg-brand'}`}
                  style={{ width: `${Math.min(usedPercent, 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="stat-pill">
                  <p className="stat-pill-label">Salary</p>
                  <p className="stat-pill-value">{formatCurrency(salaryNum)}</p>
                </div>
                <div className="stat-pill">
                  <p className="stat-pill-label">Spent</p>
                  <p className="stat-pill-value">{formatCurrency(totalExpenses)}</p>
                </div>
                <div className="stat-pill">
                  <p className="stat-pill-label">Remaining</p>
                  <p className={`stat-pill-value ${remainingClass}`}>
                    {remaining < 0 ? `-${formatCurrency(Math.abs(remaining))}` : formatCurrency(remaining)}
                  </p>
                </div>
              </div>

              {remaining < 0 && (
                <p className="mt-3 text-center text-xs font-medium text-danger">
                  Over budget by {formatCurrency(Math.abs(remaining))}
                </p>
              )}

              {remaining >= 0 && expenses.length > 0 && (
                <p className="mt-3 text-center text-xs text-text-muted">
                  {usedPercent.toFixed(0)}% of salary used · {formatCurrency(remaining)} left to spend
                </p>
              )}
            </div>

            <Button variant="success" onClick={handleSave}>
              Save Monthly Budget
            </Button>

            {saved && (
              <div className="alert-success py-3 text-sm">
                Monthly budget saved successfully
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
