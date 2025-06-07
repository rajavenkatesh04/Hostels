import { supabase, handleSupabaseError } from '@/lib/supabase'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { gender, yearOfStudy, branch, acType, washroomType, sharing } = req.body;

        // Enhanced validation to include branch
        // This ensures we don't waste database calls with incomplete data
        if (!gender || !yearOfStudy || !branch || !acType || !washroomType || !sharing) {
            return res.status(400).json({
                message: 'All filter criteria are required',
                received: req.body,
                required: ['gender', 'yearOfStudy', 'branch', 'acType', 'washroomType', 'sharing']
            });
        }

        // Convert frontend values to database enum values
        // The branch value should already match your enum format from the frontend
        const genderEnum = gender === 'boys' ? 'male' : 'female';
        const yearEnum = `${yearOfStudy}${yearOfStudy === '1' ? 'st' : yearOfStudy === '2' ? 'nd' : yearOfStudy === '3' ? 'rd' : 'th'}_year`;
        const occupancyLimit = parseInt(sharing);
        const branchEnum = branch; // Assuming frontend sends the correct enum value

        // Enhanced Supabase query with branch filtering and UUID inclusion
        // Notice how we're now filtering by branch as well
        const { data: results, error } = await supabase
            .from('hostel_rooms')
            .select(`
                *,
                hostels!inner(
                    id,
                    name,
                    description,
                    year_of_study,
                    gender,
                    branch,
                    warden_name,
                    warden_contact,
                    warden_email,
                    min_price,
                    max_price,
                    mess_fees
                )
            `)
            // All our filter conditions including the new branch filter
            .eq('hostels.gender', genderEnum)
            .eq('hostels.year_of_study', yearEnum)
            .eq('hostels.branch', branchEnum)  // New branch filter
            .eq('ac_type', acType)
            .eq('washroom_type', washroomType)
            .eq('occupancy', occupancyLimit)
            .order('price', { ascending: true });

        if (error) {
            handleSupabaseError(error);
        }

        // Enhanced transformation to include UUIDs and branch information
        const transformedResults = results.map(row => ({
            // Include both room and hostel UUIDs for future tracing
            room_id: row.id,           // Room UUID for specific room tracking
            hostel_id: row.hostels.id, // Hostel UUID for hostel-level operations

            hostels: {
                name: row.hostels.name,
                description: row.hostels.description,
                branch: row.hostels.branch,  // Include branch information
                warden_name: row.hostels.warden_name,
                warden_contact: row.hostels.warden_contact,
                warden_email: row.hostels.warden_email
            },

            // Room-specific information
            annual_fee: row.price,
            ac_type: row.ac_type,
            washroom_type: row.washroom_type,
            occupancy_limit: row.occupancy,

            // Inherited from hostel
            year_of_study: row.hostels.year_of_study,
            gender: row.hostels.gender,
            branch: row.hostels.branch,
            mess_fees: row.hostels.mess_fees
        }));

        return res.status(200).json({
            success: true,
            results: transformedResults,
            count: transformedResults.length,
            filters_applied: {
                gender: genderEnum,
                yearOfStudy: yearEnum,
                branch: branchEnum,  // Include branch in response
                acType,
                washroomType,
                sharing: occupancyLimit
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// App Router version with the same enhancements
export async function POST(request) {
    try {
        const body = await request.json();
        const { gender, yearOfStudy, branch, acType, washroomType, sharing } = body;

        // Enhanced validation
        if (!gender || !yearOfStudy || !branch || !acType || !washroomType || !sharing) {
            return Response.json(
                {
                    message: 'All filter criteria are required',
                    required: ['gender', 'yearOfStudy', 'branch', 'acType', 'washroomType', 'sharing']
                },
                { status: 400 }
            );
        }

        // Same conversion logic with branch
        const genderEnum = gender === 'boys' ? 'male' : 'female';
        const yearEnum = `${yearOfStudy}${yearOfStudy === '1' ? 'st' : yearOfStudy === '2' ? 'nd' : yearOfStudy === '3' ? 'rd' : 'th'}_year`;
        const occupancyLimit = parseInt(sharing);
        const branchEnum = branch;

        // Enhanced query with branch filtering
        const { data: results, error } = await supabase
            .from('hostel_rooms')
            .select(`
                *,
                hostels!inner(
                    id,
                    name,
                    description,
                    year_of_study,
                    gender,
                    branch,
                    warden_name,
                    warden_contact,
                    warden_email,
                    min_price,
                    max_price,
                    mess_fees
                )
            `)
            .eq('hostels.gender', genderEnum)
            .eq('hostels.year_of_study', yearEnum)
            .eq('hostels.branch', branchEnum)
            .eq('ac_type', acType)
            .eq('washroom_type', washroomType)
            .eq('occupancy', occupancyLimit)
            .order('price', { ascending: true });

        if (error) {
            handleSupabaseError(error);
        }

        // Enhanced transformation with UUIDs
        const transformedResults = results.map(row => ({
            room_id: row.id,
            hostel_id: row.hostels.id,
            hostels: {
                name: row.hostels.name,
                description: row.hostels.description,
                branch: row.hostels.branch,
                warden_name: row.hostels.warden_name,
                warden_contact: row.hostels.warden_contact,
                warden_email: row.hostels.warden_email
            },
            annual_fee: row.price,
            ac_type: row.ac_type,
            washroom_type: row.washroom_type,
            occupancy_limit: row.occupancy,
            year_of_study: row.hostels.year_of_study,
            gender: row.hostels.gender,
            branch: row.hostels.branch,
            mess_fees: row.hostels.mess_fees
        }));

        return Response.json({
            success: true,
            results: transformedResults,
            count: transformedResults.length,
            filters_applied: {
                gender: genderEnum,
                yearOfStudy: yearEnum,
                branch: branchEnum,
                acType,
                washroomType,
                sharing: occupancyLimit
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        return Response.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}