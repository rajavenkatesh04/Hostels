// app/hostels/loading.js
export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header skeleton - this mimics the actual page structure */}
            <div className="mb-8">
                <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
            </div>

            {/* Grid skeleton - shows placeholders where hostel cards will appear */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Create 6 placeholder cards to match expected layout */}
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                        {/* Card header skeleton */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                        </div>

                        {/* Card body skeleton */}
                        <div className="p-4">
                            <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>

                            {/* Statistics grid skeleton */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-gray-50 p-2 rounded">
                                    <div className="h-3 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                                </div>
                                <div className="bg-gray-50 p-2 rounded">
                                    <div className="h-3 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                                </div>
                            </div>

                            {/* Button skeleton */}
                            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}