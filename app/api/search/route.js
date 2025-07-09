// /api/search/route.js
import { supabase, handleSupabaseError } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const limit = parseInt(searchParams.get('limit')) || 10;

        if (!query || query.trim() === '') {
            return Response.json({
                success: true,
                hostels: [],
                suggestions: [
                    'Try searching for "boys hostel"',
                    'Search by branch like "CSE"',
                    'Look for amenities like "AC rooms"',
                    'Search by year like "2nd year"'
                ]
            });
        }

        // Clean and prepare search term
        const searchTerm = query.trim().toLowerCase();

        // Instead of complex OR queries with type casting, let's fetch all hostels
        // and do intelligent filtering in JavaScript. This is more reliable and
        // gives us better control over the matching logic.
        const { data, error } = await supabase
            .from('hostels')
            .select(`
                id,
                name,
                description,
                gender,
                branch,
                year_of_study,
                warden_name,
                warden_contact,
                warden_email,
                min_price,
                max_price,
                mess_fees,
                laundry_fees,
                plus_code,
                hostel_rooms (
                    id,
                    washroom_type,
                    occupancy,
                    ac_type,
                    price,
                    notes
                )
            `);

        if (error) {
            handleSupabaseError(error);
            throw error;
        }

        // Now we'll do the intelligent search filtering in JavaScript
        // This approach is more reliable and gives us complete control
        const matchingHostels = (data || []).filter(hostel => {
            // Convert all searchable fields to lowercase for case-insensitive matching
            const searchableText = [
                hostel.name,
                hostel.description,
                hostel.gender,
                hostel.branch,
                hostel.year_of_study,
                hostel.warden_name
            ].join(' ').toLowerCase();

            // Basic text matching - if the search term appears anywhere
            if (searchableText.includes(searchTerm)) {
                return true;
            }

            // Handle common gender search variations
            const genderVariations = {
                'girl': ['female'],
                'girls': ['female'],
                'women': ['female'],
                'female': ['female'],
                'boy': ['male'],
                'boys': ['male'],
                'men': ['male'],
                'male': ['male']
            };

            if (genderVariations[searchTerm]) {
                return genderVariations[searchTerm].some(variation =>
                    hostel.gender.toLowerCase().includes(variation)
                );
            }

            // Handle year-based searches with flexible patterns
            const yearMatch = searchTerm.match(/(\d+)(?:st|nd|rd|th)?\s*year|year\s*(\d+)|^(\d+)$/);
            if (yearMatch) {
                const year = yearMatch[1] || yearMatch[2] || yearMatch[3];
                return hostel.year_of_study.toLowerCase().includes(year);
            }

            // Handle room amenity searches
            if (hostel.hostel_rooms) {
                // Check for AC-related searches
                if (searchTerm.includes('ac') || searchTerm.includes('air condition')) {
                    return hostel.hostel_rooms.some(room =>
                        room.ac_type.toLowerCase().includes('ac')
                    );
                }

                // Check for washroom-related searches
                if (searchTerm.includes('attached') || searchTerm.includes('private')) {
                    return hostel.hostel_rooms.some(room =>
                        room.washroom_type.toLowerCase().includes('attached')
                    );
                }

                if (searchTerm.includes('common') || searchTerm.includes('shared')) {
                    return hostel.hostel_rooms.some(room =>
                        room.washroom_type.toLowerCase().includes('common')
                    );
                }

                // Check for occupancy-related searches
                if (searchTerm.includes('single')) {
                    return hostel.hostel_rooms.some(room => room.occupancy === 1);
                }

                if (searchTerm.includes('double')) {
                    return hostel.hostel_rooms.some(room => room.occupancy === 2);
                }

                if (searchTerm.includes('triple')) {
                    return hostel.hostel_rooms.some(room => room.occupancy === 3);
                }
            }

            // Handle price-based searches
            if (searchTerm.includes('cheap') || searchTerm.includes('budget') || searchTerm.includes('low')) {
                return hostel.min_price <= 15000;
            }

            if (searchTerm.includes('expensive') || searchTerm.includes('premium') || searchTerm.includes('high')) {
                return hostel.min_price >= 25000;
            }

            return false;
        });

        // Now let's add intelligent ranking to the matching results
        const processedResults = matchingHostels.map(hostel => {
            let relevanceScore = 0;
            const lowerName = hostel.name.toLowerCase();
            const lowerDesc = hostel.description.toLowerCase();
            const lowerGender = hostel.gender.toLowerCase();
            const lowerBranch = hostel.branch.toLowerCase();
            const lowerWarden = hostel.warden_name.toLowerCase();

            // Scoring system: exact matches get highest priority
            if (lowerName === searchTerm) relevanceScore += 100;
            else if (lowerName.includes(searchTerm)) relevanceScore += 80;

            // Gender matches are very important for user experience
            if (lowerGender.includes(searchTerm)) relevanceScore += 70;

            // Handle common gender search variations with high scores
            if ((searchTerm.includes('girl') || searchTerm.includes('female') || searchTerm.includes('women')) && lowerGender.includes('female')) {
                relevanceScore += 60;
            }
            if ((searchTerm.includes('boy') || searchTerm.includes('male') || searchTerm.includes('men')) && lowerGender.includes('male')) {
                relevanceScore += 60;
            }

            // Branch matches are also high priority
            if (lowerBranch.includes(searchTerm)) relevanceScore += 50;

            // Description matches provide context
            if (lowerDesc.includes(searchTerm)) relevanceScore += 30;

            // Warden name matches
            if (lowerWarden.includes(searchTerm)) relevanceScore += 20;

            // Year matching with flexible patterns
            const yearMatch = searchTerm.match(/(\d+)(?:st|nd|rd|th)?\s*year|year\s*(\d+)|^(\d+)$/);
            if (yearMatch) {
                const year = yearMatch[1] || yearMatch[2] || yearMatch[3];
                if (hostel.year_of_study.toLowerCase().includes(year)) {
                    relevanceScore += 40;
                }
            }

            // Extract and analyze room amenities for enhanced search
            const roomAmenities = {
                hasAC: hostel.hostel_rooms?.some(room => room.ac_type === 'AC') || false,
                hasNonAC: hostel.hostel_rooms?.some(room => room.ac_type === 'Non-AC') || false,
                hasAttachedWashroom: hostel.hostel_rooms?.some(room => room.washroom_type === 'Attached') || false,
                hasCommonWashroom: hostel.hostel_rooms?.some(room => room.washroom_type === 'Common') || false,
                occupancyTypes: [...new Set(hostel.hostel_rooms?.map(room => room.occupancy) || [])],
                priceRange: {
                    min: hostel.hostel_rooms?.length > 0
                        ? Math.min(...hostel.hostel_rooms.map(room => room.price))
                        : hostel.min_price,
                    max: hostel.hostel_rooms?.length > 0
                        ? Math.max(...hostel.hostel_rooms.map(room => room.price))
                        : hostel.max_price
                }
            };

            // Amenity-based scoring for enhanced user experience
            if (searchTerm.includes('ac') && roomAmenities.hasAC) relevanceScore += 45;
            if (searchTerm.includes('non-ac') && roomAmenities.hasNonAC) relevanceScore += 45;
            if (searchTerm.includes('attached') && roomAmenities.hasAttachedWashroom) relevanceScore += 40;
            if (searchTerm.includes('common') && roomAmenities.hasCommonWashroom) relevanceScore += 40;
            if (searchTerm.includes('single') && roomAmenities.occupancyTypes.includes(1)) relevanceScore += 35;
            if (searchTerm.includes('double') && roomAmenities.occupancyTypes.includes(2)) relevanceScore += 35;
            if (searchTerm.includes('triple') && roomAmenities.occupancyTypes.includes(3)) relevanceScore += 35;

            // Price-based intelligent matching
            if (searchTerm.includes('cheap') || searchTerm.includes('low') || searchTerm.includes('budget')) {
                if (hostel.min_price <= 15000) relevanceScore += 25;
            }
            if (searchTerm.includes('expensive') || searchTerm.includes('high') || searchTerm.includes('premium')) {
                if (hostel.min_price >= 25000) relevanceScore += 25;
            }

            return {
                id: hostel.id,
                name: hostel.name,
                description: hostel.description,
                gender: hostel.gender,
                branch: hostel.branch,
                year_of_study: hostel.year_of_study,
                warden: {
                    name: hostel.warden_name,
                    contact: hostel.warden_contact,
                    email: hostel.warden_email
                },
                pricing: {
                    min_price: hostel.min_price,
                    max_price: hostel.max_price,
                    mess_fees: hostel.mess_fees,
                    laundry_fees: hostel.laundry_fees
                },
                plus_code: hostel.plus_code,
                amenities: roomAmenities,
                relevanceScore,
                // Add match context for potential highlighting in the UI
                matchContext: {
                    nameMatch: lowerName.includes(searchTerm),
                    descriptionMatch: lowerDesc.includes(searchTerm),
                    genderMatch: lowerGender.includes(searchTerm),
                    branchMatch: lowerBranch.includes(searchTerm),
                    wardenMatch: lowerWarden.includes(searchTerm)
                }
            };
        });

        // Sort by relevance score to show most relevant results first
        processedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

        // Apply the limit after sorting by relevance
        const limitedResults = processedResults.slice(0, limit);

        return Response.json({
            success: true,
            hostels: limitedResults,
            metadata: {
                total_matches: processedResults.length,
                returned_results: limitedResults.length,
                search_term: query,
                searched_at: new Date().toISOString()
            }
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