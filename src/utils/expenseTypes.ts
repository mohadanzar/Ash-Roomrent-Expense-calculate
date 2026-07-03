import { PERSONAL_EXPENSE_TYPES } from '../types'

const CUSTOM_TYPES_KEY = 'personal-expense-custom-types'

export function loadCustomExpenseTypes(): string[] {
  try {
    const raw = localStorage.getItem(CUSTOM_TYPES_KEY)
    if (!raw) return []
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

export function getAllExpenseTypes(): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const type of [...PERSONAL_EXPENSE_TYPES, ...loadCustomExpenseTypes()]) {
    const key = type.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      result.push(type)
    }
  }

  return result
}

export function addCustomExpenseType(name: string): string[] {
  const trimmed = name.trim()
  if (!trimmed) return getAllExpenseTypes()

  const exists = getAllExpenseTypes().some((t) => t.toLowerCase() === trimmed.toLowerCase())
  if (exists) return getAllExpenseTypes()

  const custom = [...loadCustomExpenseTypes(), trimmed]
  localStorage.setItem(CUSTOM_TYPES_KEY, JSON.stringify(custom))
  return getAllExpenseTypes()
}
