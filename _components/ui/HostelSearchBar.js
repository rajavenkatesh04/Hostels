"use client"

import { useState, useEffect, useRef } from 'react';
import { Search, X, Navigation, MapPin, Users, Loader2 } from 'lucide-react';

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
        inputRef.current?.focus();
    };

    const handleInputFocus = () => {
        if (query.trim()) {
            setIsOpen(true);
        }
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
                    placeholder="Enter hostel to get directions... "
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={handleInputFocus}
                    className="w-full pl-10 pr-10 py-2 md:py-2.5 text-sm md:text-base bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-gray-900 shadow-sm hover:shadow-md"
                />

                {/* Search Icon */}
                <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <Search className="h-4 w-4 md:h-5 md:w-5" />
                </div>

                {/* Clear Button */}
                {query && (
                    <button
                        onClick={handleClearClick}
                        className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors rounded-full p-1 hover:bg-gray-100"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && (
                <>
                    {/* Backdrop for mobile */}
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" />

                    {/* Results Container */}
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
                                        className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer group ${
                                            index !== results.length - 1 ? 'border-b border-gray-100' : ''
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                        {hostel.name}
                                                    </h3>
                                                    <GenderBadge gender={hostel.gender} />
                                                </div>

                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                                    <span className="truncate">Campus Location</span>
                                                </div>
                                            </div>

                                            {/* Get Directions Button */}
                                            <button
                                                onClick={(e) => handleGetDirections(hostel, e)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 group-hover:scale-105"
                                            >
                                                <Navigation className="w-3 h-3" />
                                                <span className="hidden sm:inline">Directions</span>
                                                <span className="sm:hidden">Go</span>
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
                </>
            )}
        </div>
    );
}