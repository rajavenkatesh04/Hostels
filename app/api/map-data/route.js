import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('hostels')
            .select('id, name, gender, latitude, longitude');

        if (error) throw error;

        return Response.json({
            success: true,
            hostels: data.filter(h => h.latitude && h.longitude) // Only return hostels with coordinates
        });
    } catch (error) {
        return Response.json({
            success: false,
            message: 'Failed to fetch hostel map data'
        }, { status: 500 });
    }
}