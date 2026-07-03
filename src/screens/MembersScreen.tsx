import { useState } from 'react'
import { Layout } from '../components/Layout'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { StepBadge } from '../components/StepBadge'
import type { Member } from '../types'

interface MembersScreenProps {
  members: Member[]
  onChange: (members: Member[]) => void
  onNext: () => void
  onBack: () => void
  onHome: () => void
}

function generateId(): string {
  return crypto.randomUUID()
}

function isValidPhone(phone: string): boolean {
  return /^\d{10}$/.test(phone.replace(/\D/g, ''))
}

export function MembersScreen({ members, onChange, onNext, onBack, onHome }: MembersScreenProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const addMember = () => {
    const trimmedName = name.trim()
    const digits = phone.replace(/\D/g, '')

    if (!trimmedName) {
      setError('Enter member name')
      return
    }
    if (!isValidPhone(digits)) {
      setError('Enter valid 10-digit mobile number')
      return
    }
    if (members.some((m) => m.phone.replace(/\D/g, '') === digits)) {
      setError('This number is already added')
      return
    }

    onChange([...members, { id: generateId(), name: trimmedName, phone: digits }])
    setName('')
    setPhone('')
    setError('')
  }

  const removeMember = (id: string) => {
    onChange(members.filter((m) => m.id !== id))
  }

  return (
    <Layout
      title="Room Members"
      onBack={onBack}
      onHome={onHome}
      footer={
        <Button onClick={onNext} disabled={members.length === 0}>
          Continue
        </Button>
      }
    >
      <div className="space-y-5">
        <StepBadge step={2} total={4} label="Add members with mobile number" />

        <div className="card space-y-3 p-4">
          <Input
            label="Member Name"
            placeholder="e.g. Rahul"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Mobile Number"
            type="tel"
            inputMode="numeric"
            placeholder="10-digit number"
            value={phone}
            maxLength={10}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          />
          {error && <p className="text-sm font-medium text-danger">{error}</p>}
          <Button variant="outline" onClick={addMember}>
            + Add Member
          </Button>
        </div>

        {members.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="section-title">Added Members ({members.length})</h3>
            {members.map((member, index) => (
              <div
                key={member.id}
                className="card flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="avatar">{index + 1}</span>
                  <div>
                    <p className="font-semibold text-text">{member.name}</p>
                    <p className="text-sm text-text-muted">+91 {member.phone}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeMember(member.id)}
                  className="rounded-lg px-2.5 py-1 text-sm font-medium text-danger active:bg-danger-muted"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
