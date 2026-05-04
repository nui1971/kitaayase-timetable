import { useState } from 'react'
import type { Train, TrainType } from '../data/timetable'
import { TrainRow } from './TrainRow'
import { toAbsoluteMinutes, toCurrentAbsoluteMinutes } from '../hooks/useTimetable'

interface TrainListProps {
    trains: Train[]
    now: Date
    isNextDay: boolean
    connectedTrains?: Train[]
}

const INITIAL_COUNT = 5
const EXPANDED_COUNT = 10

const NEXT_CARD_BADGE: Record<TrainType, { backgroundColor: string; color: string }> = {
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

export const TrainList = ({ trains, now, isNextDay, connectedTrains }: TrainListProps) => {
    const [expanded, setExpanded] = useState(false)

    if (trains.length === 0) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
                <p style={{ color: '#8a9bb5', fontSize: '16px', margin: 0 }}>本日の運行は終了しました</p>
                <p style={{ color: '#4a5568', fontSize: '13px', marginTop: '8px' }}>また明日ご利用ください</p>
            </div>
        )
    }

    const currentMinutes = toCurrentAbsoluteMinutes(now)
    const nextDayOffset = isNextDay ? 1440 : 0

    const next = trains[0]
    const nextMins = toAbsoluteMinutes(next.hour, next.minute) + nextDayOffset - currentMinutes

    // 修正1: 一覧は trains[0]（次の列車）から表示する
    const displayed = expanded ? trains.slice(0, EXPANDED_COUNT) : trains.slice(0, INITIAL_COUNT)
    const hasMore = trains.length > INITIAL_COUNT

    const nextBadge = NEXT_CARD_BADGE[next.trainType]
    const lastTrain = trains[trains.length - 1]

    return (
        <div>
            {/* 次の列車カード（スクロール時も上部に固定） */}
            <div
                data-testid="next-train-sticky"
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    backgroundColor: '#0d1526',
                    paddingTop: '12px',
                }}
            >
            <div
                data-testid="next-train"
                style={{
                    background: 'linear-gradient(135deg, #0f2a4a, #0a2040)',
                    border: '0.5px solid rgba(0,100,0,0.5)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    margin: '0 16px 12px',
                }}
            >
                <div style={{ color: '#4a9e6a', fontSize: '12px', marginBottom: '6px' }}>次の列車</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ color: 'white', fontSize: '42px', fontWeight: 300, lineHeight: 1 }}>
                        {formatTime(next.hour, next.minute)}
                    </span>
                    <span style={{ color: 'white', fontSize: '18px', fontWeight: 500 }}>
                        {next.destination}行き
                    </span>
                    <span style={{
                        ...nextBadge,
                        fontSize: '11px',
                        fontWeight: 500,
                        padding: '3px 8px',
                        borderRadius: '5px',
                    }}>
                        {next.trainType}
                    </span>
                </div>
                <div style={{ color: '#4a9e6a', fontSize: '16px', fontWeight: 500 }}>
                    {formatNextMins(nextMins)}
                </div>
            </div>
            </div>

            {/* リストヘッダー */}
            <div style={{ padding: '4px 16px 8px' }}>
                <span style={{ color: '#c8d6e8', fontSize: '13px', fontWeight: 500 }}>
                    綾瀬・代々木上原方面
                </span>
            </div>

            {/* 列車リスト */}
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {displayed.map((train, index) => (
                    <TrainRow
                        key={`${train.hour}-${train.minute}-${train.destination}`}
                        train={train}
                        isFirst={index === 0}
                        isLast={train === lastTrain}
                        minutesUntil={toAbsoluteMinutes(train.hour, train.minute) + nextDayOffset - currentMinutes}
                    />
                ))}
            </div>

            {/* 修正2: 展開/折りたたみボタン（+5本固定） */}
            {hasMore && (
                <button
                    onClick={() => setExpanded(v => !v)}
                    style={{
                        display: 'block',
                        width: 'calc(100% - 32px)',
                        margin: '10px 16px 0',
                        padding: '10px',
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        borderRadius: '10px',
                        border: 'none',
                        color: '#8a9bb5',
                        fontSize: '13px',
                        textAlign: 'center',
                        cursor: 'pointer',
                    }}
                >
                    {expanded ? '▲ 追加分を非表示' : '▼ さらに表示（+5本）'}
                </button>
            )}

            {/* 深夜帯の翌日接続表示 */}
            {connectedTrains && connectedTrains.length > 0 && (
                <>
                    <div style={{
                        padding: '16px 16px 6px',
                        color: '#4a5568',
                        fontSize: '11px',
                        textAlign: 'center',
                    }}>
                        ── 翌日の運行 ──
                    </div>
                    <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {connectedTrains.slice(0, 5).map((train) => (
                            <TrainRow
                                key={`connected-${train.hour}-${train.minute}-${train.destination}`}
                                train={train}
                                isFirst={false}
                                isLast={false}
                                minutesUntil={toAbsoluteMinutes(train.hour, train.minute) + 1440 - currentMinutes}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
