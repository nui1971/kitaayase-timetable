import { useState, useEffect } from 'react'
import type { DayType, Train } from '../data/timetable'
import { getTimetable } from '../services/timetableService'

// 列車時刻を深夜0時をまたいで比較できる絶対分数に変換する
// 0時台は24時台として扱い、前日の終電と当日の始発を正しく区別する

export const toAbsoluteMinutes = (hour: number, minute: number): number => {
    const h = hour === 0 ? 24 : hour
    return h * 60 + minute
}

// 現在時刻を絶対分数に変換する（0〜4時台は24〜28時台として扱う）
export const toCurrentAbsoluteMinutes = (now: Date): number => {
    const h = now.getHours()
    const m = now.getMinutes()
    return (h < 5 ? 24 + h : h) * 60 + m
}

// 現在時刻以降の列車のみ返す（テスト可能な純粋関数として公開）
export const filterUpcomingTrains = (trains: Train[], now: Date): Train[] => {
    const current = toCurrentAbsoluteMinutes(now)
    return trains.filter(({ hour, minute }) => toAbsoluteMinutes(hour, minute) >= current)
}

// 翌日の曜日種別を返す（月〜金→weekday、土日→holiday）
export const getNextDayType = (currentDayOfWeek: number): DayType => {
    const nextDay = (currentDayOfWeek + 1) % 7
    return nextDay === 0 || nextDay === 6 ? 'holiday' : 'weekday'
}

// サービス日の曜日を返す（0〜4時台は前日のサービス日として扱う）
// 例：日曜00:30 → 土曜のサービス日 (6)
export const getServiceDay = (now: Date): number => {
    const h = now.getHours()
    const day = now.getDay()
    return h < 5 ? (day + 6) % 7 : day
}

// サービス日の Date を返す（0〜4時台は前日のカレンダー日）
export const getServiceDate = (now: Date): Date => {
    if (now.getHours() < 5) {
        const prev = new Date(now)
        prev.setDate(prev.getDate() - 1)
        return prev
    }
    return new Date(now)
}

// 指定日が祝日リストに含まれるか判定する（形式：YYYY-MM-DD）
export const isHoliday = (date: Date, holidays: Set<string>): boolean => {
    const yyyy = date.getFullYear()
    const mm = (date.getMonth() + 1).toString().padStart(2, '0')
    const dd = date.getDate().toString().padStart(2, '0')
    return holidays.has(`${yyyy}-${mm}-${dd}`)
}

// 日付と祝日リストからダイヤ種別を返す（土日・祝日 → holiday）
export const getDayType = (date: Date, holidays: Set<string>): DayType => {
    const day = date.getDay()
    if (day === 0 || day === 6) return 'holiday'
    if (isHoliday(date, holidays)) return 'holiday'
    return 'weekday'
}

export const useTimetable = (dayType: DayType, now: Date): Train[] => {
    const [trains, setTrains] = useState<Train[]>([])

    useEffect(() => {
        getTimetable(dayType).then(allTrains => {
            setTrains(filterUpcomingTrains(allTrains, now))
        })
    }, [dayType, now])

    return trains
}
