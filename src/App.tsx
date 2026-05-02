import { useState, useEffect, useMemo } from 'react'
import type { DayType, Train } from './data/timetable'
import { timetable } from './data/timetable'
import { Header } from './components/Header'
import { DayBadge } from './components/DayBadge'
import { FilterBar } from './components/FilterBar'
import { TrainList } from './components/TrainList'
import { useCurrentTime } from './hooks/useCurrentTime'
import { filterUpcomingTrains, getNextDayType, getServiceDay } from './hooks/useTimetable'
import { useFilter, filterByDestination } from './hooks/useFilter'
import { getTimetable } from './services/timetableService'

const getDayType = (serviceDay: number): DayType => {
    return serviceDay === 0 || serviceDay === 6 ? 'holiday' : 'weekday'
}

function App() {
    const now = useCurrentTime()
    const serviceDayOfWeek = getServiceDay(now)
    const dayType = getDayType(serviceDayOfWeek)

    // アプリ起動時に ODPT API から取得（初期値はフォールバック用ハードコードデータ）
    const [allTrainsMap, setAllTrainsMap] = useState<{ weekday: Train[]; holiday: Train[] }>(timetable)

    useEffect(() => {
        Promise.all([
            getTimetable('weekday'),
            getTimetable('holiday'),
        ]).then(([weekday, holiday]) => {
            setAllTrainsMap({ weekday, holiday })
        })
    }, [])

    const allDayTrains = allTrainsMap[dayType]
    const upcomingTrains = useMemo(() => filterUpcomingTrains(allDayTrains, now), [allDayTrains, now])

    // 終電後は翌日ダイヤに切り替える
    const isNextDay = upcomingTrains.length === 0
    const nextDayType = useMemo(() => getNextDayType(serviceDayOfWeek), [serviceDayOfWeek])
    const displayDayType = isNextDay ? nextDayType : dayType
    const allDisplayDayTrains = allTrainsMap[displayDayType]
    const displayUpstreamTrains = isNextDay ? allDisplayDayTrains : upcomingTrains

    const { destinations, hiddenDestinations, toggleDestination, filteredTrains } = useFilter(allDisplayDayTrains, displayUpstreamTrains)

    // 深夜帯（0〜4時）で本日の残り列車がある場合、翌日分を接続表示
    const isLateNight = !isNextDay && now.getHours() < 5
    const connectedTrains = useMemo(
        () => isLateNight ? filterByDestination(allTrainsMap[nextDayType], hiddenDestinations) : undefined,
        [isLateNight, allTrainsMap, nextDayType, hiddenDestinations]
    )

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
                <TrainList trains={filteredTrains} now={now} isNextDay={isNextDay} connectedTrains={connectedTrains} />
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
