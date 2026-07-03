export interface Member {
  id: string
  name: string
  phone: string
}

export interface Expense {
  id: string
  label: string
  amount: number
  paidById: string
}

export interface MemberSplit {
  memberId: string
  memberName: string
  phone: string
  rentShare: number
  expenseShare: number
  paidAmount: number
  totalDue: number
}

export interface SavedRoomProfile {
  id: string
  roomName: string
  members: Member[]
  lastUsedAt: number
}

export interface RoomRecord {
  id: string
  roomName: string
  members: Member[]
  rentAmount: number
  expenses: Expense[]
  month: string
  savedAt: number
  splits: MemberSplit[]
}

export interface PersonalExpenseItem {
  id: string
  label: string
  amount: number
}

export interface PersonalBudget {
  id: string
  salary: number
  expenses: PersonalExpenseItem[]
  month: string
  savedAt: number
}

export type Screen =
  | 'splash'
  | 'home'
  | 'expense'
  | 'expense-history-detail'
  | 'room-home'
  | 'room'
  | 'members'
  | 'rent'
  | 'expenses'
  | 'result'
  | 'history-detail'

export const EXPENSE_TYPES = ['EB (Electricity)', 'Water', 'Sanitary', 'Other'] as const

export const PERSONAL_EXPENSE_TYPES = [
  'Room Rent',
  'EB (Electricity)',
  'Water',
  'Food',
  'Transport',
  'Mobile/Recharge',
  'Sanitary',
  'WiFi/Internet',
  'Other',
] as const
