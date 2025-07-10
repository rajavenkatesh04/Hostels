import { supabase, handleSupabaseError } from '@/lib/supabase';

export async function GET() {
    try {
        // Fetch all hostels information
        const { data: hostelsData, error: hostelsError } = await supabase
            .from('hostels')
            .select(`
                id,
                name,
                description,
                gender,
                branch,
                year_of_study,
                warden_name,
                warden_contact,
                warden_email,
                min_price,
                max_price,
                mess_fees,
                laundry_fees
            `);

        if (hostelsError) {
            handleSupabaseError(hostelsError);
            throw hostelsError;
        }

        // Check if no hostels found
        if (!hostelsData || hostelsData.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: 'No hostels found'
                },
                { status: 404 }
            );
        }

        // Transform the data for frontend consumption
        const transformedData = hostelsData.map(hostel => ({
            id: hostel.id,
            name: hostel.name,
            description: hostel.description,
            gender: hostel.gender,
            branch: hostel.branch,
            year_of_study: hostel.year_of_study,
            warden: {
                name: hostel.warden_name,
                contact: hostel.warden_contact,
                email: hostel.warden_email
            },
            pricing: {
                min_price: hostel.min_price,
                max_price: hostel.max_price,
                mess_fees: hostel.mess_fees,
                laundry_fees: hostel.laundry_fees,
                starting_from: hostel.min_price + hostel.mess_fees,
            }
        }));

        return Response.json({
            success: true,
            hostels: transformedData,
            metadata: {
                total_hostels: transformedData.length,
                fetched_at: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Hostels API Error:', error);
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

// Handle other HTTP methods gracefully
export async function POST() {
    return Response.json(
        { message: 'POST method not supported for hostels listing' },
        { status: 405 }
    );
}

export async function PUT() {
    return Response.json(
        { message: 'PUT method not supported for hostels listing' },
        { status: 405 }
    );
}

export async function DELETE() {
    return Response.json(
        { message: 'DELETE method not supported for hostels listing' },
        { status: 405 }
    );
}
