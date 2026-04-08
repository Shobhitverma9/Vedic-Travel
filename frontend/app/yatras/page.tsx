'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { yatrasService } from '@/services/yatras.service';

function YatrasContent() {
    const searchParams = useSearchParams();
    const search = searchParams.get('search');
    const [yatras, setYatras] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchYatras();
    }, [search]);

    const fetchYatras = async () => {
        try {
            setLoading(true);
            const response = await yatrasService.getAllYatras({
                isActive: true,
                search: search || undefined
            });
            setYatras(response || []);
        } catch (error) {
            console.error('Error fetching yatras:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-16">
            {/* Hero Section */}
            <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/cards/chardham.png')" }}
                >
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center px-4 animate-fade-in">
                    <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg uppercase tracking-tight">
                        {search ? `Search Results for "${search}"` : 'Our Divine Yatras'}
                    </h1>
                    <p className="text-white/90 text-xl font-medium max-w-2xl mx-auto drop-shadow-md">
                        {search
                            ? `Showing yatras matching your search. ${yatras.length === 0 ? 'No matches found.' : ''}`
                            : 'Embark on a spiritual journey to the most sacred destinations of Ancient Bharat.'
                        }
                    </p>
                    {search && (
                        <Link
                            href="/yatras"
                            className="inline-block mt-6 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full border border-white/50 transition-all text-sm font-semibold uppercase tracking-wider"
                        >
                            Clear Search
                        </Link>
                    )}
                </div>
            </section>

            {/* Yatras Grid */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="text-center py-12 min-h-[300px] flex items-center justify-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
                        </div>
                    ) : yatras.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {yatras.map((yatra: any) => (
                                <Link
                                    key={yatra._id}
                                    href={`/yatras/${yatra.slug}`}
                                    className="group relative h-[450px] rounded-2xl overflow-hidden shadow-2xl hover:shadow-saffron/20 transition-all duration-500 transform hover:-translate-y-2"
                                >
                                    {/* Background Image */}
                                    <div className="absolute inset-0">
                                        <img
                                            src={yatra.heroImage || '/images/hero-placeholder.jpg'}
                                            alt={yatra.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                        <h3 className="text-white font-display text-3xl font-bold mb-3 uppercase tracking-wider drop-shadow-lg">
                                            {yatra.title}
                                        </h3>
                                        <p className="text-white/80 line-clamp-2 text-sm mb-6 drop-shadow-md">
                                            {yatra.description}
                                        </p>
                                        <div className="flex items-center text-saffron font-bold uppercase tracking-widest text-xs">
                                            <span>Explore Packages</span>
                                            <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 text-lg font-medium">
                                {search ? 'No yatras matched your search criteria.' : 'No yatras available at the moment.'}
                            </p>
                            {search && (
                                <Link
                                    href="/yatras"
                                    className="mt-4 inline-block text-saffron font-bold hover:underline"
                                >
                                    View all yatras
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default function YatrasPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
            </div>
        }>
            <YatrasContent />
        </Suspense>
    );
}
