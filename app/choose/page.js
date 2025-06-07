"use client"

import React, { useState, useEffect } from 'react';
import {
    Mars,
    Venus,
    Snowflake,
    Sun,
    Home,
    Users as UsersIcon,
    MapPin,
    IndianRupee,
    GraduationCap,
    BookOpen,
    Award,
    Trophy,
    Building2
} from 'lucide-react';

export default function HostelFilter() {
    const [currentStep, setCurrentStep] = useState(0);
    const [selections, setSelections] = useState({
        gender: '',
        branch: '',
        yearOfStudy: '',
        acType: '',
        washroomType: '',
        sharing: ''
    });
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // New state for managing branch options fetched from API
    const [branchOptions, setBranchOptions] = useState([]);
    const [isFetchingBranches, setIsFetchingBranches] = useState(false);

    // Enhanced filter configuration with branch step added after gender
    const filterSteps = [
        {
            id: 'gender',
            title: 'Let\'s start with the basics...',
            subtitle: 'Who will be staying at the hostel?',
            storyText: 'First, we need to know whether you\'re looking for a boys\' or girls\' hostel. This ensures we find accommodations that match your comfort and safety preferences.',
            options: [
                { value: 'boys', label: 'Boys Hostel', icon: Mars, color: 'bg-blue-500 hover:bg-blue-600' },
                { value: 'girls', label: 'Girls Hostel', icon: Venus, color: 'bg-pink-500 hover:bg-pink-600' }
            ]
        },
        {
            id: 'branch',
            title: 'Great! Now let\'s talk location...',
            subtitle: 'Which campus branch are you looking for?',
            storyText: 'Different branches offer different experiences and conveniences. Consider factors like proximity to your classes, local amenities, transportation options, and the campus culture when making your choice.',
            // Options will be populated dynamically from the API
            // This ensures we always show current, available branches
            options: branchOptions
        },
        {
            id: 'yearOfStudy',
            title: 'Tell us about your academic journey...',
            subtitle: 'Which year of study are you in?',
            storyText: 'Many hostels have specific arrangements for different academic years. First-year students often get priority in certain hostels with more guidance and support, while senior students might prefer hostels with more independence and flexibility.',
            options: [
                { value: '1', label: '1st Year', icon: BookOpen, color: 'bg-green-500 hover:bg-green-600' },
                { value: '2', label: '2nd Year', icon: GraduationCap, color: 'bg-yellow-500 hover:bg-yellow-600' },
                { value: '3', label: '3rd Year', icon: Award, color: 'bg-purple-500 hover:bg-purple-600' },
                { value: '4', label: '4th Year', icon: Trophy, color: 'bg-red-500 hover:bg-red-600' }
            ]
        },
        {
            id: 'acType',
            title: 'Now, let\'s talk comfort...',
            subtitle: 'What\'s your temperature preference?',
            storyText: 'Climate control significantly affects your daily comfort and study environment. Air-conditioned rooms provide consistent temperature but cost more, while non-AC rooms are more economical and some students prefer the natural airflow.',
            options: [
                { value: 'ac', label: 'Air Conditioned', icon: Snowflake, color: 'bg-cyan-500 hover:bg-cyan-600' },
                { value: 'non_ac', label: 'Non AC (Natural)', icon: Sun, color: 'bg-orange-500 hover:bg-orange-600' }
            ]
        },
        {
            id: 'washroomType',
            title: 'Privacy matters...',
            subtitle: 'How do you prefer your bathroom setup?',
            storyText: 'Your bathroom preference affects both privacy and convenience. Attached bathrooms offer complete privacy and convenience but are pricier, while shared bathrooms are more economical and can be quite well-maintained in good hostels.',
            options: [
                { value: 'attached', label: 'Private Bathroom', icon: Home, color: 'bg-green-500 hover:bg-green-600' },
                { value: 'common', label: 'Shared Bathroom', icon: UsersIcon, color: 'bg-purple-500 hover:bg-purple-600' }
            ]
        },
        {
            id: 'sharing',
            title: 'Finally, your social preference...',
            subtitle: 'How many roommates would you like?',
            storyText: 'The number of roommates affects both cost and your living experience. More roommates usually means lower individual cost and more social interaction, while fewer roommates provide more personal space and quiet study time.',
            options: [
                { value: '2', label: '2 Person Sharing', icon: UsersIcon, color: 'bg-teal-500 hover:bg-teal-600' },
                { value: '3', label: '3 Person Sharing', icon: UsersIcon, color: 'bg-amber-500 hover:bg-amber-600' },
                { value: '4', label: '4 Person Sharing', icon: UsersIcon, color: 'bg-red-500 hover:bg-red-600' }
            ]
        }
    ];

    // Fetch branch options when gender is selected
    // This approach ensures we only load branches when needed, improving performance
    useEffect(() => {
        const fetchBranches = async () => {
            if (!selections.gender) return; // Only fetch when gender is selected

            setIsFetchingBranches(true);
            try {
                const response = await fetch('/api/branches');
                if (response.ok) {
                    const data = await response.json();
                    // Transform API response into the format expected by our options
                    const formattedBranches = data.branches.map(branch => ({
                        value: branch.value,
                        label: branch.label,
                        icon: Building2, // Use consistent icon for all branches
                        color: 'bg-indigo-500 hover:bg-indigo-600' // Consistent color theme
                    }));
                    setBranchOptions(formattedBranches);
                } else {
                    console.error('Failed to fetch branches:', response.statusText);
                    // Fallback options in case API fails
                    setBranchOptions([
                        { value: 'kattankulathur_chennai', label: 'Kattankulathur, Chennai', icon: Building2, color: 'bg-indigo-500 hover:bg-indigo-600' }
                    ]);
                }
            } catch (error) {
                console.error('Error fetching branches:', error);
                // Provide fallback options so the user isn't stuck
                setBranchOptions([
                    { value: 'kattankulathur_chennai', label: 'Kattankulathur, Chennai', icon: Building2, color: 'bg-indigo-500 hover:bg-indigo-600' }
                ]);
            } finally {
                setIsFetchingBranches(false);
            }
        };

        fetchBranches();
    }, [selections.gender]); // Trigger when gender selection changes

    // Check if all selections are complete
    const isAllComplete = Object.values(selections).every(value => value !== '');

    // Handle selection and determine next step
    const handleSelection = (filterType, value) => {
        const newSelections = {
            ...selections,
            [filterType]: value
        };
        setSelections(newSelections);

        // Move to next step after a brief delay for better UX
        // This gives users visual feedback that their choice was registered
        if (currentStep < filterSteps.length - 1) {
            setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 300);
        }
    };

    // Enhanced API call that includes branch in the request
    useEffect(() => {
        const makeApiCall = async () => {
            if (!isAllComplete) return;

            setIsLoading(true);
            try {
                // Now includes branch in the API call
                const response = await fetch('/api/choose', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(selections),
                });

                if (response.ok) {
                    const data = await response.json();
                    setResults(data.results || []);

                    // Development mode logging for tracing specific results
                    // This helps with debugging and can be removed in production
                    if (process.env.NODE_ENV === 'development') {
                        console.log('API Response:', data);
                        console.log('Applied Filters:', data.filters_applied);
                        if (data.results?.length > 0) {
                            console.log('Sample result with UUIDs:', {
                                room_id: data.results[0].room_id,
                                hostel_id: data.results[0].hostel_id
                            });
                        }
                    }
                } else {
                    console.error('API call failed:', response.statusText);
                    setResults([]);
                }
            } catch (error) {
                console.error('Error making API call:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        makeApiCall();
    }, [selections, isAllComplete]);

    // Function to directly edit a selection without collapsing other steps
    // This is the key improvement - users can modify any step at any time
    const handleDirectEdit = (filterType, value) => {
        const newSelections = {
            ...selections,
            [filterType]: value
        };

        // If user is editing an earlier step, clear all subsequent selections
        // This ensures data consistency - if they change gender, branch should be reselected
        const stepIds = filterSteps.map(step => step.id);
        const editingStepIndex = stepIds.indexOf(filterType);

        for (let i = editingStepIndex + 1; i < stepIds.length; i++) {
            newSelections[stepIds[i]] = '';
        }

        setSelections(newSelections);

        // Move current step to the next incomplete step
        const nextIncompleteStep = stepIds.findIndex((stepId, index) =>
            index > editingStepIndex && !newSelections[stepId]
        );

        if (nextIncompleteStep !== -1) {
            setCurrentStep(nextIncompleteStep);
        } else {
            setCurrentStep(editingStepIndex + 1);
        }

        // Clear results when editing earlier steps
        setResults([]);
    };

    // Progress bar component - now more accurate with branch step included
    const ProgressBar = ({ currentStep, totalSteps }) => {
        const progress = ((currentStep + 1) / totalSteps) * 100;
        return (
            <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
                <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        );
    };

    // Enhanced component to show all completed steps in an always-visible format
    // This is the major UX improvement - everything stays visible and editable
    const CompletedSteps = () => (
        <div className="space-y-4 mb-8">
            {filterSteps.map((step, index) => {
                const selectedOption = step.options.find(opt => opt.value === selections[step.id]);
                const IconComponent = selectedOption?.icon;
                const isCompleted = selections[step.id] !== '';
                const isCurrentStep = index === currentStep;

                // Show all steps, but style them differently based on their state
                return (
                    <div
                        key={step.id}
                        className={`border-2 rounded-lg p-4 transition-all duration-300 ${
                            isCurrentStep
                                ? 'border-blue-500 bg-blue-50 shadow-lg'
                                : isCompleted
                                    ? 'border-green-200 bg-green-50 hover:bg-green-100'
                                    : 'border-gray-200 bg-gray-50'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                    isCompleted
                                        ? 'bg-green-500 text-white'
                                        : isCurrentStep
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-300 text-gray-600'
                                }`}>
                                    {isCompleted ? '✓' : index + 1}
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${
                                        isCurrentStep ? 'text-blue-800' : isCompleted ? 'text-green-800' : 'text-gray-600'
                                    }`}>
                                        {step.subtitle}
                                    </p>
                                    {isCompleted && (
                                        <div className="flex items-center space-x-2 mt-1">
                                            {IconComponent && <IconComponent size={16} className="text-green-600" />}
                                            <span className="text-green-700 font-semibold">{selectedOption?.label}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {isCompleted && !isCurrentStep && (
                                <button
                                    onClick={() => setCurrentStep(index)}
                                    className="text-green-600 text-sm hover:text-green-800 hover:underline"
                                >
                                    Edit
                                </button>
                            )}
                        </div>

                        {/* Show options for current step or if user wants to edit */}
                        {(isCurrentStep || (!isCompleted && index <= currentStep)) && (
                            <div>
                                {/* Show loading state for branch options */}
                                {step.id === 'branch' && isFetchingBranches ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mr-3"></div>
                                        <span className="text-blue-600">Loading campus branches...</span>
                                    </div>
                                ) : (
                                    <>
                                        {/* Story text for context */}
                                        <div className="mb-4 p-3 bg-white rounded-lg border">
                                            <p className="text-blue-800 text-sm leading-relaxed">
                                                {step.storyText}
                                            </p>
                                        </div>

                                        {/* Options grid */}
                                        <div className={`grid gap-3 ${
                                            step.options.length <= 2
                                                ? 'grid-cols-1 sm:grid-cols-2'
                                                : step.options.length <= 4
                                                    ? 'grid-cols-2 lg:grid-cols-4'
                                                    : 'grid-cols-2 lg:grid-cols-3'
                                        }`}>
                                            {step.options.map((option) => {
                                                const IconComponent = option.icon;
                                                const isSelected = selections[step.id] === option.value;

                                                return (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => handleDirectEdit(step.id, option.value)}
                                                        className={`group relative p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                                                            isSelected
                                                                ? `${option.color} text-white border-transparent shadow-lg`
                                                                : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700'
                                                        }`}
                                                    >
                                                        <div className="flex flex-col items-center space-y-2">
                                                            <IconComponent
                                                                size={32}
                                                                className={`transition-transform duration-300 ${
                                                                    isSelected ? 'transform rotate-12' : 'group-hover:transform group-hover:scale-110'
                                                                }`}
                                                            />
                                                            <span className="font-medium text-sm text-center">
                                                                {option.label}
                                                            </span>
                                                        </div>
                                                        {isSelected && (
                                                            <div className="absolute top-2 right-2 w-5 h-5 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="w-full max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Find Your Perfect Hostel
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We'll guide you through a few simple questions to find the ideal accommodation. All your choices remain visible and easily editable!
                    </p>
                </div>

                {/* Progress bar */}
                <ProgressBar currentStep={currentStep} totalSteps={filterSteps.length} />

                {/* All steps in always-visible format */}
                <CompletedSteps />

                {/* Loading indicator */}
                {isLoading && isAllComplete && (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fadeIn">
                        <div className="flex items-center justify-center text-blue-600 mb-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent mr-4"></div>
                            <span className="text-xl font-semibold">Searching for your perfect hostels...</span>
                        </div>
                        <p className="text-gray-600">We're matching your preferences with our database</p>
                    </div>
                )}

                {/* Enhanced results section with UUID information for dev mode */}
                {results.length > 0 && !isLoading && (
                    <div className="bg-white rounded-xl shadow-lg p-8 animate-fadeIn">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                🎉 Excellent! We found {results.length} perfect matches
                            </h2>
                            <p className="text-gray-600">Here are hostels that match all your preferences</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map((result) => (
                                <div key={result.room_id} className="border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-gray-800 flex-1 line-clamp-2">
                                            {result.hostels?.name || 'Hostel Name'}
                                        </h3>
                                    </div>

                                    <div className="flex items-center justify-center text-green-600 font-bold text-2xl mb-4 bg-green-50 rounded-lg py-3">
                                        <IndianRupee size={24} />
                                        <span>{result.annual_fee?.toLocaleString() || 'Contact'}</span>
                                    </div>

                                    {/* Branch information prominently displayed */}
                                    <div className="flex items-center justify-center text-indigo-600 font-medium text-sm mb-4 bg-indigo-50 rounded-lg py-2">
                                        <Building2 size={16} className="mr-2" />
                                        <span>{result.hostels?.branch?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Campus Branch'}</span>
                                    </div>

                                    <div className="space-y-3 text-sm text-gray-600 mb-6">
                                        <div className="flex justify-between items-center">
                                            <span>Year Preference:</span>
                                            <span className="font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                                {result.year_of_study?.replace('_', ' ') || 'All Years'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Room Type:</span>
                                            <span className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                                {result.ac_type === 'ac' ? 'AC' : 'Non AC'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Bathroom:</span>
                                            <span className="font-medium bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                                                {result.washroom_type === 'attached' ? 'Private' : 'Shared'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Occupancy:</span>
                                            <span className="font-medium bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                                                {result.occupancy_limit} Person
                                            </span>
                                        </div>

                                        {/* Development mode: Show UUIDs for tracing */}
                                        {process.env.NODE_ENV === 'development' && (
                                            <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
                                                <div>Room ID: {result.room_id}</div>
                                                <div>Hostel ID: {result.hostel_id}</div>
                                            </div>
                                        )}
                                    </div>

                                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No results message */}
                {results.length === 0 && isAllComplete && !isLoading && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center animate-fadeIn">
                        <h3 className="text-xl font-semibold text-yellow-800 mb-3">
                            No hostels found with your current preferences
                        </h3>
                        <p className="text-yellow-700 mb-4">
                            Don't worry! You can easily modify your choices using the edit buttons above.
                        </p>
                        <p className="text-sm text-yellow-600">
                            Try different combinations - sometimes a small change opens up many more options!
                        </p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-in-out;
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}