import type { SavedRoomProfile } from '../types'

interface SavedRoomCardProps {
  profile: SavedRoomProfile
  onCalculate: () => void
}

export function SavedRoomCard({ profile, onCalculate }: SavedRoomCardProps) {
  return (
    <button
      type="button"
      onClick={onCalculate}
      className="card flex w-full items-center justify-between gap-3 p-4 text-left transition-all active:scale-[0.99] active:bg-brand-muted/30"
    >
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold tracking-tight text-text">{profile.roomName}</h3>
        <p className="mt-0.5 text-sm text-text-muted">{profile.members.length} members saved</p>
      </div>
      <span className="shrink-0 rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white">
        Calculate
      </span>
    </button>
  )
}
