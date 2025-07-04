"use client"

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Github, Mail, User, CircleUserRound } from "lucide-react";


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

            .fromTo(subtitleRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5"
            )

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
                <div className="text-center mb-20">
                    <h1
                        ref={titleRef}
                        className="text-4xl sm:text-5xl font-light text-white tracking-wide mb-4"
                    >
                        SRM <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Hostels</span>
                    </h1>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-6"></div>
                    <p
                        ref={subtitleRef}
                        className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-light"
                    >
                        Experience comfortable and safe housing with world-class facilities designed to enhance your academic journey
                    </p>
                </div>


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

                <div className="fixed bottom-4 right-4 z-50">
                    <div className="group relative">
                        <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20 hover:border-purple-400/50 transition-all duration-300 cursor-pointer">
                            <User size={16} className="text-gray-400 group-hover:text-purple-400 transition-colors" />
                        </div>

                        <div className="absolute bottom-full right-0 mb-1 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 text-sm min-w-[200px] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                {/* Mini card header */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                                        <User size={14} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Raja Venkatesh</p>
                                        <p className="text-xs text-gray-500">Developer</p>
                                    </div>
                                </div>

                                {/* Links */}
                                <div className="space-y-2">
                                    <a
                                        href="https://rajavenkatesh.me/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors text-xs py-1"
                                    >
                                        <CircleUserRound size={14} />
                                        Portfolio
                                    </a>

                                    <a
                                        href="https://github.com/rajavenkatesh04"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-xs py-1"
                                    >
                                        <Github size={14} />
                                        GitHub
                                    </a>

                                    <a
                                        href="mailto:grv.9604@gmail.com"
                                        className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors text-xs py-1"
                                    >
                                        <Mail size={14} />
                                        Email
                                    </a>
                                </div>
                                <div className="border-t border-gray-200 mt-3 pt-2">
                                    <p className="text-xs text-gray-400 text-center">Built with ❤️</p>
                                </div>
                                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}