import { useState, useEffect, useMemo } from 'react'
import type { Train } from './data/timetable'
import { timetable } from './data/timetable'
import { Header } from './components/Header'
import { DayBadge } from './components/DayBadge'
import { FilterBar } from './components/FilterBar'
import { TrainList } from './components/TrainList'
import { NextTrainCard } from './components/NextTrainCard'
import { useCurrentTime } from './hooks/useCurrentTime'
import { filterUpcomingTrains, getServiceDate, getDayType } from './hooks/useTimetable'
import { useFilter, filterByDestination } from './hooks/useFilter'
import { getTimetable } from './services/timetableService'
import { loadHolidays } from './services/holidayService'

function App() {
    const now = useCurrentTime()

    // ODPT API から時刻表を取得（初期値はフォールバック用ハードコードデータ）
    const [allTrainsMap, setAllTrainsMap] = useState<{ weekday: Train[]; holiday: Train[] }>(timetable)
    useEffect(() => {
        Promise.all([
            getTimetable('weekday'),
            getTimetable('holiday'),
        ]).then(([weekday, holiday]) => {
            setAllTrainsMap({ weekday, holiday })
        })
    }, [])

    // 祝日データを取得（失敗時は空 Set → 土日のみで判定）
    const [holidays, setHolidays] = useState<Set<string>>(new Set())
    useEffect(() => {
        loadHolidays().then(setHolidays)
    }, [])

    // サービス日（0〜4時台は前日扱い）と翌日サービス日
    const serviceDate = useMemo(() => getServiceDate(now), [now])
    const nextServiceDate = useMemo(() => {
        const next = new Date(serviceDate)
        next.setDate(next.getDate() + 1)
        return next
    }, [serviceDate])

    const dayType = useMemo(() => getDayType(serviceDate, holidays), [serviceDate, holidays])
    const nextDayType = useMemo(() => getDayType(nextServiceDate, holidays), [nextServiceDate, holidays])

    const allDayTrains = allTrainsMap[dayType]
    const upcomingTrains = useMemo(() => filterUpcomingTrains(allDayTrains, now), [allDayTrains, now])

    // 終電後は翌日ダイヤに切り替える
    const isNextDay = upcomingTrains.length === 0
    const displayDayType = isNextDay ? nextDayType : dayType
    const allDisplayDayTrains = allTrainsMap[displayDayType]
    const displayUpstreamTrains = isNextDay ? allDisplayDayTrains : upcomingTrains

    const { destinations, hiddenDestinations, toggleDestination, filteredTrains } = useFilter(allDisplayDayTrains, displayUpstreamTrains)

    // 残り列車が少ない（5本未満）場合は翌日分を接続表示
    const isLateNight = !isNextDay && upcomingTrains.length < 5
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
            {filteredTrains.length > 0 && (
                <NextTrainCard train={filteredTrains[0]} now={now} isNextDay={isNextDay} />
            )}
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
