interface FilterBarProps {
    destinations: string[]
    hiddenDestinations: Set<string>
    onToggle: (destination: string) => void
}

export const FilterBar = ({ destinations, hiddenDestinations, onToggle }: FilterBarProps) => {
    if (destinations.length === 0) return null

    return (
        <div className="bg-[#0d1526] border-b border-[#1e2a3a] px-4 py-2">
            <div className="flex flex-wrap gap-3">
                {destinations.map(dest => {
                    const isHidden = hiddenDestinations.has(dest)
                    return (
                        <label key={dest} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={!isHidden}
                                onChange={() => onToggle(dest)}
                                className="w-3.5 h-3.5 accent-[#006400]"
                            />
                            <span className={`text-xs ${isHidden ? 'text-gray-600 line-through' : 'text-gray-300'}`}>
                                {dest}
                            </span>
                        </label>
                    )
                })}
            </div>
        </div>
    )
}
