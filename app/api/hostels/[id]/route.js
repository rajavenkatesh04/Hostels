// app/api/hostels/[id]/route.js
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { id } = params;
    const { data, error } = await supabase
        .from('hostels')
        .select(`
      id,
      name,
      description,
      gender,
      warden_name,
      warden_phone,
      warden_email,
      address,
      latitude,
      longitude,
      total_floors,
      total_capacity,
      established_year,
      room_types (
        id,
        room_category,
        ac_type,
        washroom_type,
        year_preference,
        annual_fee,
        security_deposit,
        available_rooms,
        occupancy_limit,
        room_size_sqft
      )
    `)
        .eq('id', id)
        .single();

    if (error || !data) {
        return NextResponse.json({ error: 'Hostel not found' }, { status: 404 });
    }

    return NextResponse.json(data);
}