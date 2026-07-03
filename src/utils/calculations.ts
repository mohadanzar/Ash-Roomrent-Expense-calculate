import type { Expense, Member, MemberSplit } from '../types'

export function calculateSplits(
  members: Member[],
  rentAmount: number,
  expenses: Expense[],
): MemberSplit[] {
  if (members.length === 0) return []

  const count = members.length
  const rentShare = rentAmount / count

  return members.map((member) => {
    let expenseShare = 0
    let paidAmount = 0

    for (const expense of expenses) {
      expenseShare += expense.amount / count
      if (expense.paidById === member.id) {
        paidAmount += expense.amount
      }
    }

    const totalDue = rentShare + expenseShare - paidAmount

    return {
      memberId: member.id,
      memberName: member.name,
      phone: member.phone,
      rentShare,
      expenseShare,
      paidAmount,
      totalDue,
    }
  })
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function formatMonth(month: string): string {
  const [year, m] = month.split('-')
  const date = new Date(Number(year), Number(m) - 1)
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}
