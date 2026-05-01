import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
    it('「北綾瀬 時刻表」が表示される', () => {
        render(<App />)
        expect(screen.getByText('北綾瀬 時刻表')).toBeInTheDocument()
    })
})
