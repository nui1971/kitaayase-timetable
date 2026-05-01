const AYASE = '綾瀬'

interface FilterBarProps {
    destinations: string[]
    hiddenDestinations: Set<string>
    onToggle: (destination: string) => void
}

export const FilterBar = ({ destinations, hiddenDestinations, onToggle }: FilterBarProps) => {
    if (!destinations.includes(AYASE)) return null

    return (
        <div className="bg-[#0d1526] border-b border-[#1e2a3a] px-4 py-2">
            <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input
                    type="checkbox"
                    checked={!hiddenDestinations.has(AYASE)}
                    onChange={() => onToggle(AYASE)}
                    className="w-4 h-4 accent-[#006400]"
                />
                <span className="text-sm text-gray-300">綾瀬</span>
            </label>
        </div>
    )
}
