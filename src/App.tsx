import { useState } from 'react'
import type { DayType } from './data/timetable'
import { Header } from './components/Header'
import { TabBar } from './components/TabBar'
import { TrainList } from './components/TrainList'
import { useCurrentTime } from './hooks/useCurrentTime'
import { useTimetable } from './hooks/useTimetable'

const getDefaultDayType = (now: Date): DayType => {
    const day = now.getDay()
    return day === 0 || day === 6 ? 'holiday' : 'weekday'
}

function App() {
    const now = useCurrentTime()
    const [dayType, setDayType] = useState<DayType>(() => getDefaultDayType(now))
    const trains = useTimetable(dayType, now)

    return (
        <div
            className="flex flex-col h-dvh bg-gray-50 max-w-md mx-auto"
            style={{
                paddingTop: 'env(safe-area-inset-top)',
                paddingBottom: 'env(safe-area-inset-bottom)',
            }}
        >
            <Header now={now} />
            <TabBar selected={dayType} onSelect={setDayType} />
            <main className="flex-1 overflow-y-auto">
                <TrainList trains={trains} />
            </main>
            <footer className="text-center text-xs text-gray-400 py-2 border-t border-gray-200 shrink-0">
                データ出典：駅探（2026年3月14日改正）
            </footer>
        </div>
    )
}

export default App
