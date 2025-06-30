'use client';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useEffect, useState, useMemo } from 'react';

const containerStyle = {
    width: '100%',
    height: '500px',
};

const defaultCenter = {
    lat: 12.823183,
    lng: 80.042759,
};

// Define the map icons outside the component to avoid recreation on each render
const createIcon = (gender) => ({
    path: window.google?.maps?.SymbolPath?.CIRCLE || '',
    fillColor: gender === 'female' ? '#FF69B4' : '#4285F4',
    fillOpacity: 1,
    strokeWeight: 0,
    scale: 10,
});

export default function Maps() {
    const [hostels, setHostels] = useState([]);
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        const fetchHostels = async () => {
            try {
                const response = await fetch('/api/map-data');
                const data = await response.json();

                if (data.success) {
                    setHostels(data.hostels);
                } else {
                    setError('Failed to load hostel data');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHostels();
    }, []);

    if (loading) return <div className="text-center py-8">Loading map...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    return (
        <div className="w-full h-[500px]">
            <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                onLoad={() => setScriptLoaded(true)}
            >
                {scriptLoaded && (
                    <GoogleMap
                        mapContainerClassName="m-6 rounded-2xl h-[500px]"
                        center={defaultCenter}
                        zoom={16}
                    >
                        {hostels.map((hostel) => (
                            <Marker
                                key={hostel.id}
                                position={{ lat: hostel.latitude, lng: hostel.longitude }}
                                icon={createIcon(hostel.gender)}
                                onClick={() => setSelectedHostel(hostel)}
                            />
                        ))}

                        {selectedHostel && (
                            <InfoWindow
                                position={{ lat: selectedHostel.latitude, lng: selectedHostel.longitude }}
                                onCloseClick={() => setSelectedHostel(null)}
                            >
                                <div className="p-2">
                                    <h3 className="font-bold text-lg">{selectedHostel.name}</h3>
                                    <p>{selectedHostel.gender === 'female' ? 'Girls' : 'Boys'} Hostel</p>
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHostel.latitude},${selectedHostel.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        Get Directions
                                    </a>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                )}
            </LoadScript>
        </div>
    );
}