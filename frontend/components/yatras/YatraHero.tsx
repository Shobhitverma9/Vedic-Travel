'use client';

import React from 'react';

interface YatraHeroProps {
    title: string;
    image: string;
    thumbnailImages?: string[];
}

const FALLBACK_THUMBNAILS = [
    '/images/tours/chardham_heli_yatra.png',
    '/images/tours/divine_south_india.png',
];

export default function YatraHero({ title, image, thumbnailImages }: YatraHeroProps) {
    // Use provided thumbnails, fall back to default decorative images
    const thumb1 = thumbnailImages?.[0] ?? FALLBACK_THUMBNAILS[0];
    const thumb2 = thumbnailImages?.[1] ?? FALLBACK_THUMBNAILS[1];

    return (
        <section className="relative w-full h-[400px] md:h-[550px] lg:h-[650px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={image || '/images/hero-placeholder.jpg'}
                    alt={title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center">
                <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg uppercase tracking-tight">
                        {title}
                    </h1>
                    <div className="w-24 h-1.5 bg-saffron rounded-full"></div>
                </div>

                {/* Decorative floating thumbnail images */}
                <div className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 hidden lg:flex space-x-4">
                    <div className="transform -rotate-6 border-4 border-white rounded-3xl overflow-hidden shadow-2xl w-56 h-72">
                        <img src={thumb1} alt="Thumbnail 1" className="w-full h-full object-cover" />
                    </div>
                    <div className="transform rotate-6 translate-y-12 border-4 border-white rounded-3xl overflow-hidden shadow-2xl w-56 h-72">
                        <img src={thumb2} alt="Thumbnail 2" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Wave effect at bottom */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[40px] md:h-[60px] fill-white">
                    <path d="M321.39,56.44c13.2,0,22,1,22,1s11-1,22-1,22,1,22,1,11-1,22-1,22,1,22,1,11-1,22-1,22,1,22,1,11-1,22-1,22,1,22,1,11-1,22-1,22,1,22,1S1200,81,1200,81V0H0V81S11,56.44,321.39,56.44Z"></path>
                </svg>
            </div>
        </section>
    );
}
