"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowRight,
    Check,
    Snowflake,
    Bath,
    Users,
    Home,
    Building
} from 'lucide-react';

export default function ChooseHostelCard({ results, isPartialMatch, userSelections }) {
    const router = useRouter();

    const handleViewDetails = (result) => {
        if (result.hostel_id) {
            router.push(`/hostel?id=${result.hostel_id}`);
        } else {
            console.error('No hostel ID found in result:', result);
        }
    };

    if (!results || results.length === 0) return null;

    // Simple tooltip component
    const Tooltip = ({ children, text }) => {
        const [show, setShow] = useState(false);

        return (
            <div
                className="relative inline-block"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                {children}
                {show && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-20">
                        {text}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                )}
            </div>
        );
    };

    // Get icon for feature
    const getFeatureIcon = (feature, value) => {
        switch (feature) {
            case 'acType':
                return value === 'ac' ? (
                    <Tooltip text="Air Conditioned">
                        <Snowflake size={16} className="text-indigo-600" />
                    </Tooltip>
                ) : (
                    <Tooltip text="Non-AC">
                        <Home size={16} className="text-gray-500" />
                    </Tooltip>
                );
            case 'washroomType':
                return value === 'attached' ? (
                    <Tooltip text="Attached Washroom">
                        <Bath size={16} className="text-teal-600" />
                    </Tooltip>
                ) : (
                    <Tooltip text="Common Washroom">
                        <Building size={16} className="text-gray-500" />
                    </Tooltip>
                );
            case 'sharing':
                return (
                    <Tooltip text={`${value} Person Room`}>
                        <Users size={16} className="text-indigo-600" />
                    </Tooltip>
                );
            default:
                return null;
        }
    };

    // Format display value
    const formatValue = (feature, value) => {
        switch (feature) {
            case 'acType':
                return value === 'ac' ? 'AC' : 'Non-AC';
            case 'washroomType':
                return value === 'attached' ? 'Attached' : 'Common';
            case 'sharing':
                return value; // Just return the number
            default:
                return value;
        }
    };

    // Mobile-optimized comparison component
    const ComparisonTable = ({ result, userSelections }) => {
        const comparisons = [
            {
                feature: 'acType',
                icon: getFeatureIcon('acType', result.ac_type),
                userChoice: formatValue('acType', userSelections?.acType),
                alternative: formatValue('acType', result.ac_type),
                isMatch: userSelections?.acType === result.ac_type,
            },
            {
                feature: 'washroomType',
                icon: getFeatureIcon('washroomType', result.washroom_type),
                userChoice: formatValue('washroomType', userSelections?.washroomType),
                alternative: formatValue('washroomType', result.washroom_type),
                isMatch: userSelections?.washroomType === result.washroom_type,
            },
            {
                feature: 'sharing',
                icon: getFeatureIcon('sharing', result.occupancy_limit),
                userChoice: formatValue('sharing', userSelections?.sharing),
                alternative: formatValue('sharing', result.occupancy_limit),
                isMatch: userSelections?.sharing === String(result.occupancy_limit),
            }
        ];

        return (
            <div className="mb-6">
                <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                    {/* Mobile-optimized header */}
                    <div className="bg-gray-100 px-3 sm:px-4 py-2 border-b border-gray-300">
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs font-medium text-gray-600">
                            <div className="text-center"></div>
                            <div className="text-center">You</div>
                            <div className="text-center">Alternative</div>
                        </div>
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-gray-200">
                        {comparisons.map(({ feature, icon, userChoice, alternative, isMatch }) => (
                            <div
                                key={feature}
                                className={`px-3 sm:px-4 py-3 ${
                                    isMatch
                                        ? 'border-l-4 border-l-green-500 bg-green-50'
                                        : 'border-l-4 border-l-yellow-500 bg-yellow-50'
                                }`}
                            >
                                <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center">
                                    {/* Icon */}
                                    <div className="flex justify-center items-center">
                                        {icon}
                                    </div>

                                    {/* Your Choice & Alternative - with colored background for matches */}
                                    <div className={`text-xs sm:text-sm font-medium text-center px-2 py-1 rounded ${
                                        isMatch
                                            ? 'text-green-800 bg-green-100 border border-green-300'
                                            : 'text-gray-900'
                                    }`}>
                                        {userChoice}
                                    </div>

                                    <div className={`text-xs sm:text-sm text-center px-2 py-1 rounded ${
                                        isMatch
                                            ? 'text-green-800 bg-green-100 border border-green-300'
                                            : 'text-gray-700'
                                    }`}>
                                        {alternative}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // For exact matches - show selected features
    if (!isPartialMatch) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto p-4">
                {results.map((result) => (
                    <div key={result.room_id} className="bg-white rounded-xl shadow-lg border-2 border-teal-500 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="p-4 sm:p-6 text-center">
                            {/* Perfect Match Badge - smaller */}
                            <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-teal-600/50 bg-gradient-to-r from-teal-600/10 to-indigo-600/10">
                                <Check size={14} className="text-teal-600" />
                                <span className="text-xs font-medium text-teal-600">Perfect Match</span>
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-light text-gray-900 mb-6 tracking-wide">
                                {result.hostels?.name || 'Hostel'}
                            </h3>

                            <div className="mb-6">
                                <p className="text-sm text-gray-600 mb-4 font-medium">Your Selected Features:</p>
                                <div className="flex justify-center gap-4 sm:gap-6">
                                    {userSelections?.acType && (
                                        <div className="flex flex-col items-center gap-2">
                                            {getFeatureIcon('acType', userSelections.acType)}
                                            <span className="text-xs text-gray-600 font-medium">
                                                {formatValue('acType', userSelections.acType)}
                                            </span>
                                        </div>
                                    )}
                                    {userSelections?.washroomType && (
                                        <div className="flex flex-col items-center gap-2">
                                            {getFeatureIcon('washroomType', userSelections.washroomType)}
                                            <span className="text-xs text-gray-600 font-medium">
                                                {formatValue('washroomType', userSelections.washroomType)}
                                            </span>
                                        </div>
                                    )}
                                    {userSelections?.sharing && (
                                        <div className="flex flex-col items-center gap-2">
                                            {getFeatureIcon('sharing', userSelections.sharing)}
                                            <span className="text-xs text-gray-600 font-medium">
                                                {formatValue('sharing', userSelections.sharing)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => handleViewDetails(result)}
                                className="w-full bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105"
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

    // For partial matches - clean comparison table with amber styling
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto p-4">
            {results.map((result) => (
                <div key={result.room_id} className="bg-white rounded-xl shadow-lg border-2 border-amber-400 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="p-4 sm:p-6">
                        {/* Alternative Option Badge - smaller */}
                        <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                            <span className="text-xs font-medium">Alternative Option</span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-light text-gray-900 mb-6 tracking-wide">
                            {result.hostels?.name || 'Hostel'}
                        </h3>

                        {/* Mobile-optimized Comparison Table */}
                        <ComparisonTable result={result} userSelections={userSelections} />

                        <button
                            onClick={() => handleViewDetails(result)}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105"
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