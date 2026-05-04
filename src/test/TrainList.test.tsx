import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TrainList } from '../components/TrainList'
import { NextTrainCard } from '../components/NextTrainCard'
import type { Train } from '../data/timetable'

const makeDate = (hour: number, minute: number): Date => {
    const d = new Date()
    d.setHours(hour, minute, 0, 0)
    return d
}

const trains: Train[] = [
    { hour: 10, minute: 0,  destination: '綾瀬',      trainType: '普通' },
    { hour: 10, minute: 10, destination: '代々木上原', trainType: '普通' },
    { hour: 10, minute: 20, destination: '綾瀬',      trainType: '普通' },
    { hour: 10, minute: 30, destination: '代々木上原', trainType: '普通' },
    { hour: 10, minute: 40, destination: '綾瀬',      trainType: '普通' },
    { hour: 10, minute: 50, destination: '代々木上原', trainType: '準急' },
    { hour: 11, minute: 0,  destination: '綾瀬',      trainType: '普通' },
]

describe('NextTrainCard', () => {
    it('次の列車の時刻・行き先・種別が表示されること', () => {
        render(<NextTrainCard train={trains[0]} now={makeDate(9, 0)} isNextDay={false} />)
        const card = screen.getByTestId('next-train')
        expect(card).toBeTruthy()
        expect(card.textContent).toContain('10:00')
        expect(card.textContent).toContain('綾瀬行き')
        expect(card.textContent).toContain('普通')
    })

    it('60分未満の場合「あと XX 分」と表示されること', () => {
        render(<NextTrainCard train={trains[0]} now={makeDate(9, 30)} isNextDay={false} />)
        expect(screen.getByTestId('next-train').textContent).toContain('あと 30 分')
    })

    it('60分超の場合「あと X 時間 Y 分」と表示されること', () => {
        render(<NextTrainCard train={trains[0]} now={makeDate(8, 30)} isNextDay={false} />)
        expect(screen.getByTestId('next-train').textContent).toContain('あと 1 時間 30 分')
    })
})

describe('TrainList', () => {
    it('デフォルトで5本表示され、展開ボタンが表示されること', () => {
        render(<TrainList trains={trains} now={makeDate(9, 0)} isNextDay={false} />)
        expect(screen.getByText('▼ さらに表示（+5本）')).toBeTruthy()
    })

    it('展開ボタンを押すと「▲ 追加分を非表示」に切り替わること', () => {
        render(<TrainList trains={trains} now={makeDate(9, 0)} isNextDay={false} />)
        fireEvent.click(screen.getByText('▼ さらに表示（+5本）'))
        expect(screen.getByText('▲ 追加分を非表示')).toBeTruthy()
    })

    it('5本以下の場合は展開ボタンが表示されないこと', () => {
        render(<TrainList trains={trains.slice(0, 3)} now={makeDate(9, 0)} isNextDay={false} />)
        expect(screen.queryByText('▼ さらに表示（+5本）')).toBeNull()
    })
})
