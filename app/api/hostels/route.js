// app/api/hostels/route.js
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
    const { data, error } = await supabase
        .from('hostels')
        .select(`
      id,
      name,
      description,
      gender,
      address,
      latitude,
      longitude,
      room_types (
        id,
        room_category,
        ac_type,
        washroom_type,
        annual_fee,
        available_rooms
      )
    `)
        .gt('room_types.available_rooms', 0);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}