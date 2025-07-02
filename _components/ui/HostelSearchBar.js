"use client"

import { useState, useEffect, useRef } from 'react';
import { Search, X, Navigation, Users, Loader2 } from 'lucide-react';

export default function HostelSearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchBarRef = useRef(null);
    const inputRef = useRef(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setIsOpen(false);
                setQuery('');
                setResults([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            setIsLoading(false);
            setIsOpen(false);
            return;
        }

        setIsOpen(true);
        const timerId = setTimeout(() => {
            searchHostels(query);
        }, 300);

        return () => clearTimeout(timerId);
    }, [query]);

    async function searchHostels(searchTerm) {
        if (searchTerm.trim() === '') {
            setResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            // First get all hostels from map-data API
            const response = await fetch('/api/map-data');
            if (!response.ok) throw new Error('Search failed');

            const data = await response.json();

            if (data.success && data.hostels) {
                // Filter hostels based on search term
                const filteredHostels = data.hostels.filter(hostel =>
                    hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    hostel.gender.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setResults(filteredHostels.slice(0, 5)); // Limit to 5 results for navbar
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }

    const handleClearClick = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    const getNavigationUrl = (hostel) => {
        return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hostel.plus_code)}`;
    };

    const handleGetDirections = (hostel, event) => {
        event.stopPropagation();
        window.open(getNavigationUrl(hostel), '_blank', 'noopener,noreferrer');
        // Close search after action
        setIsOpen(false);
        setQuery('');
        setResults([]);
    };

    const GenderBadge = ({ gender }) => {
        const isFemale = gender?.toLowerCase() === 'female';
        return (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isFemale
                    ? 'bg-pink-100 text-pink-700'
                    : 'bg-blue-100 text-blue-700'
            }`}>
                <Users className="w-3 h-3 mr-1" />
                {isFemale ? 'Girls' : 'Boys'}
            </div>
        );
    };

    return (
        <div className="relative w-full" ref={searchBarRef}>
            {/* Search Input */}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter hostel to get directions..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-8 md:pl-10 pr-8 md:pr-10 py-2 text-sm bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{
                        '@media (max-width: 768px)': {
                            animation: 'scroll-placeholder 8s linear infinite'
                        }
                    }}
                />

                {/* Search Icon */}
                <div className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <Search className="h-4 w-4" />
                </div>

                {/* Clear Button */}
                {query && (
                    <button
                        onClick={handleClearClick}
                        className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-hidden">
                    {isLoading ? (
                        <div className="p-4 flex items-center justify-center gap-2 text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                            <span className="text-sm">Searching hostels...</span>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="overflow-y-auto max-h-80">
                            {results.map((hostel, index) => (
                                <div
                                    key={hostel.id}
                                    className={`p-3 cursor-pointer ${
                                        index !== results.length - 1 ? 'border-b border-gray-100' : ''
                                    }`}
                                >
                                    {/* Mobile Layout */}
                                    <div className="md:hidden">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                                    {hostel.name}
                                                </h3>
                                                <GenderBadge gender={hostel.gender} />
                                            </div>
                                            <button
                                                onClick={(e) => handleGetDirections(hostel, e)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                <Navigation className="w-3 h-3" />
                                                <span>Go</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Desktop Layout */}
                                    <div className="hidden md:flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-sm font-semibold text-gray-900">
                                                {hostel.name}
                                            </h3>
                                            <GenderBadge gender={hostel.gender} />
                                        </div>
                                        <button
                                            onClick={(e) => handleGetDirections(hostel, e)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            <Navigation className="w-3 h-3" />
                                            <span>Directions</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : query.trim() ? (
                        <div className="p-4 text-center">
                            <div className="text-gray-400 mb-2">
                                <Search className="w-8 h-8 mx-auto opacity-50" />
                            </div>
                            <p className="text-sm text-gray-500">
                                No hostels found matching "{query}"
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Try searching for hostel names or "boys" / "girls"
                            </p>
                        </div>
                    ) : (
                        <div className="p-4 text-center">
                            <div className="text-gray-400 mb-2">
                                <Search className="w-8 h-8 mx-auto opacity-50" />
                            </div>
                            <p className="text-sm text-gray-500">
                                Start typing to get directions to hostel
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* CSS for scrolling placeholder on mobile */}
            <style jsx>{`
                @media (max-width: 768px) {
                    input::placeholder {
                        animation: scroll-placeholder 8s linear infinite;
                        white-space: nowrap;
                        overflow: hidden;
                        width: 100%;
                    }
                }

                @keyframes scroll-placeholder {
                    0% { transform: translateX(0); }
                    25% { transform: translateX(0); }
                    75% { transform: translateX(-50%); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
}