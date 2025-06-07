import { supabase, handleSupabaseError } from '@/lib/supabase'

// Helper function to convert database enum to user-friendly names
// This centralizes the mapping logic and makes it easy to update labels
function formatBranchName(branch) {
    const branchMap = {
        'kattankulathur_chennai': 'Kattankulathur, Chennai',
        'ramapuram_chennai': 'Ramapuram, Chennai',
        'vadapalani_chennai': 'Vadapalani, Chennai',
        'tiruchirappalli': 'Tiruchirappalli',
        'delhi_ncr': 'Delhi NCR',
        'baburayanpettai_chengalpattu': 'Baburayanpettai, Chengalpattu'
    };

    return branchMap[branch] || branch;
}

export async function GET() {
    try {
        // Query only branches that have actual hostels available
        // This prevents showing empty options to users
        const { data: branches, error } = await supabase
            .from('hostels')
            .select('branch')
            .not('branch', 'is', null); // Ensure we exclude any null values

        if (error) {
            handleSupabaseError(error);
        }

        // Extract unique branch values to avoid duplicates
        // Using Set ensures each branch appears only once
        const uniqueBranches = [...new Set(branches.map(item => item.branch))];

        // Transform database values into frontend-friendly format
        const branchOptions = uniqueBranches.map(branch => ({
            value: branch,           // This matches your enum values
            label: formatBranchName(branch)  // This shows user-friendly names
        }));

        return Response.json({
            success: true,
            branches: branchOptions
        });

    } catch (error) {
        console.error('Branches API Error:', error);
        return Response.json(
            {
                message: 'Failed to fetch branches',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}