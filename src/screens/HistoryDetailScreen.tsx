import { Layout } from '../components/Layout'
import { Button } from '../components/Button'
import type { RoomRecord } from '../types'
import { formatCurrency, formatMonth } from '../utils/calculations'
import { buildShareMessage, openSMS, openWhatsApp } from '../utils/share'

interface HistoryDetailScreenProps {
  record: RoomRecord
  onBack: () => void
  onHome: () => void
  onDelete: () => void
}

export function HistoryDetailScreen({ record, onBack, onHome, onDelete }: HistoryDetailScreenProps) {
  return (
    <Layout
      title="History Detail"
      onBack={onBack}
      onHome={onHome}
      footer={
        <Button variant="danger" onClick={onDelete}>Delete Record</Button>
      }
    >
      <div className="space-y-4">
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Room</p>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-text">{record.roomName}</h2>
          <p className="mt-0.5 text-sm text-text-muted">{formatMonth(record.month)}</p>
          <p className="mt-3 text-sm text-text-muted">
            Monthly rent: <strong className="text-brand">{formatCurrency(record.rentAmount)}</strong>
          </p>
        </div>

        {record.expenses.length > 0 && (
          <div className="card p-4">
            <h3 className="section-title">Expenses</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {record.expenses.map((e) => (
                <li key={e.id} className="flex justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                  <span className="text-text-muted">{e.label}</span>
                  <span className="font-semibold text-text">{formatCurrency(e.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="section-title">Member Splits</h3>
          {record.splits.map((split) => (
            <div key={split.memberId} className="card p-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-text">{split.memberName}</p>
                  <p className="text-sm text-text-muted">+91 {split.phone}</p>
                </div>
                <p className="font-bold text-brand">{formatCurrency(split.totalDue)}</p>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => openWhatsApp(split.phone, buildShareMessage(record, split))}
                  className="share-whatsapp flex-1 rounded-lg py-2 text-xs font-semibold"
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => openSMS(split.phone, buildShareMessage(record, split))}
                  className="share-sms flex-1 rounded-lg py-2 text-xs font-semibold"
                >
                  SMS
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
