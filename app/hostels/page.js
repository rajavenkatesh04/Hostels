'use client'

import { useState, useEffect } from 'react'
import HostelCard from '@/_components/hostel/HostelCard'
import LoadingSpinner from '@/_components/ui/LoadingSpinner'

export default function HostelsPage() {
    // State management - think of these as variables that can change and cause re-renders
    const [hostels, setHostels] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('all') // 'all', 'boys', 'girls'

    // useEffect runs when the component first loads (like window.onload in vanilla JS)
    useEffect(() => {
        fetchHostels()
    }, [])

    const fetchHostels = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/hostels')

            if (!response.ok) {
                throw new Error('Failed to fetch hostels')
            }

            const data = await response.json()
            setHostels(data.hostels)
        } catch (err) {
            setError(err.message)
            console.error('Error fetching hostels:', err)
        } finally {
            setLoading(false)
        }
    }

    // Filter hostels based on gender selection
    const filteredHostels = hostels.filter(hostel => {
        if (filter === 'all') return true
        return hostel.gender === filter
    })

    if (loading) return <LoadingSpinner />
    if (error) return <div className="text-center text-red-600 py-8">Error: {error}</div>

    return (
        <div className="rounded-2xl min-h-screen bg-gray-50 ">
            {/* Hero Section */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 ">
                <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                        Find Your Perfect Hostel
                    </h1>
                    <p className="text-xl text-center text-blue-100 max-w-2xl mx-auto">
                        Discover comfortable and affordable hostels with modern amenities
                    </p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-wrap gap-4 justify-center mb-8">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-full transition-colors ${
                            filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        All Hostels ({hostels.length})
                    </button>
                    <button
                        onClick={() => setFilter('boys')}
                        className={`px-6 py-2 rounded-full transition-colors ${
                            filter === 'boys'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        Boys Hostels ({hostels.filter(h => h.gender === 'boys').length})
                    </button>
                    <button
                        onClick={() => setFilter('girls')}
                        className={`px-6 py-2 rounded-full transition-colors ${
                            filter === 'girls'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        Girls Hostels ({hostels.filter(h => h.gender === 'girls').length})
                    </button>
                </div>

                {/* Results Summary */}
                <div className="text-center mb-8">
                    <p className="text-gray-600">
                        Showing {filteredHostels.length} hostel{filteredHostels.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Hostels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHostels.map(hostel => (
                        <HostelCard key={hostel.id} hostel={hostel} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredHostels.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No hostels found for the selected filter.</p>
                    </div>
                )}
            </div>
        </div>
    )
}