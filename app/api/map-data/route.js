import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('hostels')
            .select('id, name, gender, plus_code')
            .not('plus_code', 'is', null)
            .eq('year_of_study', '1st_year'); // TEMP-FY26: only 1st-year booking open

        if (error) throw error;

        return Response.json({
            success: true,
            hostels: data
        });
    } catch (error) {
        console.error('Error in map-data API:', error);
        return Response.json({
            success: false,
            message: error.message || 'Failed to fetch hostel map data'
        }, { status: 500 });
    }
}