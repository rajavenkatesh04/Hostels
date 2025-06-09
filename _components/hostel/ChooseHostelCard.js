"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    IndianRupee,
    Building2,
    Users,
    Wifi,
    Bath,
    Calendar,
    Snowflake
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

    // Feature item component
    const FeatureItem = ({ icon, text }) => (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            {icon}
            <span className="text-sm font-medium text-gray-700">{text}</span>
        </div>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto p-4">
            {results.map((result) => (
                <div
                    key={result.room_id}
                    onClick={() => handleViewDetails(result.hostel_id)}
                    className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer bg-white flex flex-col"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.borderColor = '#A0AEC0';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.borderColor = '#E2E8F0';
                    }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                        <h3 className="text-lg font-bold mb-1">{result.hostels?.name || 'Hostel Name'}</h3>
                        <div className="flex items-center gap-1 text-xs text-blue-100">
                            <Building2 size={12} />
                            <span>{result.hostels?.branch?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Campus Branch'}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-grow">
                        {/* Room Details */}
                        <div className="mb-3">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">Room Details</h4>
                            <div className="space-y-2">
                                <FeatureItem
                                    icon={<Calendar size={14} className="text-gray-500" />}
                                    text={`Year: ${result.year_of_study?.replace('_', ' ') || 'All Years'}`}
                                />
                                <FeatureItem
                                    icon={<Users size={14} className="text-gray-500" />}
                                    text={`${result.occupancy_limit} Person Room`}
                                />
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">Amenities</h4>
                            <div className="space-y-2">
                                <FeatureItem
                                    icon={<Snowflake size={14} className="text-gray-500" />}
                                    text={result.ac_type === 'ac' ? 'Air Conditioned' : 'Non-AC Room'}
                                />
                                <FeatureItem
                                    icon={<Bath size={14} className="text-gray-500" />}
                                    text={result.washroom_type === 'attached' ? 'Attached Bathroom' : 'Common Bathroom'}
                                />
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="mt-auto p-3 bg-green-50 rounded-lg border border-green-100">
                            <span className="text-xs text-green-600 font-medium block mb-1">Annual Fee</span>
                            <div className="flex items-center gap-1">
                                <IndianRupee size={16} className="text-green-700" />
                                <span className="text-lg font-bold text-green-800">
                  {result.annual_fee?.toLocaleString() || 'N/A'}
                </span>
                            </div>
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-b-xl hover:bg-blue-700 transition-colors"
                    >
                        View Details
                    </button>

                    {/* Dev Info */}
                    {/*{process.env.NODE_ENV === 'development' && (*/}
                    {/*    <div className="text-xs text-gray-400 text-center pt-1 pb-2 border-t border-gray-100">*/}
                    {/*        Room ID: {result.room_id} | Hostel ID: {result.hostel_id}*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>
            ))}
        </div>
    );
}