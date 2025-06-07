"use client"

import React, { useState, useEffect, Suspense } from 'react';
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

// Create a separate component that uses useSearchParams
function HostelDetailsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const hostelId = searchParams.get('id');

    const [hostelData, setHostelData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch hostel details when component mounts or ID changes
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

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch hostel details');
                }

                if (data.success) {
                    setHostelData(data.hostel);
                } else {
                    throw new Error(data.message || 'Failed to load hostel data');
                }
            } catch (err) {
                console.error('Error fetching hostel details:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHostelDetails();
    }, [hostelId]);

    // Helper function to format branch names for display
    const formatBranchName = (branch) => {
        return branch?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown Branch';
    };

    // Helper function to format year of study
    const formatYearOfStudy = (year) => {
        return year?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'All Years';
    };

    // Loading state
    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <Loader2 size={48} style={{ color: '#2563eb', animation: 'spin 1s linear infinite' }} />
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Loading hostel details...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '1rem',
                padding: '2rem'
            }}>
                <XCircle size={64} style={{ color: '#dc2626' }} />
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
                        Oops! Something went wrong
                    </h1>
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{error}</p>
                    <button
                        onClick={() => router.back()}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            margin: '0 auto'
                        }}
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // No data state
    if (!hostelData) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <Building2 size={64} style={{ color: '#6b7280' }} />
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>No hostel data found</p>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem 1rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header with Back Button */}
                <div style={{ marginBottom: '2rem' }}>
                    <button
                        onClick={() => router.back()}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: 'white',
                            border: '1px solid #d1d5db',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '1.5rem'
                        }}
                    >
                        <ArrowLeft size={20} />
                        Back to Results
                    </button>

                    {/* Hostel Title Section */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <Building2 size={32} style={{ color: '#2563eb' }} />
                            <h1 style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#1f2937',
                                margin: 0
                            }}>
                                {hostelData.name}
                            </h1>
                        </div>

                        {/* Quick Info Badges */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.75rem',
                            marginBottom: '1.5rem'
                        }}>
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backgroundColor: '#eff6ff',
                                color: '#2563eb',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                            }}>
                                <MapPin size={16} />
                                {formatBranchName(hostelData.branch)}
                            </span>

                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backgroundColor: '#ecfdf5',
                                color: '#059669',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                            }}>
                                <GraduationCap size={16} />
                                {formatYearOfStudy(hostelData.year_of_study)}
                            </span>

                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backgroundColor: '#fef3c7',
                                color: '#d97706',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                            }}>
                                <User size={16} />
                                {hostelData.gender === 'male' ? 'Boys Hostel' : 'Girls Hostel'}
                            </span>
                        </div>

                        {/* Description */}
                        <p style={{
                            fontSize: '1.1rem',
                            lineHeight: '1.6',
                            color: '#4b5563',
                            margin: 0
                        }}>
                            {hostelData.description}
                        </p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    {/* Warden Information */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            marginBottom: '1rem',
                            color: '#1f2937',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <User size={20} />
                            Warden Information
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <User size={16} style={{ color: '#6b7280' }} />
                                <span style={{ fontWeight: '500', color: '#374151' }}>
                                    {hostelData.warden.name}
                                </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Phone size={16} style={{ color: '#6b7280' }} />
                                <a
                                    href={`tel:${hostelData.warden.contact}`}
                                    style={{ color: '#2563eb', textDecoration: 'none' }}
                                >
                                    {hostelData.warden.contact}
                                </a>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Mail size={16} style={{ color: '#6b7280' }} />
                                <a
                                    href={`mailto:${hostelData.warden.email}`}
                                    style={{ color: '#2563eb', textDecoration: 'none' }}
                                >
                                    {hostelData.warden.email}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Overview */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            marginBottom: '1rem',
                            color: '#1f2937',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <IndianRupee size={20} />
                            Pricing Overview
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#6b7280' }}>Price Range:</span>
                                <span style={{ fontWeight: '600', color: '#374151' }}>
                                    ₹{hostelData.room_summary.cheapest_option?.toLocaleString()} - ₹{hostelData.room_summary.most_expensive_option?.toLocaleString()}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#6b7280' }}>Mess Fees:</span>
                                <span style={{ fontWeight: '600', color: '#374151' }}>
                                    ₹{hostelData.pricing.mess_fees?.toLocaleString()}/year
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#6b7280' }}>Room Options:</span>
                                <span style={{ fontWeight: '600', color: '#374151' }}>
                                    {hostelData.room_summary.total_room_types} types available
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Available Rooms */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                    <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        marginBottom: '1.5rem',
                        color: '#1f2937'
                    }}>
                        Available Room Types
                    </h3>

                    {hostelData.available_rooms.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '1.5rem'
                        }}>
                            {hostelData.available_rooms.map((room) => (
                                <div
                                    key={room.id}
                                    style={{
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        padding: '1.5rem',
                                        backgroundColor: '#f9fafb'
                                    }}
                                >
                                    {/* Price Header */}
                                    <div style={{
                                        textAlign: 'center',
                                        marginBottom: '1rem',
                                        padding: '1rem',
                                        backgroundColor: '#ecfdf5',
                                        borderRadius: '6px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.25rem',
                                            marginBottom: '0.25rem'
                                        }}>
                                            <IndianRupee size={24} style={{ color: '#059669' }} />
                                            <span style={{
                                                fontSize: '1.75rem',
                                                fontWeight: 'bold',
                                                color: '#059669'
                                            }}>
                                                {room.annual_fee.toLocaleString()}
                                            </span>
                                        </div>
                                        <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                            per year (₹{room.monthly_fee.toLocaleString()}/month)
                                        </span>
                                    </div>

                                    {/* Room Features */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '0.75rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <UsersIcon size={16} style={{ color: '#6b7280' }} />
                                            <span style={{ fontSize: '0.9rem', color: '#374151' }}>
                                                {room.occupancy} Person
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {room.ac_type === 'ac' ? (
                                                <Snowflake size={16} style={{ color: '#2563eb' }} />
                                            ) : (
                                                <Sun size={16} style={{ color: '#f59e0b' }} />
                                            )}
                                            <span style={{ fontSize: '0.9rem', color: '#374151' }}>
                                                {room.ac_type === 'ac' ? 'AC' : 'Non AC'}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: '1 / -1' }}>
                                            <Home size={16} style={{ color: '#6b7280' }} />
                                            <span style={{ fontSize: '0.9rem', color: '#374151' }}>
                                                {room.washroom_type === 'attached' ? 'Private Bathroom' : 'Shared Bathroom'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem',
                            color: '#6b7280'
                        }}>
                            <Building2 size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
                            <p>No room information available</p>
                        </div>
                    )}
                </div>

                {/* Quick Features Overview */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    marginTop: '2rem'
                }}>
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        marginBottom: '1.5rem',
                        color: '#1f2937'
                    }}>
                        Hostel Features
                    </h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {hostelData.room_summary.has_ac ? (
                                <CheckCircle size={20} style={{ color: '#059669' }} />
                            ) : (
                                <XCircle size={20} style={{ color: '#dc2626' }} />
                            )}
                            <span style={{ color: '#374151' }}>AC Rooms Available</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {hostelData.room_summary.has_non_ac ? (
                                <CheckCircle size={20} style={{ color: '#059669' }} />
                            ) : (
                                <XCircle size={20} style={{ color: '#dc2626' }} />
                            )}
                            <span style={{ color: '#374151' }}>Non-AC Rooms Available</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <CheckCircle size={20} style={{ color: '#059669' }} />
                            <span style={{ color: '#374151' }}>
                                {hostelData.room_summary.occupancy_options.join(', ')} Person Sharing
                            </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <CheckCircle size={20} style={{ color: '#059669' }} />
                            <span style={{ color: '#374151' }}>Mess Facility</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Loading fallback component for Suspense
function LoadingFallback() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <Loader2 size={48} style={{ color: '#2563eb', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Loading page...</p>
        </div>
    );
}

// Main component that wraps the content with Suspense
export default function HostelDetailsPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <HostelDetailsContent />
        </Suspense>
    );
}