'use client'

import { useRouter } from 'next/navigation'

export default function BackButton({
                                       fallbackUrl = '/',
                                       className = '',
                                       children = 'Back'
                                   }) {
    const router = useRouter()

    const handleBack = () => {
        // Check if there's history to go back to
        if (window.history.length > 1) {
            router.back()
        } else {
            // If no history, go to fallback URL
            router.push(fallbackUrl)
        }
    }

    return (
        <button
            onClick={handleBack}
            className={`inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 ${className}`}
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>{children}</span>
        </button>
    )
}