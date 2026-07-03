import { useState } from 'react'
import { Layout } from '../components/Layout'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { StepBadge } from '../components/StepBadge'
import { RoomExpenseTypeCombobox, rememberRoomExpenseType } from '../components/RoomExpenseTypeCombobox'
import { MemberCombobox, resolveMemberByName } from '../components/MemberCombobox'
import type { Expense, Member } from '../types'
import { formatCurrency } from '../utils/calculations'

interface ExpensesScreenProps {
  members: Member[]
  expenses: Expense[]
  reusingRoom?: boolean
  onChange: (expenses: Expense[]) => void
  onNext: () => void
  onBack: () => void
  onHome: () => void
}

function generateId(): string {
  return crypto.randomUUID()
}

export function ExpensesScreen({ members, expenses, reusingRoom, onChange, onNext, onBack, onHome }: ExpensesScreenProps) {
  const [expenseName, setExpenseName] = useState('')
  const [amount, setAmount] = useState('')
  const [paidByName, setPaidByName] = useState(members[0]?.name ?? '')
  const [error, setError] = useState('')

  const addExpense = () => {
    const label = expenseName.trim()
    const parsed = parseFloat(amount)
    const payer = resolveMemberByName(members, paidByName)

    if (!label) {
      setError('Enter or select expense type')
      return
    }
    if (!parsed || parsed <= 0) {
      setError('Enter valid amount')
      return
    }
    if (!payer) {
      setError('Select or type a valid member name')
      return
    }

    rememberRoomExpenseType(label)
    onChange([
      ...expenses,
      { id: generateId(), label, amount: parsed, paidById: payer.id },
    ])
    setExpenseName('')
    setAmount('')
    setError('')
  }

  const removeExpense = (id: string) => {
    onChange(expenses.filter((e) => e.id !== id))
  }

  return (
    <Layout
      title="Room Expenses"
      onBack={onBack}
      onHome={onHome}
      footer={
        <>
          <Button variant="secondary" onClick={onNext} className="!w-auto shrink-0 px-5">
            Skip
          </Button>
          <Button onClick={onNext}>Calculate Split</Button>
        </>
      }
    >
      <div className="space-y-5">
        <StepBadge
          step={reusingRoom ? 2 : 4}
          total={reusingRoom ? 2 : 4}
          label="Add shared expenses (optional)"
        />

        <div className="card space-y-3 p-4">
          <RoomExpenseTypeCombobox value={expenseName} onChange={setExpenseName} />

          <Input
            label="Amount (₹)"
            type="number"
            inputMode="decimal"
            placeholder="e.g. 1500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <MemberCombobox members={members} value={paidByName} onChange={setPaidByName} />

          {error && <p className="text-sm font-medium text-danger">{error}</p>}
          <Button variant="outline" onClick={addExpense}>+ Add Expense</Button>
        </div>

        {expenses.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="section-title">Added Expenses ({expenses.length})</h3>
            {expenses.map((expense) => {
              const payer = members.find((m) => m.id === expense.paidById)?.name ?? 'Unknown'
              return (
                <div
                  key={expense.id}
                  className="card flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-text">{expense.label}</p>
                    <p className="text-sm text-text-muted">Paid by {payer}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-brand">{formatCurrency(expense.amount)}</span>
                    <button
                      type="button"
                      onClick={() => removeExpense(expense.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-danger active:bg-danger-muted"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
