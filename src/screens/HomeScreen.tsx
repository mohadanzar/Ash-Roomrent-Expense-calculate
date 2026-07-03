import type { ReactNode } from 'react'
import { Layout } from '../components/Layout'

interface MenuCardProps {
  label: string
  title: string
  description: string
  count?: number
  icon: ReactNode
  onClick: () => void
  variant?: 'brand' | 'success'
}

export function MenuCard({ label, title, description, count, icon, onClick, variant = 'brand' }: MenuCardProps) {
  const bgClass = variant === 'brand'
    ? 'bg-gradient-to-br from-brand to-brand-light'
    : 'bg-gradient-to-br from-[#0f766e] to-success'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${bgClass} w-full rounded-2xl p-5 text-left text-white shadow-[var(--shadow-elevated)] transition-transform active:scale-[0.98]`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
          {icon}
        </div>
        {count !== undefined && count > 0 && (
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
            {count} saved
          </span>
        )}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-white/60">{label}</p>
      <h2 className="mt-1 text-lg font-bold tracking-tight">{title}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-white/75">{description}</p>
    </button>
  )
}

interface HomeScreenProps {
  expenseCount: number
  roomCount: number
  onOpenExpense: () => void
  onOpenRoom: () => void
}

export function HomeScreen({ expenseCount, roomCount, onOpenExpense, onOpenRoom }: HomeScreenProps) {
  return (
    <Layout title="Rent & Expense Calculator">
      <div className="space-y-5">
        <p className="text-center text-sm text-text-muted">
          Choose what you want to calculate
        </p>

        <MenuCard
          label="Personal"
          title="Expense Calculator"
          description="Track salary, add monthly expenses and see how much remains."
          count={expenseCount}
          variant="success"
          onClick={onOpenExpense}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <MenuCard
          label="Shared Room"
          title="Room Rent Calculator"
          description="Split room rent and shared bills among members fairly."
          count={roomCount}
          onClick={onOpenRoom}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
        />
      </div>
    </Layout>
  )
}
