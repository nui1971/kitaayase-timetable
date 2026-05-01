import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TrainRow } from '../components/TrainRow'
import type { Train } from '../data/timetable'

const baseTrain: Train = {
    hour: 10,
    minute: 5,
    destination: '代々木上原',
    trainType: '普通',
}

describe('TrainRow', () => {
    it('時刻（ゼロパディング）と行き先を表示する', () => {
        render(<TrainRow train={baseTrain} isNext={false} isLast={false} />)
        expect(screen.getByText('10:05')).toBeInTheDocument()
        expect(screen.getByText('代々木上原')).toBeInTheDocument()
    })

    it('普通バッジを表示する', () => {
        render(<TrainRow train={baseTrain} isNext={false} isLast={false} />)
        expect(screen.getByText('普通')).toBeInTheDocument()
    })

    it('準急バッジを表示する', () => {
        const train: Train = { ...baseTrain, trainType: '準急' }
        render(<TrainRow train={train} isNext={false} isLast={false} />)
        expect(screen.getByText('準急')).toBeInTheDocument()
    })

    it('急行バッジを表示する', () => {
        const train: Train = { ...baseTrain, trainType: '急行' }
        render(<TrainRow train={train} isNext={false} isLast={false} />)
        expect(screen.getByText('急行')).toBeInTheDocument()
    })

    it('最終列車に「最終」バッジを表示する', () => {
        render(<TrainRow train={baseTrain} isNext={false} isLast={true} />)
        expect(screen.getByText('最終')).toBeInTheDocument()
    })

    it('通常列車に「最終」バッジを表示しない', () => {
        render(<TrainRow train={baseTrain} isNext={false} isLast={false} />)
        expect(screen.queryByText('最終')).not.toBeInTheDocument()
    })

    it('次の列車は data-testid="next-train" で強調表示される', () => {
        render(<TrainRow train={baseTrain} isNext={true} isLast={false} minutesUntil={5} />)
        expect(screen.getByTestId('next-train')).toBeInTheDocument()
        expect(screen.getByText('10:05')).toBeInTheDocument()
    })

    it('次の列車カードに「あとXX分」を表示する', () => {
        render(<TrainRow train={baseTrain} isNext={true} isLast={false} minutesUntil={3} />)
        expect(screen.getByText(/あと 3 分/)).toBeInTheDocument()
    })

    it('0時台の列車を正しく表示する', () => {
        const train: Train = { hour: 0, minute: 15, destination: '綾瀬', trainType: '普通' }
        render(<TrainRow train={train} isNext={false} isLast={true} />)
        expect(screen.getByText('00:15')).toBeInTheDocument()
        expect(screen.getByText('最終')).toBeInTheDocument()
    })
})
