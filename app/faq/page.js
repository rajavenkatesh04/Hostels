"use client";
import { useState } from 'react';
import { TableOfContents, ChevronDown, Building2 } from 'lucide-react';
import { faqData } from './faqData';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleItem = (index) => {
        setOpenIndex(prevIndex => (prevIndex === index ? null : index));
    };

    const renderAnswer = (item) => {
        if (item.question === "What's your cancellation policy?") {
            return (
                <>
                    Please check our{' '}
                    <a
                        href="https://www.srmist.edu.in/policies/hostel-policy/#hostel-refund"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium transition-all duration-300 ease-out hover:underline"
                        style={{
                            color: 'var(--color-teal-action)',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.color = 'var(--color-teal-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = 'var(--color-teal-action)';
                        }}
                    >
                        official cancellation policy
                    </a>{' '}
                    for detailed information.
                </>
            );
        }
        return item.answer;
    };

    return (
        <div className="m-6">
            {/* Header */}
            <section className="space-y-4 mb-8">
                <div className="items-center gap-4 space-y-2">
                    <h1 className="text-4xl sm:text-4xl font-light tracking-wide transition-colors duration-300">
                        Frequently Asked Questions
                    </h1>
                    <p>Everything you need to know about staying with us</p>
                </div>
            </section>

            {/* FAQ Items */}
            <div className="space-y-4 max-w-4xl">
                {faqData.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div
                            key={index}
                            className="group transition-all duration-300 ease-out hover:transform hover:-translate-y-1"
                            style={{
                                backgroundColor: 'var(--color-warm-white)',
                                borderRadius: '16px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)'
                            }}
                        >
                            <button
                                onClick={() => toggleItem(index)}
                                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none transition-all duration-300 ease-out"
                                aria-expanded={isOpen}
                                style={{
                                    backgroundColor: isOpen ? 'var(--color-blue-gray-accent)' : 'transparent',
                                    borderTopLeftRadius: '16px',
                                    borderTopRightRadius: '16px',
                                    borderBottomLeftRadius: isOpen ? '0' : '16px',
                                    borderBottomRightRadius: isOpen ? '0' : '16px'
                                }}
                            >
                                <span
                                    className="font-medium pr-4 transition-colors duration-300 text-base"
                                    style={{ color: 'var(--color-warm-gray)' }}
                                >
                                    {item.question}
                                </span>
                                <div
                                    className="flex-shrink-0 p-1 rounded-full transition-all duration-300 ease-out"
                                    style={{
                                        backgroundColor: isOpen ? 'var(--color-teal-action)' : 'var(--color-lavender-highlight)'
                                    }}
                                >
                                    <ChevronDown
                                        className={`w-4 h-4 transition-all duration-300 ease-out ${isOpen ? 'rotate-180' : ''}`}
                                        style={{
                                            color: isOpen ? 'white' : 'var(--color-teal-action)'
                                        }}
                                    />
                                </div>
                            </button>

                            {/* Answer section */}
                            <div
                                className={`transition-all duration-400 ease-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
                            >
                                <div
                                    className="px-6 pb-6 pt-2 transition-all duration-300 ease-out"
                                    style={{
                                        backgroundColor: 'var(--color-warm-white)',
                                        borderBottomLeftRadius: '16px',
                                        borderBottomRightRadius: '16px'
                                    }}
                                >
                                    <div
                                        className="pt-3 leading-relaxed transition-colors duration-300"
                                        style={{
                                            color: 'var(--color-warm-gray)',
                                            opacity: 0.9
                                        }}
                                    >
                                        {renderAnswer(item)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}