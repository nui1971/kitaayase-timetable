import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TrainRow, formatMinutesUntil } from '../components/TrainRow'
import type { Train } from '../data/timetable'

const baseTrain: Train = {
    hour: 10,
    minute: 5,
    destination: '代々木上原',
    trainType: '普通',
}

describe('formatMinutesUntil', () => {
    it('59分以下はXX分後を返す', () => {
        expect(formatMinutesUntil(0)).toBe('0分後')
        expect(formatMinutesUntil(5)).toBe('5分後')
        expect(formatMinutesUntil(59)).toBe('59分後')
    })

    it('60分ちょうどは1時間後を返す', () => {
        expect(formatMinutesUntil(60)).toBe('1時間後')
    })

    it('75分は1時間15分後を返す', () => {
        expect(formatMinutesUntil(75)).toBe('1時間15分後')
    })

    it('120分は2時間後を返す', () => {
        expect(formatMinutesUntil(120)).toBe('2時間後')
    })
})

describe('TrainRow', () => {
    it('時刻（ゼロパディング）と行き先を表示する', () => {
        render(<TrainRow train={baseTrain} isFirst={false} isLast={false} minutesUntil={10} />)
        expect(screen.getByText('10:05')).toBeInTheDocument()
        expect(screen.getByText('代々木上原')).toBeInTheDocument()
    })

    it('普通バッジを表示する', () => {
        render(<TrainRow train={baseTrain} isFirst={false} isLast={false} minutesUntil={10} />)
        expect(screen.getByText('普通')).toBeInTheDocument()
    })

    it('準急バッジを表示する', () => {
        const train: Train = { ...baseTrain, trainType: '準急' }
        render(<TrainRow train={train} isFirst={false} isLast={false} minutesUntil={10} />)
        expect(screen.getByText('準急')).toBeInTheDocument()
    })

    it('急行バッジを表示する', () => {
        const train: Train = { ...baseTrain, trainType: '急行' }
        render(<TrainRow train={train} isFirst={false} isLast={false} minutesUntil={10} />)
        expect(screen.getByText('急行')).toBeInTheDocument()
    })

    it('最終列車に「最終」バッジを表示する', () => {
        render(<TrainRow train={baseTrain} isFirst={false} isLast={true} minutesUntil={5} />)
        expect(screen.getByText('最終')).toBeInTheDocument()
    })

    it('通常列車に「最終」バッジを表示しない', () => {
        render(<TrainRow train={baseTrain} isFirst={false} isLast={false} minutesUntil={10} />)
        expect(screen.queryByText('最終')).not.toBeInTheDocument()
    })

    it('60分後を正しく表示する', () => {
        render(<TrainRow train={baseTrain} isFirst={false} isLast={false} minutesUntil={30} />)
        expect(screen.getByText('30分後')).toBeInTheDocument()
    })

    it('60分以上は時間形式で表示する', () => {
        render(<TrainRow train={baseTrain} isFirst={false} isLast={false} minutesUntil={75} />)
        expect(screen.getByText('1時間15分後')).toBeInTheDocument()
    })

    it('0時台の列車を正しく表示する', () => {
        const train: Train = { hour: 0, minute: 15, destination: '綾瀬', trainType: '普通' }
        render(<TrainRow train={train} isFirst={false} isLast={true} minutesUntil={5} />)
        expect(screen.getByText('00:15')).toBeInTheDocument()
        expect(screen.getByText('最終')).toBeInTheDocument()
    })
})
