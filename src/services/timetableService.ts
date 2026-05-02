import type { DayType, Train, TrainType } from '../data/timetable'
import { timetable } from '../data/timetable'

const API_BASE = 'https://api.odpt.org/api/v4/odpt:StationTimetable'
const STATION = 'odpt.Station:TokyoMetro.Chiyoda.KitaAyase'
const CACHE_KEY_PREFIX = 'odpt_timetable_'

const STATION_MAP: Record<string, string> = {
    // 千代田線
    'odpt.Station:TokyoMetro.Chiyoda.Ayase': '綾瀬',
    'odpt.Station:TokyoMetro.Chiyoda.YoyogiUehara': '代々木上原',
    'odpt.Station:TokyoMetro.Chiyoda.Kasumigaseki': '霞ケ関',
    'odpt.Station:TokyoMetro.Chiyoda.MeijiJingumae': '明治神宮前',
    // 小田急線（直通先）
    'odpt.Station:Odakyu.Odawara.SeijogakuenMae': '成城学園前',
    'odpt.Station:Odakyu.Odawara.MukogaokaYuen': '向ケ丘遊園',
    'odpt.Station:Odakyu.Odawara.Isehara': '伊勢原',
    'odpt.Station:Odakyu.Odawara.SagamiOno': '相模大野',
    'odpt.Station:Odakyu.Tama.Karakida': '唐木田',
}

const TRAIN_TYPE_MAP: Record<string, TrainType> = {
    'odpt.TrainType:TokyoMetro.Local': '普通',
    'odpt.TrainType:TokyoMetro.SemiExpress': '準急',
    'odpt.TrainType:TokyoMetro.Express': '急行',
}

const convertStation = (id: string): string =>
    STATION_MAP[id] ?? id.split('.').pop() ?? id

const convertTrainType = (id: string): TrainType =>
    TRAIN_TYPE_MAP[id] ?? '普通'

interface OdptEntry {
    'odpt:departureTime': string
    'odpt:destinationStation'?: string[]
    'odpt:trainType'?: string
}

interface OdptStationTimetable {
    'odpt:calendar': string
    'odpt:stationTimetableObject': OdptEntry[]
}

const parseEntry = (entry: OdptEntry): Train | null => {
    const [hourStr, minuteStr] = entry['odpt:departureTime'].split(':')
    const hour = parseInt(hourStr, 10)
    const minute = parseInt(minuteStr, 10)
    if (isNaN(hour) || isNaN(minute)) return null

    const destinationIds = entry['odpt:destinationStation'] ?? []
    const destination = destinationIds.length > 0
        ? convertStation(destinationIds[destinationIds.length - 1])
        : '不明'

    return { hour, minute, destination, trainType: convertTrainType(entry['odpt:trainType'] ?? '') }
}

const parseCalendar = (calendar: string): DayType | null => {
    if (calendar.includes('Weekday')) return 'weekday'
    if (calendar.includes('SaturdayHoliday') || calendar.includes('Holiday')) return 'holiday'
    return null
}

// 並列リクエストの重複防止（Promise.all で同時に2つ呼ばれても API は1回のみ）
let pendingFetch: Promise<{ weekday: Train[]; holiday: Train[] }> | null = null

const fetchAllFromApi = async (): Promise<{ weekday: Train[]; holiday: Train[] }> => {
    const token = import.meta.env.VITE_ODPT_TOKEN
    if (!token) throw new Error('VITE_ODPT_TOKEN が設定されていません')

    const url = `${API_BASE}?odpt:station=${STATION}&acl:consumerKey=${token}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`API エラー: ${res.status}`)

    const data: OdptStationTimetable[] = await res.json()
    if (!Array.isArray(data) || data.length === 0) throw new Error('API レスポンスが空でした')

    const result: { weekday: Train[]; holiday: Train[] } = { weekday: [], holiday: [] }

    for (const obj of data) {
        // 北綾瀬は終点駅のため方向フィルタ不要（全件が代々木上原方面）
        const dayType = parseCalendar(obj['odpt:calendar'])
        if (!dayType) continue

        const trains = obj['odpt:stationTimetableObject']
            .map(parseEntry)
            .filter((t): t is Train => t !== null)

        result[dayType].push(...trains)
    }

    if (result.weekday.length === 0 && result.holiday.length === 0) {
        throw new Error('変換後のデータが空でした')
    }

    return result
}

export const getTimetable = async (dayType: DayType): Promise<Train[]> => {
    // sessionStorage キャッシュを確認（同セッション内は API を叩かない）
    const cached = sessionStorage.getItem(`${CACHE_KEY_PREFIX}${dayType}`)
    if (cached) {
        try {
            return JSON.parse(cached) as Train[]
        } catch {
            // キャッシュが破損している場合は無視して再取得
        }
    }

    try {
        if (!pendingFetch) {
            pendingFetch = fetchAllFromApi().finally(() => { pendingFetch = null })
        }
        const all = await pendingFetch

        // 平日・土休日の両方をキャッシュ
        sessionStorage.setItem(`${CACHE_KEY_PREFIX}weekday`, JSON.stringify(all.weekday))
        sessionStorage.setItem(`${CACHE_KEY_PREFIX}holiday`, JSON.stringify(all.holiday))

        return all[dayType]
    } catch (err) {
        console.error('[timetableService] API 取得失敗。ハードコードデータにフォールバックします:', err)
        return timetable[dayType]
    }
}
