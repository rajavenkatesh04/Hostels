"use client";

import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { MapPin, Home, Users, ArrowRight, Navigation, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- Caching Solution ---
let hostelCache = null;
let dataFetchPromise = null;
let mapInstance = null;


const MAP_CONTAINER_STYLE = {
    width: '100%',
    height: '100%',
};

const DEFAULT_CENTER = {
    lat: 12.8223491,
    lng: 80.0454476,
};

const MAP_OPTIONS = {
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    styles: [
        { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] }
    ]
};

export default function Maps() {
    const [hostels, setHostels] = useState(hostelCache || []);
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [hoveredHostel, setHoveredHostel] = useState(null);
    const [error, setError] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const router = useRouter();
    const mapRef = useRef(null);
    const hasFetched = useRef(false);

    const createPinSymbol = useCallback((color) => {
        if (typeof window === 'undefined' || !window.google || !window.google.maps) return null;

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

    const hostelIcons = useMemo(() => {
        if (!mapLoaded) return { female: null, male: null };
        return {
            female: createPinSymbol('#EC4899'),
            male: createPinSymbol('#3B82F6')
        };
    }, [mapLoaded, createPinSymbol]);

    const fetchHostels = useCallback(async () => {
        if (hostelCache) {
            setHostels(hostelCache);
            return;
        }

        if (dataFetchPromise) {
            try {
                await dataFetchPromise;
                setHostels(hostelCache);
            } catch (err) {
                setError(err.message);
            }
            return;
        }

        if (typeof window === 'undefined' || !window.google || !window.google.maps) {
            setError('Google Maps API not loaded');
            return;
        }

        dataFetchPromise = new Promise(async (resolve, reject) => {
            try {
                const response = await fetch('/api/map-data');
                if (!response.ok) throw new Error('Failed to fetch hostel data');
                const data = await response.json();
                if (!data.success) throw new Error(data.message || 'Failed to load hostel data');

                const geocoder = new window.google.maps.Geocoder();
                const processedHostels = await Promise.all(
                    data.hostels.map(hostel =>
                        new Promise((resolveGeocode) => {
                            geocoder.geocode({ address: hostel.plus_code }, (results, status) => {
                                if (status === 'OK' && results[0]) {
                                    resolveGeocode({
                                        ...hostel,
                                        coordinates: {
                                            lat: results[0].geometry.location.lat(),
                                            lng: results[0].geometry.location.lng()
                                        }
                                    });
                                } else {
                                    console.error(`Geocoding failed for ${hostel.name}:`, status);
                                    resolveGeocode(null);
                                }
                            });
                        })
                    )
                );

                const validHostels = processedHostels.filter(Boolean);
                hostelCache = validHostels;
                setHostels(validHostels);
                resolve(validHostels);
            } catch (err) {
                console.error('Error fetching hostels:', err);
                setError(err.message);
                reject(err);
            } finally {
                dataFetchPromise = null;
            }
        });
    }, []);

    useEffect(() => {
        if (mapLoaded && !hasFetched.current) {
            hasFetched.current = true;
            fetchHostels();
        }
    }, [mapLoaded, fetchHostels]);

    const handleMarkerClick = useCallback((hostel) => {
        setSelectedHostel(hostel);
        setHoveredHostel(null);
    }, []);

    const handleMarkerMouseOver = useCallback((hostel) => {
        if (!selectedHostel) setHoveredHostel(hostel);
    }, [selectedHostel]);

    const handleMarkerMouseOut = useCallback(() => {
        setHoveredHostel(null);
    }, []);

    const getNavigationUrl = useCallback((hostel) => {
        return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hostel.plus_code)}`;
    }, []);

    const handleLearnMore = useCallback((hostel) => {
        router.push(`/hostel?id=${hostel.id}`);
    }, [router]);

    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
        mapInstance = map;
        setMapLoaded(true);
    }, []);

    if (error) {
        return (
            // Modified error container to be fully responsive with proper height constraints
            <div className="h-full w-full flex items-center justify-center bg-red-50 rounded-2xl shadow-lg">
                <div className="text-center text-red-600 p-6">
                    <p className="text-lg font-semibold mb-2">Error Loading Map</p>
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            fetchHostels();
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        // Critical change: Container now fills available space completely
        <div className="h-full w-full p-6">
            <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                libraries={['places', 'geocoding']}
                loadingElement={
                    // Loading element also adapts to full container height
                    <div className="flex items-center justify-center h-full w-full bg-gray-50 rounded-2xl">
                        <div className="text-center">
                            <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4"/>
                            <p className="text-gray-600">Loading Google Maps...</p>
                        </div>
                    </div>
                }
            >
                <GoogleMap
                    // Map container now takes full available space with proper styling
                    mapContainerClassName="w-full h-full rounded-2xl shadow-lg"
                    mapContainerStyle={MAP_CONTAINER_STYLE}
                    center={DEFAULT_CENTER}
                    zoom={16.5}
                    options={MAP_OPTIONS}
                    onLoad={onMapLoad}
                >
                    {hostels.map((hostel) => (
                        <Marker
                            key={hostel.id}
                            position={hostel.coordinates}
                            icon={hostelIcons[hostel.gender === 'female' ? 'female' : 'male'] || null}
                            onClick={() => handleMarkerClick(hostel)}
                            onMouseOver={() => handleMarkerMouseOver(hostel)}
                            onMouseOut={handleMarkerMouseOut}
                            title={`${hostel.name} - ${hostel.gender === 'female' ? 'Girls' : 'Boys'} Hostel`}
                        />
                    ))}

                    {(hoveredHostel && !selectedHostel) && (
                        <InfoWindow
                            position={hoveredHostel.coordinates}
                            options={{pixelOffset: new window.google.maps.Size(0, -40)}}
                        >
                            <div className="p-2 sm:p-3 min-w-[160px] sm:min-w-[200px] bg-white rounded-lg shadow-lg border border-gray-100">
                                <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 leading-tight">
                                    {hoveredHostel.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                                    <span className={`inline-block w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2 flex-shrink-0 ${hoveredHostel.gender === 'female' ? 'bg-pink-500' : 'bg-blue-500'}`}></span>
                                    <span className="truncate">{hoveredHostel.gender === 'female' ? 'Girls' : 'Boys'} Hostel</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Click for more options</p>
                            </div>
                        </InfoWindow>
                    )}

                    {selectedHostel && (
                        <InfoWindow
                            position={selectedHostel.coordinates}
                            onCloseClick={() => setSelectedHostel(null)}
                        >
                            <div className="p-3 sm:p-4 w-full max-w-[280px] sm:max-w-[320px] bg-white rounded-lg shadow-xl border border-gray-100 font-sans">
                                <div className="mb-3 sm:mb-4">
                                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 leading-tight">{selectedHostel.name}</h3>
                                    <div className="flex items-center">
                                        <span className={`inline-block w-3 h-3 rounded-full mr-2 flex-shrink-0 ${selectedHostel.gender === 'female' ? 'bg-pink-500' : 'bg-blue-500'}`}></span>
                                        <span className="font-medium text-sm sm:text-base text-gray-700">{selectedHostel.gender === 'female' ? 'Girls' : 'Boys'} Hostel</span>
                                    </div>
                                </div>
                                <div className="mb-4 space-y-2">
                                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                        <MapPin size={14} className="text-gray-400 mr-2 flex-shrink-0"/>
                                        <span className="truncate">Campus Location</span>
                                    </div>
                                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                        <Users size={14} className="text-indigo-500 mr-2 flex-shrink-0"/>
                                        <span>Student Accommodation</span>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                    <button
                                        onClick={() => handleLearnMore(selectedHostel)}
                                        className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs sm:text-sm px-3 py-2 rounded-md hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        <ArrowRight size={14}/><span>Learn More</span>
                                    </button>
                                    <a
                                        href={getNavigationUrl(selectedHostel)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xs sm:text-sm px-3 py-2 rounded-md hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        <Navigation size={14}/><span>Navigate</span>
                                    </a>
                                </div>
                                <p className="text-xs text-gray-400 text-center mt-3 border-t pt-2">Tap outside to close</p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}