import type { Train, TrainType } from '../data/timetable'

interface TrainRowProps {
    train: Train
    isFirst: boolean
    isLast: boolean
    minutesUntil: number
}

const TYPE_BADGE: Record<TrainType, { backgroundColor: string; color: string }> = {
    普通: { backgroundColor: '#3a4a5a', color: '#c8d6e8' },
    準急: { backgroundColor: '#1a3a7a', color: '#90b8f0' },
    急行: { backgroundColor: '#7a3a10', color: '#f0b880' },
}

const formatTime = (hour: number, minute: number): string =>
    `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

export const formatMinutesUntil = (mins: number): string => {
    if (mins < 60) return `${mins}分後`
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return m === 0 ? `${h}時間後` : `${h}時間${m.toString().padStart(2, '0')}分後`
}

export const TrainRow = ({ train, isFirst, isLast, minutesUntil }: TrainRowProps) => {
    const badge = TYPE_BADGE[train.trainType]
    const minsText = formatMinutesUntil(minutesUntil)
    const minsColor = isFirst && minutesUntil < 60 ? '#4a9e6a' : '#8a9bb5'

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: isFirst ? 'rgba(0,100,0,0.18)' : 'rgba(255,255,255,0.04)',
            border: isFirst ? '0.5px solid rgba(0,100,0,0.35)' : 'none',
        }}>
            <span style={{
                color: 'white',
                fontSize: '22px',
                fontWeight: 300,
                minWidth: '56px',
                fontVariantNumeric: 'tabular-nums',
            }}>
                {formatTime(train.hour, train.minute)}
            </span>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '10px' }}>
                <span style={{ color: 'white', fontSize: '14px' }}>{train.destination}</span>
                <span style={{
                    ...badge,
                    fontSize: '11px',
                    fontWeight: 500,
                    padding: '3px 8px',
                    borderRadius: '5px',
                }}>
                    {train.trainType}
                </span>
                {isLast && (
                    <span style={{ fontSize: '11px', color: '#f87171' }}>最終</span>
                )}
            </div>
            <span style={{ color: minsColor, fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                {minsText}
            </span>
        </div>
    )
}
