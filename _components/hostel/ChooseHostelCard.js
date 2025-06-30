"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    IndianRupee,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto p-4">
            {results.map((result) => (
                <div
                    key={result.room_id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-200 group"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                            {result.hostels?.name || 'Hostel Name'}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Building2 size={14} />
                            <span>
                                {result.hostels?.branch?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Campus Branch'}
                            </span>
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="p-4 space-y-3">
                        {/* Room Type */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    {result.occupancy_limit} Person Room
                                </span>
                            </div>
                            <div className="flex gap-1">
                                {result.ac_type === 'ac' && (
                                    <div className="bg-blue-50 p-1 rounded">
                                        <Snowflake size={12} className="text-blue-600" />
                                    </div>
                                )}
                                {result.washroom_type === 'attached' && (
                                    <div className="bg-green-50 p-1 rounded">
                                        <Bath size={12} className="text-green-600" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-1">
                                        <IndianRupee size={18} className="text-gray-700" />
                                        <span className="text-xl font-bold text-gray-900">
                                            {result.annual_fee?.toLocaleString() || 'N/A'}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">per year, excl. laundry</span>
                                </div>
                                <button
                                    onClick={() => handleViewDetails(result.hostel_id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors group-hover:scale-105 transform duration-200"
                                >
                                    View Details
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}