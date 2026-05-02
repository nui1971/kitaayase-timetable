import { describe, it, expect } from 'vitest'
import {
    toAbsoluteMinutes,
    toCurrentAbsoluteMinutes,
    filterUpcomingTrains,
    getNextDayType,
    getServiceDay,
} from '../hooks/useTimetable'
import type { Train } from '../data/timetable'

const makeDate = (hour: number, minute: number): Date => {
    const d = new Date()
    d.setHours(hour, minute, 0, 0)
    return d
}

const trains: Train[] = [
    { hour: 10, minute: 0,  destination: '綾瀬',      trainType: '普通' },
    { hour: 10, minute: 30, destination: '代々木上原', trainType: '普通' },
    { hour: 11, minute: 0,  destination: '綾瀬',      trainType: '普通' },
    { hour: 17, minute: 44, destination: '伊勢原',    trainType: '急行' },
    { hour: 23, minute: 55, destination: '綾瀬',      trainType: '普通' },
    { hour: 0,  minute: 15, destination: '綾瀬',      trainType: '普通' },
]

describe('toAbsoluteMinutes', () => {
    it('通常時刻を分数に変換する', () => {
        expect(toAbsoluteMinutes(10, 30)).toBe(630)
    })

    it('0時台は24時台として扱う', () => {
        expect(toAbsoluteMinutes(0, 15)).toBe(24 * 60 + 15)
    })

    it('23時台を正しく変換する', () => {
        expect(toAbsoluteMinutes(23, 55)).toBe(23 * 60 + 55)
    })
})

describe('toCurrentAbsoluteMinutes', () => {
    it('通常時刻を正しく変換する', () => {
        expect(toCurrentAbsoluteMinutes(makeDate(10, 30))).toBe(630)
    })

    it('深夜0時台は24時台として扱う', () => {
        expect(toCurrentAbsoluteMinutes(makeDate(0, 15))).toBe(24 * 60 + 15)
    })

    it('深夜1時台は25時台として扱う', () => {
        expect(toCurrentAbsoluteMinutes(makeDate(1, 0))).toBe(25 * 60)
    })

    it('5時台以降は通常通り変換する', () => {
        expect(toCurrentAbsoluteMinutes(makeDate(5, 0))).toBe(5 * 60)
    })
})

describe('filterUpcomingTrains', () => {
    it('現在時刻以降の列車のみ返す（10:15 → 5本）', () => {
        // 10:00は過ぎているので除外、10:30以降5本が対象
        const result = filterUpcomingTrains(trains, makeDate(10, 15))
        expect(result).toHaveLength(5)
        expect(result[0]).toMatchObject({ hour: 10, minute: 30 })
    })

    it('現在時刻と同じ列車も含める（10:00 → 6本）', () => {
        const result = filterUpcomingTrains(trains, makeDate(10, 0))
        expect(result).toHaveLength(6)
        expect(result[0]).toMatchObject({ hour: 10, minute: 0 })
    })

    it('全列車が過ぎた場合は空配列を返す（0:16以降）', () => {
        const now = makeDate(0, 16)
        const result = filterUpcomingTrains(trains, now)
        expect(result).toHaveLength(0)
    })

    it('深夜0時台の最終列車を正しくフィルタする（0:10 → 1本）', () => {
        const result = filterUpcomingTrains(trains, makeDate(0, 10))
        expect(result).toHaveLength(1)
        expect(result[0]).toMatchObject({ hour: 0, minute: 15 })
    })

    it('23:56時点では0:15の1本のみ残る', () => {
        const result = filterUpcomingTrains(trains, makeDate(23, 56))
        expect(result).toHaveLength(1)
        expect(result[0]).toMatchObject({ hour: 0, minute: 15 })
    })
})

describe('getServiceDay', () => {
    // getDay(): 0=日, 1=月, 2=火, 3=水, 4=木, 5=金, 6=土
    const makeDateTime = (day: number, hour: number): Date => {
        const d = new Date(2025, 0, 5 + day) // 2025-01-05 は日曜 (0)
        d.setHours(hour, 0, 0, 0)
        return d
    }

    it('通常時間帯（5時以降）は getDay() をそのまま返す', () => {
        // 土曜 10:00 → サービス日 = 土曜 (6)
        expect(getServiceDay(makeDateTime(6, 10))).toBe(6)
    })

    it('深夜0〜4時は前日のサービス日を返す', () => {
        // 日曜 00:30 → 土曜のサービス日 (6)
        expect(getServiceDay(makeDateTime(0, 0))).toBe(6)
    })

    it('日曜深夜2時は土曜のサービス日 (6) を返す', () => {
        expect(getServiceDay(makeDateTime(0, 2))).toBe(6)
    })

    it('月曜00:30は日曜のサービス日 (0) を返す', () => {
        expect(getServiceDay(makeDateTime(1, 0))).toBe(0)
    })

    it('5時ちょうどは新しいサービス日として扱う', () => {
        // 日曜 05:00 → 日曜のサービス日 (0)
        expect(getServiceDay(makeDateTime(0, 5))).toBe(0)
    })

    it('月曜05:00は月曜のサービス日 (1) を返す', () => {
        expect(getServiceDay(makeDateTime(1, 5))).toBe(1)
    })
})

describe('getNextDayType', () => {
    it('終電後に翌日ダイヤに切り替わること（火曜→水曜＝平日）', () => {
        // 2（火曜）→ 3（水曜）= 平日
        expect(getNextDayType(2)).toBe('weekday')
    })

    it('金曜終電後は土休日ダイヤになること', () => {
        // 5（金曜）→ 6（土曜）= 土休日
        expect(getNextDayType(5)).toBe('holiday')
    })

    it('日曜終電後は平日ダイヤになること', () => {
        // 0（日曜）→ 1（月曜）= 平日
        expect(getNextDayType(0)).toBe('weekday')
    })
})
