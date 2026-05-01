import { useState, useEffect } from 'react'
import type { Train } from '../data/timetable'

const STORAGE_KEY = 'kitaayase-hidden-destinations'

export const extractDestinations = (trains: Train[]): string[] => {
    const set = new Set(trains.map(t => t.destination))
    return Array.from(set).sort()
}

export const filterByDestination = (trains: Train[], hiddenDestinations: Set<string>): Train[] => {
    return trains.filter(t => !hiddenDestinations.has(t.destination))
}

export const useFilter = (allDayTrains: Train[], upcomingTrains: Train[]) => {
    const [hiddenDestinations, setHiddenDestinations] = useState<Set<string>>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            return saved ? new Set<string>(JSON.parse(saved) as string[]) : new Set<string>()
        } catch {
            return new Set<string>()
        }
    })

    const destinations = extractDestinations(allDayTrains)

    const toggleDestination = (destination: string) => {
        setHiddenDestinations(prev => {
            const next = new Set(prev)
            if (next.has(destination)) {
                next.delete(destination)
            } else {
                next.add(destination)
            }
            return next
        })
    }

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(hiddenDestinations)))
    }, [hiddenDestinations])

    const filteredTrains = filterByDestination(upcomingTrains, hiddenDestinations)

    return { destinations, hiddenDestinations, toggleDestination, filteredTrains }
}
