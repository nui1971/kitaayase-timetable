interface HeaderProps {
    now: Date
}

export const Header = ({ now }: HeaderProps) => {
    const hh = now.getHours().toString().padStart(2, '0')
    const mm = now.getMinutes().toString().padStart(2, '0')

    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const weekdays = ['日', '月', '火', '水', '木', '金', '土']
    const weekday = weekdays[now.getDay()]
    const dateStr = `${year}/${month}/${day} (${weekday})`

    return (
        <header style={{
            backgroundColor: '#0d1526',
            borderBottom: '0.5px solid rgba(255,255,255,0.08)',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        }}>
            <div>
                <div style={{ marginBottom: '6px' }}>
                    <span style={{
                        backgroundColor: '#006400',
                        color: 'white',
                        fontSize: '11px',
                        padding: '2px 7px',
                        borderRadius: '4px',
                    }}>C20</span>
                </div>
                <div style={{ color: 'white', fontSize: '28px', fontWeight: 700, lineHeight: 1.1 }}>北綾瀬</div>
                <div style={{ color: '#8a9bb5', fontSize: '13px' }}>Kita-Ayase</div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <time style={{ color: 'white', fontSize: '38px', fontWeight: 300, display: 'block' }}>
                    {hh}:{mm}
                </time>
                <div style={{ color: '#8a9bb5', fontSize: '12px' }}>{dateStr}</div>
            </div>
        </header>
    )
}
