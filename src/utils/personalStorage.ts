import type { PersonalBudget, PersonalExpenseItem } from '../types'

const CURRENT_KEY = 'personal-budget-current'
const HISTORY_KEY = 'personal-budget-history'
const MAX_MONTHS = 5

export function calculatePersonalBudget(salary: number, expenses: PersonalExpenseItem[]) {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const remaining = salary - totalExpenses
  const usedPercent = salary > 0 ? (totalExpenses / salary) * 100 : 0

  return { totalExpenses, remaining, usedPercent }
}

export function loadCurrentBudget(): PersonalBudget | null {
  try {
    const raw = localStorage.getItem(CURRENT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersonalBudget
  } catch {
    return null
  }
}

export function saveCurrentBudget(budget: PersonalBudget): void {
  localStorage.setItem(CURRENT_KEY, JSON.stringify(budget))
}

export function loadPersonalHistory(): PersonalBudget[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as PersonalBudget[]
  } catch {
    return []
  }
}

export function savePersonalBudget(budget: PersonalBudget): PersonalBudget[] {
  saveCurrentBudget(budget)

  const history = loadPersonalHistory()
  const updated = [budget, ...history.filter((b) => b.id !== budget.id)]

  const monthMap = new Map<string, PersonalBudget[]>()
  for (const item of updated) {
    const list = monthMap.get(item.month) ?? []
    list.push(item)
    monthMap.set(item.month, list)
  }

  const sortedMonths = [...monthMap.keys()].sort((a, b) => b.localeCompare(a))
  const keptMonths = new Set(sortedMonths.slice(0, MAX_MONTHS))
  const trimmed = updated.filter((item) => keptMonths.has(item.month))

  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed))
  return trimmed
}

export function deletePersonalBudget(id: string): PersonalBudget[] {
  const updated = loadPersonalHistory().filter((b) => b.id !== id)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))

  const current = loadCurrentBudget()
  if (current?.id === id) {
    localStorage.removeItem(CURRENT_KEY)
  }

  return updated
}
