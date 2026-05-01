import type { Train, TrainType } from '../data/timetable'

interface TrainRowProps {
    train: Train
    isNext: boolean
    isLast: boolean
    minutesUntil?: number
}

const BADGE_CLASS: Record<TrainType, string> = {
    普通: 'bg-gray-600 text-white',
    準急: 'bg-blue-500 text-white',
    急行: 'bg-orange-500 text-white',
}

const formatTime = (hour: number, minute: number): string =>
    `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

const TypeBadge = ({ trainType }: { trainType: TrainType }) => (
    <span className={`text-xs px-2 py-0.5 rounded ${BADGE_CLASS[trainType]}`}>
        {trainType}
    </span>
)

export const TrainRow = ({ train, isNext, isLast, minutesUntil }: TrainRowProps) => {
    const time = formatTime(train.hour, train.minute)

    if (isNext) {
        return (
            <div className="bg-[#1a3a2e] px-4 py-4 rounded-xl" data-testid="next-train">
                <div className="text-xs text-gray-400 mb-1">次の列車</div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-3xl font-bold text-white">{time}</span>
                    <span className="text-base text-white">{train.destination}行き</span>
                    <TypeBadge trainType={train.trainType} />
                </div>
                {minutesUntil !== undefined && (
                    <div className="text-[#4caf50] text-sm">
                        あと {minutesUntil} 分
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="flex items-center px-4 py-3 rounded-xl bg-[#0d1526] min-h-[52px]">
            <span className="text-lg font-bold w-14 text-white tabular-nums">{time}</span>
            <span className="flex-1 text-gray-300 mx-2 text-sm">{train.destination}</span>
            <div className="flex items-center gap-2">
                <TypeBadge trainType={train.trainType} />
                {isLast && (
                    <span className="text-xs px-2 py-0.5 rounded bg-red-500 text-white">最終</span>
                )}
                {minutesUntil !== undefined && (
                    <span className="text-sm text-gray-400 w-12 text-right tabular-nums">
                        {minutesUntil}<span className="text-xs">分後</span>
                    </span>
                )}
            </div>
        </div>
    )
}
