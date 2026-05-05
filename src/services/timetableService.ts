import type { DayType, Train } from '../data/timetable'
import { timetable } from '../data/timetable'

export function getTimetable(dayType: DayType): Train[] {
    return dayType === 'weekday' ? timetable.weekday : timetable.holiday
}
