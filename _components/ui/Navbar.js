"use client"

import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import {X, Menu} from "lucide-react";

export default function Navbar() {

    const [isOpen, setIsOpen] = useState(false);
    return(
        <nav className="w-full fixed top-0 z-50 bg-white shadow">
            <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8 ">
                <div className="flex justify-between items-center h-16">
                    {/*Logo*/}
                    <div className="flex-shrink-0">
                        <Link href="/">
                            <Image src="srm-logo.svg" alt="SRM Logo" width="80" height="75"/>
                        </Link>
                    </div>

                    {/*Desktop Menu*/}
                    <div className="hidden md:block">
                        <ul className="flex space-x-8">
                            <li>
                                <Link href="/about" className="text-gray-800 hover:text-blue-600 px-3 py-2 font-medium transition-colors duration-200">
                                    About
                                </Link>
                            </li>

                            <li>
                                <Link href="/contact" className="text-gray-800 hover:text-blue-600 px-3 py-2 font-medium transition-colors duration-200">
                                    Contact
                                </Link>
                            </li>

                            <li>
                                <Link href="/choose" className="text-gray-800 hover:text-blue-600 px-3 py-2 font-medium transition-colors duration-200">
                                    Choose
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Mobile Menu*/}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen((!isOpen))}
                            className="p-2 rounded-md hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/*Mobile Menu navigation*/}
                {isOpen && (
                    <div className="md:hidden border-t">
                        <ul className="px-2 py-2 pb-3 space-y-1">
                            <li>
                                <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors duration-200">
                                    About
                                </Link>
                            </li>

                            <li>
                                <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors duration-200">
                                    Contact
                                </Link>
                            </li>

                            <li>
                                <Link href="/choose" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors duration-200">
                                    Choose
                                </Link>
                            </li>
                        </ul>

                    </div>
                )}


            </div>
        </nav>
    )
}