'use client';

import React, { useState, useMemo } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import PackageCard from './PackageCard';

interface YatraPackagesProps {
    packages: any[];
    title: string;
}

type SortOption = 'Popular' | 'Duration' | 'Price: Low to High' | 'Price: High to Low' | 'Recently Added';
type PriceFilter = 'All' | 'Under ₹50,000' | '₹50,000 - ₹1,00,000' | 'Above ₹1,00,000';

export default function YatraPackages({ packages, title }: YatraPackagesProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<SortOption>('Popular');
    const [priceFilter, setPriceFilter] = useState<PriceFilter>('All');

    const sortedPackages = useMemo(() => {
        // Filter out any null or non-object packages that might result from broken references
        let items = (packages || []).filter(pkg => pkg && typeof pkg === 'object');

        // Apply Price Filter
        if (priceFilter !== 'All') {
            items = items.filter(pkg => {
                const price = pkg.price || 0;
                switch (priceFilter) {
                    case 'Under ₹50,000':
                        return price < 50000;
                    case '₹50,000 - ₹1,00,000':
                        return price >= 50000 && price <= 100000;
                    case 'Above ₹1,00,000':
                        return price > 100000;
                    default:
                        return true;
                }
            });
        }

        switch (sortBy) {
            case 'Duration':
                return items.sort((a, b) => (b.duration || 0) - (a.duration || 0));
            case 'Price: Low to High':
                return items.sort((a, b) => (a.price || 0) - (b.price || 0));
            case 'Price: High to Low':
                return items.sort((a, b) => (b.price || 0) - (a.price || 0));
            case 'Recently Added':
                return items.sort((a, b) => {
                    const idA = a._id || '';
                    const idB = b._id || '';
                    return idB.localeCompare(idA);
                });
            case 'Popular':
            default:
                return items.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
        }
    }, [packages, sortBy, priceFilter]);

    return (
        <section className="py-16 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-black text-center text-gray-900 mb-12 uppercase tracking-tight">
                    {title} Packages
                </h2>

                {/* Filter & Sort Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex flex-col md:flex-row gap-4 w-full lg:flex-1 lg:min-w-0">
                        {/* Price Filter */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mr-2 whitespace-nowrap">Price:</span>
                            <div className="flex flex-nowrap gap-2">
                                {(['All', 'Under ₹50,000', '₹50,000 - ₹1,00,000', 'Above ₹1,00,000'] as PriceFilter[]).map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => setPriceFilter(opt)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${priceFilter === opt
                                            ? 'bg-deepBlue text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Divider for desktop */}
                        <div className="hidden md:block w-px h-8 bg-gray-200 mx-2"></div>

                        {/* Sort Options */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mr-2 whitespace-nowrap">Sort:</span>
                            <div className="flex flex-nowrap gap-2">
                                {(['Popular', 'Duration', 'Price: Low to High', 'Recently Added'] as SortOption[]).map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => setSortBy(opt)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${sortBy === opt
                                            ? 'bg-saffron text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'list'
                                ? 'bg-saffron text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            <List className="w-4 h-4" />
                            List
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'grid'
                                ? 'bg-saffron text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            Grid
                        </button>
                    </div>
                </div>

                {/* Packages Grid/List */}
                <div className={viewMode === 'grid'
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "flex flex-col gap-6"
                }>
                    {sortedPackages.map((pkg, index) => (
                        <PackageCard key={pkg._id || index} package={pkg} viewMode={viewMode} />
                    ))}
                </div>

                {sortedPackages.length === 0 && (
                    <div className="text-center py-20 text-gray-500 font-medium">
                        No packages found for this yatra.
                    </div>
                )}
            </div>
        </section>
    );
}
