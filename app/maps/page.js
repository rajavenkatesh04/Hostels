'use client';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useEffect, useState, useCallback } from 'react';

const containerStyle = {
    width: '100%',
    height: '500px',
};

const defaultCenter = {
    lat: 12.823183,
    lng: 80.042759,
};

export default function Maps() {
    const [hostels, setHostels] = useState([]);
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [hoveredHostel, setHoveredHostel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Memoized function to create custom icons
    const createCustomIcon = useCallback((gender) => {
        return {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: gender === 'female' ? '#FF1493' : '#4285F4',
            fillOpacity: 0.9,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
            scale: 12,
        };
    }, []);

    // Convert Plus Codes to coordinates using Geocoder
    const geocodePlusCode = useCallback(async (plusCode) => {
        if (!window.google || !window.google.maps) return null;

        return new Promise((resolve) => {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: plusCode }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    resolve({
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    });
                } else {
                    console.error(`Geocoding failed for ${plusCode}:`, status);
                    resolve(null);
                }
            });
        });
    }, []);

    // Fetch and process hostel data
    useEffect(() => {
        if (!mapLoaded) return;

        const fetchHostels = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/map-data');

                if (!response.ok) {
                    throw new Error('Failed to fetch hostel data');
                }

                const data = await response.json();

                if (data.success) {
                    // Process hostels in parallel
                    const processedHostels = await Promise.all(
                        data.hostels.map(async (hostel) => {
                            try {
                                const coordinates = await geocodePlusCode(hostel.plus_code);
                                return coordinates ? { ...hostel, coordinates } : null;
                            } catch (err) {
                                console.error(`Error processing ${hostel.name}:`, err);
                                return null;
                            }
                        })
                    );

                    setHostels(processedHostels.filter(Boolean));
                } else {
                    throw new Error(data.message || 'Failed to load hostel data');
                }
            } catch (err) {
                console.error('Error fetching hostels:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHostels();
    }, [mapLoaded, geocodePlusCode]);

    const handleMarkerClick = (hostel) => {
        setSelectedHostel(hostel);
        setHoveredHostel(null);
    };

    const handleMarkerMouseOver = (hostel) => {
        if (!selectedHostel) {
            setHoveredHostel(hostel);
        }
    };

    const handleMarkerMouseOut = () => {
        setHoveredHostel(null);
    };

    const getNavigationUrl = (hostel) => {
        return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hostel.plus_code)}`;
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-[500px] bg-red-50 rounded-2xl m-6">
                <div className="text-center text-red-600">
                    <p className="text-lg font-semibold mb-2">Error Loading Map</p>
                    <p>{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            setLoading(true);
                        }}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                onLoad={() => setMapLoaded(true)}
                libraries={['places']}
                loadingElement={
                    <div className="flex items-center justify-center h-[500px] bg-gray-50 rounded-2xl m-6">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading Google Maps...</p>
                        </div>
                    </div>
                }
            >
                {mapLoaded && (
                    <GoogleMap
                        mapContainerClassName="m-6 rounded-2xl shadow-lg"
                        mapContainerStyle={containerStyle}
                        center={defaultCenter}
                        zoom={15}
                        options={{
                            zoomControl: true,
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: true,
                        }}
                    >
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10">
                                <div className="bg-white p-4 rounded-lg shadow-lg">
                                    <p className="text-gray-700">Loading hostel locations...</p>
                                </div>
                            </div>
                        ) : (
                            hostels.map((hostel) => (
                                <Marker
                                    key={hostel.id}
                                    position={hostel.coordinates}
                                    icon={createCustomIcon(hostel.gender)}
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
                                <div className="p-2 min-w-[200px]">
                                    <h3 className="font-bold text-lg text-gray-800 mb-1">
                                        {hoveredHostel.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                            hoveredHostel.gender === 'female' ? 'bg-pink-500' : 'bg-blue-500'
                                        }`}></span>
                                        {hoveredHostel.gender === 'female' ? 'Girls' : 'Boys'} Hostel
                                    </p>
                                    <p className="text-xs text-gray-500">Click for details</p>
                                </div>
                            </InfoWindow>
                        )}

                        {/* Click InfoWindow */}
                        {selectedHostel && (
                            <InfoWindow
                                position={selectedHostel.coordinates}
                                onCloseClick={() => setSelectedHostel(null)}
                            >
                                <div className="p-3 max-w-xs">
                                    <h3 className="font-bold text-xl text-gray-800 mb-2">
                                        {selectedHostel.name}
                                    </h3>

                                    <div className="mb-3">
                                        <p className="text-sm text-gray-600 mb-1">
                                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                                selectedHostel.gender === 'female' ? 'bg-pink-500' : 'bg-blue-500'
                                            }`}></span>
                                            {selectedHostel.gender === 'female' ? 'Girls' : 'Boys'} Hostel
                                        </p>
                                        <p className="text-xs text-gray-500 font-mono">
                                            {selectedHostel.plus_code}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <a
                                            href={getNavigationUrl(selectedHostel)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 bg-blue-500 text-white text-sm px-3 py-2 rounded-md hover:bg-blue-600 transition-colors text-center font-medium"
                                        >
                                            Navigate
                                        </a>

                                        <button
                                            onClick={() => setSelectedHostel(null)}
                                            className="flex-1 bg-gray-200 text-gray-700 text-sm px-3 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
                                        >
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