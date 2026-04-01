'use client';

import React from 'react';
import { Plane, Train, Car } from 'lucide-react';

export default function Reachability() {
    return (
        <section className="py-12 bg-cream-light">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-2xl font-bold text-deepBlue text-center mb-10">How to Reach Vedic Travel</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Airport */}
                        <div className="p-6 rounded-xl border border-gray-50 bg-gray-50/30 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mb-4 text-blue-500">
                                <Plane size={24} />
                            </div>
                            <h4 className="font-bold text-deepBlue mb-3 flex items-center gap-2">
                                <span className="text-blue-500">✈️</span> Nearest Airport
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Indira Gandhi International Airport (DEL)<br />
                                <span className="text-gray-400">45-60 minutes drive</span>
                            </p>
                        </div>

                        {/* Railway */}
                        <div className="p-6 rounded-xl border border-gray-50 bg-gray-50/30 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                                <Train size={24} />
                            </div>
                            <h4 className="font-bold text-deepBlue mb-3 flex items-center gap-2">
                                <span className="text-blue-600">🚆</span> Railway Station
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                New Delhi Railway Station (NDLS)<br />
                                <span className="text-gray-400">30-45 minutes drive</span>
                            </p>
                        </div>

                        {/* Metro */}
                        <div className="p-6 rounded-xl border border-gray-50 bg-gray-50/30 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                                <SubwayIcon size={24} />
                            </div>
                            <h4 className="font-bold text-deepBlue mb-3 flex items-center gap-2">
                                <span className="text-purple-600">🚇</span> Metro Station
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Noida Sector 18 (Blue Line)<br />
                                <span className="text-gray-400">Exit Gate 2 | 5 min walk</span>
                            </p>
                        </div>
                    </div>

                    {/* Local Transport Banner */}
                    <div className="mt-10 p-4 bg-sky-50/50 rounded-lg flex items-center gap-4 border border-sky-100">
                        <div className="text-blue-500">
                            <Car size={24} />
                        </div>
                        <div>
                            <h5 className="font-bold text-deepBlue text-sm flex items-center gap-2">
                                🚕 Local Transport Availability
                            </h5>
                            <p className="text-gray-600 text-xs">Easy access via cabs, buses and autos from all major locations in Delhi/NCR.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Simple Subway Icon since Subways might be different in lucide or needs import
function SubwayIcon({ size }: { size: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="16" height="16" x="4" y="3" rx="2" />
            <path d="M4 11h16" />
            <path d="M12 3v8" />
            <path d="m8 19-2 2" />
            <path d="m18 19 2 2" />
            <circle cx="8" cy="15" r="1" />
            <circle cx="16" cy="15" r="1" />
        </svg>
    )
}
