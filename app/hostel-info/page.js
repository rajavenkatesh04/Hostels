"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, User, XCircle, Users, MapPin, Shield, Wifi, Car, Utensils, Dumbbell, Camera, ArrowRight, HelpCircle, Bath, Monitor, Coffee, BookOpen, Gamepad2, ShoppingBag, Zap } from 'lucide-react';

// Cache implementation
const cache = new Map();

const fetchHostelsWithCache = async () => {
    const cacheKey = 'hostel-data';

    // Return cached data if available and not expired (5 minute cache)
    if (cache.has(cacheKey)) {
        const { data, timestamp } = cache.get(cacheKey);
        const now = Date.now();
        if (now - timestamp < 300000) { // 5 minutes in milliseconds
            return data;
        }
    }

    // Fetch fresh data
    const response = await fetch('/api/hostel-info');
    if (!response.ok) {
        throw new Error('Failed to fetch hostels');
    }
    const data = await response.json();

    // Update cache
    cache.set(cacheKey, {
        data: data.hostels,
        timestamp: Date.now()
    });

    return data.hostels;
};

export default function HostelsPage() {
    const router = useRouter();
    const [hostels, setHostels] = useState([]);
    const [filteredHostels, setFilteredHostels] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (window.location.hash) {
            const el = document.querySelector(window.location.hash);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [router.asPath]);

    useEffect(() => {
        const fetchHostels = async () => {
            try {
                setError(null);
                const data = await fetchHostelsWithCache();
                setHostels(data);
                setFilteredHostels(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };

        fetchHostels();
    }, []);

    useEffect(() => {
        let results = hostels;

        if (filter !== 'all') {
            results = results.filter(hostel => hostel.gender === filter);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            results = results.filter(hostel =>
                hostel.name.toLowerCase().includes(query) ||
                (hostel.description && hostel.description.toLowerCase().includes(query)) ||
                (hostel.branch && hostel.branch.toLowerCase().includes(query))
            );
        }

        setFilteredHostels(results);
    }, [hostels, filter, searchQuery]);

    const keyFeatures = [
        {
            id: 1,
            title: "Premium Security",
            description: "24/7 CCTV surveillance, biometric attendance, security guards, and turnstile gates with baggage scanners ensure complete safety.",
            icon: <Shield className="text-indigo-600" size={24} />
        },
        {
            id: 2,
            title: "Modern Amenities",
            description: "Fully equipped gym, Wi-Fi, lifts, air-conditioned waiting halls, study halls, TV halls, and indoor games facilities",
            icon: <Wifi className="text-teal-600" size={24} />
        },
        {
            id: 3,
            title: "Convenient Living",
            description: "On-campus supermarkets, eatery shops, beauty parlour, clothing shops, photocopier services and jogging tracks for comfortable student life.",
            icon: <MapPin className="text-indigo-600" size={24} />
        }
    ];

    const facilitiesData = {
        common: [
            { icon: <Shield size={20} />, text: "24/7 Security & CCTV" },
            { icon: <Wifi size={20} />, text: "High-Speed Wi-Fi" },
            { icon: <Zap size={20} />, text: "Power Backup" },
            { icon: <Bath size={20} />, text: "Hot & Cold Water" },
            { icon: <Monitor size={20} />, text: "TV Halls" },
            { icon: <BookOpen size={20} />, text: "Study Halls" },
            { icon: <Dumbbell size={20} />, text: "Fully Equipped Gym" },
            { icon: <Gamepad2 size={20} />, text: "Indoor Games Hall" }
        ],
        male: [
            { icon: <Building2 size={20} />, text: "14 Hostel Blocks" },
            { icon: <Users size={20} />, text: "7,500 Total Capacity" },
            { icon: <Car size={20} />, text: "AC & Non-AC Options" },
            { icon: <Bath size={20} />, text: "Attached & Common Washrooms" }
        ],
        female: [
            { icon: <Building2 size={20} />, text: "6 Hostel Blocks" },
            { icon: <Users size={20} />, text: "4,000 Total Capacity" },
            { icon: <ShoppingBag size={20} />, text: "Beauty Parlour & Shopping" },
            { icon: <Coffee size={20} />, text: "Eatery Shops & Food Courts" }
        ]
    };

    const hostelStats = [
        {
            number: "15,000+",
            label: "Total Capacity",
            description: "Students accommodated"
        },
        {
            number: "20+",
            label: "Hostel Blocks",
            description: "Across campus"
        },
        {
            number: "24/7",
            label: "Security",
            description: "Round the clock safety"
        }
    ];

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
                <XCircle className="text-red-500" size={64} />
                <h1 className="mt-4 text-xl font-light text-gray-900">Something went wrong</h1>
                <p className="mt-2 text-gray-600 font-light">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white text-gray-900 min-h-screen transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-24 py-16">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-light text-gray-900 tracking-wide mb-4">
                        SRM <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-600">Hostels</span>
                    </h1>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-indigo-600 to-teal-600 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-light">
                        Experience comfortable and safe housing with world-class facilities designed to enhance your academic journey
                    </p>
                </div>

                {/* Search Bar */}
                {/*<SearchBar onSearch={setSearchQuery} />*/}

                {/* Key Features */}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {keyFeatures.map(feature => (
                        <div key={feature.id} className="group p-6 rounded-xl border border-gray-300 bg-gray-50 hover:border-indigo-600/50 hover:bg-indigo-600/5 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500/20 to-teal-500/20 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                            </div>
                            <p className="text-gray-700 font-light leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Statistics */}
                <div className="text-center mb-16">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        {hostelStats.map((stat, index) => (
                            <div key={index} className="space-y-2">
                                <div className="text-3xl font-bold text-indigo-600">{stat.number}</div>
                                <div className="text-lg font-medium text-gray-900">{stat.label}</div>
                                <div className="text-sm text-gray-500">{stat.description}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Facilities Section */}
                <div className="mb-16">
                    <h2 className="text-2xl font-light text-center text-gray-900 mb-12">
                        Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-600">Facilities</span>
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Common Facilities */}
                        <div className="p-6 rounded-xl border border-gray-300 bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <Utensils className="text-indigo-600" size={20} />
                                Common Facilities
                            </h3>
                            <div className="space-y-3">
                                {facilitiesData.common.map((facility, index) => (
                                    <div key={index} className="flex items-center gap-3 text-gray-700">
                                        <div className="text-indigo-600">{facility.icon}</div>
                                        <span className="font-light">{facility.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Men's Hostel Specific */}
                        <div className="p-6 rounded-xl border border-gray-300 bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <User className="text-blue-600" size={20} />
                                Men's Hostels
                            </h3>
                            <div className="space-y-3">
                                {facilitiesData.male.map((facility, index) => (
                                    <div key={index} className="flex items-center gap-3 text-gray-700">
                                        <div className="text-blue-600">{facility.icon}</div>
                                        <span className="font-light">{facility.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Women's Hostel Specific */}
                        <div className="p-6 rounded-xl border border-gray-300 bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <User className="text-pink-600" size={20} />
                                Women's Hostels
                            </h3>
                            <div className="space-y-3">
                                {facilitiesData.female.map((facility, index) => (
                                    <div key={index} className="flex items-center gap-3 text-gray-700">
                                        <div className="text-pink-600">{facility.icon}</div>
                                        <span className="font-light">{facility.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Buttons */}
                <section id="main">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                                    filter === 'all'
                                        ? 'bg-gradient-to-r from-indigo-600 to-teal-600 text-white shadow-lg transform scale-105'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                All Hostels
                            </button>
                            <button
                                onClick={() => setFilter('male')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                                    filter === 'male'
                                        ? 'bg-gradient-to-r from-indigo-600 to-teal-600 text-white shadow-lg transform scale-105'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Boys Hostels
                            </button>
                            <button
                                onClick={() => setFilter('female')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                                    filter === 'female'
                                        ? 'bg-gradient-to-r from-indigo-600 to-teal-600 text-white shadow-lg transform scale-105'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Girls Hostels
                            </button>
                        </div>
                    </div>
                </section>

                {/* Results Count */}
                {filteredHostels.length > 0 && (
                    <div className="text-center mb-8">
                        <p className="text-gray-600 font-light">
                            Showing <span className="font-medium text-indigo-600">{filteredHostels.length}</span>
                            {filter === 'all' ? ' hostels' : ` ${filter} hostels`}
                            {searchQuery && (
                                <span> matching <span className="font-medium">"{searchQuery}"</span></span>
                            )}
                        </p>
                    </div>
                )}

                {/* Hostels Grid */}
                {filteredHostels.length === 0 ? (
                    <div className="text-center py-16">
                        <Building2 className="mx-auto text-gray-400 mb-4" size={64} />
                        <h3 className="text-xl font-light text-gray-600 mb-2">Please wait, Loading...</h3>
                        <p className="text-gray-500">
                            {searchQuery
                                ? "Try adjusting your filter selection"
                                : "If issue persists, please check your internet connection and try again"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredHostels.map(hostel => (
                            <div key={hostel.id} className="group bg-white border border-gray-300 rounded-xl overflow-hidden hover:shadow-xl hover:border-indigo-600/50 transition-all duration-300 transform hover:-translate-y-1">
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-500/20 to-teal-500/20 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                                            <Building2 size={20} className="text-indigo-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-xl font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">{hostel.name}</h2>
                                        </div>
                                    </div>

                                    <p className=" font-light mb-4 leading-relaxed line-clamp-1">{hostel.description}</p>

                                    <div className="flex items-center justify-between mb-6 text-sm">
                                        <div
                                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm w-fit border ${
                                                hostel.gender === 'male'
                                                    ? 'bg-blue-50 text-blue-500 border-blue-500'
                                                    : 'bg-pink-50 text-pink-500 border-pink-500'
                                            }`}
                                        >
                                            <User size={16} className={hostel.gender === 'male' ? 'text-blue-500' : 'text-pink-500'} />
                                            <span>{hostel.gender === 'male' ? 'Boys Hostel' : 'Girls Hostel'}</span>
                                        </div>



                                        {hostel.pricing && (
                                            <div className="text-right">
                                                <div className="text-sm text-gray-500">Starting from</div>
                                                <div className="text-lg font-semibold text-indigo-500">₹{hostel.pricing.min_price}</div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => router.push(`/hostel?id=${hostel.id}`)}
                                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        View Details
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* FAQ Link */}
                <div className="text-center mt-16">
                    <Link href="/faq" className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-indigo-600/50 bg-gradient-to-r from-indigo-600/10 to-teal-600/10 hover:from-indigo-600/20 hover:to-teal-600/20 transition-all duration-300 group">
                        <HelpCircle className="text-indigo-600 group-hover:rotate-12 transition-transform duration-300" size={20} />
                        <span className="text-indigo-600 font-medium">Have Questions? Check our FAQ</span>
                        <ArrowRight className="text-teal-600 group-hover:translate-x-1 transition-transform duration-300" size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}