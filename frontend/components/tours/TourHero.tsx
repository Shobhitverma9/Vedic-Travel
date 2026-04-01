'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface TourHeroProps {
    images: string[];
    title: string;
    duration: number;
    locations: string[];
    packageType: string;
    highlights: string[];
}

export default function TourHero({ images, title, duration, locations, packageType, highlights }: TourHeroProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const bgImages = images && images.length > 0 ? images : ['/header-vt.png'];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % bgImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [bgImages.length]);

    return (
        <section className="relative h-[85vh] flex items-center justify-center bg-deepBlue overflow-hidden">
            {/* Background Image Slider */}
            {bgImages.map((img, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                    style={{
                        backgroundImage: `url('${img}')`,
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-deepBlue/50 via-deepBlue/40 to-deepBlue/90"></div>
                </div>
            ))}

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center pt-24 h-full justify-center">

                {/* Package Type Badge */}
                <div className="mb-6 animate-fade-in-down">
                    <span className="bg-saffron text-white px-6 py-2 rounded-full font-bold text-sm tracking-widest uppercase shadow-lg border border-white/20">
                        {packageType || 'Land Only'} Package
                    </span>
                </div>

                {/* Text Content */}
                <div className="text-center mb-12 animate-fade-in max-w-5xl mx-auto">
                    <h1 className="mb-4 leading-tight drop-shadow-2xl">
                        <span className="font-display italic text-3xl md:text-5xl text-white block mb-3 opacity-95">
                            Rediscover
                        </span>
                        <span className="font-sans font-bold text-4xl md:text-6xl lg:text-7xl text-white uppercase tracking-tight">
                            {title}
                        </span>
                    </h1>
                    <p className="font-sans text-xl md:text-2xl text-white font-medium tracking-wide drop-shadow-md max-w-2xl mx-auto opacity-90 mt-4">
                        {locations?.join(' - ') || 'Spiritual Journey'} | {duration} Days
                    </p>
                </div>

                {/* Highlights Strip (Bottom) */}
                {highlights && highlights.length > 0 && (
                    <div className="w-full max-w-6xl mt-auto mb-8 animate-slide-up">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                            <h3 className="text-white font-display italic text-xl mb-4 text-center">Journey Highlights</h3>
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-center">
                                {highlights.map((img, idx) => (
                                    <div key={idx} className="flex-shrink-0 w-32 h-24 md:w-40 md:h-28 rounded-lg overflow-hidden border-2 border-white/30 hover:scale-105 transition-transform cursor-pointer relative group">
                                        <Image
                                            src={img}
                                            alt={`Highlight ${idx}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
                <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}
