// app/api/hostels/route.js
import { getHostels } from '@/lib/database'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)

        // Extract all possible filter parameters
        // Notice how we're being explicit about type conversion for numeric values
        const filters = {
            gender: searchParams.get('gender'),
            ac_type: searchParams.get('ac_type'),
            washroom_type: searchParams.get('washroom_type'),
            room_category: searchParams.get('room_category'),
            max_fee: searchParams.get('max_fee') ? parseFloat(searchParams.get('max_fee')) : null,
            year_preference: searchParams.get('year_preference')
        }

        // Clean up the filters object - remove null/undefined values
        // This prevents unnecessary WHERE clauses in our database query
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== null && value !== '')
        )

        console.log('Applied filters:', cleanFilters) // Helpful for debugging

        const hostels = await getHostels(cleanFilters)

        return NextResponse.json({
            success: true,
            data: hostels,
            count: hostels.length,
            filters_applied: cleanFilters // Include this for debugging on the frontend
        })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch hostels' },
            { status: 500 }
        )
    }
}