"use client";

import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { MapPin, Home, Users, Snowflake, Bath, Loader2, Navigation, X } from 'lucide-react';

// Constants
const MAP_CONTAINER_STYLE = {
    width: '100%',
    height: '400px',
};

const DEFAULT_CENTER = {
    lat: 12.823183,
    lng: 80.042759,
};

const MAP_OPTIONS = {
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    styles: [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "transit",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
        }
    ]
};

export default function Maps() {
    const [hostels, setHostels] = useState([]);
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [hoveredHostel, setHoveredHostel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Create pin symbols using MapPin from lucide-react
    const createPinSymbol = useCallback((color) => {
        if (!window.google || !window.google.maps) return null;

        return {
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 1,
            scale: 1.5,
            anchor: new window.google.maps.Point(12, 22),
        };
    }, []);

    // Memoized hostel icons
    const hostelIcons = useMemo(() => {
        if (!mapLoaded) return { female: null, male: null };

        return {
            female: createPinSymbol('#EC4899'), // Pink for female
            male: createPinSymbol('#3B82F6')    // Blue for male
        };
    }, [mapLoaded, createPinSymbol]);

    // Fetch hostel data
    const fetchHostels = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/map-data');

            if (!response.ok) {
                throw new Error('Failed to fetch hostel data');
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to load hostel data');
            }

            // Process hostels in parallel
            const processedHostels = await Promise.all(
                data.hostels.map(async (hostel) => {
                    try {
                        if (!window.google || !window.google.maps) {
                            throw new Error('Google Maps not loaded');
                        }

                        const geocoder = new window.google.maps.Geocoder();
                        const results = await new Promise((resolve) => {
                            geocoder.geocode({ address: hostel.plus_code }, (results, status) => {
                                if (status === 'OK' && results[0]) {
                                    resolve(results);
                                } else {
                                    console.error(`Geocoding failed for ${hostel.name}:`, status);
                                    resolve(null);
                                }
                            });
                        });

                        if (!results) return null;

                        return {
                            ...hostel,
                            coordinates: {
                                lat: results[0].geometry.location.lat(),
                                lng: results[0].geometry.location.lng()
                            }
                        };
                    } catch (err) {
                        console.error(`Error processing ${hostel.name}:`, err);
                        return null;
                    }
                })
            );

            setHostels(processedHostels.filter(Boolean));
        } catch (err) {
            console.error('Error fetching hostels:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load hostels when map is ready
    useEffect(() => {
        if (mapLoaded) {
            fetchHostels();
        }
    }, [mapLoaded, fetchHostels]);

    // Event handlers
    const handleMarkerClick = useCallback((hostel) => {
        setSelectedHostel(hostel);
        setHoveredHostel(null);
    }, []);

    const handleMarkerMouseOver = useCallback((hostel) => {
        if (!selectedHostel) {
            setHoveredHostel(hostel);
        }
    }, [selectedHostel]);

    const handleMarkerMouseOut = useCallback(() => {
        setHoveredHostel(null);
    }, []);

    const getNavigationUrl = useCallback((hostel) => {
        return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hostel.plus_code)}`;
    }, []);

    // Feature icons
    const featureIcons = {
        ac: <Snowflake size={16} className="text-indigo-600" />,
        nonAc: <Home size={16} className="text-gray-500" />,
        attached: <Bath size={16} className="text-teal-600" />,
        common: <Home size={16} className="text-gray-500" />,
        sharing: <Users size={16} className="text-indigo-600" />,
    };

    if (error) {
        return (
            <div className="m-6 rounded-2xl overflow-hidden shadow-lg h-60 flex items-center justify-center bg-red-50">
                <div className="text-center text-red-600">
                    <p className="text-lg font-semibold mb-2">Error Loading Map</p>
                    <p>{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            setLoading(true);
                            fetchHostels();
                        }}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="m-6 rounded-2xl overflow-hidden shadow-lg">
            <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                onLoad={() => setMapLoaded(true)}
                libraries={['places']}
                loadingElement={
                    <div className="flex items-center justify-center h-60 bg-gray-50">
                        <div className="text-center">
                            <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
                            <p className="text-gray-600">Loading Google Maps...</p>
                        </div>
                    </div>
                }
            >
                {mapLoaded && hostelIcons.female && hostelIcons.male && (
                    <GoogleMap
                        mapContainerClassName="w-full h-60"
                        mapContainerStyle={MAP_CONTAINER_STYLE}
                        center={DEFAULT_CENTER}
                        zoom={16}
                        options={MAP_OPTIONS}
                    >
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-2xl">
                                <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
                                    <Loader2 className="animate-spin h-5 w-5 mr-2 text-blue-500" />
                                    <p className="text-gray-700">Loading hostel locations...</p>
                                </div>
                            </div>
                        ) : (
                            hostels.map((hostel) => (
                                <Marker
                                    key={hostel.id}
                                    position={hostel.coordinates}
                                    icon={hostelIcons[hostel.gender === 'female' ? 'female' : 'male']}
                                    onClick={() => handleMarkerClick(hostel)}
                                    onMouseOver={() => handleMarkerMouseOver(hostel)}
                                    onMouseOut={handleMarkerMouseOut}
                                    title={`${hostel.name} - ${hostel.gender === 'female' ? 'Girls' : 'Boys'} Hostel`}
                                />
                            ))
                        )}

                        {/* Hover InfoWindow */}
                        {hoveredHostel && !selectedHostel && (
                            <InfoWindow
                                position={hoveredHostel.coordinates}
                                options={{
                                    pixelOffset: new window.google.maps.Size(0, -40)
                                }}
                            >
                                <div className="p-3 min-w-[200px] bg-white rounded-lg shadow-md">
                                    <h3 className="font-semibold text-gray-800 text-base mb-1">
                                        {hoveredHostel.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 flex items-center">
                                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                            hoveredHostel.gender === 'female' ? 'bg-pink-500' : 'bg-blue-500'
                                        }`}></span>
                                        {hoveredHostel.gender === 'female' ? 'Girls' : 'Boys'} Hostel
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Click for details</p>
                                </div>
                            </InfoWindow>
                        )}

                        {/* Click InfoWindow */}
                        {selectedHostel && (
                            <InfoWindow
                                position={selectedHostel.coordinates}
                                onCloseClick={() => setSelectedHostel(null)}
                            >
                                <div className="p-4 max-w-[300px] bg-white rounded-lg shadow-lg border border-gray-100">
                                    <h3 className="font-bold text-lg text-gray-900 mb-3">
                                        {selectedHostel.name}
                                    </h3>

                                    <div className="mb-4 space-y-2">
                                        <div className="flex items-center text-sm">
                                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                                selectedHostel.gender === 'female' ? 'bg-pink-500' : 'bg-blue-500'
                                            }`}></span>
                                            <span className="font-medium text-gray-700">
                                                {selectedHostel.gender === 'female' ? 'Girls' : 'Boys'} Hostel
                                            </span>
                                        </div>

                                        {selectedHostel.ac_type && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                {selectedHostel.ac_type === 'ac' ? featureIcons.ac : featureIcons.nonAc}
                                                <span className="ml-2">
                                                    {selectedHostel.ac_type === 'ac' ? 'AC Rooms' : 'Non-AC Rooms'}
                                                </span>
                                            </div>
                                        )}

                                        {selectedHostel.washroom_type && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                {selectedHostel.washroom_type === 'attached' ? featureIcons.attached : featureIcons.common}
                                                <span className="ml-2">
                                                    {selectedHostel.washroom_type === 'attached' ? 'Attached Bathroom' : 'Common Bathroom'}
                                                </span>
                                            </div>
                                        )}

                                        {selectedHostel.occupancy_limit && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                {featureIcons.sharing}
                                                <span className="ml-2">
                                                    {selectedHostel.occupancy_limit}-person rooms
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <a
                                            href={getNavigationUrl(selectedHostel)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm px-4 py-2 rounded-md hover:from-blue-600 hover:to-indigo-700 transition-colors font-medium"
                                        >
                                            <Navigation size={16} />
                                            Navigate
                                        </a>

                                        <button
                                            onClick={() => setSelectedHostel(null)}
                                            className="flex-1 flex items-center justify-center gap-1 bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
                                        >
                                            <X size={16} />
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                )}
            </LoadScript>
        </div>
    );
}