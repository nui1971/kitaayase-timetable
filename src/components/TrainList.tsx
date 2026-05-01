import { useState } from 'react'
import type { DayType, Train } from '../data/timetable'
import { TrainRow } from './TrainRow'
import { toAbsoluteMinutes, toCurrentAbsoluteMinutes } from '../hooks/useTimetable'

interface TrainListProps {
    trains: Train[]
    now: Date
    dayType: DayType
}

const INITIAL_COUNT = 5

const DAY_LABEL: Record<DayType, string> = {
    weekday: '平日',
    holiday: '土・休日',
}

export const TrainList = ({ trains, now, dayType }: TrainListProps) => {
    const [expanded, setExpanded] = useState(false)

    if (trains.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-lg font-medium text-gray-400">本日の運行は終了しました</p>
                <p className="text-sm mt-2 text-gray-500">また明日ご利用ください</p>
            </div>
        )
    }

    const displayed = expanded ? trains : trains.slice(0, INITIAL_COUNT)
    const remaining = trains.length - INITIAL_COUNT
    const currentMinutes = toCurrentAbsoluteMinutes(now)

    return (
        <div>
            <TrainRow
                train={trains[0]}
                isNext={true}
                isLast={trains.length === 1}
                minutesUntil={toAbsoluteMinutes(trains[0].hour, trains[0].minute) - currentMinutes}
            />
            <div className="flex items-center justify-between px-4 py-2 bg-[#0a0f1e] border-b border-[#1e2a3a]">
                <span className="text-xs text-gray-400">綾瀬・代々木上原方面</span>
                <span className="text-xs text-gray-500">{DAY_LABEL[dayType]}</span>
            </div>
            <ul>
                {displayed.map((train, index) => (
                    <li key={`${train.hour}-${train.minute}-${train.destination}`}>
                        <TrainRow
                            train={train}
                            isNext={index === 0}
                            isLast={index === trains.length - 1}
                            minutesUntil={toAbsoluteMinutes(train.hour, train.minute) - currentMinutes}
                        />
                    </li>
                ))}
            </ul>
            {!expanded && remaining > 0 && (
                <button
                    onClick={() => setExpanded(true)}
                    className="w-full py-3 text-sm text-gray-400 hover:text-gray-200 bg-[#0d1526] border-t border-[#1e2a3a] transition-colors"
                >
                    ▼ さらに表示（+{remaining}本）
                </button>
            )}
        </div>
    )
}
