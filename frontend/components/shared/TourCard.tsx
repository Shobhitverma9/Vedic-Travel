'use client';

import Link from 'next/link';
import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { paymentsService } from '@/services/payments.service';
import { useEffect } from 'react';
import InquiryModal from './InquiryModal';

interface TourCardProps {
    tour: any;
    isTrending?: boolean;
    isInternational?: boolean;
}

export default function TourCard({ tour, isTrending = false, isInternational = false }: TourCardProps) {
    const [isInWishlist, setIsInWishlist] = useState(false);

    const [showInquiryModal, setShowInquiryModal] = useState(false);
    const [lowestEmi, setLowestEmi] = useState<number | null>(null);

    useEffect(() => {
        if (tour.price) {
            paymentsService.getEmiOptions(tour.price)
                .then(data => setLowestEmi(data.lowestEmi))
                .catch(err => console.error('Failed to fetch EMI options', err));
        }
    }, [tour.price]);

    const handleWishlistToggle = async () => {
        try {
            await authService.toggleWishlist(tour._id);
            setIsInWishlist(!isInWishlist);
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    return (
        <>
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full relative border border-gray-100">
                {/* Image Area - Reduced Height */}
                <div className="relative h-40 overflow-hidden">
                    <img
                        src={tour.images?.[0] || '/placeholder-tour.jpg'}
                        alt={tour.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {isInternational && (
                            <span className="bg-deepBlue/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                International
                            </span>
                        )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlistToggle}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white transition-all group-hover:scale-110"
                    >
                        <svg
                            className={`w-5 h-5 ${isInWishlist ? 'text-red-500 fill-current' : 'text-white'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>

                    {/* Duration Overlay */}
                    <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {tour.duration - 1}N / {tour.duration}D
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow relative text-left">
                    <h3 className="text-lg font-bold text-deepBlue mb-2 leading-tight line-clamp-2 min-h-[3rem] group-hover:text-purple-700 transition-colors">
                        {tour.title}
                    </h3>

                    {/* Route - Restored */}
                    {tour.locations && (
                        <div className="text-xs text-gray-500 mb-2 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-saffron flex-shrink-0"></span>
                            <span className="line-clamp-1">{tour.locations.join(' → ')}</span>
                        </div>
                    )}

                    {/* Highlights - Restored List */}
                    <div className="space-y-1 mb-4 flex-grow">
                        {tour.highlights?.temples?.slice(0, 3).map((highlight: string, i: number) => (
                            <div key={i} className="flex items-start text-xs text-gray-600">
                                <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span className="line-clamp-1">{highlight}</span>
                            </div>
                        ))}
                        {(!tour.highlights?.temples || tour.highlights.temples.length === 0) && (
                            <p className="text-xs text-gray-400">View details for full itinerary.</p>
                        )}
                    </div>

                    {/* Footer: Price & Actions */}
                    <div className="mt-auto flex items-end justify-between pt-3 border-t border-gray-100/50">
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Starting from</p>
                            <p className="text-xl font-bold text-deepBlue whitespace-nowrap">
                                ₹{tour.price ? tour.price.toLocaleString() : 'N/A'}
                            </p>
                            {lowestEmi && (
                                <p className="text-xs text-green-600 font-semibold mt-1">
                                    EMI starts ₹{lowestEmi.toLocaleString()}/mo
                                </p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowInquiryModal(true)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-saffron/10 text-saffron hover:bg-saffron hover:text-white transition-colors"
                                title="Enquire"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8H8l-4 4V5a2 2 0 012-2h10a2 2 0 012 2v7z" /></svg>
                            </button>
                            <Link
                                href={`/package/${tour.slug}`}
                                className="px-4 py-2 bg-purple text-white text-xs font-bold uppercase rounded-lg hover:bg-purple-dark transition-all shadow-md shadow-purple/20 flex items-center gap-1"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <InquiryModal
                isOpen={showInquiryModal}
                onClose={() => setShowInquiryModal(false)}
                tourId={tour._id}
                tourName={tour.title}
                tourImage={tour.images?.[0]}
            />
        </>
    );
}
