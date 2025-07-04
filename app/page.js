"use client"

import { useEffect } from "react";
import Disclaimer from "@/_components/Disclaimer";
import Banner from "@/_components/Banner";
import Maps from "@/app/maps/page";
import FAQ from "@/app/faq/page";
import HostelSearchBar from "@/_components/hostel/HostelSearchBar";
import { gsap } from "gsap";

export default function Home() {
    useEffect(() => {

        gsap.fromTo(
            ".banner",
            { opacity: 0, x: -100 },
            { opacity: 1, x: 0, duration: 1.2, ease: "power4.out" }
        );


        gsap.fromTo(
            ".content-section",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power4.out", delay: 0.3 }
        );
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <div className="md:hidden z-50 m-4 content-section">
                <HostelSearchBar />
            </div>
            <div className="banner">
                <Banner />
            </div>
            <div className="flex flex-col sm:flex-row flex-1">
                <div className="w-full sm:w-2/3 min-h-[50vh] sm:min-h-[calc(100vh-120px)] content-section">
                    <Maps />
                </div>
                <div className="w-full sm:w-1/3 content-section">
                    <FAQ />
                </div>
            </div>
            <div className="content-section">
                <Disclaimer />
            </div>

            <div className="m-6 text-center text-xs text-gray-500 opacity-50">
                <div className={``} >
                    v1.0 • Built by <a href={"https://rajavenkatesh.me/"} target={`_blank`} className={`hover:underline hover:text-purple-800`}>Raja Venkatesh</a>
                </div>
            </div>

        </div>
    );
}