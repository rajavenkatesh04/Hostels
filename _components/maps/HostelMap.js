"use client";
import { useState } from 'react';
import GoogleMap from './GoogleMap';

// Example data to test the map
const mockHostels = [
    { id: 1, name: 'Green Meadows Hostel', latitude: 13.08, longitude: 80.27, price: 8500, type: 'Boys', address: '123 Anna Salai, Chennai' },
    { id: 2, name: 'Ocean View Stays', latitude: 13.05, longitude: 80.28, price: 12000, type: 'Girls', address: '456 Marina Beach Rd, Chennai' },
    { id: 3, name: 'City Center Living', latitude: 13.06, longitude: 80.25, price: 15000, type: 'Co-ed', address: '789 T. Nagar, Chennai' },
    { id: 4, name: 'Budget Friendly Rooms', latitude: 13.10, longitude: 80.26, price: 6000, type: 'Boys', address: '101 Purasawalkam, Chennai' }
];


const HostelMap = ({ initialHostels = mockHostels }) => {
    const [hostels] = useState(initialHostels);
    const [filters, setFilters] = useState({
        maxPrice: 20000,
        minPrice: 0,
        amenities: []
    });

    // Ensure minPrice is not greater than maxPrice
    const handleMinPriceChange = (e) => {
        const newMinPrice = parseInt(e.target.value);
        if (newMinPrice > filters.maxPrice) {
            setFilters({ ...filters, minPrice: filters.maxPrice });
        } else {
            setFilters({ ...filters, minPrice: newMinPrice });
        }
    };

    // Ensure maxPrice is not less than minPrice
    const handleMaxPriceChange = (e) => {
        const newMaxPrice = parseInt(e.target.value);
        if (newMaxPrice < filters.minPrice) {
            setFilters({ ...filters, maxPrice: filters.minPrice });
        } else {
            setFilters({ ...filters, maxPrice: newMaxPrice });
        }
    };


    // Filter hostels based on current filters
    const filteredHostels = hostels.filter(hostel => {
        const price = hostel.price || 0;
        return price >= filters.minPrice && price <= filters.maxPrice;
    });

    return (
        <div className="w-full">
            {/* Map Controls */}
            <div className="mb-4 p-4 bg-gray-50 border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Filter Hostels</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Price Range</label>
                        <div className='flex justify-between text-sm text-gray-600'>
                            <span>₹{filters.minPrice.toLocaleString()}</span>
                            <span>₹{filters.maxPrice.toLocaleString()}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="20000"
                            value={filters.maxPrice}
                            onChange={handleMaxPriceChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <input
                            type="range"
                            min="0"
                            max="20000"
                            value={filters.minPrice}
                            onChange={handleMinPriceChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                        />
                    </div>
                    <div className="md:col-span-2 text-right">
                        <span className="text-lg font-semibold text-blue-600">
                           Showing {filteredHostels.length} of {hostels.length} hostels
                        </span>
                    </div>
                </div>
            </div>

            {/* Map */}
            <GoogleMap
                hostels={filteredHostels}
                className="w-full h-[500px] md:h-[600px]"
            />
        </div>
    );
};

export default HostelMap;