import type { DayType } from '../data/timetable'

interface TabBarProps {
    selected: DayType
    onSelect: (day: DayType) => void
}

const TABS: { key: DayType; label: string }[] = [
    { key: 'weekday', label: '平日' },
    { key: 'holiday', label: '土休日' },
]

export const TabBar = ({ selected, onSelect }: TabBarProps) => (
    <nav className="flex border-b border-gray-200">
        {TABS.map(({ key, label }) => (
            <button
                key={key}
                onClick={() => onSelect(key)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    selected === key
                        ? 'bg-[#006400] text-white'
                        : 'text-gray-500 hover:text-gray-700 bg-white'
                }`}
            >
                {label}
            </button>
        ))}
    </nav>
)
