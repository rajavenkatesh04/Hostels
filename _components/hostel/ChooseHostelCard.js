"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Building2,
    Users,
    ArrowRight,
    Snowflake,
    Bath
} from 'lucide-react';

export default function ChooseHostelCard({ results }) {
    const router = useRouter();

    const handleViewDetails = (hostelId) => {
        if (hostelId) {
            router.push(`/hostel?id=${hostelId}`);
        } else {
            console.error('No hostel ID provided for navigation');
        }
    };

    if (!results || results.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto p-4">
            {results.map((result) => (
                <div key={result.room_id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {/* Card Header with Hostel Name */}
                    <div className="bg-gradient-to-r from-indigo-500 to-teal-500 p-4">
                        <h3 className="text-white text-xl font-bold">
                            {result.hostels?.name || 'Hostel Name'}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-indigo-100 mt-1">
                            <Building2 size={14} />
                            <span>
                {result.hostels?.branch?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Campus Branch'}
              </span>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <Users size={18} className="text-gray-500" />
                                <span className="text-gray-700">
                  {result.occupancy_limit} Person Room
                </span>
                            </div>
                            <div className="flex gap-2">
                                {result.ac_type === 'ac' && (
                                    <div className="bg-indigo-100 p-2 rounded-full">
                                        <Snowflake size={16} className="text-indigo-600" />
                                    </div>
                                )}
                                {result.washroom_type === 'attached' && (
                                    <div className="bg-teal-100 p-2 rounded-full">
                                        <Bath size={16} className="text-teal-600" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* View Details Button */}
                        <button
                            onClick={() => handleViewDetails(result.hostel_id)}
                            className="w-full bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-300 transform hover:scale-105"
                        >
                            View Details
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
