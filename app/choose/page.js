// app/hostels/page.js
'use client'

import { useState, useEffect } from 'react'
import HostelGrid from '../../_components/hostel/HostelGrid'

export default function HostelsPage() {
    // State management - think of these as the "memory" of your component
    const [hostels, setHostels] = useState([]) // Stores the actual hostel data
    const [loading, setLoading] = useState(true) // Tracks if we're currently fetching data
    const [error, setError] = useState(null) // Stores any error messages
    const [filters, setFilters] = useState({}) // Will store active filters
    const [totalCount, setTotalCount] = useState(0) // Tracks how many hostels match current filters

    // This effect runs when the component first mounts - like opening a book to the first page
    useEffect(() => {
        fetchHostels()
    }, []) // Empty dependency array means this only runs once when component loads

    // This is our main data fetching function - the workhorse of the page
    const fetchHostels = async (appliedFilters = {}) => {
        try {
            // Set loading to true to show users that something is happening
            setLoading(true)
            setError(null) // Clear any previous errors

            console.log('Fetching hostels with filters:', appliedFilters) // Helpful for debugging

            // Build the query string from filters - this is like creating a search request
            const queryParams = new URLSearchParams()
            Object.entries(appliedFilters).forEach(([key, value]) => {
                if (value && value !== '') { // Only add filters that have actual values
                    queryParams.append(key, value)
                }
            })

            // Make the actual API call - this is where we talk to our backend
            const response = await fetch(`/api/hostels?${queryParams}`)

            // Check if the response is successful - like checking if a letter was delivered
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            // Handle the response based on our API design
            if (result.success) {
                setHostels(result.data)
                setTotalCount(result.count)
                setFilters(appliedFilters) // Remember which filters are currently active
                console.log('Successfully loaded hostels:', result.data.length) // Success feedback
            } else {
                throw new Error(result.error || 'Failed to fetch hostels')
            }
        } catch (err) {
            // Error handling - like having a backup plan when things go wrong
            console.error('Error fetching hostels:', err)
            setError(err.message || 'Failed to load hostels. Please try again.')
            setHostels([]) // Clear any previous data
        } finally {
            // This always runs, regardless of success or failure
            setLoading(false)
        }
    }

    // Helper function to handle filter changes - this will be useful when we add filters later
    const handleFilterChange = (newFilters) => {
        fetchHostels(newFilters)
    }

    // Helper function to retry loading - gives users a way to recover from errors
    const handleRetry = () => {
        fetchHostels(filters)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page header - sets the context for users */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Find Your Perfect Hostel
                            </h1>
                            <p className="text-gray-600">
                                Discover comfortable and affordable accommodation options
                            </p>
                        </div>

                        {/* Results counter - helps users understand what they're seeing */}
                        {!loading && (
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">
                                    {totalCount}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {totalCount === 1 ? 'hostel' : 'hostels'} found
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main content area */}
            <div className="container mx-auto px-4 py-8">
                {/* Filter section placeholder - we'll expand this later */}
                <div className="mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                {Object.keys(filters).length > 0 ? (
                                    <span>
                    Active filters: {Object.entries(filters)
                                        .filter(([_, value]) => value)
                                        .map(([key, value]) => `${key}: ${value}`)
                                        .join(', ')}
                  </span>
                                ) : (
                                    <span>Showing all hostels</span>
                                )}
                            </div>

                            {/* Quick filter buttons for testing */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleFilterChange({ gender: 'boys' })}
                                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                >
                                    Boys Only
                                </button>
                                <button
                                    onClick={() => handleFilterChange({ gender: 'girls' })}
                                    className="px-3 py-1 text-xs bg-pink-100 text-pink-700 rounded hover:bg-pink-200 transition-colors"
                                >
                                    Girls Only
                                </button>
                                <button
                                    onClick={() => handleFilterChange({})}
                                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error handling - shows users what went wrong and how to fix it */}
                {error && (
                    <div className="mb-8">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-red-800 font-medium mb-1">
                                        Unable to load hostels
                                    </h3>
                                    <p className="text-red-700 text-sm">
                                        {error}
                                    </p>
                                </div>
                                <button
                                    onClick={handleRetry}
                                    className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors text-sm font-medium"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main content - this is where the hostels are displayed */}
                <HostelGrid hostels={hostels} loading={loading} />

                {/* Additional information section */}
                {!loading && !error && hostels.length > 0 && (
                    <div className="mt-12 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            About Our Hostels
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-600 font-bold">✓</span>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800 mb-1">Verified Properties</h3>
                                    <p>All hostels are verified and meet our quality standards</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-green-600 font-bold">₹</span>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800 mb-1">Transparent Pricing</h3>
                                    <p>No hidden fees - all costs are clearly displayed upfront</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-purple-600 font-bold">⚡</span>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800 mb-1">Quick Booking</h3>
                                    <p>Book your room in minutes with our streamlined process</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty state - shown when no hostels match the criteria */}
                {!loading && !error && hostels.length === 0 && (
                    <div className="text-center py-12">
                        <div className="mb-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-gray-400 text-2xl">🏠</span>
                            </div>
                            <h3 className="text-xl font-medium text-gray-800 mb-2">
                                No hostels found
                            </h3>
                            <p className="text-gray-600 mb-4">
                                We couldn't find any hostels matching your criteria. Try adjusting your filters or check back later.
                            </p>
                            <button
                                onClick={() => handleFilterChange({})}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Show All Hostels
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Debug information - helpful during development */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded text-xs max-w-xs">
                    <div className="font-bold mb-1">Debug Info:</div>
                    <div>Loading: {loading ? 'Yes' : 'No'}</div>
                    <div>Error: {error ? 'Yes' : 'No'}</div>
                    <div>Hostels: {hostels.length}</div>
                    <div>Filters: {Object.keys(filters).length}</div>
                </div>
            )}
        </div>
    )
}