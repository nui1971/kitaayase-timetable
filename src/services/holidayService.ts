const CACHE_KEY_PREFIX = 'holidays_'
const API_BASE = 'https://holidays-jp.github.io/api/v1'

const fetchHolidays = async (year: number): Promise<Set<string>> => {
    const cacheKey = `${CACHE_KEY_PREFIX}${year}`
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
        try {
            return new Set<string>(JSON.parse(cached) as string[])
        } catch {
            // キャッシュ破損は無視して再取得
        }
    }
    try {
        const res = await fetch(`${API_BASE}/${year}/date.json`)
        if (!res.ok) throw new Error(`API エラー: ${res.status}`)
        const data: Record<string, string> = await res.json()
        const dates = Object.keys(data)
        sessionStorage.setItem(cacheKey, JSON.stringify(dates))
        return new Set<string>(dates)
    } catch (err) {
        console.warn(`[holidayService] ${year}年の祝日取得失敗。土日のみで判定します:`, err)
        return new Set<string>()
    }
}

// 当年・翌年の祝日を並列取得してまとめて返す
export const loadHolidays = async (): Promise<Set<string>> => {
    const year = new Date().getFullYear()
    const [current, next] = await Promise.all([
        fetchHolidays(year),
        fetchHolidays(year + 1),
    ])
    return new Set<string>([...current, ...next])
}
