"use client"

import React, { useState, useEffect, useRef } from 'react';
import {
    Mars, Venus, Sun, Snowflake, Home, Users as UsersIcon,
    BookOpen, GraduationCap, Award, Trophy, Building2, Edit3, CheckCircle2
} from 'lucide-react';
import ChooseHostelCard from '@/_components/hostel/ChooseHostelCard';

export default function HostelFilter() {
    const [activeStep, setActiveStep] = useState(0);
    const [selections, setSelections] = useState({
        gender: '', branch: '', yearOfStudy: '',
        acType: '', washroomType: '', sharing: ''
    });
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [branchOptions, setBranchOptions] = useState([]);
    const [isFetchingBranches, setIsFetchingBranches] = useState(false);

    const resultsRef = useRef(null);
    const stepRefs = useRef([]);

    const [matchInfo, setMatchInfo] = useState(null);

    const filterSteps = [
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
            options: branchOptions
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
    ];

    // Fetch branch options when gender is selected
    useEffect(() => {
        const fetchBranches = async () => {
            if (!selections.gender) {
                setBranchOptions([]);
                return;
            }

            setIsFetchingBranches(true);
            try {
                const response = await fetch('/api/branches');
                if (response.ok) {
                    const data = await response.json();
                    const formattedBranches = data.branches.map(branch => ({
                        value: branch.value,
                        label: branch.label,
                        icon: Building2
                    }));
                    setBranchOptions(formattedBranches);
                } else {
                    // Fallback branches if API fails
                    setBranchOptions([
                        { value: 'kattankulathur_chennai', label: 'Kattankulathur', icon: Building2 },
                        { value: 'ramapuram_chennai', label: 'Ramapuram', icon: Building2 },
                        { value: 'vadapalani_chennai', label: 'Vadapalani', icon: Building2 }
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch branches:", error);
                setBranchOptions([
                    { value: 'kattankulathur_chennai', label: 'Kattankulathur', icon: Building2 },
                    { value: 'ramapuram_chennai', label: 'Ramapuram', icon: Building2 },
                    { value: 'vadapalani_chennai', label: 'Vadapalani', icon: Building2 }
                ]);
            } finally {
                setIsFetchingBranches(false);
            }
        };
        fetchBranches();
    }, [selections.gender]);

    const handleSelection = (filterType, value, stepIndex) => {
        const newSelections = { ...selections, [filterType]: value };

        // If a user changes an earlier selection, reset subsequent selections
        if (stepIndex < filterSteps.length - 1) {
            for (let i = stepIndex + 1; i < filterSteps.length; i++) {
                newSelections[filterSteps[i].id] = '';
            }
        }

        setSelections(newSelections);
        setResults([]); // Clear previous results when a selection is changed

        if (stepIndex < filterSteps.length - 1) {
            setActiveStep(stepIndex + 1);
            // Smoothly scroll to the next question
            setTimeout(() => {
                stepRefs.current[stepIndex + 1]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }, 100);
        }
    };

    const handleEdit = (stepIndex) => {
        setActiveStep(stepIndex);
        stepRefs.current[stepIndex]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    };

    const isAllComplete = filterSteps.every(step => selections[step.id]);

    // Make API call when all selections are complete
    useEffect(() => {
        const makeApiCall = async () => {
            if (!isAllComplete) return;

            setIsLoading(true);
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

            try {
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
                    setMatchInfo({
                        type: data.match_type,
                        quality: data.match_quality,
                        message: data.message,
                        compromises: data.compromises || [],
                        explanation: data.explanation
                    });
                } else {
                    console.error('API response not ok:', response.status);
                    setResults([]);
                    setMatchInfo(null);
                }
            } catch (error) {
                console.error("API call failed:", error);
                setResults([]);
                setMatchInfo(null);
            } finally {
                setIsLoading(false);
            }
        };

        makeApiCall();
    }, [isAllComplete, selections]);

    // Selections Summary Component
    const SelectionsSummary = () => (
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
                            onClick={() => handleEdit(index)}
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

            {Object.values(selections).some(v => v) && <SelectionsSummary />}

            {/* Filters Section */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {filterSteps.map((step, index) => {
                    const isEnabled = index === 0 || !!selections[filterSteps[index - 1].id];
                    const isCompleted = !!selections[step.id];

                    return (
                        <section
                            key={step.id}
                            ref={el => stepRefs.current[index] = el}
                            className={`p-6 md:p-8 mb-6 bg-white rounded-xl border-2 transition-all duration-300 ${
                                activeStep === index
                                    ? 'border-blue-500 shadow-lg'
                                    : 'border-gray-200'
                            } ${
                                isEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'
                            }`}
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
                                        const isSelected = selections[step.id] === option.value;
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => handleSelection(step.id, option.value, index)}
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
                })}
            </div>

            {/* Results Section */}

            <div ref={resultsRef} className="py-8">
                {isLoading && (
                    <div className="text-center py-12 px-4">
                        <div className="flex flex-col items-center gap-4">
                            {/* Pulsing spinner */}
                            <div className="relative">
                                <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-teal-400 rounded-full animate-spin animate-pulse" style={{animationDelay: '0.5s'}}></div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-light text-gray-900 tracking-wide">Finding Your Perfect Match</h3>
                                <p className="text-gray-600 font-medium">Analyzing preferences and available rooms...</p>
                            </div>
                        </div>
                    </div>
                )}

                {!isLoading && results.length > 0 && (
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 tracking-wide">
                                {results[0]?.match_score !== undefined ? (
                                    <>
                                        Perfect matches weren't available, but we found{' '}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 font-medium">
                                {results.length}
                            </span>
                                        {' '}alternative{results.length > 1 ? 's' : ''} for you
                                    </>
                                ) : (
                                    <>
                                        Found{' '}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600 font-medium">
                                {results.length}
                            </span>
                                        {' '}perfect match{results.length > 1 ? 'es' : ''} for your preferences
                                    </>
                                )}
                            </h2>

                            {/* Only show message for exact matches - keep it simple */}
                            {results[0]?.match_score === undefined && (
                                <p className="text-gray-600 font-medium">
                                    These hostels meet all your specified criteria.
                                </p>
                            )}

                            {/* For partial matches, show a brief professional message */}
                            {results[0]?.match_score !== undefined && (
                                <p className="text-gray-600 font-medium">
                                    Consider these quality alternatives that closely match your needs.
                                </p>
                            )}
                        </div>

                        <ChooseHostelCard
                            results={results}
                            isPartialMatch={results[0]?.match_score !== undefined}
                            userSelections={selections}
                        />
                    </div>
                )}

                {!isLoading && isAllComplete && results.length === 0 && (
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="bg-white border-2 border-amber-200 rounded-xl p-8 text-center shadow-lg">
                            <h3 className="text-2xl font-light text-gray-900 mb-3 tracking-wide">No Available Matches</h3>
                            <p className="text-gray-600 mb-6 font-medium">
                                Unfortunately, no hostels currently match your specific criteria.
                            </p>
                            <button
                                onClick={() => setActiveStep(0)}
                                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                            >
                                Adjust Preferences
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}