import { Layout } from '../components/Layout'
import { Button } from '../components/Button'
import { HistoryCard } from '../components/HistoryCard'
import { SavedRoomCard } from '../components/SavedRoomCard'
import type { RoomRecord, SavedRoomProfile } from '../types'

interface RoomHomeScreenProps {
  history: RoomRecord[]
  savedRooms: SavedRoomProfile[]
  onNewRoom: () => void
  onUseRoom: (profile: SavedRoomProfile) => void
  onViewHistory: (record: RoomRecord) => void
  onBack: () => void
  onHome: () => void
}

export function RoomHomeScreen({
  history,
  savedRooms,
  onNewRoom,
  onUseRoom,
  onViewHistory,
  onBack,
  onHome,
}: RoomHomeScreenProps) {
  const hasSavedRooms = savedRooms.length > 0

  return (
    <Layout title="Room Rent Calculator" onBack={onBack} onHome={onHome}>
      <div className="space-y-6">
        <div className="hero-banner">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Shared Room</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight">Split rent fairly</h2>
          <p className="hero-banner-subtitle">
            {hasSavedRooms
              ? 'Calculate for your saved room or add a new room.'
              : 'Add room details, members, rent & shared expenses. Calculate splits and share instantly.'}
          </p>
        </div>

        {hasSavedRooms && (
          <section>
            <div className="mb-3.5 flex items-center justify-between">
              <h2 className="section-title">Same Room Calculate</h2>
              <span className="badge badge-brand">{savedRooms.length} saved</span>
            </div>
            <div className="space-y-3">
              {savedRooms.map((profile) => (
                <SavedRoomCard
                  key={profile.id}
                  profile={profile}
                  onCalculate={() => onUseRoom(profile)}
                />
              ))}
            </div>
          </section>
        )}

        <Button variant={hasSavedRooms ? 'outline' : 'primary'} onClick={onNewRoom}>
          + New Room Calculation
        </Button>

        <section>
          <div className="mb-3.5 flex items-center justify-between">
            <h2 className="section-title">Room Rent History</h2>
            <span className="badge badge-accent">{history.length} records</span>
          </div>

          {history.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-title">No saved room calculations</p>
              <p className="empty-state-desc">Your last 5 months of room history will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record) => (
                <HistoryCard key={record.id} record={record} onClick={() => onViewHistory(record)} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  )
}
