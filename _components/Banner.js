"use client"

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import React from "react";

export default function Banner() {
    return (
        <div className="m-6">
            <Link href="/choose">
                <div
                    className="rounded-2xl overflow-hidden shadow-lg relative group"
                    style={{
                        backgroundImage: "url('bg2.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                    </div>

                    <div className="bg-black/50 backdrop-blur-sm flex justify-center items-center h-48 sm:h-60 md:h-72 relative overflow-hidden">
                        <header className="text-center px-4">
                            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight mb-4 flex flex-wrap justify-center items-center gap-2">
                                <span className="whitespace-nowrap">Help me choose my</span>
                                <span className="relative whitespace-nowrap">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400 relative z-10 ">
                    hostel
                  </span>
                                    {/* Underline animation */}
                                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r mt-2 from-indigo-400 to-teal-400 group-hover:w-full transition-all duration-500 ease-out"></span>
                </span>
                                <ArrowRight
                                    size={35}
                                    className="mt-1 sm:mt-2 md:mt-3 ml-1 transform group-hover:translate-x-2 transition-transform duration-300"
                                />
                            </h1>
                        </header>
                    </div>
                </div>
            </Link>
        </div>
    );
}