import { useState } from 'react'
import { Combobox } from './Combobox'
import { addCustomRoomExpenseType, getAllRoomExpenseTypes } from '../utils/roomExpenseTypes'

interface RoomExpenseTypeComboboxProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

export function RoomExpenseTypeCombobox({ value, onChange, label = 'Expense Type' }: RoomExpenseTypeComboboxProps) {
  const [options, setOptions] = useState(() => getAllRoomExpenseTypes())

  return (
    <Combobox
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select or type expense name"
      hint="Pick from list or type a new expense name"
      onAddOption={(name) => {
        const updated = addCustomRoomExpenseType(name)
        setOptions(updated)
        return updated
      }}
    />
  )
}

export function rememberRoomExpenseType(name: string): void {
  addCustomRoomExpenseType(name)
}
