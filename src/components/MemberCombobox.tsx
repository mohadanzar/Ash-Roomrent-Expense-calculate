import { useMemo } from 'react'
import { Combobox } from './Combobox'
import type { Member } from '../types'

interface MemberComboboxProps {
  members: Member[]
  value: string
  onChange: (value: string) => void
  label?: string
}

export function MemberCombobox({ members, value, onChange, label = 'Paid By' }: MemberComboboxProps) {
  const names = useMemo(() => members.map((m) => m.name), [members])

  return (
    <Combobox
      label={label}
      value={value}
      onChange={onChange}
      options={names}
      placeholder="Select or type member name"
      hint="Pick a member from list or type their name"
      allowAdd={false}
    />
  )
}

export function resolveMemberByName(members: Member[], name: string): Member | undefined {
  const trimmed = name.trim().toLowerCase()
  return members.find((m) => m.name.toLowerCase() === trimmed)
}
