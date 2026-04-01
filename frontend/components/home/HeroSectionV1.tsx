'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import HeroCardsAnimation from './HeroCardsAnimation';
import { settingsService } from '@/services/settings.service';
import { yatrasService } from '@/services/yatras.service';
import { toursService } from '@/services/tours.service';

const bgImages = [
    '/header-vt.png',
    '/images/cards/chardham.png',
    '/images/cards/varanasi.png',
];

export default function HeroSectionV1() {
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [images, setImages] = useState<string[]>(bgImages);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const [isFetching, setIsFetching] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const query = searchQuery.trim();
        if (query) {
            setShowSuggestions(false);
            router.push(`/yatras?search=${encodeURIComponent(query)}`);
        }
    };

    const handleSuggestionClick = (suggestion: any) => {
        setShowSuggestions(false);
        if (suggestion.type === 'yatra') {
            router.push(`/yatras/${suggestion.slug}`);
        } else {
            router.push(`/package/${suggestion.slug}`);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        setActiveSuggestion(-1);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (value.trim().length < 1) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            try {
                setIsFetching(true);
                const [yatrasResults, toursResults] = await Promise.all([
                    yatrasService.getAllYatras({
                        isActive: true,
                        search: value.trim(),
                    }),
                    toursService.getAllTours({
                        isActive: true,
                        search: value.trim(),
                        limit: 5,
                    })
                ]);

                const formattedYatras = (yatrasResults || []).map((y: any) => ({ ...y, type: 'yatra' }));
                const formattedTours = (toursResults?.tours || []).map((t: any) => ({ ...t, type: 'package' }));

                setSuggestions([...formattedYatras, ...formattedTours]);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Search error:', error);
                setSuggestions([]);
            } finally {
                setIsFetching(false);
            }
        }, 300);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestion((prev) => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestion((prev) => Math.max(prev - 1, -1));
        } else if (e.key === 'Enter' && activeSuggestion >= 0) {
            e.preventDefault();
            handleSuggestionClick(suggestions[activeSuggestion]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const data = await settingsService.getSetting('hero_slider_images');
                if (data && data.value && Array.isArray(data.value) && data.value.length > 0) {
                    setImages(data.value);
                }
            } catch (error) {
                console.error('Error fetching hero images:', error);
            }
        };
        fetchImages();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images]);

    return (
        <section className="relative min-h-[100dvh] lg:min-h-[75vh] xl:min-h-[70vh] flex items-center justify-center bg-deepBlue overflow-hidden py-16 md:py-24 lg:py-12">
            {/* Background Image Slider */}
            {images.map((img, index) => (
                <div
                    key={img}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                    style={{
                        backgroundImage: `url('${img}')`,
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-deepBlue/40 via-deepBlue/60 to-deepBlue/80"></div>
                </div>
            ))}

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center pt-24 md:pt-32 lg:pt-20">
                {/* Text Content */}
                <div className="text-center mb-6 lg:mb-4 animate-fade-in max-w-4xl mx-auto">
                    <h1 className="mb-4 leading-tight drop-shadow-lg">
                        <span className="font-sans italic text-3xl md:text-5xl text-white block mb-2 opacity-90">Rediscovering</span>
                        <span className="font-sans font-bold text-4xl md:text-6xl lg:text-7xl text-white uppercase tracking-tight">Ancient Bharat</span>
                    </h1>
                    <p className="font-sans text-lg md:text-xl text-white font-medium tracking-wide drop-shadow-md max-w-xl mx-auto opacity-90">
                        In The Most Divine Destinations
                    </p>
                </div>

                {/* Search Bar with Autocomplete */}
                <div ref={containerRef} className="w-full max-w-2xl mx-auto relative z-20 mb-6 lg:mb-4 animate-slide-up">
                    <form
                        onSubmit={handleSearch}
                        className="bg-white rounded-full p-1.5 flex shadow-2xl"
                    >
                        <div className="flex-grow flex items-center px-4">
                            {isFetching ? (
                                <div className="w-5 h-5 mr-3 border-2 border-gray-300 border-t-deepBlue rounded-full animate-spin flex-shrink-0" />
                            ) : (
                                <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                            <input
                                type="text"
                                placeholder="Search Your Dream Pilgrimage!"
                                value={searchQuery}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                className="w-full py-2.5 focus:outline-none text-deepBlue placeholder-gray-400 text-base"
                                autoComplete="off"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => { setSearchQuery(''); setSuggestions([]); setShowSuggestions(false); }}
                                    className="text-gray-400 hover:text-gray-600 ml-1 flex-shrink-0"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="bg-deepBlue hover:bg-deepBlue-light text-white px-8 py-2.5 rounded-full font-semibold text-base transition-colors flex-shrink-0"
                        >
                            Search
                        </button>
                    </form>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 max-h-96 overflow-y-auto transform origin-top transition-all duration-200 custom-scrollbar">
                            {/* Yatras Section */}
                            {suggestions.some(s => s.type === 'yatra') && (
                                <div className="border-b border-gray-50 last:border-0">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] px-4 pt-4 pb-2">
                                        Suggested Yatras
                                    </p>
                                    {suggestions.filter(s => s.type === 'yatra').map((yatra, index) => (
                                        <button
                                            key={yatra._id}
                                            type="button"
                                            onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(yatra); }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${index === activeSuggestion && suggestions[activeSuggestion].type === 'yatra' ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
                                        >
                                            {yatra.heroImage ? (
                                                <img
                                                    src={yatra.heroImage}
                                                    alt={yatra.title}
                                                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-deepBlue font-bold text-sm truncate">{yatra.title}</p>
                                                <p className="text-gray-400 text-[11px] truncate">{yatra.description}</p>
                                            </div>
                                            <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Packages Section */}
                            {suggestions.some(s => s.type === 'package') && (
                                <div className="border-b border-gray-50 last:border-0">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] px-4 pt-4 pb-2">
                                        Featured Packages
                                    </p>
                                    {suggestions.filter(s => s.type === 'package').map((pkg, index) => {
                                        const globalIndex = suggestions.findIndex(s => s._id === pkg._id);
                                        return (
                                            <button
                                                key={pkg._id}
                                                type="button"
                                                onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(pkg); }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${globalIndex === activeSuggestion ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                            >
                                                {pkg.images?.[0] ? (
                                                    <img
                                                        src={pkg.images[0]}
                                                        alt={pkg.title}
                                                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-deepBlue font-bold text-sm truncate">{pkg.title}</p>
                                                        {pkg.price && (
                                                            <span className="text-[10px] font-bold text-saffron bg-saffron/10 px-1.5 py-0.5 rounded">₹{pkg.price}</span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-400 text-[11px] truncate">
                                                        {pkg.duration} Days • {pkg.locations?.join(', ')}
                                                    </p>
                                                </div>
                                                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            <button
                                type="button"
                                onMouseDown={(e) => { e.preventDefault(); handleSearch(); }}
                                className="w-full px-4 py-4 text-center text-xs text-deepBlue font-bold uppercase tracking-widest hover:bg-gray-50 bg-gray-50/30 border-t border-gray-100 transition-colors"
                            >
                                See all results for &ldquo;{searchQuery}&rdquo;
                            </button>
                        </div>
                    )}

                    {/* No results message */}
                    {showSuggestions && !isFetching && searchQuery.trim().length >= 1 && suggestions.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 px-4 py-4 text-center">
                            <p className="text-gray-500 text-sm">No yatras found for &ldquo;{searchQuery}&rdquo;</p>
                            <p className="text-gray-400 text-xs mt-1">Try a different search term</p>
                        </div>
                    )}
                </div>

                {/* Animation below search bar */}
                <div className="w-full transform translate-y-4">
                    <HeroCardsAnimation />
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}
