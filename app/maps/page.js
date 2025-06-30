'use client';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px',
};

const center = {
    lat: 12.823183,
    lng: 80.042759,
};

export default function Maps() {
    return (
        <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        >
            <GoogleMap
                // mapContainerStyle={containerStyle}
                mapContainerClassName={`m-6 rounded-2xl h-100`}
                center={center}
                zoom={16}

            >

                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
    );
}