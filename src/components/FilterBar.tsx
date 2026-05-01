const AYASE = '綾瀬'

interface FilterBarProps {
    destinations: string[]
    hiddenDestinations: Set<string>
    onToggle: (destination: string) => void
}

export const FilterBar = ({ destinations, hiddenDestinations, onToggle }: FilterBarProps) => {
    if (!destinations.includes(AYASE)) return null

    return (
        <div style={{ margin: '6px 16px 10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                    type="checkbox"
                    checked={hiddenDestinations.has(AYASE)}
                    onChange={() => onToggle(AYASE)}
                    style={{ accentColor: '#006400', width: '15px', height: '15px' }}
                />
                <span style={{ color: '#c8d6e8', fontSize: '13px' }}>綾瀬行を表示しない</span>
            </label>
        </div>
    )
}
