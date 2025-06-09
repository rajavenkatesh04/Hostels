"use client";
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const GoogleMap = ({
                       hostels = [],
                       center = { lat: 12.823183, lng: 80.042759 },
                       zoom = 16,
                       className = "w-full h-150"
                   }) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const infoWindowRef = useRef(null); // Ref to hold a single InfoWindow instance

    // 1. Initialize the map only ONCE
    useEffect(() => {
        const initMap = async () => {
            if (!mapRef.current) return;

            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_Maps_API_KEY,
                version: 'weekly',
                libraries: ['maps', 'marker', 'places'] // Load all libraries at once
            });

            try {
                // Import all necessary modules from the loader
                const { Map } = await loader.importLibrary('maps');
                const { InfoWindow } = await loader.importLibrary('maps');

                const mapOptions = {
                    center,
                    zoom,
                    mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || 'HOSTEL_FINDER_MAP', // Use an env var for Map ID
                    disableDefaultUI: true,
                    zoomControl: true,
                    styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }]
                };

                const mapInstance = new Map(mapRef.current, mapOptions);
                setMap(mapInstance);

                // Create a single InfoWindow to be reused by all markers
                infoWindowRef.current = new InfoWindow();

            } catch (error) {
                console.error('Error loading Google Maps:', error);
            }
        };

        initMap();

    }, []); // <-- Empty dependency array ensures this runs only once

    // 2. Update markers whenever the hostels prop changes
    useEffect(() => {
        if (!map) return; // Wait for the map to be initialized

        const addHostelMarkers = async () => {
            // Clear existing markers from the map before adding new ones
            markers.forEach(marker => marker.map = null);

            // Import the AdvancedMarkerElement library
            const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
            const newMarkers = [];

            hostels.forEach((hostel) => {
                if (hostel.latitude && hostel.longitude) {
                    const markerContent = document.createElement('div');
                    markerContent.className = 'bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-bold shadow-lg border-2 border-white cursor-pointer';
                    markerContent.textContent = `₹${hostel.price?.toLocaleString() || 'N/A'}`;

                    const marker = new AdvancedMarkerElement({
                        map,
                        position: { lat: hostel.latitude, lng: hostel.longitude },
                        content: markerContent,
                        title: hostel.name
                    });

                    // Add click listener to open the single InfoWindow
                    marker.addListener('click', () => {
                        if (infoWindowRef.current) {
                            const content = createInfoWindowContent(hostel);
                            infoWindowRef.current.setContent(content);
                            infoWindowRef.current.open(map, marker);
                        }
                    });

                    newMarkers.push(marker);
                }
            });

            setMarkers(newMarkers); // Store the new markers in state
        };

        addHostelMarkers();

    }, [map, hostels]);


    const createInfoWindowContent = (hostel) => {
        // Note: Buttons inside this HTML string won't have React's onClick functionality.
        // For complex interactions, a different approach (like portal-based popups) is needed.
        return `
      <div class="p-1 max-w-xs font-sans">
        <h3 class="font-bold text-lg mb-2 text-gray-800">${hostel.name}</h3>
        <div class="space-y-1 text-sm text-gray-600">
          <p><span class="font-semibold text-gray-700">Price:</span> ₹${hostel.price?.toLocaleString() || 'Contact for price'}</p>
          <p><span class="font-semibold text-gray-700">Type:</span> ${hostel.type || 'Hostel'}</p>
          <p><span class="font-semibold text-gray-700">Address:</span> ${hostel.address || 'Not available'}</p>
        </div>
        <a href="/hostels/${hostel.id}" class="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors no-underline">
            View Details
        </a>
      </div>
    `;
    };

    return (
        <div className={className}>
            <div ref={mapRef} className="w-full h-full rounded-lg shadow-md border" />
        </div>
    );
};

export default GoogleMap;