import { Layout } from '../components/Layout'
import { Button } from '../components/Button'
import type { MemberSplit, RoomRecord } from '../types'
import { formatCurrency } from '../utils/calculations'
import { buildShareMessage, openSMS, openWhatsApp } from '../utils/share'

interface ResultScreenProps {
  record: Omit<RoomRecord, 'id' | 'savedAt'>
  splits: MemberSplit[]
  onSave: () => void
  onBack: () => void
  onHome: () => void
  saved: boolean
}

export function ResultScreen({ record, splits, onSave, onBack, onHome, saved }: ResultScreenProps) {
  const fullRecord: RoomRecord = {
    ...record,
    id: 'preview',
    savedAt: Date.now(),
    splits,
  }

  const shareToMember = (split: MemberSplit, type: 'whatsapp' | 'sms') => {
    const message = buildShareMessage(fullRecord, split)
    if (type === 'whatsapp') {
      openWhatsApp(split.phone, message)
    } else {
      openSMS(split.phone, message)
    }
  }

  const shareAll = () => {
    const message = buildShareMessage(fullRecord)
    if (splits[0]) {
      openWhatsApp(splits[0].phone, message)
    }
  }

  return (
    <Layout
      title="Split Result"
      onBack={onBack}
      onHome={onHome}
      footer={
        <>
          {!saved ? (
            <Button variant="success" onClick={onSave}>Save</Button>
          ) : (
            <Button variant="secondary" onClick={onHome}>Home</Button>
          )}
          <Button variant="outline" onClick={shareAll}>Share All</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="result-banner">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Summary</p>
          <h2 className="mt-1 text-lg font-bold tracking-tight">{record.roomName}</h2>
          <p className="mt-1 text-sm text-white/80">
            Rent: {formatCurrency(record.rentAmount)} · {record.members.length} members
          </p>
          {record.expenses.length > 0 && (
            <p className="mt-0.5 text-sm text-white/80">
              + {record.expenses.length} shared expense(s)
            </p>
          )}
        </div>

        <div className="space-y-3">
          {splits.map((split) => (
            <div key={split.memberId} className="card-elevated p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold tracking-tight text-text">{split.memberName}</h3>
                  <p className="text-sm text-text-muted">+91 {split.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-text-muted">Total due</p>
                  <p className={`text-xl font-bold tracking-tight ${split.totalDue < 0 ? 'text-success' : 'text-brand'}`}>
                    {split.totalDue < 0 ? `Credit ${formatCurrency(Math.abs(split.totalDue))}` : formatCurrency(split.totalDue)}
                  </p>
                </div>
              </div>

              <div className="mt-3.5 grid grid-cols-3 gap-2">
                <div className="stat-pill">
                  <p className="stat-pill-label">Rent</p>
                  <p className="stat-pill-value">{formatCurrency(split.rentShare)}</p>
                </div>
                <div className="stat-pill">
                  <p className="stat-pill-label">Expenses</p>
                  <p className="stat-pill-value">{formatCurrency(split.expenseShare)}</p>
                </div>
                <div className="stat-pill">
                  <p className="stat-pill-label">Paid</p>
                  <p className="stat-pill-value text-success">-{formatCurrency(split.paidAmount)}</p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => shareToMember(split, 'whatsapp')}
                  className="share-whatsapp flex flex-1 items-center justify-center rounded-xl py-2.5 text-sm font-semibold active:opacity-90"
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => shareToMember(split, 'sms')}
                  className="share-sms flex flex-1 items-center justify-center rounded-xl py-2.5 text-sm font-semibold active:opacity-90"
                >
                  SMS
                </button>
              </div>
            </div>
          ))}
        </div>

        {saved && (
          <div className="alert-success">
            Saved to history successfully
          </div>
        )}

        <Button variant="secondary" onClick={onHome}>
          Exit to Home
        </Button>
      </div>
    </Layout>
  )
}
