"use client"

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import {
    Mars,
    Venus,
    Sun,
    Snowflake,
    Home,
    Users as UsersIcon,
    BookOpen,
    GraduationCap,
    Award,
    Trophy,
    Building2
} from 'lucide-react';
import ChooseHostelCard from '@/_components/hostel/ChooseHostelCard';

// Register GSAP plugin for smooth scrolling
gsap.registerPlugin(ScrollToPlugin);

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
    const [branchOptions, setBranchOptions] = useState([]);
    const [isFetchingBranches, setIsFetchingBranches] = useState(false);

    // Refs for GSAP animations - these help us target specific DOM elements for smooth animations
    const questionRefs = useRef([]);
    const containerRef = useRef(null);

    // Filter configuration with all the questions and options
    const filterSteps = [
        {
            id: 'gender',
            question: 'Who will be staying at the hostel?',
            options: [
                { value: 'boys', label: 'Boys Hostel', icon: Mars },
                { value: 'girls', label: 'Girls Hostel', icon: Venus }
            ]
        },
        {
            id: 'branch',
            question: 'Which campus branch are you looking for?',
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
            question: 'What\'s your temperature preference?',
            options: [
                { value: 'ac', label: 'Air Conditioned', icon: Snowflake },
                { value: 'non_ac', label: 'Non AC (Natural)', icon: Sun }
            ]
        },
        {
            id: 'washroomType',
            question: 'How do you prefer your bathroom setup?',
            options: [
                { value: 'attached', label: 'Private Bathroom', icon: Home },
                { value: 'common', label: 'Shared Bathroom', icon: UsersIcon }
            ]
        },
        {
            id: 'sharing',
            question: 'How many roommates would you like?',
            options: [
                { value: '2', label: '2 Person Sharing', icon: UsersIcon },
                { value: '3', label: '3 Person Sharing', icon: UsersIcon },
                { value: '4', label: '4 Person Sharing', icon: UsersIcon }
            ]
        }
    ];

    // Fetch branch options when gender is selected
    useEffect(() => {
        const fetchBranches = async () => {
            if (!selections.gender) return;

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
                    setBranchOptions([
                        { value: 'kattankulathur_chennai', label: 'Kattankulathur, Chennai', icon: Building2 }
                    ]);
                }
            } catch (error) {
                setBranchOptions([
                    { value: 'kattankulathur_chennai', label: 'Kattankulathur, Chennai', icon: Building2 }
                ]);
            } finally {
                setIsFetchingBranches(false);
            }
        };

        fetchBranches();
    }, [selections.gender]);

    // Handle selection and animate to next question
    const handleSelection = (filterType, value) => {
        const newSelections = {
            ...selections,
            [filterType]: value
        };
        setSelections(newSelections);

        // Animate the current question moving up and fade in the next question
        if (currentStep < filterSteps.length - 1) {
            const currentQuestionEl = questionRefs.current[currentStep];
            const nextQuestionEl = questionRefs.current[currentStep + 1];

            // First, move current question up with a subtle animation
            gsap.to(currentQuestionEl, {
                duration: 0.4,
                y: -20,
                opacity: 0.7,
                scale: 0.95,
                ease: "power2.out"
            });

            // Then fade in and animate the next question
            gsap.fromTo(nextQuestionEl,
                {
                    opacity: 0,
                    y: 50,
                    scale: 0.9
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    delay: 0.2,
                    ease: "power2.out"
                }
            );

            // Smooth scroll to center the next question
            gsap.to(window, {
                duration: 0.8,
                scrollTo: {
                    y: nextQuestionEl,
                    offsetY: window.innerHeight / 2 - 100
                },
                delay: 0.3,
                ease: "power2.inOut"
            });

            setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 300);
        }
    };

    // Check if all selections are complete
    const isAllComplete = Object.values(selections).every(value => value !== '');

    // Make API call when all selections are complete
    useEffect(() => {
        const makeApiCall = async () => {
            if (!isAllComplete) return;

            setIsLoading(true);
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
                } else {
                    setResults([]);
                }
            } catch (error) {
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        makeApiCall();
    }, [selections, isAllComplete]);

    return (
        <div ref={containerRef} style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
                    Find Your Perfect Hostel
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#6b7280', lineHeight: '1.6' }}>
                    We'll guide you through a few simple questions to find the ideal accommodation.
                    All your choices remain visible and easily editable!
                </p>
            </div>

            <hr style={{ border: 'none', height: '1px', backgroundColor: '#e5e7eb', margin: '2rem auto', maxWidth: '600px' }} />

            {/* Questions Container */}
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                {filterSteps.map((step, index) => {
                    const isCurrentOrPrevious = index <= currentStep;
                    const isSelected = selections[step.id] !== '';

                    return (
                        <div
                            key={step.id}
                            ref={el => questionRefs.current[index] = el}
                            style={{
                                marginBottom: '3rem',
                                opacity: isCurrentOrPrevious ? 1 : 0,
                                visibility: isCurrentOrPrevious ? 'visible' : 'hidden'
                            }}
                        >
                            {/* Question */}
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                marginBottom: '1.5rem',
                                color: isSelected ? '#059669' : '#374151'
                            }}>
                                {step.question}
                                {isSelected && (
                                    <span style={{ marginLeft: '0.5rem', color: '#059669' }}>✓</span>
                                )}
                            </h3>

                            {/* Loading state for branches */}
                            {step.id === 'branch' && isFetchingBranches ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                    Loading campus branches...
                                </div>
                            ) : (
                                /* Options */
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: step.options.length <= 2 ? '1fr 1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '1rem',
                                    marginBottom: '2rem'
                                }}>
                                    {step.options.map((option) => {
                                        const IconComponent = option.icon;
                                        const isOptionSelected = selections[step.id] === option.value;

                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => handleSelection(step.id, option.value)}
                                                style={{
                                                    padding: '1rem',
                                                    border: isOptionSelected ? '2px solid #059669' : '1px solid #d1d5db',
                                                    borderRadius: '8px',
                                                    backgroundColor: isOptionSelected ? '#ecfdf5' : '#ffffff',
                                                    color: isOptionSelected ? '#059669' : '#374151',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    fontSize: '1rem',
                                                    fontWeight: isOptionSelected ? '600' : '400'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isOptionSelected) {
                                                        e.target.style.backgroundColor = '#f9fafb';
                                                        e.target.style.borderColor = '#9ca3af';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isOptionSelected) {
                                                        e.target.style.backgroundColor = '#ffffff';
                                                        e.target.style.borderColor = '#d1d5db';
                                                    }
                                                }}
                                            >
                                                {IconComponent && <IconComponent size={20} />}
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <hr style={{ border: 'none', height: '1px', backgroundColor: '#e5e7eb', margin: '2rem auto', maxWidth: '600px' }} />

            {/* Loading State */}
            {isLoading && isAllComplete && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    <div style={{ marginBottom: '1rem' }}>🔍 Searching for your perfect hostels...</div>
                    <p>We're matching your preferences with our database</p>
                </div>
            )}

            {/* Results Section - Now using the separate component */}
            {results.length > 0 && !isLoading && (
                <div style={{ marginTop: '3rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
                            🎉 Excellent! We found {results.length} perfect matches
                        </h2>
                        <p style={{ color: '#6b7280' }}>Here are hostels that match all your preferences</p>
                    </div>

                    <ChooseHostelCard results={results} />
                </div>
            )}

            {/* No Results Message */}
            {results.length === 0 && isAllComplete && !isLoading && (
                <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    backgroundColor: '#fef3c7',
                    borderRadius: '8px',
                    maxWidth: '600px',
                    margin: '2rem auto'
                }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#92400e' }}>
                        No hostels found with your current preferences
                    </h3>
                    <p style={{ color: '#d97706' }}>
                        Don't worry! You can easily modify your choices by clicking on any question above.
                    </p>
                </div>
            )}
        </div>
    );
}