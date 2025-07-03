"use client";

import { GoogleMap, LoadScript, Marker, InfoWindow, Polygon } from '@react-google-maps/api';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { MapPin, Info, Users, ArrowRight, Navigation, Loader2, GraduationCap } from 'lucide-react';
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

// First Year Building Coordinates
const FIRST_YEAR_BUILDING_COORDS = [
    { lat: 12.823177630633419, lng: 80.04252332891708 },
    { lat: 12.82375346771602, lng: 80.04252971342196 },
    { lat: 12.823793931893912, lng: 80.04223602619749 },
    { lat: 12.823523133041068, lng: 80.04195191573034 },
    { lat: 12.823214982267931, lng: 80.04192956996326 },
    { lat: 12.823177630633419, lng: 80.04252332891708 } // Close the polygon
];

// Building center point for the info window
const BUILDING_CENTER = {
    lat: 12.823483782762984,
    lng: 80.04222644732022
};

// Updated polygon options with purple/amber color that stands out
const POLYGON_OPTIONS = {
    fillColor: '#A855F7', // Purple color
    fillOpacity: 0.25,
    strokeColor: '#7C3AED',
    strokeOpacity: 0.9,
    strokeWeight: 3,
    clickable: true,
    editable: false,
    draggable: false,
};

export default function Maps() {
    const [hostels, setHostels] = useState(hostelCache || []);
    const [activeInfoWindow, setActiveInfoWindow] = useState(null);
    const [showClassroomInfo, setShowClassroomInfo] = useState(false);
    const [error, setError] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const router = useRouter();
    const mapRef = useRef(null);
    const hasFetched = useRef(false);

    // Distance calculation helper function
    const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c * 1000; // Distance in meters
        return Math.round(distance);
    }, []);

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

    const handleMarkerInteraction = useCallback((hostel) => {
        setActiveInfoWindow(hostel);
        setShowClassroomInfo(false);
    }, []);

    const handleBuildingInteraction = useCallback(() => {
        setShowClassroomInfo(true);
        setActiveInfoWindow(null);
    }, []);

    const handleMapClick = useCallback(() => {
        setActiveInfoWindow(null);
        setShowClassroomInfo(false);
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
        <div className="h-[calc(100vh-120px)] w-full p-7.5 sm:h-full">
            <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                libraries={['places', 'geocoding']}
                loadingElement={
                    <div className="flex items-center justify-center h-full w-full bg-gray-50 rounded-2xl">
                        <div className="text-center">
                            <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4"/>
                            <p className="text-gray-600">Loading Google Maps...</p>
                        </div>
                    </div>
                }
            >
                <GoogleMap
                    mapContainerClassName="w-full h-full rounded-2xl shadow-lg"
                    mapContainerStyle={MAP_CONTAINER_STYLE}
                    center={DEFAULT_CENTER}
                    zoom={16.5}
                    options={MAP_OPTIONS}
                    onLoad={onMapLoad}
                    onClick={handleMapClick}
                >
                    {/* Building Polygon */}
                    <Polygon
                        paths={FIRST_YEAR_BUILDING_COORDS}
                        options={POLYGON_OPTIONS}
                        onClick={handleBuildingInteraction}
                        onMouseOver={handleBuildingInteraction}
                    />

                    {/* Hostel Markers */}
                    {hostels.map((hostel) => (
                        <Marker
                            key={hostel.id}
                            position={hostel.coordinates}
                            icon={hostelIcons[hostel.gender === 'female' ? 'female' : 'male'] || null}
                            onClick={() => handleMarkerInteraction(hostel)}
                            onMouseOver={() => handleMarkerInteraction(hostel)}
                            title={`${hostel.name} - ${hostel.gender === 'female' ? 'Girls' : 'Boys'} Hostel`}
                        />
                    ))}

                    {/* Unified Hostel Info Window */}
                    {activeInfoWindow && (
                        <InfoWindow
                            position={activeInfoWindow.coordinates}
                            onCloseClick={() => setActiveInfoWindow(null)}
                            options={{
                                pixelOffset: new window.google.maps.Size(0, -40),
                                disableAutoPan: false,
                                maxWidth: 350
                            }}
                        >
                            <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border-2 ${
                                activeInfoWindow.gender === 'female'
                                    ? 'border-pink-500/30'
                                    : 'border-blue-500/30'
                            } overflow-hidden font-sans`}>
                                <div className="p-4 sm:p-6 text-center">
                                    {/* Hostel Name */}
                                    <h3 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2 tracking-wide">
                                        {activeInfoWindow.name}
                                    </h3>

                                    {/* Gender Badge */}
                                    <div className="mb-4 flex items-center justify-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                            activeInfoWindow.gender === 'female'
                                                ? 'bg-pink-100 text-pink-800 border border-pink-200'
                                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full mr-2 ${
                                                activeInfoWindow.gender === 'female' ? 'bg-pink-500' : 'bg-blue-500'
                                            }`}></span>
                                            {activeInfoWindow.gender === 'female' ? 'Girls' : 'Boys'} Hostel
                                        </span>
                                    </div>

                                    {/* Info Details */}
                                    <div className="mb-6 space-y-3">
                                        <div className="flex items-center justify-center text-sm text-gray-700">
                                            <GraduationCap size={16} className="text-green-500 mr-2 flex-shrink-0"/>
                                            <span className="font-medium">
                                                {calculateDistance(
                                                    activeInfoWindow.coordinates.lat,
                                                    activeInfoWindow.coordinates.lng,
                                                    BUILDING_CENTER.lat,
                                                    BUILDING_CENTER.lng
                                                )}m to University Building
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => handleLearnMore(activeInfoWindow)}
                                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white text-sm px-4 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                                        >
                                            <span>Learn More</span>
                                            <ArrowRight size={16} />
                                        </button>
                                        <a
                                            href={getNavigationUrl(activeInfoWindow)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-sm px-4 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                                        >
                                            <Navigation size={16} />
                                            <span>Navigate</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </InfoWindow>
                    )}

                    {/* Building Info Window */}
                    {showClassroomInfo && (
                        <InfoWindow
                            position={BUILDING_CENTER}
                            onCloseClick={() => setShowClassroomInfo(false)}
                            options={{
                                pixelOffset: new window.google.maps.Size(0, -40),
                                disableAutoPan: false,
                                maxWidth: 350
                            }}
                        >
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border-2 border-purple-500/30 overflow-hidden font-sans">
                                <div className="p-4 sm:p-6 text-center">
                                    {/* University Badge */}
                                    <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-purple-600/30 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm">
                                        <GraduationCap size={16} className="text-purple-600"/>
                                        <span className="text-xs font-medium text-purple-700">Academic Building</span>
                                    </div>

                                    {/* Building Name */}
                                    <h3 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2 tracking-wide">
                                        University Building
                                    </h3>

                                    {/* Info Details */}
                                    <div className="mb-6 space-y-3">
                                        <div className="flex items-center justify-center text-sm text-gray-700">
                                            <Info size={16} className="text-green-500 mr-2 flex-shrink-0"/>
                                            <span>1st year classes happen here</span>
                                        </div>
                                        <div className="flex items-center justify-center text-sm text-gray-700">
                                            <Info size={16} className="text-green-500 mr-2 flex-shrink-0"/>
                                            <span>Admission office (2nd floor)</span>
                                        </div>
                                        <div className="flex items-center justify-center text-sm text-gray-700">
                                            <Info size={16} className="text-green-500 mr-2 flex-shrink-0"/>
                                            <span>Central library</span>
                                        </div>
                                    </div>

                                    {/* Info Note */}
                                    <div className="text-xs text-gray-700 bg-purple-50/80 backdrop-blur-sm border border-purple-200/50 p-3 rounded-lg mb-4">
                                        📚 All first year classes are conducted in this building. Check the distance from your hostel by clicking on the hostel markers!
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex flex-col gap-3">
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${BUILDING_CENTER.lat},${BUILDING_CENTER.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-sm px-4 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                                        >
                                            <Navigation size={16} />
                                            <span>Navigate to Building</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}