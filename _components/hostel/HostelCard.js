// _components/hostel/HostelCard.js
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import PriceDisplay from './PriceDisplay';

export default function HostelCard({ hostel }) {
    return (
        <Card className="p-4">
            <h2 className="text-xl font-semibold">{hostel.name}</h2>
            <p className="text-gray-600">{hostel.description}</p>
            <p className="text-sm">Gender: {hostel.gender}</p>
            <p className="text-sm">Address: {hostel.address}</p>
            <p className="text-sm">Available Rooms: {hostel.availableRooms}</p>
            <PriceDisplay price={hostel.minPrice} label="Starting at" />
            <Link href={`/hostels/${hostel.id}`} className="text-blue-500 hover:underline">
                View Details
            </Link>
        </Card>
    );
}