'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, Users, Utensils, Hotel, Car, Camera, Phone } from 'lucide-react';
import InquiryModal from '../shared/InquiryModal';

interface PackageCardProps {
    package: any;
    viewMode: 'grid' | 'list';
}

export default function PackageCard({ package: pkg, viewMode }: PackageCardProps) {
    const isGrid = viewMode === 'grid';
    const [showInquiryModal, setShowInquiryModal] = useState(false);

    return (
        <>
            <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex ${isGrid ? 'flex-col' : 'flex-col md:flex-row'}`}>
                {/* Image Overlay */}
                <Link href={`/package/${pkg.slug}`} className={`relative ${isGrid ? 'w-full h-48' : 'w-full md:w-80 h-64 md:h-auto'} block overflow-hidden`}>
                    <img
                        src={pkg.images?.[0] || '/images/tour-placeholder.jpg'}
                        alt={pkg.title}
                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                    />
                    {pkg.badge && (
                        <div className="absolute top-4 left-0 bg-saffron text-white text-xs font-bold px-3 py-1.5 rounded-r-lg shadow-sm">
                            {pkg.badge}
                        </div>
                    )}
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Handle wishlist toggle if implemented here
                        }}
                        className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors z-10"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </Link>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-saffron transition-colors clamp-2">
                        <Link href={`/package/${pkg.slug}`}>
                            {pkg.title}
                        </Link>
                    </h3>

                    <div className="flex items-center text-xs text-gray-500 mb-3 space-x-3">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-saffron" />
                            {pkg.duration - 1} Night / {pkg.duration} Days
                        </div>
                    </div>

                    <div className="flex items-end space-x-3 mb-3">
                        <div>
                            <span className="text-xl font-black text-gray-900 whitespace-nowrap">₹{pkg.price?.toLocaleString() || '0'}</span>
                            {pkg.priceOriginal && (
                                <span className="text-sm text-gray-400 line-through ml-2">₹{pkg.priceOriginal?.toLocaleString()}</span>
                            )}
                        </div>
                        {pkg.emiStartingFrom > 0 && (
                            <div className="text-[10px] text-blue-600 font-medium pb-1">
                                EMI from ₹{pkg.emiStartingFrom}/mo
                            </div>
                        )}
                    </div>

                    {/* Inclusions */}
                    <div className="mb-4">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Inclusions:</div>
                        <div className="flex space-x-4">
                            <div className="flex flex-col items-center">
                                <div className="bg-orange-50 p-1.5 rounded-full mb-1">
                                    <Utensils className="w-3 h-3 text-orange-500" />
                                </div>
                                <span className="text-[9px] font-medium text-gray-600">Meals</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="bg-purple-50 p-1.5 rounded-full mb-1">
                                    <Hotel className="w-3 h-3 text-purple-500" />
                                </div>
                                <span className="text-[9px] font-medium text-gray-600">Stay</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="bg-green-50 p-1.5 rounded-full mb-1">
                                    <Car className="w-3 h-3 text-green-500" />
                                </div>
                                <span className="text-[9px] font-medium text-gray-600">Transfer</span>
                            </div>
                            {pkg.packageIncludes?.includes('Sightseeing') && (
                                <div className="flex flex-col items-center">
                                    <div className="bg-blue-50 p-1.5 rounded-full mb-1">
                                        <Camera className="w-3 h-3 text-blue-500" />
                                    </div>
                                    <span className="text-[9px] font-medium text-gray-600">Sightseeing</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-auto flex items-center space-x-3">
                        <Link
                            href={`/package/${pkg.slug}`}
                            className="flex-1 text-center py-2.5 border border-red-500 text-red-500 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors"
                        >
                            View Details
                        </Link>
                        <button
                            onClick={() => setShowInquiryModal(true)}
                            className="p-2.5 px-4 bg-saffron text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-colors shadow-md shadow-saffron/20"
                        >
                            Enquire Now
                        </button>
                    </div>
                </div>
            </div>

            <InquiryModal
                isOpen={showInquiryModal}
                onClose={() => setShowInquiryModal(false)}
                tourId={pkg._id}
                tourName={pkg.title}
                tourImage={pkg.images?.[0]}
            />
        </>
    );
}
