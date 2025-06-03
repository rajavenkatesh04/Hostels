import { getFilterOptions } from '@/lib/database'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const options = await getFilterOptions()

        return NextResponse.json({
            success: true,
            data: options
        })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch filter options' },
            { status: 500 }
        )
    }
}