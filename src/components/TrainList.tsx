import { useState } from 'react'
import type { Train } from '../data/timetable'
import { TrainRow } from './TrainRow'
import { toAbsoluteMinutes, toCurrentAbsoluteMinutes, buildCombinedTrains } from '../hooks/useTimetable'

interface TrainListProps {
    trains: Train[]
    now: Date
    isNextDay: boolean
    connectedTrains?: Train[]
}

const INITIAL_COUNT = 5
const EXPANDED_COUNT = 10

export const TrainList = ({ trains, now, isNextDay, connectedTrains }: TrainListProps) => {
    const [expanded, setExpanded] = useState(false)

    const currentMinutes = toCurrentAbsoluteMinutes(now)
    const currentOffset = isNextDay ? 1440 : 0

    // 当日・翌日を1本の配列に統合し、各列車に分オフセットを付与
    const allItems = buildCombinedTrains(trains, connectedTrains ?? []).map(
        ({ train, isNextDay: itemIsNextDay }) => ({
            train,
            isNextDay: itemIsNextDay,
            offset: itemIsNextDay ? 1440 : currentOffset,
        })
    )

    if (allItems.length === 0) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
                <p style={{ color: '#8a9bb5', fontSize: '16px', margin: 0 }}>本日の運行は終了しました</p>
                <p style={{ color: '#4a5568', fontSize: '13px', marginTop: '8px' }}>また明日ご利用ください</p>
            </div>
        )
    }

    const displayed = allItems.slice(0, expanded ? EXPANDED_COUNT : INITIAL_COUNT)
    const hasMore = allItems.length > INITIAL_COUNT
    // 当日最終列車（「最終」バッジ表示用）
    const lastTodayTrain = trains.length > 0 ? trains[trains.length - 1] : null

    return (
        <div>
            {/* リストヘッダー */}
            <div style={{ padding: '4px 16px 8px' }}>
                <span style={{ color: '#c8d6e8', fontSize: '13px', fontWeight: 500 }}>
                    綾瀬・代々木上原方面
                </span>
            </div>

            {/* 列車リスト（当日・翌日シームレス） */}
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {displayed.map(({ train, isNextDay: itemIsNextDay, offset }, index) => (
                    <TrainRow
                        key={`${itemIsNextDay ? 'next-' : ''}${train.hour}-${train.minute}-${train.destination}`}
                        train={train}
                        isFirst={index === 0}
                        isLast={train === lastTodayTrain}
                        minutesUntil={toAbsoluteMinutes(train.hour, train.minute) + offset - currentMinutes}
                    />
                ))}
            </div>

            {/* 展開/折りたたみボタン（+5本固定） */}
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
        </div>
    )
}
