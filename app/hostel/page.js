import { Suspense } from 'react';
import HostelDetailsContent from './HostelDetailsContent';

function LoadingFallback() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-lg text-gray-600">Loading hostel details...</p>
        </div>
    );
}

export default function HostelPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <HostelDetailsContent />
        </Suspense>
    );
}