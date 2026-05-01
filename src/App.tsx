import { useMemo } from 'react'
import type { DayType } from './data/timetable'
import { timetable } from './data/timetable'
import { Header } from './components/Header'
import { FilterBar } from './components/FilterBar'
import { TrainList } from './components/TrainList'
import { useCurrentTime } from './hooks/useCurrentTime'
import { filterUpcomingTrains } from './hooks/useTimetable'
import { useFilter } from './hooks/useFilter'

const getDayType = (now: Date): DayType => {
    const day = now.getDay()
    return day === 0 || day === 6 ? 'holiday' : 'weekday'
}

function App() {
    const now = useCurrentTime()
    const dayType = getDayType(now)

    const allDayTrains = useMemo(() => timetable[dayType], [dayType])
    const upcomingTrains = useMemo(() => filterUpcomingTrains(allDayTrains, now), [allDayTrains, now])

    const { destinations, hiddenDestinations, toggleDestination, filteredTrains } = useFilter(allDayTrains, upcomingTrains)

    return (
        <div
            className="flex flex-col h-dvh bg-[#0a0f1e] max-w-md mx-auto"
            style={{
                paddingTop: 'env(safe-area-inset-top)',
                paddingBottom: 'env(safe-area-inset-bottom)',
            }}
        >
            <Header now={now} dayType={dayType} />
            <FilterBar
                destinations={destinations}
                hiddenDestinations={hiddenDestinations}
                onToggle={toggleDestination}
            />
            <main className="flex-1 overflow-y-auto">
                <TrainList trains={filteredTrains} now={now} dayType={dayType} />
            </main>
            <footer className="text-center text-xs text-gray-500 py-2 border-t border-[#1e2a3a] shrink-0">
                データ出典：東京メトロ（2026年3月14日改正）
            </footer>
        </div>
    )
}

export default App
