import { supabase } from '@/lib/supabase';


export default async function HostelsPage() {
    // Fetch hostels with available rooms using the single supabase client
    const { data: hostels, error } = await supabase
        .from('hostels')
        .select(`
      id,
      name,
      description,
      gender,
      address,
      latitude,
      longitude,
      room_types (
        id,
        room_category,
        ac_type,
        washroom_type,
        annual_fee,
        available_rooms
      )
    `)
        .gt('room_types.available_rooms', 0);

    if (error) {
        console.error('Supabase error:', error);
        return <div>Error loading hostels. Please try again later.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Explore Hostels</h1>
            {hostels.length > 0 ? (
                <HostelGrid>
                    {hostels.map((hostel) => (
                        <HostelCard
                            key={hostel.id}
                            hostel={{
                                id: hostel.id,
                                name: hostel.name,
                                description: hostel.description,
                                gender: hostel.gender,
                                address: hostel.address,
                                availableRooms: hostel.room_types.reduce(
                                    (sum, room) => sum + room.available_rooms,
                                    0
                                ),
                                minPrice: Math.min(
                                    ...hostel.room_types.map((room) => room.annual_fee)
                                ),
                            }}
                        />
                    ))}
                </HostelGrid>
            ) : (
                <p>No hostels available at the moment.</p>
            )}
        </div>
    );
}