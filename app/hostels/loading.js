export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Explore Hostels</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 h-48 rounded"></div>
                        <div className="mt-2 h-6 bg-gray-200 rounded"></div>
                        <div className="mt-2 h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}