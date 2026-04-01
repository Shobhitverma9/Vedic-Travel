'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useTours } from '@/hooks/useTours';
import { motion } from 'framer-motion';
import { Tour } from '@/services/tours.service';

export default function AllTimeFavorites() {
    const { data, isLoading: loading } = useTours({ isFavorite: true });
    const favorites: Tour[] = data?.tours || [];

    if (loading) {
        return (
            <section className="py-10 bg-[#006666]">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            </section>
        );
    }

    if (favorites.length === 0) return null;

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#004d4d] via-[#006666] to-[#004d4d]">
            {/* Top Wave - white color on teal background */}
            <div className="w-full overflow-hidden leading-none" style={{ fontSize: 0, marginBottom: '-2px' }}>
                <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[60px]" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#ffffff" d="M0,40L48,42C96,44,192,48,288,46C384,44,480,36,576,33C672,30,768,32,864,35C960,38,1056,42,1152,42C1248,41,1344,36,1392,34L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
                </svg>
            </div>

            <div className="mx-auto px-4 max-w-[1400px] pb-10 relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Start Journey to Enlightenment With <span className="font-sans italic text-saffron">Most Sought Tours</span>
                    </h2>
                    <p className="text-cyan-100 max-w-2xl mx-auto">
                        Embark on an unparalleled odyssey of spirituality with our specially-curated tour packages
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 grid-flow-dense" style={{ gridAutoRows: '300px' }}>
                    {favorites.map((tour, index) => {
                        // Determine grid spans based on favoriteSize
                        let gridClass = '';
                        if (tour.favoriteSize === 'large') {
                            gridClass = 'md:col-span-2 md:row-span-1'; // Changed from 2x2 to 2x1
                        } else if (tour.favoriteSize === 'wide') {
                            gridClass = 'md:col-span-2 md:row-span-1';
                        } else {
                            gridClass = 'md:col-span-1 md:row-span-1';
                        }

                        return (
                            <motion.div
                                key={tour._id}
                                className={`relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer ${gridClass}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/package/${tour._id}`} className="block w-full h-full">
                                    <div className="absolute inset-0 bg-gray-200">
                                        {tour.images && tour.images[0] ? (
                                            <img
                                                src={tour.images[0]}
                                                alt={tour.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-300"></div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 p-6 w-full text-white">
                                        <h3 className={`font-sans font-bold mb-1 ${tour.favoriteSize === 'large' ? 'text-3xl' : 'text-xl'}`}>
                                            {tour.title}
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-200 gap-3">
                                            <span>
                                                {tour.duration} Nights / {tour.duration + 1} Days
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Wave - white color on teal background */}
            <div className="w-full overflow-hidden leading-none" style={{ fontSize: 0, marginTop: '-2px' }}>
                <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[60px]" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#ffffff" d="M0,40C150,80,350,0,500,40C650,80,850,0,1000,40C1150,80,1350,0,1440,40L1440,80L0,80Z" />
                </svg>
            </div>
        </section>
    );
}
