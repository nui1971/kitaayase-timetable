import type { DayType } from '../data/timetable'

interface TabBarProps {
    selected: DayType
    onSelect: (day: DayType) => void
}

const TABS: { key: DayType; label: string }[] = [
    { key: 'weekday', label: '平日' },
    { key: 'holiday', label: '土・休日' },
]

export const TabBar = ({ selected, onSelect }: TabBarProps) => (
    <nav className="flex gap-2 px-4 py-3 bg-[#0a0f1e]">
        {TABS.map(({ key, label }) => (
            <button
                key={key}
                onClick={() => onSelect(key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selected === key
                        ? 'bg-[#006400] text-white'
                        : 'border border-gray-600 text-gray-400 hover:text-gray-200'
                }`}
            >
                {label}
            </button>
        ))}
    </nav>
)
