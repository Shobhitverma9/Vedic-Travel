'use client';

import { useState, useEffect } from 'react';
import TourHighlightCards from './TourHighlightCards';

interface Highlight {
    image: string;
    title: string;
}

interface TourPageHeroProps {
    images: string[];
    packageType: string;
    highlights: (string | Highlight)[];
}

export default function TourPageHero({ images, packageType, highlights }: TourPageHeroProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const bgImages = images && images.filter(img => img && img.trim().length > 0).length > 0
        ? images.filter(img => img && img.trim().length > 0)
        : ['/header-vt.png'];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % bgImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [bgImages.length]);

    return (
        <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl border border-gray-100 group">
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
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deepBlue/20 to-deepBlue/90"></div>
                </div>
            ))}

            {/* Content Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-6">

                {/* Top Badge */}
                <div className="flex justify-end">
                    <span className="bg-saffron/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full font-bold text-xs tracking-widest uppercase shadow-lg border border-white/20">
                        {packageType || 'Land Only'} Package
                    </span>
                </div>

                {/* Bottom Section: Highlights Animation */}
                <div className="w-full">
                    {/* Optional Caption if needed, keeping it clean for now */}
                    <div className="mb-2 text-center">
                        <p className="text-white/80 font-handwriting text-lg drop-shadow-md">Experience Divine Beauty</p>
                    </div>

                    <TourHighlightCards highlights={highlights} />
                </div>
            </div>

            {/* Navigation Dots (Optional, for manual control if needed later) */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {bgImages.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
}
