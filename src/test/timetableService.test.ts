import { describe, it, expect } from 'vitest'
import { getTimetable } from '../services/timetableService'
import { timetable } from '../data/timetable'

describe('getTimetable', () => {
    it('平日ダイヤが正しく返ること', () => {
        const result = getTimetable('weekday')
        expect(result).toEqual(timetable.weekday)
        expect(result.length).toBeGreaterThan(0)
    })

    it('土休日ダイヤが正しく返ること', () => {
        const result = getTimetable('holiday')
        expect(result).toEqual(timetable.holiday)
        expect(result.length).toBeGreaterThan(0)
    })
})
