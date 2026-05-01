import { useState, useEffect } from 'react'

export const useCurrentTime = (): Date => {
    const [now, setNow] = useState(() => new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date())
        }, 60000)
        return () => clearInterval(timer)
    }, [])

    return now
}
