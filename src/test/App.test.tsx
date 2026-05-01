import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
    it('ヘッダーに「北綾瀬」が表示される', () => {
        render(<App />)
        expect(screen.getByText('北綾瀬')).toBeInTheDocument()
    })

    it('平日/土・休日タブが表示される', () => {
        render(<App />)
        expect(screen.getByRole('button', { name: '平日' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: '土・休日' })).toBeInTheDocument()
    })

    it('フッターに出典情報が表示される', () => {
        render(<App />)
        expect(screen.getByText(/データ出典：東京メトロ/)).toBeInTheDocument()
    })
})
