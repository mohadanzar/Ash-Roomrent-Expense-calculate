import { useCallback, useState } from 'react'
import type { Expense, Member, PersonalBudget, RoomRecord, SavedRoomProfile, Screen } from './types'
import { calculateSplits, getCurrentMonth } from './utils/calculations'
import { deleteRecord, loadHistory, saveRecord } from './utils/storage'
import { deletePersonalBudget, loadPersonalHistory } from './utils/personalStorage'
import { bootstrapProfilesFromHistory, loadSavedRoomProfiles, saveRoomProfile } from './utils/roomProfiles'
import { HomeScreen } from './screens/HomeScreen'
import { ExpenseScreen } from './screens/ExpenseScreen'
import { RoomHomeScreen } from './screens/RoomHomeScreen'
import { RoomScreen } from './screens/RoomScreen'
import { MembersScreen } from './screens/MembersScreen'
import { RentScreen } from './screens/RentScreen'
import { ExpensesScreen } from './screens/ExpensesScreen'
import { ResultScreen } from './screens/ResultScreen'
import { HistoryDetailScreen } from './screens/HistoryDetailScreen'
import { PersonalHistoryDetailScreen } from './screens/PersonalHistoryDetailScreen'
import { WelcomeSplash } from './screens/WelcomeSplash'

const emptyDraft = () => ({
  roomName: '',
  members: [] as Member[],
  rentAmount: '',
  expenses: [] as Expense[],
})

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [roomHistory, setRoomHistory] = useState<RoomRecord[]>(() => loadHistory())
  const [savedRooms, setSavedRooms] = useState<SavedRoomProfile[]>(() =>
    bootstrapProfilesFromHistory(loadHistory()),
  )
  const [expenseHistory, setExpenseHistory] = useState<PersonalBudget[]>(() => loadPersonalHistory())
  const [draft, setDraft] = useState(emptyDraft)
  const [reusingRoom, setReusingRoom] = useState(false)
  const [selectedRoomRecord, setSelectedRoomRecord] = useState<RoomRecord | null>(null)
  const [selectedExpenseRecord, setSelectedExpenseRecord] = useState<PersonalBudget | null>(null)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const goMainHome = useCallback(() => {
    setScreen('home')
    setDraft(emptyDraft())
    setReusingRoom(false)
    setSelectedRoomRecord(null)
    setSelectedExpenseRecord(null)
    setSaved(false)
    setErrors({})
  }, [])

  const goRoomHome = useCallback(() => {
    setScreen('room-home')
    setDraft(emptyDraft())
    setReusingRoom(false)
    setSelectedRoomRecord(null)
    setSaved(false)
    setErrors({})
    setSavedRooms(loadSavedRoomProfiles())
  }, [])

  const goExpenseHome = useCallback(() => {
    setScreen('expense')
    setSelectedExpenseRecord(null)
  }, [])

  const refreshExpenseHistory = useCallback(() => {
    setExpenseHistory(loadPersonalHistory())
  }, [])

  const startNewRoom = () => {
    setDraft(emptyDraft())
    setReusingRoom(false)
    setSaved(false)
    setErrors({})
    setScreen('room')
  }

  const startExistingRoom = (profile: SavedRoomProfile) => {
    setDraft({
      roomName: profile.roomName,
      members: profile.members,
      rentAmount: '',
      expenses: [],
    })
    setReusingRoom(true)
    setSaved(false)
    setErrors({})
    setScreen('rent')
  }

  const splits = calculateSplits(
    draft.members,
    parseFloat(draft.rentAmount) || 0,
    draft.expenses,
  )

  const handleSaveRoom = () => {
    const record: RoomRecord = {
      id: crypto.randomUUID(),
      roomName: draft.roomName.trim(),
      members: draft.members,
      rentAmount: parseFloat(draft.rentAmount),
      expenses: draft.expenses,
      month: getCurrentMonth(),
      savedAt: Date.now(),
      splits,
    }
    const updated = saveRecord(record)
    setRoomHistory(updated)
    setSavedRooms(saveRoomProfile(record.roomName, record.members))
    setSaved(true)
  }

  const handleDeleteRoom = () => {
    if (!selectedRoomRecord) return
    const updated = deleteRecord(selectedRoomRecord.id)
    setRoomHistory(updated)
    goRoomHome()
  }

  const handleDeleteExpense = () => {
    if (!selectedExpenseRecord) return
    const updated = deletePersonalBudget(selectedExpenseRecord.id)
    setExpenseHistory(updated)
    goExpenseHome()
  }

  switch (screen) {
    case 'splash':
      return <WelcomeSplash onComplete={() => setScreen('home')} />

    case 'home':
      return (
        <HomeScreen
          expenseCount={expenseHistory.length}
          roomCount={roomHistory.length}
          onOpenExpense={goExpenseHome}
          onOpenRoom={() => setScreen('room-home')}
        />
      )

    case 'expense':
      return (
        <ExpenseScreen
          history={expenseHistory}
          onRefreshHistory={refreshExpenseHistory}
          onViewHistory={(record) => {
            setSelectedExpenseRecord(record)
            setScreen('expense-history-detail')
          }}
          onBack={goMainHome}
          onHome={goMainHome}
        />
      )

    case 'expense-history-detail':
      if (!selectedExpenseRecord) {
        goExpenseHome()
        return null
      }
      return (
        <PersonalHistoryDetailScreen
          record={selectedExpenseRecord}
          onBack={goExpenseHome}
          onHome={goMainHome}
          onDelete={handleDeleteExpense}
        />
      )

    case 'room-home':
      return (
        <RoomHomeScreen
          history={roomHistory}
          savedRooms={savedRooms}
          onNewRoom={startNewRoom}
          onUseRoom={startExistingRoom}
          onViewHistory={(record) => {
            setSelectedRoomRecord(record)
            setScreen('history-detail')
          }}
          onBack={goMainHome}
          onHome={goMainHome}
        />
      )

    case 'room':
      return (
        <RoomScreen
          roomName={draft.roomName}
          onChange={(name) => setDraft((d) => ({ ...d, roomName: name }))}
          onNext={() => {
            if (!draft.roomName.trim()) {
              setErrors({ roomName: 'Room name is required' })
              return
            }
            setErrors({})
            setScreen('members')
          }}
          onHome={goRoomHome}
          error={errors.roomName}
        />
      )

    case 'members':
      return (
        <MembersScreen
          members={draft.members}
          onChange={(members) => setDraft((d) => ({ ...d, members }))}
          onNext={() => setScreen('rent')}
          onBack={() => setScreen('room')}
          onHome={goRoomHome}
        />
      )

    case 'rent':
      return (
        <RentScreen
          roomName={reusingRoom ? draft.roomName : undefined}
          rentAmount={draft.rentAmount}
          memberCount={draft.members.length}
          onChange={(rentAmount) => setDraft((d) => ({ ...d, rentAmount }))}
          onNext={() => {
            const amount = parseFloat(draft.rentAmount)
            if (!amount || amount <= 0) {
              setErrors({ rent: 'Enter valid rent amount' })
              return
            }
            setErrors({})
            setScreen('expenses')
          }}
          onBack={() => (reusingRoom ? goRoomHome() : setScreen('members'))}
          onHome={goRoomHome}
          error={errors.rent}
        />
      )

    case 'expenses':
      return (
        <ExpensesScreen
          members={draft.members}
          expenses={draft.expenses}
          reusingRoom={reusingRoom}
          onChange={(expenses) => setDraft((d) => ({ ...d, expenses }))}
          onNext={() => setScreen('result')}
          onBack={() => setScreen('rent')}
          onHome={goRoomHome}
        />
      )

    case 'result':
      return (
        <ResultScreen
          record={{
            roomName: draft.roomName.trim(),
            members: draft.members,
            rentAmount: parseFloat(draft.rentAmount),
            expenses: draft.expenses,
            month: getCurrentMonth(),
            splits,
          }}
          splits={splits}
          onSave={handleSaveRoom}
          onBack={() => setScreen('expenses')}
          onHome={goRoomHome}
          saved={saved}
        />
      )

    case 'history-detail':
      if (!selectedRoomRecord) {
        goRoomHome()
        return null
      }
      return (
        <HistoryDetailScreen
          record={selectedRoomRecord}
          onBack={goRoomHome}
          onHome={goMainHome}
          onDelete={handleDeleteRoom}
        />
      )

    default:
      return null
  }
}
