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
                    <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
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
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <div className="max-w-md mx-4 p-8 bg-white rounded-xl shadow-lg border border-gray-100 text-center space-y-6 animate-fade-in">
                <div className="space-y-3">
                    <h2 className="text-2xl font-light text-gray-900">You're about to be redirected</h2>
                    <p className="text-gray-600 font-light">to SRMIST - Student Portal</p>
                </div>

                {/*Alert*/}
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
                    <p className="font-bold">Online Booking Dates</p>
                    <p>Girls - 21.07.2025</p>
                    <p>Boys - 22.07.2025</p>
                </div>


                <button
                    onClick={handleProceedToBooking}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg w-full max-w-xs mx-auto flex items-center justify-center gap-2"
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
