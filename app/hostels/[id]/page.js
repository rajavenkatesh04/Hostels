// app/hostels/[id]/page.js
import { supabase } from '@/lib/supabase';
import HostelDetail from '@/components/hostel/HostelDetail';
import HostelMap from '@/components/maps/HostelMap';

export default async function HostelDetailPage({ params }) {
    const { id } = params;

    // Fetch hostel details with room types using the single supabase client
    const { data: hostel, error } = await supabase
        .from('hostels')
        .select(`
      id,
      name,
      description,
      gender,
      warden_name,
      warden_phone,
      warden_email,
      address,
      latitude,
      longitude,
      total_floors,
      total_capacity,
      established_year,
      room_types (
        id,
        room_category,
        ac_type,
        washroom_type,
        year_preference,
        annual_fee,
        security_deposit,
        available_rooms,
        occupancy_limit,
        room_size_sqft
      )
    `)
        .eq('id', id)
        .single();

    if (error || !hostel) {
        console.error('Supabase error:', error);
        return <div>Hostel not found.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <HostelDetail
                hostel={{
                    ...hostel,
                    roomTypes: hostel.room_types,
                }}
            />
            {hostel.latitude && hostel.longitude && (
                <HostelMap
                    latitude={hostel.latitude}
                    longitude={hostel.longitude}
                    hostelName={hostel.name}
                />
            )}
        </div>
    );
}