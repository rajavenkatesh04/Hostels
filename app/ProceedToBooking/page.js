"use client"

import React, { useState } from "react";

export default function Page() {
    const [isRedirecting, setIsRedirecting] = useState(false);

    function handleProceedToBooking() {
        setIsRedirecting(true);
        setTimeout(() => {
            window.open(
                "https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp",
                "_blank"
            );
            setIsRedirecting(false);
        }, 2000);
    }

    if (isRedirecting) {
        return (
            <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 border-4 border-slate-500/30 border-t-slate-800 rounded-full animate-spin" />
                    <div className="space-y-2">
                        <h2 className="text-2xl font-light text-gray-900">
                            Redirecting you now...
                        </h2>
                        <p className="text-gray-600 font-light">
                            Opening SRMIST - Student Portal
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center z-50 overflow-auto py-10">
            <div className="max-w-md mx-4 p-8 bg-white rounded-xl shadow-lg border border-gray-100 text-center space-y-6 animate-fade-in">
                <div className="space-y-3">
                    <h2 className="text-2xl font-light text-gray-900">You're about to be redirected</h2>
                    <p className="text-gray-600 font-light">to SRMIST - Student Portal</p>
                </div>

                {/* Updated Info Section */}
                <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-lg p-5 shadow-sm text-left">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-blue-900">
                                Hostel Booking Update
                            </h3>
                            <p className="text-sm text-blue-800 leading-relaxed">
                                Once the student receives their Registration number and Net ID, they can start booking the hostel through the portal.
                            </p>
                            <p className="text-sm text-blue-800 font-medium">
                                Students need not wait for any date announcement from the admission office for hostel booking.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Updated Button - Solid Formal Color */}
                <button
                    onClick={handleProceedToBooking}
                    className="mt-6 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors duration-200 font-medium shadow-md w-full max-w-xs mx-auto flex items-center justify-center gap-2"
                >
                    <span>Proceed to Portal</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}