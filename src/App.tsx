import { useMemo } from 'react'
import type { DayType } from './data/timetable'
import { timetable } from './data/timetable'
import { Header } from './components/Header'
import { DayBadge } from './components/DayBadge'
import { FilterBar } from './components/FilterBar'
import { TrainList } from './components/TrainList'
import { useCurrentTime } from './hooks/useCurrentTime'
import { filterUpcomingTrains, getNextDayType } from './hooks/useTimetable'
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

    // 終電後は翌日ダイヤに切り替える
    const isNextDay = upcomingTrains.length === 0
    const nextDayType = useMemo(() => getNextDayType(now.getDay()), [now])
    const displayDayType = isNextDay ? nextDayType : dayType
    const allDisplayDayTrains = useMemo(() => timetable[displayDayType], [displayDayType])
    const displayUpstreamTrains = isNextDay ? allDisplayDayTrains : upcomingTrains

    const { destinations, hiddenDestinations, toggleDestination, filteredTrains } = useFilter(allDisplayDayTrains, displayUpstreamTrains)

    return (
        <div style={{
            backgroundColor: '#0d1526',
            fontFamily: 'sans-serif',
            display: 'flex',
            flexDirection: 'column',
            height: '100dvh',
            maxWidth: '430px',
            margin: '0 auto',
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
            <Header now={now} isNextDay={isNextDay} />
            <DayBadge dayType={displayDayType} />
            <FilterBar
                destinations={destinations}
                hiddenDestinations={hiddenDestinations}
                onToggle={toggleDestination}
            />
            <main style={{ flex: 1, overflowY: 'auto' }}>
                <TrainList trains={filteredTrains} now={now} isNextDay={isNextDay} />
            </main>
            <footer style={{
                textAlign: 'center',
                fontSize: '11px',
                color: '#4a5568',
                padding: '8px',
                borderTop: '0.5px solid rgba(255,255,255,0.08)',
                flexShrink: 0,
            }}>
                データ出典：東京メトロ（2026年3月14日改正）
            </footer>
        </div>
    )
}

export default App
