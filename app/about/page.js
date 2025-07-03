"use client"

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function About() {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const contentRef = useRef([]);

    useEffect(() => {
        const tl = gsap.timeline();

        // Animate title
        tl.fromTo(titleRef.current,
            { opacity: 0, y: -80, scale: 0.8 },
            { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "back.out(1.7)" }
        )
            // Animate subtitle
            .fromTo(subtitleRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5"
            )
            // Animate content cards
            .fromTo(contentRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power2.out"
                }, "-=0.3"
            );

    }, []);

    const addToRefs = (el) => {
        if (el && !contentRef.current.includes(el)) {
            contentRef.current.push(el);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Subtle Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-6 py-20">
                {/* Centered Header */}
                <div className="text-center mb-20">
                    <h1
                        ref={titleRef}
                        className="text-7xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-8 tracking-tight"
                    >
                        SRM IST Hostels
                    </h1>
                    <p
                        ref={subtitleRef}
                        className="text-xl text-gray-400 font-light max-w-md mx-auto"
                    >
                        Your Home Away From Home
                    </p>

                </div>

                {/* Minimalist Content Grid */}
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Mission */}
                    <div
                        ref={addToRefs}
                        className="group text-center p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/30 transition-all duration-300"
                    >
                        <h3 className="text-2xl font-semibold text-white mb-4">Our Mission</h3>
                        <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            Providing world-class accommodation with modern amenities, fostering a community where students can thrive academically and personally.
                        </p>
                    </div>

                    {/* Two Column Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div
                            ref={addToRefs}
                            className="group text-center p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/30 transition-all duration-300"
                        >
                            <h3 className="text-xl font-semibold text-white mb-4">Premium Facilities</h3>
                            <p className="text-gray-300 leading-relaxed">
                                24/7 Wi-Fi, study lounges, recreational areas, and round-the-clock security for comfortable living.
                            </p>
                        </div>

                        <div
                            ref={addToRefs}
                            className="group text-center p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-pink-400/30 transition-all duration-300"
                        >
                            <h3 className="text-xl font-semibold text-white mb-4">Vibrant Community</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Join a diverse community of scholars, creating lifelong friendships and networking opportunities.
                            </p>
                        </div>
                    </div>

                    {/* Simple Stats */}
                    <div
                        ref={addToRefs}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
                    >
                        {[
                            { number: "15,000+", label: "Students" },
                            { number: "20+", label: "Hostels" },
                            { number: "24/7", label: "Support" },
                            { number: "100%", label: "Satisfaction" }
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-1">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-gray-500 uppercase tracking-wide">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}