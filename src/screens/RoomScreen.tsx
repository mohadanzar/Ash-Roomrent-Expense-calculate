import { Layout } from '../components/Layout'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { StepBadge } from '../components/StepBadge'

interface RoomScreenProps {
  roomName: string
  onChange: (name: string) => void
  onNext: () => void
  onHome: () => void
  error?: string
}

export function RoomScreen({ roomName, onChange, onNext, onHome, error }: RoomScreenProps) {
  return (
    <Layout
      title="Room Details"
      onBack={onHome}
      onHome={onHome}
      footer={
        <Button onClick={onNext} disabled={!roomName.trim()}>
          Continue
        </Button>
      }
    >
      <div className="space-y-5">
        <StepBadge step={1} total={4} label="Enter room name" />

        <div className="card p-4">
          <Input
            label="Room Name"
            placeholder="e.g. Room 204, PG Block A"
            value={roomName}
            onChange={(e) => onChange(e.target.value)}
            error={error}
            autoFocus
          />
        </div>
      </div>
    </Layout>
  )
}
