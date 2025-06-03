// _components/hostel/HostelCard.js
import Link from 'next/link'

export default function HostelCard({ hostel }) {
    // Helper function to format currency - using Indian Rupee since this appears to be for India
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(price)
    }

    // Helper function to capitalize enum values for display
    const formatEnumValue = (value) => {
        if (!value) return ''
        return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    // Helper function to get a color class based on gender
    const getGenderColor = (gender) => {
        switch(gender) {
            case 'boys': return 'bg-blue-100 text-blue-800'
            case 'girls': return 'bg-pink-100 text-pink-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
            {/* Header with hostel name and gender badge */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 flex-1">
                        {hostel.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGenderColor(hostel.gender)}`}>
            {formatEnumValue(hostel.gender)}
          </span>
                </div>

                {hostel.address && (
                    <p className="text-gray-600 text-sm">
                        📍 {hostel.address}
                    </p>
                )}
            </div>

            <div className="p-4">
                {/* Description */}
                {hostel.description && (
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                        {hostel.description}
                    </p>
                )}

                {/* Key statistics */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                        <div className="font-medium text-gray-800">Capacity</div>
                        <div className="text-gray-600">{hostel.total_capacity} students</div>
                    </div>

                    <div className="bg-gray-50 p-2 rounded">
                        <div className="font-medium text-gray-800">Available Rooms</div>
                        <div className="text-gray-600">{hostel.total_available_rooms || 0} rooms</div>
                    </div>

                    {hostel.total_floors && (
                        <div className="bg-gray-50 p-2 rounded">
                            <div className="font-medium text-gray-800">Floors</div>
                            <div className="text-gray-600">{hostel.total_floors} floors</div>
                        </div>
                    )}

                    {hostel.established_year && (
                        <div className="bg-gray-50 p-2 rounded">
                            <div className="font-medium text-gray-800">Established</div>
                            <div className="text-gray-600">{hostel.established_year}</div>
                        </div>
                    )}
                </div>

                {/* Fee range */}
                {hostel.min_annual_fee > 0 && (
                    <div className="mb-4">
                        <div className="font-medium text-gray-800 mb-1">Annual Fee Range</div>
                        <div className="text-lg font-bold text-green-600">
                            {hostel.min_annual_fee === hostel.max_annual_fee ?
                                formatPrice(hostel.min_annual_fee) :
                                `${formatPrice(hostel.min_annual_fee)} - ${formatPrice(hostel.max_annual_fee)}`
                            }
                        </div>
                    </div>
                )}

                {/* Room types preview */}
                {hostel.room_types && hostel.room_types.length > 0 && (
                    <div className="mb-4">
                        <div className="font-medium text-gray-800 mb-2">Room Types Available</div>
                        <div className="flex flex-wrap gap-1">
                            {hostel.room_types.slice(0, 3).map((roomType, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                  {formatEnumValue(roomType.ac_type)} • {formatEnumValue(roomType.washroom_type)}
                </span>
                            ))}
                            {hostel.room_types.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{hostel.room_types.length - 3} more
                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Warden contact info */}
                {hostel.warden_name && (
                    <div className="mb-4 text-sm text-gray-600">
                        <div className="font-medium">Warden: {hostel.warden_name}</div>
                        {hostel.warden_phone && (
                            <div>📞 {hostel.warden_phone}</div>
                        )}
                    </div>
                )}

                {/* Action button */}
                <Link
                    href={`/hostels/${hostel.id}`}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-center block font-medium"
                >
                    View Details & Room Types
                </Link>
            </div>
        </div>
    )
}