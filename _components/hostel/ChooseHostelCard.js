"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { IndianRupee, Building2 } from 'lucide-react';

// This component handles displaying hostel results in a clean card format
// It receives the results as props and manages navigation to individual hostel pages
export default function ChooseHostelCard({ results }) {
    const router = useRouter();

    // Handle navigation to individual hostel details page
    // Uses the hostel_id from Supabase to create a unique URL
    const handleViewDetails = (hostelId) => {
        if (hostelId) {
            router.push(`/hostel?id=${hostelId}`);
        } else {
            console.error('No hostel ID provided for navigation');
        }
    };

    // If no results are provided, don't render anything
    if (!results || results.length === 0) {
        return null;
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1rem'
        }}>
            {results.map((result) => (
                <div
                    key={result.room_id}
                    style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    }}
                >
                    {/* Hostel Name */}
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        color: '#1f2937',
                        lineHeight: '1.4'
                    }}>
                        {result.hostels?.name || 'Hostel Name'}
                    </h3>

                    {/* Price Display */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#ecfdf5',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem'
                    }}>
                        <IndianRupee size={24} style={{ color: '#059669', marginRight: '0.25rem' }} />
                        <span style={{
                            fontSize: '1.75rem',
                            fontWeight: 'bold',
                            color: '#059669'
                        }}>
                            {result.annual_fee?.toLocaleString() || 'Contact for Price'}
                        </span>
                        <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>/year</span>
                    </div>

                    {/* Branch Information */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#eff6ff',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        marginBottom: '1.5rem'
                    }}>
                        <Building2 size={16} style={{ color: '#2563eb', marginRight: '0.5rem' }} />
                        <span style={{
                            color: '#2563eb',
                            fontWeight: '500',
                            fontSize: '0.9rem'
                        }}>
                            {result.hostels?.branch?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Campus Branch'}
                        </span>
                    </div>

                    {/* Room Details */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '0.75rem',
                            fontSize: '0.9rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#6b7280' }}>Year:</span>
                                <span style={{
                                    backgroundColor: '#dcfce7',
                                    color: '#166534',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: '500'
                                }}>
                                    {result.year_of_study?.replace('_', ' ') || 'All Years'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#6b7280' }}>AC:</span>
                                <span style={{
                                    backgroundColor: '#dbeafe',
                                    color: '#1e40af',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: '500'
                                }}>
                                    {result.ac_type === 'ac' ? 'AC' : 'Non AC'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#6b7280' }}>Bathroom:</span>
                                <span style={{
                                    backgroundColor: '#f3e8ff',
                                    color: '#7c3aed',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: '500'
                                }}>
                                    {result.washroom_type === 'attached' ? 'Private' : 'Shared'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#6b7280' }}>Sharing:</span>
                                <span style={{
                                    backgroundColor: '#fed7aa',
                                    color: '#c2410c',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: '500'
                                }}>
                                    {result.occupancy_limit} Person
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* View Details Button */}
                    <button
                        onClick={() => handleViewDetails(result.hostel_id)}
                        style={{
                            width: '100%',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#1d4ed8';
                            e.target.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#2563eb';
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        View Details
                    </button>

                    {/* Development Mode Debug Info */}
                    {process.env.NODE_ENV === 'development' && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '0.5rem',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            color: '#6b7280'
                        }}>
                            <div>Room ID: {result.room_id}</div>
                            <div>Hostel ID: {result.hostel_id}</div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}