import { supabase, handleSupabaseError } from '@/lib/supabase'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query || query.trim() === '') {
            return Response.json({
                success: true,
                hostels: []
            });
        }

        // Search hostels by name (case-insensitive)
        const { data, error } = await supabase
            .from('hostels')
            .select(`
                id,
                name,
                gender,
                branch,
                year_of_study,
                min_price,
                max_price
            `)
            .ilike('name', `%${query}%`)
            .limit(10);

        if (error) {
            handleSupabaseError(error);
            throw error;
        }

        return Response.json({
            success: true,
            hostels: data || []
        });

    } catch (error) {
        console.error('Search API Error:', error);
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