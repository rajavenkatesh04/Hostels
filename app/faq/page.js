"use client"
import { useState } from 'react';
import { TableOfContents, ChevronDown, Building2 } from 'lucide-react';
import { faqData } from './faqData';

const FAQ = () => {
    const [openItems, setOpenItems] = useState({});

    const toggleItem = (index) => {
        setOpenItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
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
                        className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-300"
                    >
                        official cancellation policy
                    </a>
                    {' '}for detailed information.
                </>
            );
        }
        return item.answer;
    };

    return (
        <div className="m-6">
            {/* Header */}
            <section className="space-y-2 mb-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-4xl sm:text-4xl font-light tracking-wide">
                        Frequently Asked Questions
                    </h1>
                </div>
                <p className="text-gray-600 leading-relaxed">
                    Everything you need to know about staying with us
                </p>
            </section>
            {/* FAQ Items */}
            <div className="space-y-3">
                {faqData.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                    >
                        <button
                            onClick={() => toggleItem(index)}
                            className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                            aria-expanded={openItems[index]}
                        >
                            <span className="font-medium text-gray-900 pr-4">
                                {item.question}
                            </span>
                            <ChevronDown
                                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                                    openItems[index] ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        <div
                            className={`transition-all duration-300 ease-out ${
                                openItems[index]
                                    ? 'max-h-40 opacity-100'
                                    : 'max-h-0 opacity-0'
                            } overflow-hidden`}
                        >
                            <div className="px-5 pb-4 pt-1">
                                <div className="text-gray-600 text-sm leading-relaxed">
                                    {renderAnswer(item)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;