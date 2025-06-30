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

        // Convert to database values
        const genderEnum = gender === 'boys' ? 'male' : 'female';
        const yearEnum = `${yearOfStudy}${yearOfStudy === '1' ? 'st' : yearOfStudy === '2' ? 'nd' : yearOfStudy === '3' ? 'rd' : 'th'}_year`;
        const occupancyLimit = parseInt(sharing);
        const branchEnum = branch;

        // 1. First try exact match query
        const { data: exactResults, error: exactError } = await supabase
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

        if (exactError) {
            handleSupabaseError(exactError);
        }

        // If we have exact matches, return them
        if (exactResults && exactResults.length > 0) {
            return Response.json({
                success: true,
                results: transformResults(exactResults),
                count: exactResults.length,
                match_type: 'exact',
                filters_applied: body
            });
        }

        // 2. If no exact matches, try partial matches (only relax AC, washroom, and sharing)
        const { data: partialResults, error: partialError } = await supabase
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
            // Strict requirements (non-negotiable)
            .eq('hostels.gender', genderEnum)
            .eq('hostels.year_of_study', yearEnum)
            .eq('hostels.branch', branchEnum)
            // Relaxable requirements (any combination)
            .or(`ac_type.eq.${acType},washroom_type.eq.${washroomType},occupancy.eq.${occupancyLimit}`)
            .order('price', { ascending: true })
            .limit(10); // Limit to top 10 partial matches

        if (partialError) {
            handleSupabaseError(partialError);
        }

        // Calculate match score for each partial result (only considering relaxable filters)
        const partialWithScores = (partialResults || []).map(result => {
            let score = 0;
            if (result.ac_type === acType) score += 1;
            if (result.washroom_type === washroomType) score += 1;
            if (result.occupancy === occupancyLimit) score += 1;

            return {
                ...result,
                match_score: score,
                matched_filters: {
                    ac_type: result.ac_type === acType,
                    washroom_type: result.washroom_type === washroomType,
                    occupancy: result.occupancy === occupancyLimit
                }
            };
        }).sort((a, b) => b.match_score - a.match_score); // Sort by highest score first

        return Response.json({
            success: true,
            results: transformResults(partialWithScores),
            count: partialWithScores.length,
            match_type: partialWithScores.length > 0 ? 'partial' : 'none',
            filters_applied: body
        });

    } catch (error) {
        console.error('API Error:', error);
        return Response.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Helper function to transform results
function transformResults(results) {
    return results.map(row => ({
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
        mess_fees: row.hostels.mess_fees,
        // Additional fields for partial matches
        ...(row.match_score !== undefined && {
            match_score: row.match_score,
            matched_filters: row.matched_filters
        })
    }));
}