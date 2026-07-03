import { EXPENSE_TYPES } from '../types'

const CUSTOM_KEY = 'room-expense-custom-types'

export function loadCustomRoomExpenseTypes(): string[] {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY)
    if (!raw) return []
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

export function getAllRoomExpenseTypes(): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const type of [...EXPENSE_TYPES, ...loadCustomRoomExpenseTypes()]) {
    const key = type.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      result.push(type)
    }
  }

  return result
}

export function addCustomRoomExpenseType(name: string): string[] {
  const trimmed = name.trim()
  if (!trimmed) return getAllRoomExpenseTypes()

  const exists = getAllRoomExpenseTypes().some((t) => t.toLowerCase() === trimmed.toLowerCase())
  if (exists) return getAllRoomExpenseTypes()

  const custom = [...loadCustomRoomExpenseTypes(), trimmed]
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom))
  return getAllRoomExpenseTypes()
}
