'use client';

import React from 'react';
import { MapPin, Phone, Mail, Building2, Clock } from 'lucide-react';

export default function OfficeInfo() {
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Office Address Card */}
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm col-span-1 lg:col-span-2">
                        <h3 className="text-2xl font-bold text-deepBlue text-center mb-8 flex items-center justify-center gap-2">
                            Office Address
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="flex gap-4">
                                <div className="text-saffron shrink-0">
                                    <MapPin size={24} fill="currentColor" className="text-pink-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-deepBlue mb-2">Registered Office</h4>
                                    <p className="text-gray-600 leading-relaxed">
                                        201, JOP Plaza, Sector 18, Noida, Uttar Pradesh 201301
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-skyBlue shrink-0">
                                    <Building2 size={24} className="text-sky-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-deepBlue mb-2">Corporate Office</h4>
                                    <p className="text-gray-600 leading-relaxed">
                                        Vedic Travel, 101, JOP Plaza, Sector 18, Noida, Uttar Pradesh 201301
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Call Us Card */}
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-bold text-deepBlue mb-6 flex items-center gap-2">
                            Call Us
                        </h3>
                        <ul className="space-y-4">
                            {[
                                '+91-8447470062',
                            ].map((num, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700">
                                    <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center text-purple-600">
                                        <Phone size={14} />
                                    </div>
                                    <span className="font-medium">{num}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 flex items-center gap-2 text-gray-500 text-sm italic">
                            <Clock size={16} />
                            <span>Available 24/7 for your queries</span>
                        </div>
                    </div>

                    {/* Email Us Card */}
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-bold text-deepBlue mb-6 flex items-center gap-2">
                            Email Us
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-gray-700">
                                <div className="w-6 h-6 bg-sky-100 rounded flex items-center justify-center text-sky-600">
                                    <Mail size={14} />
                                </div>
                                <div>
                                    <span className="font-semibold mr-2">Bookings:</span>
                                    <a href="mailto:bookings@vedictravel.com" className="text-red-500 hover:underline">bookings@vedictravel.com</a>
                                </div>
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <div className="w-6 h-6 bg-sky-100 rounded flex items-center justify-center text-sky-600">
                                    <Mail size={14} />
                                </div>
                                <div>
                                    <span className="font-semibold mr-2">Support:</span>
                                    <a href="mailto:support@vedictravel.com" className="text-red-500 hover:underline">support@vedictravel.com</a>
                                </div>
                            </li>
                        </ul>
                        <p className="mt-8 text-gray-400 text-sm">
                            Response within 24 hours
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
