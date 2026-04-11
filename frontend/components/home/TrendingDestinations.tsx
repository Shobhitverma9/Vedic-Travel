'use client';

import { useState, useEffect, useRef } from 'react';
import { useTours } from '@/hooks/useTours';
import TourCard from '@/components/shared/TourCard';

export default function TrendingDestinations() {
    const { data, isLoading: loading } = useTours({ isTrending: true, limit: 10, sortBy: 'trendingRank', order: 'asc' });
    const tours = data?.tours || [];
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [scrollPos, setScrollPos] = useState(0);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 350; // Approx card width + gap
            const currentScroll = scrollContainerRef.current.scrollLeft;
            scrollContainerRef.current.scrollTo({
                left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const handleScroll = () => setScrollPos(el.scrollLeft);
        el.addEventListener('scroll', handleScroll);
        return () => el.removeEventListener('scroll', handleScroll);
    }, [tours]); // re-run once tours load and the carousel is in the DOM

    if (loading) return null; // Or a skeleton loader
    if (!tours || tours.length === 0) return null;

    return (
        <section className="py-16 relative overflow-hidden bg-white">
            {/* Background Texture/Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url(/pattern-bg.png)' }}></div>

            <div className="container mx-auto px-6 md:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    {/* Left Column: Heading & Social Proof */}
                    <div className="md:col-span-3 md:sticky md:top-24 self-start">
                        <div className="relative inline-block mb-4">
                            <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-saffron to-purple opacity-30 blur"></span>
                            <span className="relative inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-saffron tracking-wider uppercase border border-white/20">
                                Trending Now
                            </span>
                        </div>

                        <h2 className="font-sans text-4xl md:text-5xl font-bold text-deepBlue mb-4 leading-tight">
                            Recently <br /> <span className="text-saffron">Booked</span> <br /> Itineraries
                        </h2>

                        <p className="text-gray-600 text-lg mb-8 max-w-xs">
                            Discover the most loved spiritual journeys chosen by fellow travelers.
                        </p>

                        {/* Social Proof Badge */}
                        <div className="inline-flex items-center gap-3 bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl mb-8 md:mb-0">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-deepBlue overflow-hidden">
                                        <img src={`/images/users/user${i}.png`} alt="user" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm">
                                <span className="block text-deepBlue font-bold">140+ Trips</span>
                                <span className="text-gray-500 text-xs">booked last week</span>
                            </div>
                        </div>

                        {/* Navigation Buttons (Desktop) */}
                        <div className="hidden md:flex gap-4 mt-8">
                            <button
                                onClick={() => scroll('left')}
                                className="w-12 h-12 flex items-center justify-center rounded-full bg-white hover:bg-gray-50 text-deepBlue border border-gray-200 shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                disabled={scrollPos === 0}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="w-12 h-12 flex items-center justify-center rounded-full bg-saffron hover:bg-saffron-dark text-white shadow-lg shadow-saffron/20 transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Carousel */}
                    <div className="md:col-span-9 min-w-0">
                        <div className="relative group">
                            {/* Mobile Navigation Buttons overlay */}
                            <div className="md:hidden absolute top-[64%] left-0 z-20 pointer-events-none -translate-y-1/2">
                                <button
                                    onClick={() => scroll('left')}
                                    className="pointer-events-auto bg-black/30 backdrop-blur-sm text-white p-2 rounded-r-lg"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                            </div>
                            <div className="md:hidden absolute top-[64%] right-0 z-20 pointer-events-none -translate-y-1/2">
                                <button
                                    onClick={() => scroll('right')}
                                    className="pointer-events-auto bg-black/30 backdrop-blur-sm text-white p-2 rounded-l-lg"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>

                            <div
                                id="trending-tours-carousel"
                                ref={scrollContainerRef}
                                className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {tours.map((tour: any) => (
                                    <div key={tour._id} className="w-[280px] md:w-[320px] snap-center flex-shrink-0">
                                        <TourCard tour={tour} isTrending={true} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
