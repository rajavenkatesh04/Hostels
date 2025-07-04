"use client"

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Banner() {
    const textRef1 = useRef(null);
    const textRef2 = useRef(null);
    const arrowRef = useRef(null);

    useEffect(() => {
        // Left-to-right fade-in animation without stagger
        gsap.fromTo(
            [textRef1.current, textRef2.current, arrowRef.current],
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 1, ease: "power4.out" }
        );
    }, []);

    return (
        <div className="m-6">
            <svg style={{ position: "absolute", width: 0, height: 0 }}>
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                        <feFlood floodColor="white" result="color" />
                        <feComposite in="color" in2="blur" operator="in" result="glow" />
                        <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>
            <Link href="/choose">
                <div
                    className="rounded-2xl overflow-hidden shadow-lg relative group"
                    style={{
                        backgroundImage: "url('download2.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                    </div>

                    <div className="bg-black/60 backdrop-blur-sm flex justify-center items-center h-48 sm:h-60 md:h-72 relative overflow-hidden">
                        <header className="text-center px-4">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tighter mb-4 flex flex-wrap justify-center items-center gap-2">
                                <span
                                    ref={textRef1}
                                    className="banner-text whitespace-nowrap"
                                    style={{
                                        textShadow: "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6)",
                                    }}
                                >
                                    Help me choose my
                                </span>
                                <span ref={textRef2} className="banner-text relative whitespace-nowrap">
                                    <span
                                        className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-teal-300 relative z-10"
                                        style={{
                                            "--glow-offset": "10%",
                                        }}
                                    >
                                        hostel
                                    </span>
                                    {/* Underline animation */}
                                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-indigo-400 to-teal-400 group-hover:w-full transition-all duration-500 ease-out"></span>
                                </span>
                                <ArrowRight
                                    ref={arrowRef}
                                    className="banner-text mt-1 sm:mt-2 md:mt-3 ml-1 transform group-hover:translate-x-2 transition-transform duration-300"
                                    size={35}
                                    style={{
                                        filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))",
                                    }}
                                />
                            </h1>
                        </header>
                    </div>
                </div>
            </Link>
        </div>
    );
}