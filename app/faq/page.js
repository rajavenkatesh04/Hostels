"use client"
import { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { faqData } from './faqData';

const FAQ = () => {
    const [openItems, setOpenItems] = useState({});

    const toggleItem = (index) => {
        setOpenItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Frequently Asked Questions
                </h2>
                <p className="text-gray-600">
                    Everything you need to know about staying with us
                </p>
            </div>

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
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;