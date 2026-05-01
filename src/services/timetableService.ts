import type { DayType, Train } from '../data/timetable'
import { timetable } from '../data/timetable'

// Phase 1: ハードコードデータを返す
// Phase 2でODPT APIに切り替える際はこの関数のみ変更する
export const getTimetable = async (dayType: DayType): Promise<Train[]> => {
    return timetable[dayType]
}
