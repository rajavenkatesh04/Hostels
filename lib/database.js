import { supabase, handleSupabaseError } from './supabase'

// Fetch all hostels with their room types - this is a JOIN operation
export const getHostels = async (filters = {}) => {
    try {
        // We're using Supabase's relationship syntax here, which is incredibly powerful
        // The room_types(*) means "get all fields from related room_types records"
        let query = supabase
            .from('hostels')
            .select(`
        id,
        name,
        gender,
        description,
        warden_name,
        warden_phone,
        warden_email,
        address,
        latitude,
        longitude,
        total_floors,
        total_capacity,
        established_year,
        created_at,
        room_types(*)
      `)

        // Here's where we apply filters based on your enum types
        // Notice how we can filter on the parent table (hostels) or child table (room_types)
        if (filters.gender) {
            query = query.eq('gender', filters.gender)
        }

        // This is a more complex filter - we want hostels that have at least one room type
        // matching the AC preference. The room_types.ac_type syntax lets us filter
        // on the related table
        if (filters.ac_type) {
            query = query.eq('room_types.ac_type', filters.ac_type)
        }

        if (filters.washroom_type) {
            query = query.eq('room_types.washroom_type', filters.washroom_type)
        }

        // Filter by maximum annual fee - this shows how to work with decimal fields
        if (filters.max_fee) {
            query = query.lte('room_types.annual_fee', filters.max_fee)
        }

        // Order by capacity to show larger hostels first
        query = query.order('total_capacity', { ascending: false })

        const { data, error } = await query

        if (error) handleSupabaseError(error)

        // Here's an important data transformation step
        // We're calculating the minimum fee for each hostel to help with sorting and display
        const enrichedData = data?.map(hostel => ({
            ...hostel,
            min_annual_fee: hostel.room_types.length > 0
                ? Math.min(...hostel.room_types.map(rt => rt.annual_fee || 0))
                : 0,
            max_annual_fee: hostel.room_types.length > 0
                ? Math.max(...hostel.room_types.map(rt => rt.annual_fee || 0))
                : 0,
            room_type_count: hostel.room_types.length
        })) || []

        return enrichedData
    } catch (error) {
        console.error('Error fetching hostels:', error)
        return []
    }
}

// Fetch a single hostel with all its room types and calculated statistics
export const getHostelById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('hostels')
            .select(`
        *,
        room_types(*)
      `)
            .eq('id', id)
            .single()

        if (error) handleSupabaseError(error)

        // Let's add some useful calculations for the detail view
        if (data && data.room_types) {
            // Calculate total available rooms across all room types
            data.total_available_rooms = data.room_types.reduce(
                (sum, rt) => sum + (rt.available_rooms || 0), 0
            )

            // Calculate fee range
            const fees = data.room_types.map(rt => rt.annual_fee).filter(fee => fee > 0)
            data.fee_range = fees.length > 0 ? {
                min: Math.min(...fees),
                max: Math.max(...fees)
            } : null

            // Group room types by category for better organization
            data.room_types_by_category = data.room_types.reduce((acc, rt) => {
                const key = rt.room_category || 'Other'
                if (!acc[key]) acc[key] = []
                acc[key].push(rt)
                return acc
            }, {})
        }

        return data
    } catch (error) {
        console.error('Error fetching hostel:', error)
        return null
    }
}

// Get unique filter options - this is crucial for building dynamic filter interfaces
export const getFilterOptions = async () => {
    try {
        // Since gender, ac_type, and washroom_type are enums, we could hardcode them
        // But it's better to fetch from the database to stay flexible
        const { data: roomTypes, error } = await supabase
            .from('room_types')
            .select('room_category, ac_type, washroom_type, year_preference')

        if (error) handleSupabaseError(error)

        // Extract unique values for each filter type
        const categories = [...new Set(roomTypes?.map(rt => rt.room_category).filter(Boolean))]
        const acTypes = [...new Set(roomTypes?.map(rt => rt.ac_type).filter(Boolean))]
        const washroomTypes = [...new Set(roomTypes?.map(rt => rt.washroom_type).filter(Boolean))]
        const yearPreferences = [...new Set(roomTypes?.map(rt => rt.year_preference).filter(Boolean))]

        // For gender, we'll fetch from hostels table since it's stored there
        const { data: hostels, error: hostelError } = await supabase
            .from('hostels')
            .select('gender')

        if (hostelError) handleSupabaseError(hostelError)

        const genders = [...new Set(hostels?.map(h => h.gender).filter(Boolean))]

        return {
            genders,
            categories,
            acTypes,
            washroomTypes,
            yearPreferences
        }
    } catch (error) {
        console.error('Error fetching filter options:', error)
        return {
            genders: [],
            categories: [],
            acTypes: [],
            washroomTypes: [],
            yearPreferences: []
        }
    }
}