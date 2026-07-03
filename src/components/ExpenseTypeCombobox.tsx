import { useState } from 'react'
import { Combobox } from './Combobox'
import { addCustomExpenseType, getAllExpenseTypes } from '../utils/expenseTypes'

interface ExpenseTypeComboboxProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

export function ExpenseTypeCombobox({ value, onChange, label = 'Expense Type' }: ExpenseTypeComboboxProps) {
  const [options, setOptions] = useState(() => getAllExpenseTypes())

  return (
    <Combobox
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select or type expense name"
      hint="Pick from list or type a new expense name"
      onAddOption={(name) => {
        const updated = addCustomExpenseType(name)
        setOptions(updated)
        return updated
      }}
    />
  )
}

export function rememberExpenseType(name: string): void {
  addCustomExpenseType(name)
}
