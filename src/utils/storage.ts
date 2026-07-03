import type { RoomRecord } from '../types'

const STORAGE_KEY = 'room-rent-history'
const MAX_MONTHS = 5

export function loadHistory(): RoomRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as RoomRecord[]
  } catch {
    return []
  }
}

export function saveRecord(record: RoomRecord): RoomRecord[] {
  const history = loadHistory()
  const updated = [record, ...history.filter((r) => r.id !== record.id)]

  const monthMap = new Map<string, RoomRecord[]>()
  for (const item of updated) {
    const list = monthMap.get(item.month) ?? []
    list.push(item)
    monthMap.set(item.month, list)
  }

  const sortedMonths = [...monthMap.keys()].sort((a, b) => b.localeCompare(a))
  const keptMonths = new Set(sortedMonths.slice(0, MAX_MONTHS))

  const trimmed = updated.filter((item) => keptMonths.has(item.month))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  return trimmed
}

export function deleteRecord(id: string): RoomRecord[] {
  const updated = loadHistory().filter((r) => r.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}
