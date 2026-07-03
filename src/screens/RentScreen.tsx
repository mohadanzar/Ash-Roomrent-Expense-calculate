import { Layout } from '../components/Layout'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { StepBadge } from '../components/StepBadge'
import { formatCurrency } from '../utils/calculations'

interface RentScreenProps {
  roomName?: string
  rentAmount: string
  memberCount: number
  onChange: (amount: string) => void
  onNext: () => void
  onBack: () => void
  onHome: () => void
  error?: string
}

export function RentScreen({
  roomName,
  rentAmount,
  memberCount,
  onChange,
  onNext,
  onBack,
  onHome,
  error,
}: RentScreenProps) {
  const amount = parseFloat(rentAmount) || 0
  const perPerson = memberCount > 0 ? amount / memberCount : 0
  const isReusing = Boolean(roomName)

  return (
    <Layout
      title="Room Rent"
      onBack={onBack}
      onHome={onHome}
      footer={
        <Button onClick={onNext} disabled={!rentAmount || amount <= 0}>
          Continue
        </Button>
      }
    >
      <div className="space-y-5">
        {isReusing ? (
          <div className="card border-brand-muted bg-brand-muted/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">Same Room</p>
            <h2 className="mt-1 text-lg font-bold text-text">{roomName}</h2>
            <p className="mt-0.5 text-sm text-text-muted">{memberCount} members · ready to calculate</p>
          </div>
        ) : null}

        <StepBadge
          step={isReusing ? 1 : 3}
          total={isReusing ? 2 : 4}
          label="Enter total monthly rent"
        />

        <div className="card p-4">
          <Input
            label="Room Rent Amount (₹)"
            type="number"
            inputMode="decimal"
            placeholder="e.g. 12000"
            value={rentAmount}
            onChange={(e) => onChange(e.target.value)}
            error={error}
            autoFocus
          />
        </div>

        {amount > 0 && memberCount > 0 && (
          <div className="card-elevated border-brand-muted bg-brand-muted/40 p-4">
            <p className="text-sm font-medium text-brand">
              Split among <strong>{memberCount}</strong> members
            </p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight text-brand-dark">
              {formatCurrency(perPerson)}
              <span className="ml-1 text-base font-medium text-text-muted">/ person</span>
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}
