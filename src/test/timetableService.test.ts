import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTimetable } from '../services/timetableService'
import { timetable } from '../data/timetable'

// ODPT API モックレスポンス（平日・土休日の両方を含む）
const mockOdptResponse = [
    {
        'odpt:calendar': 'odpt.Calendar:Weekday',
        'odpt:railDirection': 'odpt.RailDirection:TokyoMetro.Outbound',
        'odpt:stationTimetableObject': [
            {
                'odpt:departureTime': '05:00',
                'odpt:trainType': 'odpt.TrainType:TokyoMetro.Local',
                'odpt:trainDirection': 'odpt.TrainDirection:TokyoMetro.Outbound',
                'odpt:destinationStation': ['odpt.Station:TokyoMetro.Chiyoda.Ayase'],
            },
            {
                'odpt:departureTime': '08:57',
                'odpt:trainType': 'odpt.TrainType:TokyoMetro.SemiExpress',
                'odpt:trainDirection': 'odpt.TrainDirection:TokyoMetro.Outbound',
                'odpt:destinationStation': ['odpt.Station:TokyoMetro.Chiyoda.YoyogiUehara'],
            },
        ],
    },
    {
        'odpt:calendar': 'odpt.Calendar:SaturdayHoliday',
        'odpt:railDirection': 'odpt.RailDirection:TokyoMetro.Outbound',
        'odpt:stationTimetableObject': [
            {
                'odpt:departureTime': '07:00',
                'odpt:trainType': 'odpt.TrainType:TokyoMetro.Local',
                'odpt:destinationStation': ['odpt.Station:TokyoMetro.Chiyoda.Ayase'],
            },
        ],
    },
]

describe('getTimetable', () => {
    beforeEach(() => {
        sessionStorage.clear()
        vi.stubEnv('VITE_ODPT_TOKEN', 'test-token')
    })

    afterEach(() => {
        vi.unstubAllEnvs()
        vi.restoreAllMocks()
    })

    it('API 正常時にデータが正しく変換されること', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockOdptResponse,
        }))

        const result = await getTimetable('weekday')

        expect(result).toHaveLength(2)
        expect(result[0]).toEqual({
            hour: 5,
            minute: 0,
            destination: '綾瀬',
            trainType: '普通',
        })
        expect(result[1]).toEqual({
            hour: 8,
            minute: 57,
            destination: '代々木上原',
            trainType: '準急',
        })
    })

    it('API 失敗時にフォールバックデータが返ること', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ネットワークエラー')))

        const result = await getTimetable('weekday')

        // ハードコードデータと一致することを確認
        expect(result).toEqual(timetable.weekday)
    })

    it('sessionStorage キャッシュが機能すること（2回目は API を叩かない）', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockOdptResponse,
        })
        vi.stubGlobal('fetch', fetchMock)

        // 1回目: API を叩いてキャッシュに保存
        await getTimetable('weekday')
        expect(fetchMock).toHaveBeenCalledTimes(1)

        // 2回目: sessionStorage から返す（API は叩かない）
        const result = await getTimetable('weekday')
        expect(fetchMock).toHaveBeenCalledTimes(1)

        // キャッシュから返ったデータも正しいことを確認
        expect(result[0]).toMatchObject({ hour: 5, minute: 0, destination: '綾瀬' })
    })
})
