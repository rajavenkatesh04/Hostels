"use client"
import Link from "next/link";
import { gsap } from "gsap";
import {useEffect, useRef} from "react";

export default function Banner() {
    const textRef = useRef(null);

    useEffect(() => {
        // GSAP animation for fading in the text with a color transition
        gsap.fromTo(textRef.current,
            { opacity: 0, y: -50, color: '#000' },
            { opacity: 1, y: 0, duration: 1, ease: "power2.inOut", color: '#fff' }
        );
    }, []);

    return (
        <Link href="/choose">
            <div
                className="mb-10 relative rounded-2xl overflow-hidden shadow-lg"
                style={{
                    backgroundImage: "url('/bg2.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="bg-black/20 backdrop-blur-sm p-6 flex justify-left items-end h-60">
                    <h1 ref={textRef} className="text-3xl font-bold text-white drop-shadow-lg hover:text-blue-500">
                        Help me choose my hostel<span className="material-symbols-outlined">arrow_forward</span>
                    </h1>
                </div>
            </div>
        </Link>
    );
}
