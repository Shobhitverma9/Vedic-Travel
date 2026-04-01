'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
    {
        id: 1,
        image: '/images/cards/chardham.png',
        title: 'Char Dham Yatra',
        description: 'Embark on a spiritual journey to the four sacred abodes of the Himalayas.',
    },
    {
        id: 2,
        image: '/images/cards/varanasi.png',
        title: 'Divine Varanasi',
        description: 'Experience the spiritual energy of the oldest living city in the world.',
    },
    {
        id: 3,
        image: '/images/tours/panch_jyotirlinga.png',
        title: 'Panch Jyotirlinga',
        description: 'Visit the five most sacred Shiva temples in Maharashtra.',
    },
];

export default function Slideshow() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-full w-full overflow-hidden bg-gray-900">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={slides[currentIndex].image}
                        alt={slides[currentIndex].title}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-10">
                <motion.div
                    key={`text-${currentIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <h2 className="text-4xl font-display font-bold mb-4">
                        {slides[currentIndex].title}
                    </h2>
                    <p className="text-lg text-gray-200 max-w-md">
                        {slides[currentIndex].description}
                    </p>
                </motion.div>

                <div className="flex gap-2 mt-8">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
