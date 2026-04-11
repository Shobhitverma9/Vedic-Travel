'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TourImageSliderProps {
    images: string[];
    title: string;
    locations?: string[];
}

export default function TourImageSlider({ images, title, locations }: TourImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-[400px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                No Images Available
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Main Image Slider */}
            <div className="relative">
                <div className="relative h-[300px] md:h-[400px] w-full rounded-tr-[3rem] rounded-bl-[3rem] overflow-hidden border-4 border-white shadow-lg group">
                    <AnimatePresence>
                        <motion.img
                            key={currentIndex}
                            src={images[currentIndex]}
                            alt={`${title} - Image ${currentIndex + 1}`}
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        />
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    <button
                        onClick={(e) => { e.preventDefault(); prevImage(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white text-deepBlue p-2 rounded-full backdrop-blur-sm transition-all duration-300"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); nextImage(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white text-deepBlue p-2 rounded-full backdrop-blur-sm transition-all duration-300"
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>
            </div>

            {/* Places Highlights Strip */}
            <div>
                <h3 className="text-center text-lg font-handwriting text-deepBlue mb-3 relative inline-block w-full">
                    <span className="relative z-10 bg-white px-4">Places Highlights</span>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 -z-0"></div>
                </h3>

                <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                    {/* Display locations as highlights if available, otherwise just images */}
                    {(locations && locations.length > 0 ? locations : images.slice(0, 5)).map((item, idx) => {
                        const isLocation = typeof item === 'string' && locations?.includes(item);
                        const imgSrc = isLocation ? images[idx % images.length] : item;
                        const label = isLocation ? item : `View ${idx + 1}`;

                        return (
                            <div key={idx} className="flex flex-col items-center group cursor-pointer" onClick={() => setCurrentIndex(idx % images.length)}>
                                <div className={`w-full aspect-square rounded-xl overflow-hidden border-2 mb-1 transition-all ${currentIndex === idx ? 'border-saffron ring-2 ring-saffron/20' : 'border-gray-100'}`}>
                                    <img
                                        src={imgSrc}
                                        alt={label}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <span className="text-[10px] md:text-xs font-bold text-gray-600 text-center uppercase tracking-wide truncate w-full">
                                    {label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
