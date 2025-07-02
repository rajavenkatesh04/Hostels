"use client"

import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import {X, Menu} from "lucide-react";
import HostelSearchBar from "@/_components/hostel/HostelSearchBar";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return(
        <nav className="w-full fixed top-0 z-60 bg-white border border-b-blue-500 shadow mb-16">
            <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/*Logo*/}
                    <div className="flex-shrink-0">
                        <Link href="/">
                            <Image src="srm-logo.svg" alt="SRM Logo" width="80" height="75"/>
                        </Link>
                    </div>

                    {/* Desktop Menu and Search */}
                    <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
                        <HostelSearchBar />
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center">
                        <ul className="flex space-x-6">
                            <li>
                                <Link href="/hostel-info" className="text-gray-800 hover:text-blue-600 px-3 py-2 font-medium transition-colors duration-200 whitespace-nowrap">
                                    Hostels
                                </Link>
                            </li>

                            <li>
                                <Link href="/resources" className="text-gray-800 hover:text-blue-600 px-3 py-2 font-medium transition-colors duration-200 whitespace-nowrap">
                                    Resources
                                </Link>
                            </li>

                            <li>
                                <Link href="/about" className="text-gray-800 hover:text-blue-600 px-3 py-2 font-medium transition-colors duration-200 whitespace-nowrap">
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <div className="px-4 py-3">
                            <HostelSearchBar />
                        </div>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/*Mobile Menu navigation*/}
                {isOpen && (
                    <div className="md:hidden border-t bg-white">

                        <ul className="px-2 pb-3 space-y-1">
                            <li>
                                <Link href="/hostel-info" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors duration-200">
                                    Hostels
                                </Link>
                            </li>
                            <li>
                                <Link href="/resources" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors duration-200">
                                    Resources
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors duration-200">
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    )
}