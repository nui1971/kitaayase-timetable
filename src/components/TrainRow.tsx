import type { Train, TrainType } from '../data/timetable'

interface TrainRowProps {
    train: Train
    isNext: boolean
    isLast: boolean
}

const BADGE_CLASS: Record<TrainType, string> = {
    普通: 'bg-gray-400 text-white',
    準急: 'bg-blue-500 text-white',
    急行: 'bg-orange-500 text-white',
}

const formatTime = (hour: number, minute: number): string =>
    `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

const TypeBadge = ({ trainType }: { trainType: TrainType }) => (
    <span className={`text-xs px-2 py-0.5 rounded-full ${BADGE_CLASS[trainType]}`}>
        {trainType}
    </span>
)

export const TrainRow = ({ train, isNext, isLast }: TrainRowProps) => {
    const time = formatTime(train.hour, train.minute)

    if (isNext) {
        return (
            <div className="bg-[#006400] text-white px-4 py-5" data-testid="next-train">
                <div className="text-4xl font-bold mb-1">{time}</div>
                <div className="flex items-center gap-2 text-lg">
                    <span>{train.destination}</span>
                    <TypeBadge trainType={train.trainType} />
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center px-4 py-3 border-b border-gray-100 min-h-[52px]">
            <span className="text-xl font-bold w-16 text-gray-800 tabular-nums">{time}</span>
            <span className="flex-1 text-gray-700 mx-3">{train.destination}</span>
            <div className="flex items-center gap-2">
                {isLast && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500 text-white">最終</span>
                )}
                <TypeBadge trainType={train.trainType} />
            </div>
        </div>
    )
}
