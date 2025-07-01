"use client"

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Users, GraduationCap, Building, ArrowRight } from 'lucide-react';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchBarRef = useRef(null);

    useEffect(() => {
        const searchBar = searchBarRef.current;

        const handleFocus = () => {
            searchBar.classList.add('search-focused');
        };

        const handleBlur = () => {
            if (!query.trim()) {
                searchBar.classList.remove('search-focused');
                setResults([]);
            }
        };

        const handleClickOutside = (event) => {
            if (searchBar && !searchBar.contains(event.target)) {
                searchBar.classList.remove('search-focused');
                setQuery('');
                setResults([]);
            }
        };

        const inputElement = searchBar.querySelector('input');
        inputElement.addEventListener('focus', handleFocus);
        inputElement.addEventListener('blur', handleBlur);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            inputElement.removeEventListener('focus', handleFocus);
            inputElement.removeEventListener('blur', handleBlur);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [query]);

    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            setIsLoading(false);
            return;
        }

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
            const response = await fetch(`/api/hostel/search?q=${encodeURIComponent(searchTerm)}`);
            if (!response.ok) throw new Error('Search failed');
            const data = await response.json();
            setResults(data.hostels || []);
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
        const inputElement = searchBarRef.current.querySelector('input');
        inputElement.value = '';
        inputElement.focus();
        searchBarRef.current.classList.remove('search-focused');
    };

    const handleResultClick = (hostelId) => {
        router.push(`/hostel/?id=${hostelId}`);
        searchBarRef.current.classList.remove('search-focused');
        setQuery('');
        setResults([]);
    };

    const GenderIcon = ({ gender }) => {
        const isFemale = gender?.toLowerCase().includes('female') || gender?.toLowerCase().includes('girl');
        const iconColor = isFemale ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-300' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300';
        return (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconColor} flex-shrink-0`}>
                <Users className="w-4 h-4" />
            </div>
        );
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto" ref={searchBarRef}>
            <div className="search-overlay hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>
            <div className="relative z-50">
                <input
                    type="text"
                    placeholder="Search hostels by name, description or branch..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-lime-400 focus:border-indigo-500 dark:focus:border-lime-400 transition-all duration-300 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md"
                />
                <div className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500">
                    <Search className="h-5 w-5" />
                </div>
                <button
                    className={`absolute right-4 top-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ${query ? '' : 'hidden'} clear-button`}
                    onClick={handleClearClick}
                    aria-label="Clear search"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
            <div className="search-results hidden absolute z-50 mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                {isLoading ? (
                    <div className="p-4 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                        <div className="w-4 h-4 border-2 border-indigo-600 dark:border-lime-400 border-t-transparent rounded-full animate-spin"></div>
                        <span>Searching hostels...</span>
                    </div>
                ) : results.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                        {results.map((hostel) => (
                            <li
                                key={hostel.id}
                                className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                                onClick={() => handleResultClick(hostel.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <GenderIcon gender={hostel.gender} />
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                            {hostel.name}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                                            {hostel.branch && (
                                                <span className="flex items-center gap-1">
                                                    <Building className="w-3 h-3" />
                                                    {hostel.branch}
                                                </span>
                                            )}
                                            {hostel.year_of_study && (
                                                <span className="flex items-center gap-1">
                                                    <GraduationCap className="w-3 h-3" />
                                                    Year {hostel.year_of_study}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        {query.trim() ? 'No hostels found matching your search.' : 'Start typing to search for hostels...'}
                    </div>
                )}
            </div>
            <style jsx global>{`
                .search-focused .search-overlay {
                    display: block;
                }
                .search-focused .clear-button {
                    display: block;
                }
                .search-focused .search-results {
                    display: block;
                }
            `}</style>
        </div>
    );
}