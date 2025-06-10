"use client"

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function About() {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const contentRef = useRef(null);
    const cardRefs = useRef([]);

    useEffect(() => {
        const tl = gsap.timeline();

        // Animate title
        tl.fromTo(titleRef.current,
            { opacity: 0, y: -80, scale: 0.8 },
            { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "back.out(1.7)" }
        )
            // Animate subtitle
            .fromTo(subtitleRef.current,
                { opacity: 0, x: -100 },
                { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, "-=0.5"
            )
            // Animate content cards
            .fromTo(cardRefs.current,
                { opacity: 0, y: 50, rotateX: -15 },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power2.out"
                }, "-=0.3"
            );

        // Floating animation for cards
        gsap.to(cardRefs.current, {
            y: "random(-10, 10)",
            duration: "random(2, 4)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.5
        });

    }, []);

    const addToRefs = (el) => {
        if (el && !cardRefs.current.includes(el)) {
            cardRefs.current.push(el);
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen overflow-hidden"
            style={{
                background: `
                    radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%),
                    linear-gradient(135deg, #1a1a2e 0%, #16213e 35%, #0f3460 100%)
                `
            }}
        >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1
                        ref={titleRef}
                        className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 mb-6 drop-shadow-2xl"
                    >
                        SRM IST Hostels
                    </h1>
                    <p
                        ref={subtitleRef}
                        className="text-xl md:text-2xl text-gray-300 font-light tracking-wide"
                    >
                        Your Home Away From Home
                    </p>
                </div>

                {/* Content Grid */}
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Mission Card */}
                    <div
                        ref={addToRefs}
                        className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-105"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-6 flex items-center justify-center">
                                <span className="text-2xl">🏠</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Providing world-class accommodation with modern amenities, fostering a community where students can thrive academically and personally.
                            </p>
                        </div>
                    </div>

                    {/* Facilities Card */}
                    <div
                        ref={addToRefs}
                        className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:scale-105"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-6 flex items-center justify-center">
                                <span className="text-2xl">⭐</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Premium Facilities</h3>
                            <p className="text-gray-300 leading-relaxed">
                                24/7 Wi-Fi, study lounges, recreational areas, dining facilities, and round-the-clock security for a comfortable living experience.
                            </p>
                        </div>
                    </div>

                    {/* Community Card */}
                    <div
                        ref={addToRefs}
                        className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-pink-500/50 transition-all duration-500 hover:scale-105 md:col-span-2 lg:col-span-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl mb-6 flex items-center justify-center">
                                <span className="text-2xl">🤝</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Vibrant Community</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Join a diverse community of scholars from around the world, creating lifelong friendships and networking opportunities.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    {[
                        { number: "10,000+", label: "Students" },
                        { number: "20+", label: "Hostels" },
                        { number: "24/7", label: "Support" },
                        { number: "100%", label: "Satisfaction" }
                    ].map((stat, index) => (
                        <div
                            key={index}
                            ref={addToRefs}
                            className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
                                {stat.number}
                            </div>
                            <div className="text-gray-400 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    33% { transform: translateY(-10px) rotate(120deg); }
                    66% { transform: translateY(10px) rotate(240deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}