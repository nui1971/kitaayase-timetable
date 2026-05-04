import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TrainList } from '../components/TrainList'
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

describe('TrainList', () => {
    it('次の列車カードが sticky スタイルで固定されること', () => {
        render(<TrainList trains={trains} now={makeDate(9, 0)} isNextDay={false} />)
        const stickyWrapper = screen.getByTestId('next-train-sticky')
        expect(stickyWrapper).toHaveStyle({ position: 'sticky', top: '0px' })
    })

    it('次の列車カード内に次の列車情報が表示されること', () => {
        render(<TrainList trains={trains} now={makeDate(9, 0)} isNextDay={false} />)
        expect(screen.getByTestId('next-train')).toBeTruthy()
    })

    it('デフォルトで5本表示され、展開ボタンが表示されること', () => {
        render(<TrainList trains={trains} now={makeDate(9, 0)} isNextDay={false} />)
        expect(screen.getByText('▼ さらに表示（+5本）')).toBeTruthy()
    })

    it('展開ボタンを押すと「▲ 追加分を非表示」に切り替わること', () => {
        render(<TrainList trains={trains} now={makeDate(9, 0)} isNextDay={false} />)
        fireEvent.click(screen.getByText('▼ さらに表示（+5本）'))
        expect(screen.getByText('▲ 追加分を非表示')).toBeTruthy()
    })
})
