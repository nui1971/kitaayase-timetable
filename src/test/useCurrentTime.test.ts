import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useCurrentTime } from '../hooks/useCurrentTime'

describe('useCurrentTime', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('初期値として現在時刻（Dateオブジェクト）を返す', () => {
        const { result } = renderHook(() => useCurrentTime())
        expect(result.current).toBeInstanceOf(Date)
    })

    it('1分後に時刻が更新される', () => {
        const { result } = renderHook(() => useCurrentTime())
        const initial = result.current

        act(() => {
            vi.advanceTimersByTime(60000)
        })

        expect(result.current).not.toBe(initial)
        expect(result.current).toBeInstanceOf(Date)
    })
})
