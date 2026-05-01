interface HeaderProps {
    now: Date
}

export const Header = ({ now }: HeaderProps) => {
    const hh = now.getHours().toString().padStart(2, '0')
    const mm = now.getMinutes().toString().padStart(2, '0')

    return (
        <header className="bg-[#006400] text-white px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-bold">北綾瀬駅</h1>
            <time className="text-2xl font-mono font-bold" dateTime={`${hh}:${mm}`}>
                {hh}:{mm}
            </time>
        </header>
    )
}
