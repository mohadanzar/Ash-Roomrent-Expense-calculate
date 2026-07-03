import { useEffect, useId, useRef, useState } from 'react'

interface ComboboxProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  hint?: string
  allowAdd?: boolean
  onAddOption?: (value: string) => string[]
}

export function Combobox({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select or type',
  hint = 'Pick from list or type manually',
  allowAdd = true,
  onAddOption,
}: ComboboxProps) {
  const [list, setList] = useState(options)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputId = useId()

  useEffect(() => {
    setList(options)
  }, [options])

  const filtered = value.trim()
    ? list.filter((opt) => opt.toLowerCase().includes(value.trim().toLowerCase()))
    : list

  const showAddHint =
    allowAdd &&
    onAddOption &&
    value.trim().length > 0 &&
    !list.some((opt) => opt.toLowerCase() === value.trim().toLowerCase())

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectOption = (opt: string) => {
    onChange(opt)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-text">
        {label}
      </label>

      <div className="relative">
        <input
          id={inputId}
          type="text"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(e) => {
            onChange(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          className="h-12 w-full rounded-xl border border-border bg-white py-2 pl-4 pr-11 text-base text-text placeholder:text-slate-400 transition-colors focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15"
        />
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-lg text-text-muted active:bg-slate-100"
          aria-label={`Show ${label} options`}
        >
          <svg
            className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {open && (
        <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-border bg-white py-1 shadow-[var(--shadow-elevated)]">
          {filtered.length === 0 && !showAddHint && (
            <li className="px-4 py-3 text-sm text-text-muted">No matching options</li>
          )}

          {filtered.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => selectOption(opt)}
                className={`w-full px-4 py-2.5 text-left text-sm active:bg-brand-muted/50 ${
                  opt.toLowerCase() === value.trim().toLowerCase()
                    ? 'bg-brand-muted/40 font-semibold text-brand'
                    : 'text-text'
                }`}
              >
                {opt}
              </button>
            </li>
          ))}

          {showAddHint && (
            <li className="border-t border-border">
              <button
                type="button"
                onClick={() => {
                  const trimmed = value.trim()
                  const updated = onAddOption!(trimmed)
                  setList(updated)
                  onChange(trimmed)
                  setOpen(false)
                }}
                className="w-full px-4 py-2.5 text-left text-sm font-medium text-accent active:bg-accent-muted"
              >
                + Add &ldquo;{value.trim()}&rdquo; to list
              </button>
            </li>
          )}
        </ul>
      )}

      <p className="text-xs text-text-muted">{hint}</p>
    </div>
  )
}
