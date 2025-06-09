import { supabase, handleSupabaseError } from '@/lib/supabase'


export async function GET(request) {
    try {
        // Extract the hostel ID from URL search parameters
        const { searchParams } = new URL(request.url);
        const hostelId = searchParams.get('id');

        // Validate that hostel ID is provided
        if (!hostelId) {
            return Response.json(
                {
                    success: false,
                    message: 'Hostel ID is required',
                    example: '/api/hostel?id=uuid-here'
                },
                { status: 400 }
            );
        }

        // Validate UUID format (basic check)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(hostelId)) {
            return Response.json(
                {
                    success: false,
                    message: 'Invalid hostel ID format'
                },
                { status: 400 }
            );
        }

        // Fetch comprehensive hostel information
        // We're getting the hostel details AND all available room types
        const { data: hostelData, error: hostelError } = await supabase
            .from('hostels')
            .select(`
                *,
                hostel_rooms (
                    id,
                    washroom_type,
                    occupancy,
                    ac_type,
                    price,
                    created_at
                )
            `)
            .eq('id', hostelId)
            .single(); // We expect exactly one hostel

        if (hostelError) {
            // Check if hostel doesn't exist
            if (hostelError.code === 'PGRST116') {
                return Response.json(
                    {
                        success: false,
                        message: 'Hostel not found',
                        hostel_id: hostelId
                    },
                    { status: 404 }
                );
            }

            handleSupabaseError(hostelError);
            throw hostelError;
        }

        // If no hostel found (shouldn't happen with .single() but good to check)
        if (!hostelData) {
            return Response.json(
                {
                    success: false,
                    message: 'Hostel not found'
                },
                { status: 404 }
            );
        }

        // Transform and organize the data for frontend consumption
        const transformedData = {
            // Basic hostel information
            id: hostelData.id,
            name: hostelData.name,
            description: hostelData.description,

            // Academic and demographic info
            year_of_study: hostelData.year_of_study,
            gender: hostelData.gender,
            branch: hostelData.branch,

            // Contact information
            warden: {
                name: hostelData.warden_name,
                contact: hostelData.warden_contact,
                email: hostelData.warden_email
            },

            // Pricing information
            pricing: {
                min_price: hostelData.min_price,
                max_price: hostelData.max_price,
                mess_fees: hostelData.mess_fees
            },

            // Available rooms organized by type for easy display
            available_rooms: hostelData.hostel_rooms?.map(room => ({
                id: room.id,
                washroom_type: room.washroom_type,
                occupancy: room.occupancy,
                ac_type: room.ac_type,
                annual_fee: room.price,
                // Calculate monthly fee for display
                monthly_fee: Math.round(room.price / 12)
            })) || [],

            // Summary statistics for quick overview
            room_summary: {
                total_room_types: hostelData.hostel_rooms?.length || 0,
                cheapest_option: hostelData.hostel_rooms?.length > 0
                    ? Math.min(...hostelData.hostel_rooms.map(r => r.price))
                    : hostelData.min_price,
                most_expensive_option: hostelData.hostel_rooms?.length > 0
                    ? Math.max(...hostelData.hostel_rooms.map(r => r.price))
                    : hostelData.max_price,
                // Available AC and Non-AC options
                has_ac: hostelData.hostel_rooms?.some(r => r.ac_type === 'ac') || false,
                has_non_ac: hostelData.hostel_rooms?.some(r => r.ac_type === 'non_ac') || false,
                // Available occupancy options
                occupancy_options: [...new Set(hostelData.hostel_rooms?.map(r => r.occupancy) || [])].sort()
            },

            // Metadata
            created_at: hostelData.created_at
        };

        return Response.json({
            success: true,
            hostel: transformedData,
            // Include some metadata that might be useful for the frontend
            metadata: {
                hostel_id: hostelId,
                fetched_at: new Date().toISOString(),
                total_room_types: transformedData.available_rooms.length
            }
        });

    } catch (error) {
        console.error('Hostel API Error:', error);
        return Response.json(
            {
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}

// Optional: Handle other HTTP methods gracefully
export async function POST() {
    return Response.json(
        { message: 'POST method not supported for hostel details' },
        { status: 405 }
    );
}

export async function PUT() {
    return Response.json(
        { message: 'PUT method not supported for hostel details' },
        { status: 405 }
    );
}

export async function DELETE() {
    return Response.json(
        { message: 'DELETE method not supported for hostel details' },
        { status: 405 }
    );
}