import type { Member, RoomRecord, SavedRoomProfile } from '../types'

const PROFILES_KEY = 'saved-room-profiles'

export function loadSavedRoomProfiles(): SavedRoomProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY)
    if (raw) {
      return JSON.parse(raw) as SavedRoomProfile[]
    }
  } catch {
    /* fall through */
  }
  return []
}

export function saveRoomProfile(roomName: string, members: Member[]): SavedRoomProfile[] {
  const trimmed = roomName.trim()
  if (!trimmed || members.length === 0) return loadSavedRoomProfiles()

  const key = trimmed.toLowerCase()
  const existing = loadSavedRoomProfiles()
  const profile: SavedRoomProfile = {
    id: key,
    roomName: trimmed,
    members,
    lastUsedAt: Date.now(),
  }

  const updated = [profile, ...existing.filter((p) => p.id !== key)]
  localStorage.setItem(PROFILES_KEY, JSON.stringify(updated))
  return updated
}

export function bootstrapProfilesFromHistory(history: RoomRecord[]): SavedRoomProfile[] {
  const stored = loadSavedRoomProfiles()
  if (stored.length > 0) return stored

  const map = new Map<string, SavedRoomProfile>()
  for (const record of history) {
    const key = record.roomName.trim().toLowerCase()
    if (!key) continue
    const existing = map.get(key)
    if (!existing || record.savedAt > existing.lastUsedAt) {
      map.set(key, {
        id: key,
        roomName: record.roomName.trim(),
        members: record.members,
        lastUsedAt: record.savedAt,
      })
    }
  }

  const profiles = [...map.values()].sort((a, b) => b.lastUsedAt - a.lastUsedAt)
  if (profiles.length > 0) {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
  }
  return profiles
}
