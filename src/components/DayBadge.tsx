import type { DayType } from '../data/timetable'

interface DayBadgeProps {
    dayType: DayType
}

const LABELS: { key: DayType; label: string }[] = [
    { key: 'weekday', label: '平日' },
    { key: 'holiday', label: '土・休日' },
]

export const DayBadge = ({ dayType }: DayBadgeProps) => (
    <div style={{ display: 'flex', gap: '8px', padding: '10px 16px 8px' }}>
        {LABELS.map(({ key, label }) => (
            <span
                key={key}
                style={key === dayType ? {
                    backgroundColor: '#006400',
                    color: 'white',
                    fontSize: '13px',
                    padding: '4px 12px',
                    borderRadius: '6px',
                } : {
                    backgroundColor: 'rgba(255,255,255,0.07)',
                    color: '#8a9bb5',
                    fontSize: '12px',
                    padding: '4px 12px',
                    borderRadius: '6px',
                }}
            >
                {label}
            </span>
        ))}
    </div>
)
