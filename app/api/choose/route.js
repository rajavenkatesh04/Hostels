import { supabase, handleSupabaseError } from '@/lib/supabase'

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