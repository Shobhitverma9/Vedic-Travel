'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { yatrasService } from '@/services/yatras.service';

interface Yatra {
    _id: string;
    title: string;
    description: string;
    heroImage?: string;
    packages: {
        _id: string;
        title: string;
        images: string[];
        price: number;
    }[];
    slug?: string;
}

export default function VedicImprintsSection() {
    const [yatras, setYatras] = useState<Yatra[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchYatras = async () => {
            try {
                const response = await yatrasService.getAllYatras({ isActive: true, isVedicImprint: true });
                setYatras(response || []);
            } catch (error) {
                console.error('Error fetching Vedic Imprints (International):', error);
            } finally {
                setLoading(false);
            }
        };

        fetchYatras();
    }, []);

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

    if (loading) return null;
    if (!yatras || yatras.length === 0) return null;

    return (
        <section className="py-16 bg-[#FDF8F3]">
            <div className="container mx-auto px-4 relative">

                {/* Header */}
                <div className="flex justify-between items-center mb-10 px-2">
                    <div>
                        <h2 className="font-sans text-4xl md:text-5xl font-bold text-deepBlue mb-2">
                            Vedic Imprints (International)
                        </h2>
                        <div className="h-1.5 w-24 bg-saffron rounded-full"></div>
                    </div>
                    <Link href="/tours" className="hidden md:block font-bold text-lg text-deepBlue hover:text-saffron transition-colors">
                        International Destinations →
                    </Link>
                </div>

                <div className="relative group">
                    {/* Navigation Buttons */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white text-deepBlue rounded-full p-3 shadow-xl transition-all hover:bg-saffron hover:text-white disabled:opacity-0"
                        disabled={!scrollContainerRef.current || scrollContainerRef.current.scrollLeft === 0}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white text-deepBlue rounded-full p-3 shadow-xl transition-all hover:bg-saffron hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Carousel */}
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-8 pb-10 snap-x snap-mandatory scrollbar-hide py-4 px-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {yatras.map((yatra, index) => {
                            const coverImage = yatra.heroImage || yatra.packages?.[0]?.images?.[0] || '/images/hero-bg.jpg';
                            const startingPrice = yatra.packages?.[0]?.price;

                            return (
                                <div key={yatra._id} className="min-w-[320px] md:min-w-[340px] snap-center h-[460px] relative rounded-[2rem] overflow-hidden shadow-2xl group/card cursor-pointer border-4 border-white/50">
                                    <Link href={`/yatras/${yatra.slug || yatra._id}`} className="absolute inset-0 z-20 block" />

                                    <div className="absolute inset-0 z-0">
                                        <Image
                                            src={coverImage}
                                            alt={yatra.title}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover/card:scale-110"
                                            sizes="(max-width: 768px) 320px, 340px"
                                            priority={index < 2}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 z-20 p-0 flex flex-col justify-end">
                                        <div className="bg-saffron text-white text-center py-4 font-bold text-xl uppercase tracking-widest shadow-lg">
                                            {yatra.title}
                                        </div>
                                        <div className="bg-[#1A2B48] text-white flex justify-between items-center px-6 py-4">
                                            {startingPrice ? (
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Starting from</span>
                                                    <span className="text-lg font-bold">Rs. {startingPrice.toLocaleString()}/-</span>
                                                </div>
                                            ) : (
                                                <span className="text-md font-bold tracking-wider">COMING SOON</span>
                                            )}
                                            <div className="bg-white/10 p-2 rounded-lg group-hover/card:bg-white/20 transition-colors">
                                                <svg className="w-5 h-5 text-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
