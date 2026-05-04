import type { Train, TrainType } from '../data/timetable'
import { toAbsoluteMinutes, toCurrentAbsoluteMinutes } from '../hooks/useTimetable'

interface NextTrainCardProps {
    train: Train
    now: Date
    isNextDay: boolean
}

const BADGE_STYLE: Record<TrainType, { backgroundColor: string; color: string }> = {
    普通: { backgroundColor: '#3a4a5a', color: '#c8d6e8' },
    準急: { backgroundColor: '#1a3a7a', color: '#90b8f0' },
    急行: { backgroundColor: '#7a3a10', color: '#f0b880' },
}

const formatTime = (hour: number, minute: number): string =>
    `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

const formatNextMins = (mins: number): string => {
    if (mins < 60) return `あと ${mins} 分`
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return m === 0 ? `あと ${h} 時間` : `あと ${h} 時間 ${m} 分`
}

export const NextTrainCard = ({ train, now, isNextDay }: NextTrainCardProps) => {
    const nextDayOffset = isNextDay ? 1440 : 0
    const mins = toAbsoluteMinutes(train.hour, train.minute) + nextDayOffset - toCurrentAbsoluteMinutes(now)
    const badge = BADGE_STYLE[train.trainType]

    return (
        <div
            data-testid="next-train"
            style={{
                background: 'linear-gradient(135deg, #0f2a4a, #0a2040)',
                border: '0.5px solid rgba(0,100,0,0.5)',
                borderRadius: '12px',
                padding: '14px 16px',
                margin: '12px 16px 0',
                flexShrink: 0,
            }}
        >
            <div style={{ color: '#4a9e6a', fontSize: '12px', marginBottom: '6px' }}>次の列車</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span style={{ color: 'white', fontSize: '42px', fontWeight: 300, lineHeight: 1 }}>
                    {formatTime(train.hour, train.minute)}
                </span>
                <span style={{ color: 'white', fontSize: '18px', fontWeight: 500 }}>
                    {train.destination}行き
                </span>
                <span style={{
                    ...badge,
                    fontSize: '11px',
                    fontWeight: 500,
                    padding: '3px 8px',
                    borderRadius: '5px',
                }}>
                    {train.trainType}
                </span>
            </div>
            <div style={{ color: '#4a9e6a', fontSize: '16px', fontWeight: 500 }}>
                {formatNextMins(mins)}
            </div>
        </div>
    )
}
