"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
    const [isScroll, setIsScroll] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScroll(true);
            } else {
                setIsScroll(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`w-full fixed top-0 z-50 px-5 lg:px-8 xl:px-[8%] py-4 flex justify-center items-center transition-colors duration-300 ${
                isScroll
                    ? "bg-white bg-opacity-50 backdrop-blur-lg shadow-sm"
                    : "bg-transparent"
            }`}
        >
            <ul
                className={`flex gap-6 lg:gap-8 rounded-full px-8 py-2 transition duration-300 ${
                    isScroll ? "" : "bg-white shadow-sm bg-opacity-50"
                }`}
            >
                <li>
                    <Link
                        href="/about"
                        className="font-Ovo text-gray-700 hover:text-blue-500 transition-colors"
                    >
                        About
                    </Link>
                </li>
                <li>
                    <Link
                        href="/contact"
                        className="font-Ovo text-gray-700 hover:text-blue-500 transition-colors"
                    >
                        Contact
                    </Link>
                </li>
                <li>
                    <Link
                        href="/hostels"
                        className="font-Ovo text-gray-700 hover:text-blue-500 transition-colors"
                    >
                        Hostels
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
