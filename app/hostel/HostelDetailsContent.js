"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Building2,
    IndianRupee,
    Phone,
    Mail,
    User,
    Users as UsersIcon,
    Home,
    Snowflake,
    Sun,
    MapPin,
    GraduationCap,
    CheckCircle,
    XCircle,
    Loader2
} from 'lucide-react';

export default function HostelDetailsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const hostelId = searchParams.get('id');
    const [hostelData, setHostelData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHostelDetails = async () => {
            if (!hostelId) {
                setError('No hostel ID provided');
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch(`/api/hostel?id=${hostelId}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Failed to fetch details');
                setHostelData(data.hostel);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHostelDetails();
    }, [hostelId]);

    // Format helper functions
    const formatBranchName = (branch) =>
        branch?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown Branch';

    const formatYearOfStudy = (year) =>
        year?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'All Years';

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={48} />
                <p className="mt-4 text-lg text-gray-600">Loading hostel details...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
                <XCircle className="text-red-500" size={64} />
                <h1 className="mt-4 text-xl font-bold text-gray-800">Oops! Something went wrong</h1>
                <p className="mt-2 text-gray-600">{error}</p>
                <button
                    onClick={() => router.back()}
                    className="mt-4 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // No data found
    if (!hostelData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
                <Building2 className="text-gray-400" size={64} />
                <p className="mt-4 text-gray-600">No hostel data found.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen pb-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-all text-gray-700 text-base font-medium"
                >
                    <ArrowLeft size={20}/> Back to Results
                </button>

                {/* Hostel Header */}
                <section className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Building2 size={32} className="text-blue-600"/>
                        <h1 className="text-3xl font-bold text-gray-900">{hostelData.name}</h1>
                    </div>
                    <div className="flex flex-wrap gap-3 mb-4">
       <span
           className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
         <MapPin size={14}/> {formatBranchName(hostelData.branch)}
       </span>
                        <span
                            className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
         <GraduationCap size={14}/> {formatYearOfStudy(hostelData.year_of_study)}
       </span>
                        <span
                            className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
         <User size={14}/> {hostelData.gender === 'male' ? 'Boys Hostel' : 'Girls Hostel'}
       </span>
                    </div>
                    <p className="text-lg text-gray-700">{hostelData.description}</p>
                </section>

                {/* Warden & Pricing Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Warden Info */}
                    <section className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
                            <User size={20}/> Warden Information
                        </h2>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <User size={16} className="text-gray-500"/>
                                <span className="text-gray-700">{hostelData.warden.name}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={16} className="text-gray-500"/>
                                <a href={`tel:${hostelData.warden.contact}`}
                                   className="text-blue-600 hover:underline">
                                    {hostelData.warden.contact}
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={16} className="text-gray-500"/>
                                <a href={`mailto:${hostelData.warden.email}`}
                                   className="text-blue-600 hover:underline">
                                    {hostelData.warden.email}
                                </a>
                            </li>
                        </ul>
                    </section>

                    {/* Pricing Info */}
                    <section className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
                            <IndianRupee size={20}/> Pricing Overview
                        </h2>
                        <ul className="space-y-3">
                            <li className="flex justify-between">
                                <span className="text-gray-600">Price Range:</span>
                                <span className="font-medium text-gray-800">
             ₹{hostelData.room_summary.cheapest_option?.toLocaleString()} - ₹{hostelData.room_summary.most_expensive_option?.toLocaleString()}
           </span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Mess Fees:</span>
                                <span className="font-medium text-gray-800">
             ₹{hostelData.pricing.mess_fees?.toLocaleString()}/year
           </span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Room Types Available:</span>
                                <span className="font-medium text-gray-800">
             {hostelData.room_summary.total_room_types}
           </span>
                            </li>
                        </ul>
                    </section>
                </div>

                {/* Rooms Section */}
                <section className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Available Room Types</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hostelData.available_rooms.length > 0 ? (
                            hostelData.available_rooms.map((room) => (
                                <div key={room.id}
                                     className="border border-gray-200 rounded-lg p-5 bg-gray-50 hover:shadow-md transition-shadow">
                                    <div className="text-center mb-4">
                                        <div className="flex items-center justify-center gap-1 mb-2">
                                            <IndianRupee className="text-green-600" size={24}/>
                                            <span
                                                className="text-2xl font-bold text-green-700">{room.annual_fee.toLocaleString()}</span>
                                        </div>
                                        <small className="text-gray-500">per year
                                            (₹{room.monthly_fee.toLocaleString()}/month)</small>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <UsersIcon size={16} className="text-gray-500"/>
                                            <span className="text-gray-700">{room.occupancy} Person</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {room.ac_type === 'ac' ? (
                                                <Snowflake size={16} className="text-blue-500"/>
                                            ) : (
                                                <Sun size={16} className="text-yellow-500"/>
                                            )}
                                            <span
                                                className="text-gray-700">{room.ac_type === 'ac' ? 'AC' : 'Non AC'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Home size={16} className="text-gray-500"/>
                                            <span className="text-gray-700">
                   {room.washroom_type === 'attached' ? 'Private Bathroom' : 'Shared Bathroom'}
                 </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500">No room types available</p>
                        )}
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Hostel Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            {hostelData.room_summary.has_ac ? (
                                <CheckCircle className="text-green-600" size={20}/>
                            ) : (
                                <XCircle className="text-red-500" size={20}/>
                            )}
                            <span className="text-gray-700">AC Rooms Available</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {hostelData.room_summary.has_non_ac ? (
                                <CheckCircle className="text-green-600" size={20}/>
                            ) : (
                                <XCircle className="text-red-500" size={20}/>
                            )}
                            <span className="text-gray-700">Non-AC Rooms Available</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-green-600" size={20}/>
                            <span className="text-gray-700">
           {hostelData.room_summary.occupancy_options.join(', ')} Person Sharing
         </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-green-600" size={20}/>
                            <span className="text-gray-700">Mess Facility</span>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}