import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
    it('ヘッダーに「北綾瀬駅」が表示される', () => {
        render(<App />)
        expect(screen.getByText('北綾瀬駅')).toBeInTheDocument()
    })

    it('平日/土休日タブが表示される', () => {
        render(<App />)
        expect(screen.getByText('平日')).toBeInTheDocument()
        expect(screen.getByText('土休日')).toBeInTheDocument()
    })

    it('フッターに出典情報が表示される', () => {
        render(<App />)
        expect(screen.getByText(/データ出典：駅探/)).toBeInTheDocument()
    })
})
