"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {Building2,ArrowLeft, Phone, Mail, User, Users as UsersIcon, Home, MapPin, GraduationCap, CheckCircle, XCircle, Loader2, ShoppingCart, ShieldCheck, WashingMachine, Info, IdCard} from 'lucide-react';


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

    const formatBranchName = (branch) =>
        branch?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown Branch';

    const formatYearOfStudy = (year) =>
        year?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'All Years';

    const calculateTotalPrice = () => {
        if (!selectedRoom) return 0;
        let total = selectedRoom.annual_fee + hostelData.pricing.mess_fees;
        if (includeLaundry) {
            total += hostelData.pricing.laundry_fees || 0;
        }
        return total;
    };


    function handleProceedToBooking() {
        router.push(`/ProceedToBooking`);
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
                <p className="mt-4 text-lg font-light text-gray-700">Loading hostel details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
                <XCircle className="text-red-500" size={64} />
                <h1 className="mt-4 text-xl font-light text-gray-900">Something went wrong</h1>
                <p className="mt-2 text-gray-600 font-light">{error}</p>
                <button
                    onClick={() => router.back()}
                    className="mt-6 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-300 font-medium"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!hostelData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
                <Building2 className="text-gray-400" size={64} />
                <p className="mt-4 text-gray-600 font-light">No hostel data found.</p>
            </div>
        );
    }


    return (
        <div>
            <div className="bg-white text-gray-900 min-h-screen transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-24 py-8">
                    {/*<button*/}
                    {/*    onClick={() => router.back()}*/}
                    {/*    className="mb-8 flex items-center gap-3 px-6 py-3 border border-indigo-500/30 text-indigo-500 rounded-lg hover:bg-indigo-500/5 transition-all duration-300 font-medium"*/}
                    {/*>*/}
                    {/*    <ArrowLeft size={20} /> Back to Results*/}
                    {/*</button>*/}
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-500/20 to-teal-500/20 flex items-center justify-center border border-indigo-500/30">
                                        <Building2 size={24} className="text-indigo-500"/>
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-wide">
                                        {hostelData.name}
                                    </h1>
                                </div>
                                <div className="flex flex-wrap gap-3">
                <span
                    className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-500 px-4 py-2 rounded-full text-sm font-medium border border-indigo-500/20">
                  <MapPin size={14}/> {formatBranchName(hostelData.branch)}
                </span>
                                    <span
                                        className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-500 px-4 py-2 rounded-full text-sm font-medium border border-teal-500/20">
                  <GraduationCap size={14}/> {formatYearOfStudy(hostelData.year_of_study)}
                </span>
                                    <span
                                        className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-500 px-4 py-2 rounded-full text-sm font-medium border border-indigo-500/20">
                  <User size={14}/> {hostelData.gender === 'male' ? 'Boys Hostel' : 'Girls Hostel'}
                </span>
                                </div>
                                <p className=" text-gray-600 leading-relaxed">
                                    {hostelData.description}
                                </p>
                                <div
                                    className="w-full h-px bg-gradient-to-r from-indigo-500/50 via-teal-500/50 to-transparent"></div>
                            </section>
                            <section className="space-y-6">
                                <h2 className="text-2xl font-light text-gray-900 flex items-center gap-3">
                                    <Home size={24} className="text-indigo-500"/>
                                    Available Room Types ({hostelData.room_summary.total_room_types})
                                </h2>
                                <div className="flex items-start gap-2 bg-gray-100  text-gray-500  text-sm px-2 py-2 ">
                                    <Info size={16} className="mt-0.5 text-amber-500"/>
                                    <p className="font-medium">
                                        Select a room below to see its pricing details in the pricing summary.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    {hostelData.available_rooms.length > 0 ? (
                                        hostelData.available_rooms.map((room) => (
                                            <div
                                                key={room.id}
                                                onClick={() => setSelectedRoom(room)}
                                                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                                                    selectedRoom?.id === room.id
                                                        ? 'border-indigo-500 bg-indigo-500/5'
                                                        : 'border-gray-300 hover:border-indigo-500/50'
                                                }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    {/* Left Section */}
                                                    <div className="flex flex-col">
                                                        <h3 className="font-medium text-gray-900">
                                                            {room.occupancy} Sharing {room.ac_type === 'ac' ? 'AC' : 'Non-AC'} {room.notes}
                                                        </h3>
                                                    </div>

                                                    {/* Right Section */}
                                                    <div className="text-right">
                                                        <p className="font-medium text-gray-600">
                                                            {room.washroom_type === 'attached' ? 'Attached Bathroom' : 'Common Bathroom'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-8 font-light">No room types currently
                                            available</p>
                                    )}
                                </div>
                                <div
                                    className="w-full h-px bg-gradient-to-r from-indigo-500/50 via-teal-500/50 to-transparent"></div>
                            </section>
                            <section className="space-y-6">
                                <h2 className="text-2xl font-light text-gray-900 flex items-center gap-3">
                                    <User size={24} className="text-indigo-500"/>
                                    Warden Contact
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <IdCard size={18} className="text-indigo-500"/>
                                        <p className="text-lg text-medium text-teal-500">{hostelData.warden.name}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Phone size={18} className="text-indigo-500"/>
                                        <a href={`tel:${hostelData.warden.contact}`}
                                           className="text-teal-500 hover:underline font-medium">
                                            {hostelData.warden.contact}
                                        </a>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Mail size={18} className="text-indigo-500 mt-0.5"/>
                                        <a href={`mailto:${hostelData.warden.email}`}
                                           className="text-teal-500 hover:underline font-medium  break-all sm:break-normal">
                                            {hostelData.warden.email}
                                        </a>
                                    </div>
                                </div>
                                <div
                                    className="w-full h-px bg-gradient-to-r from-indigo-500/50 via-teal-500/50 to-transparent"></div>
                            </section>
                            <section className="space-y-6">
                                <h2 className="text-2xl font-light text-gray-900 flex items-center gap-3">
                                    <Info size={24} className="text-indigo-500"/>
                                    Quick Facts
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-indigo-500/5 p-4 rounded-lg border border-indigo-500/20">
                                        <div className="text-xs text-indigo-500 font-medium">Options</div>
                                        <div className="font-medium text-gray-900">
                                            {hostelData.room_summary.has_ac && hostelData.room_summary.has_non_ac ? 'AC & Non-AC' :
                                                hostelData.room_summary.has_ac ? 'AC Only' : 'Non-AC Only'}
                                        </div>
                                    </div>
                                    <div className="bg-teal-500/5 p-4 rounded-lg border border-teal-500/20">
                                        <div className="text-xs text-teal-500 font-medium">Room Types</div>
                                        <div
                                            className="font-medium text-gray-900">{hostelData.room_summary.total_room_types}</div>
                                    </div>
                                    <div className="bg-indigo-500/5 p-4 rounded-lg border border-indigo-500/20">
                                        <div className="text-xs text-indigo-500 font-medium">Washroom</div>
                                        <div className="font-medium text-gray-900">
                                            {hostelData.room_summary.has_attached && hostelData.room_summary.has_common ? 'Attached & Common' :
                                                hostelData.room_summary.has_attached ? 'Attached Only' : 'Common Only'}
                                        </div>
                                    </div>
                                    <div className="bg-teal-500/5 p-4 rounded-lg border border-teal-500/20">
                                        <div className="text-xs text-teal-500 font-medium">Sharing</div>
                                        <div
                                            className="font-medium text-gray-900">{hostelData.room_summary.occupancy_options.join(', ')}</div>
                                    </div>

                                </div>
                            </section>
                        </div>
                        <div className="space-y-8">
                            <section className="sticky top-100 space-y-8">
                                <div className="border border-gray-300 rounded-xl p-6">
                                    <h2 className="text-2xl text-gray-900 flex items-center gap-3 mb-6">
                                        <ShoppingCart size={24} className="text-purple-500  "/>
                                        Pricing Summary
                                    </h2>
                                    <div
                                        className="my-2 flex items-start gap-2 bg-gray-100  text-gray-500  text-sm px-2 py-2 ">
                                        <Info size={16} className="mt-0.5 text-amber-500"/>
                                        <p className="font-medium">
                                            Selected room : <span
                                            className={`animate-pulse font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500`}>{selectedRoom?.occupancy} Sharing | {selectedRoom?.ac_type === 'ac' ? 'AC' : 'Non-AC'} | {selectedRoom?.washroom_type === 'attached' ? 'Attached Bathroom' : 'Common Bathroom'} {selectedRoom?.notes}</span>
                                        </p>
                                    </div>
                                    {selectedRoom ? (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <div
                                                    className="flex justify-between items-center py-3 border-b border-gray-200">
                                                    <div className="flex items-center gap-3">
                                                        <Home size={16} className="text-indigo-500"/>
                                                        <span className="text-gray-700 font-light">Room Fee</span>
                                                    </div>
                                                    <span
                                                        className="font-medium text-gray-900">₹{selectedRoom.annual_fee.toLocaleString()}</span>
                                                </div>
                                                <div
                                                    className="flex justify-between items-center py-3 border-b border-gray-200">
                                                    <div className="flex items-center gap-3">
                                                        <UsersIcon size={16} className="text-indigo-500"/>
                                                        <span className="text-gray-700 font-light">Mess Fee</span>
                                                    </div>
                                                    <span
                                                        className="font-medium text-gray-900">₹{hostelData.pricing.mess_fees.toLocaleString()}</span>
                                                </div>
                                                <div
                                                    className="flex justify-between items-center py-3 border-b border-gray-200">
                                                    <div className="flex items-center gap-3">
                                                        <WashingMachine size={16} className="text-indigo-500"/>
                                                        <span className="text-gray-700 font-light">Laundry Fee <br/>(Optional)</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <label
                                                            className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only peer"
                                                                checked={includeLaundry}
                                                                onChange={() => setIncludeLaundry(!includeLaundry)}
                                                            />
                                                            <div
                                                                className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                                        </label>
                                                        <span
                                                            className="font-medium text-gray-900">₹{hostelData.pricing.laundry_fees.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pt-4 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span
                                                        className="text-xl font-light text-gray-900">Total Annual Cost</span>
                                                    <span
                                                        className="text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">
                          ₹{calculateTotalPrice().toLocaleString()}
                        </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleProceedToBooking}
                                                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
                                            >
                                                Proceed to Booking
                                            </button>

                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8 font-light">Select a room type to
                                            see pricing</p>
                                    )}
                                </div>
                                <div className="border border-indigo-500/20 bg-indigo-500/5 rounded-xl p-6">
                                    <h3 className="font-medium text-indigo-500 mb-4 flex items-center gap-3">
                                        <Info size={18}/>
                                        Important Notes
                                    </h3>
                                    <ul className="space-y-3  text-gray-700">
                                        <li className="flex items-start gap-3 font-light">
                                            <span className="text-indigo-500 mt-1">•</span>
                                            <span>Prices are for one entire academic year</span>
                                        </li>
                                        <li className="flex items-start gap-3 font-light">
                                            <span className="text-indigo-500 mt-1">•</span>
                                            <span>Mess fees are mandatory for all residents</span>
                                        </li>
                                        <li className="flex items-start gap-3 font-light">
                                            <span className="text-indigo-500 mt-1">•</span>
                                            <span>Laundry service can also be availed later by contacting warden.</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="border border-indigo-500/20 bg-indigo-500/5 rounded-xl p-6">
                                    <h3 className="font-medium text-indigo-500 mb-4 flex items-center gap-3">
                                        <ShieldCheck size={24} className="text-indigo-500"/>
                                        Hostel Features
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="font-medium text-indigo-500">Room Features</h3>
                                            <ul className="space-y-3">
                                                <li className="flex items-center gap-3">
                                                    {hostelData.room_summary.has_ac ? (
                                                        <CheckCircle className="text-teal-500" size={18}/>
                                                    ) : (
                                                        <XCircle className="text-red-500" size={18}/>
                                                    )}
                                                    <span className="text-gray-700 font-light">AC Rooms</span>
                                                </li>
                                                <li className="flex items-center gap-3">
                                                    {hostelData.room_summary.has_non_ac ? (
                                                        <CheckCircle className="text-teal-500" size={18}/>
                                                    ) : (
                                                        <XCircle className="text-red-500" size={18}/>
                                                    )}
                                                    <span className="text-gray-700 font-light">Non-AC Rooms</span>
                                                </li>
                                                <li className="flex items-center gap-3">
                                                    <CheckCircle className="text-teal-500" size={18}/>
                                                    <span className="text-gray-700 font-light">
                          {hostelData.room_summary.occupancy_options.join(', ')} Sharing
                        </span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="font-medium text-indigo-500">Amenities</h3>
                                            <ul className="space-y-3">
                                                <li className="flex items-center gap-3">
                                                    <CheckCircle className="text-teal-500" size={18}/>
                                                    <span className="text-gray-700 font-light">Mess Facility</span>
                                                </li>
                                                <li className="flex items-center gap-3">
                                                    <CheckCircle className="text-teal-500" size={18}/>
                                                    <span className="text-gray-700 font-light">24/7 Security</span>
                                                </li>
                                                <li className="flex items-center gap-3">
                                                    <CheckCircle className="text-teal-500" size={18}/>
                                                    <span className="text-gray-700 font-light">Laundry Service</span>
                                                </li>
                                                <li className="flex items-center gap-3">
                                                    <CheckCircle className="text-teal-500" size={18}/>
                                                    <span className="text-gray-700 font-light">24/7 Wifi</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}