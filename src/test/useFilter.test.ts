import { describe, it, expect } from 'vitest'
import { extractDestinations, filterByDestination } from '../hooks/useFilter'
import type { Train } from '../data/timetable'

const trains: Train[] = [
    { hour: 10, minute: 0,  destination: '綾瀬',      trainType: '普通' },
    { hour: 10, minute: 30, destination: '代々木上原', trainType: '普通' },
    { hour: 11, minute: 0,  destination: '綾瀬',      trainType: '普通' },
    { hour: 17, minute: 44, destination: '伊勢原',    trainType: '急行' },
]

describe('extractDestinations', () => {
    it('重複なしでソートされた行き先一覧を返す', () => {
        const result = extractDestinations(trains)
        expect(result).toEqual(['代々木上原', '伊勢原', '綾瀬'])
    })

    it('空配列の場合は空配列を返す', () => {
        expect(extractDestinations([])).toEqual([])
    })
})

describe('filterByDestination', () => {
    it('非表示の行き先を除外する', () => {
        const hidden = new Set(['綾瀬'])
        const result = filterByDestination(trains, hidden)
        expect(result).toHaveLength(2)
        expect(result.every(t => t.destination !== '綾瀬')).toBe(true)
    })

    it('非表示なし（空Set）の場合は全列車を返す', () => {
        const result = filterByDestination(trains, new Set())
        expect(result).toHaveLength(4)
    })

    it('複数の行き先を非表示にできる', () => {
        const hidden = new Set(['綾瀬', '伊勢原'])
        const result = filterByDestination(trains, hidden)
        expect(result).toHaveLength(1)
        expect(result[0]).toMatchObject({ destination: '代々木上原' })
    })

    it('全行き先を非表示にすると空配列を返す', () => {
        const hidden = new Set(['綾瀬', '代々木上原', '伊勢原'])
        const result = filterByDestination(trains, hidden)
        expect(result).toHaveLength(0)
    })
})
