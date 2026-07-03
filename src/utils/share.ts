import type { MemberSplit, RoomRecord } from '../types'
import { formatCurrency, formatMonth } from './calculations'

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `91${digits}`
  return digits
}

export function buildShareMessage(record: RoomRecord, split?: MemberSplit): string {
  const lines: string[] = [
    `🏠 *${record.roomName}* — ${formatMonth(record.month)}`,
    `Room Rent: ${formatCurrency(record.rentAmount)}`,
    '',
  ]

  if (record.expenses.length > 0) {
    lines.push('*Expenses:*')
    for (const exp of record.expenses) {
      const payer = record.members.find((m) => m.id === exp.paidById)?.name ?? 'Unknown'
      lines.push(`• ${exp.label}: ${formatCurrency(exp.amount)} (paid by ${payer})`)
    }
    lines.push('')
  }

  if (split) {
    lines.push(`*${split.memberName}'s Share:*`)
    lines.push(`Rent share: ${formatCurrency(split.rentShare)}`)
    lines.push(`Expense share: ${formatCurrency(split.expenseShare)}`)
    if (split.paidAmount > 0) {
      lines.push(`Paid by you: -${formatCurrency(split.paidAmount)}`)
    }
    lines.push(`*Total to pay: ${formatCurrency(split.totalDue)}*`)
  } else {
    lines.push('*Split Summary:*')
    for (const s of record.splits) {
      lines.push(`• ${s.memberName}: ${formatCurrency(s.totalDue)}`)
    }
  }

  return lines.join('\n')
}

export function openWhatsApp(phone: string, message: string): void {
  const url = `https://wa.me/${formatPhone(phone)}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}

export function openSMS(phone: string, message: string): void {
  const digits = phone.replace(/\D/g, '')
  const url = `sms:${digits}?body=${encodeURIComponent(message)}`
  window.location.href = url
}

export function shareAllWhatsApp(record: RoomRecord): void {
  const message = buildShareMessage(record)
  const firstPhone = record.members[0]?.phone
  if (firstPhone) {
    openWhatsApp(firstPhone, message)
  }
}
