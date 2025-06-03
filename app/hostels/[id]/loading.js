// app/hostels/[id]/loading.js
export default function HostelDetailLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back button skeleton */}
            <div className="h-8 bg-gray-200 rounded w-24 mb-6 animate-pulse"></div>

            {/* Main content area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content column */}
                <div className="lg:col-span-2">
                    {/* Title and basic info skeleton */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </div>

                    {/* Room types skeleton */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="h-5 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar skeleton */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                        <div className="space-y-3">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="flex justify-between">
                                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}