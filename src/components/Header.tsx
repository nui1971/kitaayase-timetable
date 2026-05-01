import { useState, useEffect } from 'react'
import type { DayType } from '../data/timetable'

interface HeaderProps {
    now: Date
    dayType: DayType
}

const DAY_LABEL: Record<DayType, string> = {
    weekday: '平日',
    holiday: '土・休日',
}

export const Header = ({ now, dayType }: HeaderProps) => {
    const [seconds, setSeconds] = useState(() => new Date().getSeconds())

    useEffect(() => {
        const id = setInterval(() => setSeconds(new Date().getSeconds()), 1000)
        return () => clearInterval(id)
    }, [])

    const hh = now.getHours().toString().padStart(2, '0')
    const mm = now.getMinutes().toString().padStart(2, '0')
    const ss = seconds.toString().padStart(2, '0')

    const dateStr = now.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
    })

    return (
        <header className="bg-[#0a0f1e] text-white px-4 pt-3 pb-2 flex justify-between items-start">
            <div>
                <div className="text-[#00c853] text-xs font-bold mb-0.5">C20</div>
                <div className="text-2xl font-bold leading-tight">北綾瀬</div>
                <div className="text-xs text-gray-400">Kita-Ayase</div>
            </div>
            <div className="text-right">
                <div className="flex items-baseline justify-end">
                    <time className="text-4xl font-mono font-bold" dateTime={`${hh}:${mm}`}>
                        {hh}:{mm}
                    </time>
                    <span className="text-lg font-mono text-gray-400 ml-1">{ss}</span>
                </div>
                <div className="text-xs text-gray-400">{dateStr}</div>
                <div className="text-xs text-gray-500 mt-0.5">{DAY_LABEL[dayType]}</div>
            </div>
        </header>
    )
}
