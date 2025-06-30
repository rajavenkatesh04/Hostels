"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Building2,
    User,
    Loader2,
    XCircle
} from 'lucide-react';

export default function HostelsPage() {
    const router = useRouter();
    const [hostels, setHostels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'boys', 'girls'

    useEffect(() => {
        const fetchHostels = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch('/api/hostel-info');
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Failed to fetch hostels');
                setHostels(data.hostels);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHostels();
    }, []);

    const filteredHostels = hostels.filter(hostel => {
        if (filter === 'all') return true;
        return hostel.gender === filter;
    });

    const hostelInfoSections = [
        {
            id: 1,
            title: "Safe and Secure",
            description: "Our hostels are designed with your safety in mind. With 24/7 security and secure access, you can focus on your studies and enjoy your time without worry."
        },
        {
            id: 2,
            title: "Comfortable Living",
            description: "Experience a comfortable living space that feels like home. Our hostels are equipped with modern amenities to ensure you have a pleasant stay."
        },
        {
            id: 3,
            title: "Convenient Facilities",
            description: "Enjoy easy access to campus facilities and academic buildings. Our hostels are strategically located to provide convenience and save you time."
        }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
                <p className="mt-4 text-lg font-light text-gray-700">Loading hostels...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
                <XCircle className="text-red-500" size={64} />
                <h1 className="mt-4 text-xl font-light text-gray-900">Something went wrong</h1>
                <p className="mt-2 text-gray-600 font-light">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white text-gray-900 min-h-screen transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-24 py-8">
                <h1 className="text-4xl font-light text-gray-900 mb-8">Our Hostels</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {hostelInfoSections.map(section => (
                        <div key={section.id} className="bg-indigo-50 rounded-lg p-6 shadow-lg">
                            <h2 className="text-xl font-medium text-gray-900 mb-2">{section.title}</h2>
                            <p className="text-gray-700 font-light">{section.description}</p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        All Hostels
                    </button>
                    <button
                        onClick={() => setFilter('boys')}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === 'boys' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Boys Hostels
                    </button>
                    <button
                        onClick={() => setFilter('girls')}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === 'girls' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Girls Hostels
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredHostels.map(hostel => (
                        <div key={hostel.id} className="border border-gray-300 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-500/20 to-teal-500/20 flex items-center justify-center border border-indigo-500/30">
                                        <Building2 size={24} className="text-indigo-500" />
                                    </div>
                                    <h2 className="text-xl font-medium text-gray-900">{hostel.name}</h2>
                                </div>
                                <p className="text-gray-700 font-light mb-4">{hostel.description}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-600 font-light">
                                    <User size={16} />
                                    <span>{hostel.gender === 'male' ? 'Boys Hostel' : 'Girls Hostel'}</span>
                                </div>
                                <button
                                    onClick={() => router.push(`/hostel?id=${hostel.id}`)}
                                    className="mt-6 w-full py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition-all duration-300"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
