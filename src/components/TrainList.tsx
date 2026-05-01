import type { Train } from '../data/timetable'
import { TrainRow } from './TrainRow'

interface TrainListProps {
    trains: Train[]
}

export const TrainList = ({ trains }: TrainListProps) => {
    if (trains.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <p className="text-lg font-medium">本日の運行は終了しました</p>
                <p className="text-sm mt-2">また明日ご利用ください</p>
            </div>
        )
    }

    return (
        <ul>
            {trains.map((train, index) => (
                <li key={`${train.hour}-${train.minute}-${train.destination}`}>
                    <TrainRow
                        train={train}
                        isNext={index === 0}
                        isLast={index === trains.length - 1}
                    />
                </li>
            ))}
        </ul>
    )
}
