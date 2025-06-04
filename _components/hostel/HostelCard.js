import Badge from './Badge'

export default function HostelCard({ hostel }) {
    // Helper function to format currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price)
    }

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            {/* Card Header */}
            <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                        {hostel.name}
                    </h3>
                    <Badge
                        text={hostel.gender}
                        variant={hostel.gender === 'boys' ? 'blue' : 'pink'}
                    />
                </div>

                {hostel.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {hostel.description}
                    </p>
                )}

                {/* Features Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {hostel.availableFeatures.hasAC && (
                        <Badge text="AC Available" variant="green" size="sm" />
                    )}
                    {hostel.availableFeatures.hasNonAC && (
                        <Badge text="Non-AC" variant="gray" size="sm" />
                    )}
                    {hostel.availableFeatures.hasAttached && (
                        <Badge text="Attached Washroom" variant="blue" size="sm" />
                    )}
                    {hostel.availableFeatures.hasCommon && (
                        <Badge text="Common Washroom" variant="yellow" size="sm" />
                    )}
                </div>

                {/* Price Range */}
                <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Annual Fee</p>
                    <p className="text-lg font-semibold text-green-600">
                        {hostel.priceRange.min === hostel.priceRange.max
                            ? formatPrice(hostel.priceRange.min)
                            : `${formatPrice(hostel.priceRange.min)} - ${formatPrice(hostel.priceRange.max)}`
                        }
                    </p>
                </div>

                {/* Contact Info */}
                {hostel.warden_name && (
                    <div className="text-sm text-gray-600 mb-2">
                        <p><span className="font-medium">Warden:</span> {hostel.warden_name}</p>
                    </div>
                )}

                {/* Room Types Summary */}
                <div className="text-sm text-gray-600 mb-4">
                    <p><span className="font-medium">Room Types:</span> {hostel.room_types.length} available</p>
                </div>
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">
                    View Details
                </button>
            </div>
        </div>
    )
}