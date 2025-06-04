import { supabase, handleSupabaseError } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        // First, let's understand what we're doing here
        // We want to fetch hostels AND their related room types in one go
        // This is called a "join" - we're joining two tables together

        const { data: hostels, error } = await supabase
            .from('hostels')
            .select(`
        *,
        room_types (
          room_category,
          ac_type,
          washroom_type,
          annual_fee,
          available_rooms,
          occupancy_limit
        )
      `)
            .order('name') // Sort hostels alphabetically

        if (error) {
            handleSupabaseError(error)
        }

        // Let's also add some processing to make the data easier to work with
        const processedHostels = hostels.map(hostel => ({
            ...hostel,
            // Create a summary of available room features for easy badge display
            availableFeatures: {
                hasAC: hostel.room_types.some(room => room.ac_type === 'ac'),
                hasNonAC: hostel.room_types.some(room => room.ac_type === 'non_ac'),
                hasAttached: hostel.room_types.some(room => room.washroom_type === 'attached'),
                hasCommon: hostel.room_types.some(room => room.washroom_type === 'common')
            },
            // Find the price range
            priceRange: {
                min: Math.min(...hostel.room_types.map(room => room.annual_fee)),
                max: Math.max(...hostel.room_types.map(room => room.annual_fee))
            }
        }))

        return NextResponse.json({
            hostels: processedHostels,
            total: processedHostels.length
        })

    } catch (error) {
        console.error('Error fetching hostels:', error)
        return NextResponse.json(
            { error: 'Failed to fetch hostels' },
            { status: 500 }
        )
    }
}