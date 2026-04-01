'use client';

import { useRef } from 'react';
import { useYatras } from '@/hooks/useYatras';
import TourCard from '@/components/shared/TourCard';
import Link from 'next/link';

export default function YatraSection() {
    const { data: yatras, isLoading: loading } = useYatras({ isActive: true, isVedicImprint: false, showOnHome: true });

    if (loading) return null;
    if (!yatras || yatras.length === 0) return null;

    return (
        <div className="flex flex-col gap-12 py-10">
            {yatras.map((yatra: any) => (
                <SingleYatraSection key={yatra._id} yatra={yatra} />
            ))}
        </div>
    );
}

function SingleYatraSection({ yatra }: { yatra: any }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 350;
            const currentScroll = scrollContainerRef.current.scrollLeft;
            scrollContainerRef.current.scrollTo({
                left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (!yatra.packages || yatra.packages.length === 0) return null;

    return (
        <section className="container mx-auto px-6 md:px-8">
            <div className="text-center mb-8 max-w-4xl mx-auto">
                <h2 className="font-sans text-4xl md:text-5xl font-bold text-deepBlue mb-4">
                    {yatra.title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                    {yatra.description}
                </p>
            </div>

            <div className="relative group">
                {/* Left Button */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-20 bg-white/80 hover:bg-white text-deepBlue rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                    disabled={!scrollContainerRef.current || scrollContainerRef.current.scrollLeft === 0}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Carousel */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide py-4 px-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {yatra.packages.map((tour: any) => (
                        <div key={tour._id} className="w-[260px] md:w-[300px] h-[480px] snap-center flex-shrink-0">
                            <TourCard tour={tour} isInternational={yatra.isVedicImprint} />
                        </div>
                    ))}
                </div>

                {/* Right Button */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-20 bg-white/80 hover:bg-white text-deepBlue rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </section>
    );
}
