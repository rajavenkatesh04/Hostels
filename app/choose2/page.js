"use client"

import React, { useState, useEffect, useRef, useReducer, useMemo, useCallback } from 'react';
import {
    Mars, Venus, Sun, Snowflake, Home, Users as UsersIcon,
    BookOpen, GraduationCap, Award, Trophy, Building2, Edit3, CheckCircle2
} from 'lucide-react';
import ChooseHostelCard from '@/_components/hostel/ChooseHostelCard';

// First, let's understand why we're moving to useReducer
// Instead of managing multiple related state pieces separately,
// we centralize all state management in one place
const initialState = {
    activeStep: 0,
    selections: {
        gender: '', branch: '', yearOfStudy: '',
        acType: '', washroomType: '', sharing: ''
    },
    results: [],
    isLoading: false,
    branchOptions: [],
    isFetchingBranches: false
};

// The reducer function handles all state updates in a predictable way
// This prevents bugs from inconsistent state updates and makes debugging easier
function hostelFilterReducer(state, action) {
    switch (action.type) {
        case 'SET_SELECTION':
            // When a user makes a selection, we need to:
            // 1. Update the selected value
            // 2. Reset any subsequent selections (since they depend on earlier choices)
            // 3. Clear previous results
            // 4. Move to the next step if not at the end
            const newSelections = { ...state.selections, [action.filterType]: action.value };

            // Reset subsequent selections when changing an earlier step
            if (action.stepIndex < action.totalSteps - 1) {
                const filterStepsOrder = ['gender', 'branch', 'yearOfStudy', 'acType', 'washroomType', 'sharing'];
                for (let i = action.stepIndex + 1; i < filterStepsOrder.length; i++) {
                    newSelections[filterStepsOrder[i]] = '';
                }
            }

            return {
                ...state,
                selections: newSelections,
                results: [], // Clear results when selection changes
                activeStep: action.stepIndex < action.totalSteps - 1 ? action.stepIndex + 1 : state.activeStep
            };

        case 'SET_ACTIVE_STEP':
            return { ...state, activeStep: action.stepIndex };

        case 'SET_BRANCHES_LOADING':
            return { ...state, isFetchingBranches: action.isLoading };

        case 'SET_BRANCHES':
            return {
                ...state,
                branchOptions: action.branches,
                isFetchingBranches: false
            };

        case 'SET_HOSTEL_LOADING':
            return { ...state, isLoading: action.isLoading };

        case 'SET_RESULTS':
            return {
                ...state,
                results: action.results,
                isLoading: false
            };

        default:
            return state;
    }
}

// Custom hook for managing branch data
// This separates the API logic from the component, making it reusable and testable
function useBranches(gender, dispatch) {
    useEffect(() => {
        // If no gender is selected, clear branches and return early
        if (!gender) {
            dispatch({ type: 'SET_BRANCHES', branches: [] });
            return;
        }

        // Async function to fetch branches
        const fetchBranches = async () => {
            dispatch({ type: 'SET_BRANCHES_LOADING', isLoading: true });

            try {
                const response = await fetch('/api/branches');
                if (response.ok) {
                    const data = await response.json();
                    // Transform the data to match our component's expected format
                    const formattedBranches = data.branches.map(branch => ({
                        value: branch.value,
                        label: branch.label,
                        icon: Building2
                    }));
                    dispatch({ type: 'SET_BRANCHES', branches: formattedBranches });
                } else {
                    // Fallback to default branches if API fails
                    dispatch({ type: 'SET_BRANCHES', branches: getDefaultBranches() });
                }
            } catch (error) {
                console.error("Failed to fetch branches:", error);
                dispatch({ type: 'SET_BRANCHES', branches: getDefaultBranches() });
            }
        };

        fetchBranches();
    }, [gender, dispatch]); // Only re-run when gender changes
}

// Custom hook for managing hostel search
// This encapsulates the search logic and prevents unnecessary API calls
function useHostelSearch(selections, isAllComplete, dispatch) {
    // Use useRef to track the previous selections
    // This helps us avoid making API calls when selections haven't actually changed
    const previousSelectionsRef = useRef();

    useEffect(() => {
        // Don't search if not all selections are complete
        if (!isAllComplete) return;

        // Compare current selections with previous ones
        const selectionsChanged = JSON.stringify(selections) !== JSON.stringify(previousSelectionsRef.current);
        if (!selectionsChanged) return;

        // Update the ref with current selections
        previousSelectionsRef.current = selections;

        const searchHostels = async () => {
            dispatch({ type: 'SET_HOSTEL_LOADING', isLoading: true });

            try {
                const response = await fetch('/api/choose', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(selections),
                });

                if (response.ok) {
                    const data = await response.json();
                    dispatch({ type: 'SET_RESULTS', results: data.results || [] });
                } else {
                    console.error('API response not ok:', response.status);
                    dispatch({ type: 'SET_RESULTS', results: [] });
                }
            } catch (error) {
                console.error("API call failed:", error);
                dispatch({ type: 'SET_RESULTS', results: [] });
            }
        };

        searchHostels();
    }, [selections, isAllComplete, dispatch]);
}

// Helper function for default branches
function getDefaultBranches() {
    return [
        { value: 'kattankulathur_chennai', label: 'Kattankulathur', icon: Building2 },
        { value: 'ramapuram_chennai', label: 'Ramapuram', icon: Building2 },
        { value: 'vadapalani_chennai', label: 'Vadapalani', icon: Building2 }
    ];
}

// Memoized component for individual filter steps
// React.memo prevents re-rendering when props haven't changed
const FilterStep = React.memo(({
                                   step,
                                   index,
                                   isEnabled,
                                   isCompleted,
                                   isActive,
                                   selection,
                                   onSelection,
                                   isFetchingBranches,
                                   stepRef
                               }) => {
    return (
        <section
            ref={stepRef}
            className={`p-6 md:p-8 mb-6 bg-white rounded-xl border-2 transition-all duration-300 ${
                isActive ? 'border-blue-500 shadow-lg' : 'border-gray-200'
            } ${isEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}
        >
            <h3 className={`flex items-center gap-3 text-xl md:text-2xl font-semibold mb-6 ${
                isCompleted ? 'text-green-600' : 'text-gray-800'
            }`}>
                {isCompleted ? (
                    <CheckCircle2 size={24} />
                ) : (
                    <span className="w-6 h-6 rounded-full border-2 border-gray-400 inline-block" />
                )}
                {step.question}
            </h3>

            {step.id === 'branch' && isFetchingBranches ? (
                <div className="text-gray-500 py-8 text-center">Loading branches...</div>
            ) : (
                <div className={`grid gap-4 ${
                    step.options.length <= 2
                        ? 'grid-cols-1 sm:grid-cols-2'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}>
                    {step.options.map((option) => {
                        const Icon = option.icon;
                        const isSelected = selection === option.value;
                        return (
                            <button
                                key={option.value}
                                onClick={() => onSelection(step.id, option.value, index)}
                                className={`flex items-center justify-center gap-3 p-4 md:p-5 rounded-lg border-2 font-semibold transition-all duration-200 ${
                                    isSelected
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {Icon && <Icon size={20} />}
                                <span className="text-sm md:text-base">{option.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </section>
    );
});

// Memoized selections summary component
const SelectionsSummary = React.memo(({ selections, filterSteps, onEdit }) => {
    return (
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4 border-b border-gray-200 mb-8">
            <div className="max-w-6xl mx-auto flex flex-wrap gap-3 items-center">
                <span className="font-semibold text-gray-600 text-sm">Your Selections:</span>
                {filterSteps.map((step, index) => {
                    const selectionValue = selections[step.id];
                    if (!selectionValue) return null;

                    const option = step.options.find(o => o.value === selectionValue);
                    return (
                        <button
                            key={step.id}
                            onClick={() => onEdit(index)}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <span>{option ? option.label : selectionValue}</span>
                            <Edit3 size={12} className="text-gray-500" />
                        </button>
                    );
                })}
            </div>
        </div>
    );
});

// Memoized results section component
const ResultsSection = React.memo(({ isLoading, results, isAllComplete, resultsRef }) => {
    if (isLoading) {
        return (
            <div ref={resultsRef} className="py-8">
                <div className="text-center py-12 px-4 text-gray-600">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">Finding Your Hostel...</h3>
                    <p>We're matching your preferences with available rooms.</p>
                </div>
            </div>
        );
    }

    if (!isLoading && results.length > 0) {
        return (
            <div ref={resultsRef} className="py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                            🎉 We Found {results.length} Match{results.length > 1 ? 'es' : ''}
                        </h2>
                        <p className="text-gray-600">These hostels perfectly fit your criteria.</p>
                    </div>
                    <ChooseHostelCard results={results} />
                </div>
            </div>
        );
    }

    if (!isLoading && isAllComplete && results.length === 0) {
        return (
            <div ref={resultsRef} className="py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
                        <h3 className="text-2xl font-semibold text-yellow-800 mb-2">No Matches Found</h3>
                        <p className="text-yellow-700">
                            Try changing a selection above. Your perfect room is just a click away!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return <div ref={resultsRef} className="py-8"></div>;
});

// Main component - now much cleaner and focused
export default function HostelFilter() {
    // Use useReducer for centralized state management
    const [state, dispatch] = useReducer(hostelFilterReducer, initialState);
    const resultsRef = useRef(null);
    const stepRefs = useRef([]);

    // Define filter steps - this could be moved to a separate file for better organization
    const filterSteps = useMemo(() => [
        {
            id: 'gender',
            question: 'Select your gender',
            options: [
                { value: 'boys', label: 'Boys', icon: Mars },
                { value: 'girls', label: 'Girls', icon: Venus }
            ]
        },
        {
            id: 'branch',
            question: 'Which campus are you looking for?',
            options: state.branchOptions // This gets updated by the custom hook
        },
        {
            id: 'yearOfStudy',
            question: 'Which year of study are you in?',
            options: [
                { value: '1', label: '1st Year', icon: BookOpen },
                { value: '2', label: '2nd Year', icon: GraduationCap },
                { value: '3', label: '3rd Year', icon: Award },
                { value: '4', label: '4th Year', icon: Trophy }
            ]
        },
        {
            id: 'acType',
            question: 'AC or Non-AC?',
            options: [
                { value: 'ac', label: 'AC', icon: Snowflake },
                { value: 'non_ac', label: 'Non-AC', icon: Sun }
            ]
        },
        {
            id: 'washroomType',
            question: 'Preferred bathroom setup?',
            options: [
                { value: 'attached', label: 'Attached', icon: Home },
                { value: 'common', label: 'Common', icon: UsersIcon }
            ]
        },
        {
            id: 'sharing',
            question: 'How many roommates?',
            options: [
                { value: '2', label: '2 Sharing', icon: UsersIcon },
                { value: '3', label: '3 Sharing', icon: UsersIcon },
                { value: '4', label: '4 Sharing', icon: UsersIcon },
                { value: '5', label: '5 Sharing', icon: UsersIcon }
            ]
        }
    ], [state.branchOptions]);

    // Use custom hooks for side effects
    useBranches(state.selections.gender, dispatch);

    // Memoize the completion check to avoid recalculating on every render
    const isAllComplete = useMemo(() =>
            filterSteps.every(step => state.selections[step.id]),
        [filterSteps, state.selections]
    );

    useHostelSearch(state.selections, isAllComplete, dispatch);

    // Memoized event handlers to prevent unnecessary re-renders of child components
    const handleSelection = useCallback((filterType, value, stepIndex) => {
        dispatch({
            type: 'SET_SELECTION',
            filterType,
            value,
            stepIndex,
            totalSteps: filterSteps.length
        });

        // Smooth scroll to next step
        if (stepIndex < filterSteps.length - 1) {
            setTimeout(() => {
                stepRefs.current[stepIndex + 1]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }, 100);
        }
    }, [filterSteps.length]);

    const handleEdit = useCallback((stepIndex) => {
        dispatch({ type: 'SET_ACTIVE_STEP', stepIndex });
        stepRefs.current[stepIndex]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    }, []);

    // Scroll to results when loading starts
    useEffect(() => {
        if (state.isLoading) {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [state.isLoading]);

    // Check if any selections have been made
    const hasSelections = useMemo(() =>
            Object.values(state.selections).some(v => v),
        [state.selections]
    );

    return (
        <main className="bg-gray-50 min-h-screen">
            {/* Header */}
            <header className="text-center py-16 px-4 bg-white">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                    Find Your Perfect Hostel
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Answer a few questions and we'll find the perfect room for you.
                </p>
            </header>

            {/* Selections Summary - only show if user has made selections */}
            {hasSelections && (
                <SelectionsSummary
                    selections={state.selections}
                    filterSteps={filterSteps}
                    onEdit={handleEdit}
                />
            )}

            {/* Filters Section */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {filterSteps.map((step, index) => {
                    const isEnabled = index === 0 || !!state.selections[filterSteps[index - 1].id];
                    const isCompleted = !!state.selections[step.id];

                    return (
                        <FilterStep
                            key={step.id}
                            step={step}
                            index={index}
                            isEnabled={isEnabled}
                            isCompleted={isCompleted}
                            isActive={state.activeStep === index}
                            selection={state.selections[step.id]}
                            onSelection={handleSelection}
                            isFetchingBranches={state.isFetchingBranches}
                            stepRef={el => stepRefs.current[index] = el}
                        />
                    );
                })}
            </div>

            {/* Results Section */}
            <ResultsSection
                isLoading={state.isLoading}
                results={state.results}
                isAllComplete={isAllComplete}
                resultsRef={resultsRef}
            />
        </main>
    );
}