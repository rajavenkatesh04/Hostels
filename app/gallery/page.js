import { Images } from 'lucide-react';

export default function Gallery() {
    return (
        <div className="fixed inset-0 gap-4 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <p className="text-center font-bold text-lg">Gallery Coming Soon</p>
            <Images size={100} />
            <p className="text-sm text-gray-600">Images for each hostel will be available shortly.</p>
        </div>
    );
}
