'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toursService } from '@/services/tours.service';
import { ChevronRight } from 'lucide-react';

export default function PopularPackagesSidebar() {
    const [tours, setTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTours() {
            try {
                const data = await toursService.getAllTours({ limit: 5 });
                setTours(data.tours || []);
            } catch (error) {
                console.error('Error fetching popular tours:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchTours();
    }, []);

    if (loading) return <div>Loading popular packages...</div>;

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-center">
                <h3 className="text-xl font-bold text-deepBlue">Popular Packages</h3>
            </div>
            <div className="p-4 space-y-4">
                {tours.map((tour) => (
                    <div key={tour._id} className="flex gap-4 group">
                        <div className="w-20 h-16 shrink-0 rounded-lg overflow-hidden relative">
                            <img
                                src={tour.images?.[0] || '/placeholder-tour.jpg'}
                                alt={tour.title}
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                        </div>
                        <div className="flex flex-col justify-between">
                            <h4 className="text-sm font-bold text-deepBlue line-clamp-2 leading-tight">
                                {tour.title}
                            </h4>
                            <Link
                                href={`/tours/${tour.slug}`}
                                className="text-red-500 text-xs font-bold flex items-center gap-1 hover:underline"
                            >
                                View Details <ChevronRight size={14} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
