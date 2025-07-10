"use client"

import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import {X, Menu} from "lucide-react";
import MasterSearch from "@/_components/hostel/MasterSearch";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return(
        <nav className="w-full fixed top-0 z-60 transition-all duration-300 ease-in-out"
             style={{
                 backgroundColor: 'var(--color-warm-white)',
                 boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)'
             }}>
            <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/*Logo - Adding gentle hover effect*/}
                    <div className="flex-shrink-0 transition-transform duration-200 hover:scale-105">
                        <Link href="/">
                            <Image
                                src="srm-logo.svg"
                                alt="SRM Logo"
                                width="80"
                                height="75"
                                className="transition-opacity duration-200 hover:opacity-80"
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu and Search - Creating breathing room */}
                    <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
                        <MasterSearch />
                    </div>

                    {/* Desktop Navigation Links - Applying calming hover states */}
                    <div className="hidden md:flex items-center">
                        <ul className="flex space-x-8"> {/* Increased spacing for peaceful feel */}
                            <li>
                                <Link
                                    href="/hostel-info#main"
                                    className="relative px-3 py-2 font-medium transition-all duration-300 ease-out whitespace-nowrap group"
                                    style={{ color: 'var(--color-warm-gray)' }}
                                >
                                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                                        Hostels
                                    </span>
                                    {/* Gentle background animation on hover */}
                                    <div
                                        className="absolute inset-0 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"
                                        style={{ backgroundColor: 'var(--color-teal-action)' }}
                                    ></div>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/resources"
                                    className="relative px-3 py-2 font-medium transition-all duration-300 ease-out whitespace-nowrap group"
                                    style={{ color: 'var(--color-warm-gray)' }}
                                >
                                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                                        Resources
                                    </span>
                                    <div
                                        className="absolute inset-0 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"
                                        style={{ backgroundColor: 'var(--color-teal-action)' }}
                                    ></div>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/choose"
                                    className="relative px-3 py-2 font-medium transition-all duration-300 ease-out whitespace-nowrap group"
                                    style={{ color: 'var(--color-warm-gray)' }}
                                >
                                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                                        Choose
                                    </span>
                                    <div
                                        className="absolute inset-0 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"
                                        style={{ backgroundColor: 'var(--color-teal-action)' }}
                                    ></div>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/about"
                                    className="relative px-3 py-2 font-medium transition-all duration-300 ease-out whitespace-nowrap group"
                                    style={{ color: 'var(--color-warm-gray)' }}
                                >
                                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                                        About
                                    </span>
                                    <div
                                        className="absolute inset-0 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"
                                        style={{ backgroundColor: 'var(--color-teal-action)' }}
                                    ></div>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/gallery"
                                    className="relative px-3 py-2 font-medium transition-all duration-300 ease-out whitespace-nowrap group"
                                    style={{ color: 'var(--color-warm-gray)' }}
                                >
                                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                                        Gallery
                                    </span>
                                    <div
                                        className="absolute inset-0 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"
                                        style={{ backgroundColor: 'var(--color-teal-action)' }}
                                    ></div>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Mobile Menu Button - Elegant toggle animation */}
                    <div className="md:hidden flex items-center space-x-2">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-opacity-50"
                            style={{
                                color: 'var(--color-warm-gray)',
                                backgroundColor: isOpen ? 'var(--color-blue-gray-accent)' : 'transparent',
                                focusRingColor: 'var(--color-teal-action)'
                            }}
                        >
                            {/* Animated icon transition */}
                            <div className="relative w-6 h-6">
                                <Menu
                                    className={`absolute inset-0 transition-all duration-300 ease-out ${
                                        isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                                    }`}
                                />
                                <X
                                    className={`absolute inset-0 transition-all duration-300 ease-out ${
                                        isOpen ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
                                    }`}
                                />
                            </div>
                        </button>
                    </div>
                </div>

                {/*Mobile Menu navigation - Smooth dropdown with staggered animations*/}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                    style={{
                        backgroundColor: 'var(--color-warm-white)',
                        borderTop: `1px solid var(--color-blue-gray-accent)`
                    }}
                >
                    <div className="px-2 pb-3 space-y-1 pt-2">
                        {/* Each menu item animates in with a slight delay for elegance */}
                        <div className={`transform transition-all duration-300 ease-out ${
                            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                        }`} style={{ transitionDelay: '100ms' }}>
                            <Link
                                href="/hostel-info#main"
                                className="block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-out"
                                style={{
                                    color: 'var(--color-warm-gray)',
                                    backgroundColor: 'transparent'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'var(--color-blue-gray-accent)';
                                    e.target.style.color = 'var(--color-teal-action)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = 'var(--color-warm-gray)';
                                }}
                            >
                                Hostels
                            </Link>
                        </div>

                        <div className={`transform transition-all duration-300 ease-out ${
                            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                        }`} style={{ transitionDelay: '150ms' }}>
                            <Link
                                href="/resources"
                                className="block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-out"
                                style={{
                                    color: 'var(--color-warm-gray)',
                                    backgroundColor: 'transparent'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'var(--color-blue-gray-accent)';
                                    e.target.style.color = 'var(--color-teal-action)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = 'var(--color-warm-gray)';
                                }}
                            >
                                Resources
                            </Link>
                        </div>

                        <div className={`transform transition-all duration-300 ease-out ${
                            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                        }`} style={{ transitionDelay: '200ms' }}>
                            <Link
                                href="/choose"
                                className="block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-out"
                                style={{
                                    color: 'var(--color-warm-gray)',
                                    backgroundColor: 'transparent'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'var(--color-blue-gray-accent)';
                                    e.target.style.color = 'var(--color-teal-action)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = 'var(--color-warm-gray)';
                                }}
                            >
                                Choose
                            </Link>
                        </div>

                        <div className={`transform transition-all duration-300 ease-out ${
                            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                        }`} style={{ transitionDelay: '250ms' }}>
                            <Link
                                href="/about"
                                className="block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-out"
                                style={{
                                    color: 'var(--color-warm-gray)',
                                    backgroundColor: 'transparent'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'var(--color-blue-gray-accent)';
                                    e.target.style.color = 'var(--color-teal-action)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = 'var(--color-warm-gray)';
                                }}
                            >
                                About
                            </Link>
                        </div>

                        <div className={`transform transition-all duration-300 ease-out ${
                            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                        }`} style={{ transitionDelay: '250ms' }}>
                            <Link
                                href="/gallery"
                                className="block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-out"
                                style={{
                                    color: 'var(--color-warm-gray)',
                                    backgroundColor: 'transparent'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'var(--color-blue-gray-accent)';
                                    e.target.style.color = 'var(--color-teal-action)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = 'var(--color-warm-gray)';
                                }}
                            >
                                Gallery
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}