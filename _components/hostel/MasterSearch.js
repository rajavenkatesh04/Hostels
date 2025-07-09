"use client";
import { useState, useEffect, useRef } from 'react';
import { Search, X, Navigation, Users, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function MasterSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchBarRef = useRef(null);
    const inputRef = useRef(null);
    const router = useRouter();

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
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&limit=8`);
            if (!response.ok) throw new Error('Search failed');
            const data = await response.json();
            if (data.success) {
                setResults(data.hostels || []);
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

    const getNavigationUrl = (hostel) => {
        return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hostel.plus_code)}`;
    };

    const handleGetDirections = (hostel, event) => {
        event.stopPropagation();
        if (hostel.plus_code) {
            window.open(getNavigationUrl(hostel), '_blank', 'noopener,noreferrer');
        }
    };

    const handleHostelClick = (hostel, event) => {
        event.stopPropagation();
        router.push(`/hostel?id=${hostel.id}`);
        setIsOpen(false);
        setQuery('');
        setResults([]);
    };

    const GenderBadge = ({ gender }) => {
        const isFemale = gender?.toLowerCase() === 'female';
        const dotColor = isFemale ? 'bg-pink-500' : 'bg-blue-500';
        const bgColor = isFemale ? 'bg-pink-50' : 'bg-blue-50';
        const textColor = isFemale ? 'text-pink-700' : 'text-blue-700';

        return (
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${bgColor} ${textColor}`}>
                <div className={`w-2 h-2 rounded-full mr-1.5 ${dotColor}`}></div>
                <Users className="w-3 h-3 mr-1" />
                {isFemale ? 'Girls' : 'Boys'}
            </div>
        );
    };

    // Function to get styling based on gender
    const getGenderStyling = (gender) => {
        const isFemale = gender?.toLowerCase() === 'female';
        return {
            borderColor: isFemale ? 'border-l-pink-500' : 'border-l-blue-500',
            bgColor: isFemale ? 'bg-pink-50' : 'bg-blue-50',
            hoverBgColor: isFemale ? 'hover:bg-pink-100' : 'hover:bg-blue-100'
        };
    };

    return (
        <div className="relative w-full max-w-lg mx-auto z-80" ref={searchBarRef}>
            <div className="relative">
                <div className="relative flex items-center">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search hostels by name, gender, branch, amenities..."
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 placeholder-gray-400"
                    />
                    <AnimatePresence>
                        {query && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.1 }}
                                onClick={handleClearClick}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-80 top-full left-0 right-0 mt-2 z-50 w-full max-h-80 overflow-hidden bg-white border border-gray-100 shadow-lg rounded-lg"
                    >
                        {isLoading ? (
                            <div className="p-4 z-80 flex items-center justify-center gap-2 text-gray-500">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                                <span className="text-sm">Searching hostels...</span>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="overflow-y-auto z-80 max-h-80">
                                {results.map((hostel, index) => {
                                    const genderStyling = getGenderStyling(hostel.gender);
                                    return (
                                        <motion.div
                                            key={hostel.id}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                            className={`relative cursor-pointer transition-all duration-150 border-l-4 ${genderStyling.borderColor} ${genderStyling.bgColor} ${genderStyling.hoverBgColor} ${
                                                index !== results.length - 1 ? 'border-b border-gray-100' : ''
                                            }`}
                                        >
                                            <div className="p-3">
                                                <div className="flex items-center justify-between z-80 gap-3">
                                                    <div
                                                        className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                                                        onClick={(e) => handleHostelClick(hostel, e)}
                                                    >
                                                        <div className="flex flex-col gap-2 min-w-0 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="text-sm font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors">
                                                                    {hostel.name}
                                                                </h3>
                                                                <Info className="w-3 h-3 text-gray-400" />
                                                            </div>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <GenderBadge gender={hostel.gender} />
                                                                {hostel.branch && (
                                                                    <span className="text-xs text-gray-500 bg-white/60 px-2 py-0.5 rounded">
                                                                        {hostel.branch}
                                                                    </span>
                                                                )}
                                                                <span className="text-xs text-gray-500">
                                                                    ₹{hostel.pricing.min_price.toLocaleString()} - ₹{hostel.pricing.max_price.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {hostel.plus_code && (
                                                        <button
                                                            onClick={(e) => handleGetDirections(hostel, e)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-colors duration-150"
                                                        >
                                                            <Navigation className="w-3.5 h-3.5" />
                                                            <span className="hidden sm:inline">Directions</span>
                                                            <span className="sm:hidden">Go</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : query.trim() ? (
                            <div className="p-4 text-center">
                                <Search className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                                <p className="text-sm text-gray-600">No hostels found for "{query}"</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Try searching by hostel name, gender, branch, or amenities
                                </p>
                            </div>
                        ) : (
                            <div className="p-4 text-center">
                                <Search className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                                <p className="text-sm text-gray-600">Start typing to find hostels</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Search by name, gender, branch, amenities, or ask questions
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}