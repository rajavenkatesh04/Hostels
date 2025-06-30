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
    Loader2,
    ClipboardList,
    ShoppingCart,
    ShieldCheck,
    WashingMachine
} from 'lucide-react';

export default function HostelDetailsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const hostelId = searchParams.get('id');
    const [hostelData, setHostelData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [includeLaundry, setIncludeLaundry] = useState(false);

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
                // Select the first room by default if available
                if (data.hostel?.available_rooms?.length > 0) {
                    setSelectedRoom(data.hostel.available_rooms[0]);
                }
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

    // Calculate total price
    const calculateTotalPrice = () => {
        if (!selectedRoom) return 0;
        let total = selectedRoom.annual_fee + hostelData.pricing.mess_fees;
        if (includeLaundry) {
            total += hostelData.laundry_fees || 7500;
        }
        return total;
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={48} />
                <p className="mt-4 text-lg text-gray-600">Loading hostel details...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-gray-50">
                <XCircle className="text-red-500" size={64} />
                <h1 className="mt-4 text-xl font-bold text-gray-800">Oops! Something went wrong</h1>
                <p className="mt-2 text-gray-600">{error}</p>
                <button
                    onClick={() => router.back()}
                    className="mt-4 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // No data found
    if (!hostelData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-gray-50">
                <Building2 className="text-gray-400" size={64} />
                <p className="mt-4 text-gray-600">No hostel data found.</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all text-gray-700 font-medium hover:shadow-md"
                >
                    <ArrowLeft size={20}/> Back to Results
                </button>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* LEFT COLUMN - Hostel Information */}
                    <div className="space-y-6">
                        {/* Hostel Header */}
                        <section className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <Building2 size={28} className="text-blue-600"/>
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{hostelData.name}</h1>
                            </div>

                            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
                                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                    <MapPin size={14}/> {formatBranchName(hostelData.branch)}
                                </span>
                                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                    <GraduationCap size={14}/> {formatYearOfStudy(hostelData.year_of_study)}
                                </span>
                                <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                    <User size={14}/> {hostelData.gender === 'male' ? 'Boys Hostel' : 'Girls Hostel'}
                                </span>
                            </div>

                            <p className="text-base text-gray-700 mb-4">{hostelData.description}</p>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="text-center">
                                    <div className="text-blue-600 font-bold text-lg">
                                        ₹{hostelData.room_summary.cheapest_option?.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-600">Starting Price</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-blue-600 font-bold text-lg">
                                        {hostelData.room_summary.total_room_types}
                                    </div>
                                    <div className="text-xs text-gray-600">Room Types</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-blue-600 font-bold text-sm lg:text-lg">
                                        {hostelData.room_summary.has_ac && hostelData.room_summary.has_non_ac ? 'AC/Non-AC' :
                                            hostelData.room_summary.has_ac ? 'AC Only' : 'Non-AC Only'}
                                    </div>
                                    <div className="text-xs text-gray-600">Options</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-blue-600 font-bold text-lg">
                                        {hostelData.room_summary.occupancy_options.join('/')}
                                    </div>
                                    <div className="text-xs text-gray-600">Sharing</div>
                                </div>
                            </div>
                        </section>

                        {/* Divider */}
                        <hr className="border-gray-200" />

                        {/* Hostel Features */}
                        <section className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                <ShieldCheck size={20} className="text-blue-500"/> Hostel Features
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <h3 className="font-medium text-gray-700 text-sm">Room Features</h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2 text-sm">
                                            {hostelData.room_summary.has_ac ? (
                                                <CheckCircle className="text-green-600 flex-shrink-0" size={16}/>
                                            ) : (
                                                <XCircle className="text-red-500 flex-shrink-0" size={16}/>
                                            )}
                                            <span className="text-gray-700">AC Rooms Available</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-sm">
                                            {hostelData.room_summary.has_non_ac ? (
                                                <CheckCircle className="text-green-600 flex-shrink-0" size={16}/>
                                            ) : (
                                                <XCircle className="text-red-500 flex-shrink-0" size={16}/>
                                            )}
                                            <span className="text-gray-700">Non-AC Rooms Available</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="text-green-600 flex-shrink-0" size={16}/>
                                            <span className="text-gray-700">
                                                {hostelData.room_summary.occupancy_options.join(', ')} Sharing Options
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="font-medium text-gray-700 text-sm">Amenities</h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="text-green-600 flex-shrink-0" size={16}/>
                                            <span className="text-gray-700">Mess Facility</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="text-green-600 flex-shrink-0" size={16}/>
                                            <span className="text-gray-700">24/7 Security</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="text-green-600 flex-shrink-0" size={16}/>
                                            <span className="text-gray-700">Wi-Fi Connectivity</span>
                                        </li>
                                        <li className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="text-green-600 flex-shrink-0" size={16}/>
                                            <span className="text-gray-700">Laundry Service</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Warden Contact Details */}
                        <section className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                <User size={20} className="text-blue-500"/> Warden Contact
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-700 mb-3 text-sm">Contact Details</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-2">
                                            <User size={16} className="text-gray-500 flex-shrink-0"/>
                                            <span className="text-gray-700 text-sm">{hostelData.warden.name}</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Phone size={16} className="text-gray-500 flex-shrink-0"/>
                                            <a href={`tel:${hostelData.warden.contact}`}
                                               className="text-blue-600 hover:underline text-sm">
                                                {hostelData.warden.contact}
                                            </a>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Mail size={16} className="text-gray-500 flex-shrink-0 mt-0.5"/>
                                            <a href={`mailto:${hostelData.warden.email}`}
                                               className="text-blue-600 hover:underline text-sm break-all">
                                                {hostelData.warden.email}
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-700 mb-3 text-sm">Details</h3>
                                    <ul className="space-y-2">
                                        <li className="flex justify-between text-sm">
                                            <span className="text-gray-600">Year:</span>
                                            <span className="font-medium text-gray-800">
                                                {formatYearOfStudy(hostelData.year_of_study)}
                                            </span>
                                        </li>
                                        <li className="flex justify-between text-sm">
                                            <span className="text-gray-600">Branch:</span>
                                            <span className="font-medium text-gray-800">
                                                {formatBranchName(hostelData.branch)}
                                            </span>
                                        </li>
                                        <li className="flex justify-between text-sm">
                                            <span className="text-gray-600">Gender:</span>
                                            <span className="font-medium text-gray-800">
                                                {hostelData.gender === 'male' ? 'Male' : 'Female'}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Available Room Types */}
                        <section className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                <ClipboardList size={20} className="text-blue-500"/> Available Room Types
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {hostelData.available_rooms.length > 0 ? (
                                    hostelData.available_rooms.map((room) => (
                                        <div
                                            key={room.id}
                                            onClick={() => setSelectedRoom(room)}
                                            className={`border rounded-lg p-4 transition-all cursor-pointer ${
                                                selectedRoom?.id === room.id
                                                    ? 'border-blue-500 bg-blue-50 shadow-md'
                                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-base text-gray-800">
                                                        {room.occupancy} Sharing {room.ac_type === 'ac' ? 'AC' : 'Non-AC'}
                                                    </h3>
                                                    <p className="text-xs text-gray-600">
                                                        {room.washroom_type === 'attached' ? 'Private Bathroom' : 'Shared Bathroom'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <IndianRupee className="text-green-600" size={16}/>
                                                        <span className="text-lg font-bold text-green-700">
                                                            {room.annual_fee.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <small className="text-gray-500 text-xs">
                                                        ₹{room.monthly_fee.toLocaleString()}/month
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="col-span-full text-center text-gray-500 py-6 text-sm">
                                        No room types currently available
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN - Pricing & Important Notes */}
                    <div className="space-y-6">
                        {/* Pricing Summary */}
                        <section className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-6">
                            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                                <ShoppingCart size={20} className="text-blue-500"/> Pricing Summary
                            </h2>

                            {selectedRoom ? (
                                <div className="space-y-4">
                                    {/* Selected Room Info */}
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <h3 className="font-semibold text-gray-800 mb-2">Selected Room</h3>
                                        <p className="text-sm text-gray-700">
                                            {selectedRoom.occupancy} Sharing {selectedRoom.ac_type === 'ac' ? 'AC' : 'Non-AC'} Room
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {selectedRoom.washroom_type === 'attached' ? 'Private Bathroom' : 'Shared Bathroom'}
                                        </p>
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Room Fee (Annual):</span>
                                            <span className="font-semibold text-gray-800">
                                                ₹{selectedRoom.annual_fee.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Mess Fee (Annual):</span>
                                            <span className="font-semibold text-gray-800">
                                                ₹{hostelData.pricing.mess_fees.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <WashingMachine size={16} className="text-gray-500"/>
                                                <span className="text-gray-600">Laundry Service:</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={includeLaundry}
                                                        onChange={() => setIncludeLaundry(!includeLaundry)}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                                <span className="font-semibold text-gray-800 min-w-0">
                                                    ₹{(hostelData.laundry_fees || 7500).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-lg font-semibold text-gray-700">Total Annual Cost:</span>
                                            <span className="text-2xl font-bold text-green-600">
                                                ₹{calculateTotalPrice().toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 text-right">
                                            (~₹{Math.round(calculateTotalPrice() / 12).toLocaleString()}/month)
                                        </div>
                                    </div>

                                    {/* Booking Button */}
                                    <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all hover:from-blue-700 hover:to-blue-800">
                                        Proceed to Booking
                                    </button>

                                    <div className="text-xs text-gray-500 mt-2 text-center">
                                        Prices include all applicable taxes. No hidden charges.
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <ClipboardList className="mx-auto text-gray-400 mb-3" size={48}/>
                                    <p className="text-gray-500">Please select a room type to see pricing details</p>
                                </div>
                            )}
                        </section>

                        {/* Important Notes */}
                        <section className="bg-yellow-50 rounded-xl shadow-lg p-6 border border-yellow-100">
                            <h3 className="font-semibold text-yellow-800 mb-4 text-lg">Important Notes</h3>
                            <ul className="space-y-3 text-sm text-yellow-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-600 font-bold mt-0.5">•</span>
                                    <span>Prices are for the entire academic year (10 months)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-600 font-bold mt-0.5">•</span>
                                    <span>Mess fees are mandatory for all residents</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-600 font-bold mt-0.5">•</span>
                                    <span>Security deposit of ₹5,000 (refundable) required at booking</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-600 font-bold mt-0.5">•</span>
                                    <span>Laundry service is optional and can be added anytime</span>
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}