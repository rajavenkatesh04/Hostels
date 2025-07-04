"use client";
import { FileText, BookOpen, Shield, Calendar, HelpCircle, Library, ClipboardList, Users, Home, Settings, Mail, Map } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { resourceCategories, quickLinks, announcement } from './resourcesData';

const iconComponents = {
    BookOpen,
    Home,
    Users,
    ClipboardList,
    Shield,
    Library,
    Settings,
    Mail,
    Map,
    HelpCircle
};

export default function Resources() {
    const router = useRouter();

    return (
        <div className="bg-white text-gray-900 min-h-screen transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-24 py-16">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-light text-gray-900 tracking-wide mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-600">Resources</span>
                    </h1>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-indigo-600 to-teal-600 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-light">
                        Everything you need for academic and hostel life in one place
                    </p>
                </div>

                {/* Search Bar */}
                {/*<div className="mb-16 max-w-2xl mx-auto">*/}
                {/*    <div className="relative">*/}
                {/*        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">*/}
                {/*            <HelpCircle className="h-5 w-5 text-indigo-600" />*/}
                {/*        </div>*/}
                {/*        <input*/}
                {/*            type="text"*/}
                {/*            className="block w-full pl-10 pr-3 py-4 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg font-light text-gray-900 placeholder-gray-500"*/}
                {/*            placeholder="Search resources (coming soon)..."*/}
                {/*            disabled*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*    <p className="mt-2 text-sm text-gray-500 text-center font-light">*/}
                {/*        Search functionality will be added in future updates*/}
                {/*    </p>*/}
                {/*</div>*/}

                {/* Resource Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {resourceCategories.map((category) => {
                        const IconComponent = iconComponents[category.icon];
                        const colorClasses = {
                            indigo: 'text-indigo-600',
                            blue: 'text-blue-600',
                            green: 'text-teal-600',
                            purple: 'text-purple-600',
                            red: 'text-red-600',
                            amber: 'text-amber-600'
                        };

                        return (
                            <div
                                key={category.title}
                                className="group bg-white border border-gray-300 rounded-xl overflow-hidden hover:shadow-xl hover:border-indigo-600/50 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-500/20 to-teal-500/20 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                                            <IconComponent className={`w-6 h-6 ${colorClasses[category.color]}`} />
                                        </div>
                                        <h3 className="text-xl font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                                            {category.title}
                                        </h3>
                                    </div>
                                    <div className="space-y-3">
                                        {category.items.map((item) => (
                                            <a
                                                key={item.title}
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-start space-x-3 hover:bg-indigo-600/5 p-2 rounded-md transition-colors duration-300"
                                            >
                                                <div className="flex-shrink-0 h-5 w-5 mt-0.5 text-indigo-600 group-hover:text-indigo-500">
                                                    <FileText className="w-full h-full" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-sm text-gray-700 font-light leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Links Section */}
                <div className="mb-16">
                    <h2 className="text-2xl font-light text-center text-gray-900 mb-12">
                        Quick <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-600">Access Links</span>
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                        {quickLinks.map((link) => {
                            const IconComponent = iconComponents[link.icon];
                            const colorClasses = {
                                indigo: 'text-indigo-600',
                                blue: 'text-blue-600',
                                green: 'text-teal-600',
                                red: 'text-red-600'
                            };

                            return (
                                <a
                                    key={link.title}
                                    href={link.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex flex-col items-center justify-center p-6 border border-gray-300 rounded-xl bg-gray-50 hover:bg-indigo-600/5 hover:border-indigo-600/50 transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-500/20 to-teal-500/20 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                                        <IconComponent className={`h-8 w-8 ${colorClasses[link.color]}`} />
                                    </div>
                                    <span className="mt-2 text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                                        {link.title}
                                    </span>
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Announcement Banner */}
                <div className="p-6 rounded-xl border border-gray-300 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500/20 to-teal-500/20 flex items-center justify-center border border-indigo-500/30">
                            <HelpCircle className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">
                                {announcement.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-700 font-light leading-relaxed">
                                {announcement.content}{" "}
                                <a
                                    href={announcement.action.link}
                                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-300"
                                >
                                    {announcement.action.text}
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}