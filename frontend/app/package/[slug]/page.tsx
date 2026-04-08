'use client';


import { useState, useEffect, useRef } from 'react';
import { toursService } from '@/services/tours.service';
import { settingsService } from '@/services/settings.service';
import { notFound } from 'next/navigation';
import TourPageHero from '@/components/tours/TourPageHero';
import TourPricingCard from '@/components/tours/TourPricingCard';
import TourItinerary from '@/components/tours/TourItinerary';
import { Luggage, BedDouble, Utensils, Binoculars, Plane, FileCheck, Car, CheckCircle, Hotel, Camera } from 'lucide-react';
import CalculatePriceContainer from '@/components/tours/CalculatePrice/CalculatePriceContainer';
import TourPolicies from '@/components/tours/TourPolicies';
import TourCard from '@/components/shared/TourCard';

const getIconForInclude = (include: string) => {
    const lower = include.toLowerCase();

    // Hotel/Stay
    if (lower.includes('hotel') || lower.includes('accommodation') || lower.includes('stay')) {
        return (
            <div className="bg-purple-50 p-1.5 rounded-full">
                <Hotel className="w-4 h-4 text-purple-500" />
            </div>
        );
    }

    // Sightseeing/Camera
    if (lower.includes('sightseeing') || lower.includes('darshan') || lower.includes('temple')) {
        return (
            <div className="bg-blue-50 p-1.5 rounded-full">
                <Camera className="w-4 h-4 text-blue-500" />
            </div>
        );
    }

    // Transfer/Car
    if (lower.includes('transfer') || lower.includes('cab') || lower.includes('transport')) {
        return (
            <div className="bg-green-50 p-1.5 rounded-full">
                <Car className="w-4 h-4 text-green-500" />
            </div>
        );
    }

    // Meals/Utensils
    if (lower.includes('meal') || lower.includes('breakfast') || lower.includes('dinner') || lower.includes('food')) {
        return (
            <div className="bg-orange-50 p-1.5 rounded-full">
                <Utensils className="w-4 h-4 text-orange-500" />
            </div>
        );
    }

    if (lower.includes('flight') || lower.includes('air')) {
        return (
            <div className="bg-sky-50 p-1.5 rounded-full">
                <Plane className="w-4 h-4 text-sky-500" />
            </div>
        );
    }

    if (lower.includes('visa')) {
        return (
            <div className="bg-indigo-50 p-1.5 rounded-full">
                <FileCheck className="w-4 h-4 text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 p-1.5 rounded-full">
            <CheckCircle className="w-4 h-4 text-gray-400" />
        </div>
    );
};

export default function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const [tour, setTour] = useState<any>(null);
    const [otherTours, setOtherTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
    const [hasAutoTriggered, setHasAutoTriggered] = useState(false);
    const inclusionsRef = useRef<HTMLDivElement>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-open modal after 15 seconds
    useEffect(() => {
        // Only start if not loading, tour is present, and we haven't already triggered or set a timer
        if (loading || !tour || hasAutoTriggered || timerRef.current) return;

        timerRef.current = setTimeout(() => {
            if (!hasAutoTriggered) {
                setIsEnquiryModalOpen(true);
                setHasAutoTriggered(true);
            }
        }, 15000); // 15 seconds

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [loading, tour, hasAutoTriggered]);

    // Intersection Observer for Inclusions section
    /*
    useEffect(() => {
        if (loading || !tour || hasAutoTriggered) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !hasAutoTriggered) {
                    setIsEnquiryModalOpen(true);
                    setHasAutoTriggered(true);
                }
            },
            { threshold: 0.2 } // Trigger when 20% of section is visible
        );

        if (inclusionsRef.current) {
            observer.observe(inclusionsRef.current);
        }

        return () => {
            if (inclusionsRef.current) {
                observer.unobserve(inclusionsRef.current);
            }
        };
    }, [loading, tour, hasAutoTriggered]);
    */

    useEffect(() => {
        const fetchTour = async () => {
            const resolvedParams = await params;
            try {
                // Check if slug is a valid MongoDB ObjectId (24 hex characters)
                const isObjectId = /^[0-9a-fA-F]{24}$/.test(resolvedParams.slug);

                let data;
                if (isObjectId) {
                    data = await toursService.getTourById(resolvedParams.slug);
                } else {
                    data = await toursService.getTourBySlug(resolvedParams.slug);
                }
                setTour(data);

                // Fetch global "Others are also choosing" settings
                try {
                    const settingsData = await settingsService.getSetting('global_others_choosing');
                    if (settingsData && settingsData.value && Array.isArray(settingsData.value) && settingsData.value.length > 0) {
                        const globalToursResponse = await toursService.getAllTours({ ids: settingsData.value, limit: 12 });
                        // Sort hydrated tours to match the order of IDs in the setting
                        const hydrated = settingsData.value
                            .map((id: string) => globalToursResponse.tours.find((t: any) => t._id === id))
                            .filter((t: any) => t && t._id !== data._id);
                        setOtherTours(hydrated.slice(0, 4));
                    } else {
                        // Fallback to existing logic if no global settings
                        const allToursResponse = await toursService.getAllTours({ limit: 5 });
                        const filteredOtherTours = (allToursResponse.tours || []).filter((t: any) => t._id !== data._id).slice(0, 4);
                        setOtherTours(filteredOtherTours);
                    }
                } catch (err) {
                    // Fallback to existing logic if settings fetch fails
                    const allToursResponse = await toursService.getAllTours({ limit: 5 });
                    const filteredOtherTours = (allToursResponse.tours || []).filter((t: any) => t._id !== data._id).slice(0, 4);
                    setOtherTours(filteredOtherTours);
                }
            } catch (error) {
                console.error('Error fetching tour:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTour();
    }, [params]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
            </div>
        );
    }

    if (!tour) return notFound();

    // Mock data for wireframe specific fields
    const originalPrice = tour.priceOriginal || Math.round(tour.price * 1.25);
    const nights = tour.duration - 1;
    const joiningFrom = tour.joiningFrom || 'Joining Direct';

    return (
        <div className="min-h-screen bg-white pb-20 font-sans overflow-x-hidden max-w-full">
            {/* 1. New Hero Section */}
            <div className="max-w-7xl mx-auto px-4 py-6 pt-24 md:pt-36">

                {/* 1. Header Section (Title + Subheader) */}
                <div className="mb-6 border-b pb-4">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h1 className="text-2xl md:text-5xl font-display font-bold text-deepBlue">
                                    {tour.title}
                                </h1>
                                <span className="text-sm md:text-lg text-gray-500 font-medium whitespace-nowrap">
                                    ({nights} Nights / {tour.duration} Days)
                                </span>
                            </div>
                            <p className="text-lg text-gray-700 font-medium">
                                {tour.nightDistribution || `2N ${tour.locations?.[0]} | 1N ${tour.locations?.[1]}`}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            {/* Pricing or extra badges could go here if needed, but Pricing Card handles it */}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">

                    {/* LEFT COLUMN: Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 2. New Hero Section (Left Sided) */}
                        <div className="mb-6">
                            <TourPageHero
                                images={tour.slideshowImages || tour.images}
                                packageType={tour.packageType}
                                highlights={tour.placesHighlights}
                            />
                        </div>

                        {/* 3. Redesigned Compact Info Strip */}
                        <div className="bg-gray-50/50 rounded-2xl border border-gray-200/60 shadow-sm p-3 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-0 lg:divide-x divide-gray-200/80 items-stretch">
                                {/* Duration */}
                                <div className="flex items-center gap-3 px-4 py-2 group hover:bg-white transition-all rounded-xl lg:rounded-none">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50/50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-50 transition-all border border-orange-100/50">
                                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Duration</p>
                                        <p className="font-bold text-deepBlue text-sm whitespace-nowrap">{nights}N / {tour.duration}D</p>
                                    </div>
                                </div>

                                {/* Joining From */}
                                <div className="flex items-center gap-3 px-4 py-2 group hover:bg-white transition-all rounded-xl lg:rounded-none">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50/50 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-50 transition-all border border-purple-100/50">
                                        <Plane className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Joining From</p>
                                        <p className="font-bold text-deepBlue text-sm leading-tight whitespace-normal break-words">Ex: {joiningFrom}</p>
                                    </div>
                                </div>

                                {/* Includes */}
                                <div className="flex flex-col justify-center px-4 py-2 group hover:bg-white transition-all rounded-xl lg:rounded-none">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Package Includes</p>
                                    <div className="flex flex-wrap items-center gap-4">
                                        {(tour.packageIncludes && tour.packageIncludes.length > 0 ? tour.packageIncludes : ['Hotel', 'Sightseeing', 'Transfer', 'Meals']).slice(0, 5).map((item: string) => (
                                            <div key={item} title={item} className="flex flex-col items-center group/icon">
                                                <div className="scale-75 origin-center">
                                                    {getIconForInclude(item)}
                                                </div>
                                                <span className="text-[8px] font-bold text-gray-400/80 uppercase tracking-tighter mt-0.5 group-hover/icon:text-deepBlue flex-shrink-0">{item}</span>
                                            </div>
                                        ))}
                                        {(tour.packageIncludes?.length > 5) && (
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200" title="More inclusions">
                                                <span className="text-[8px] font-bold text-gray-500">+{tour.packageIncludes.length - 5}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Places Flow Row */}
                            <div className="mt-2 pt-3 border-t border-gray-200/60 px-4 pb-2">
                                <div className="flex items-start gap-4">
                                    <div className="w-9 h-9 rounded-lg bg-blue-50/50 flex items-center justify-center flex-shrink-0 border border-blue-100/30 mt-1">
                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Route / Places to Visit</p>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                                            {(tour.placesToVisit || tour.locations?.join(' / ') || 'Multiple Cities').split('/').map((place: string, idx: number, arr: any[]) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <span className="font-bold text-deepBlue text-[14px] tracking-tight break-words">{place.trim()}</span>
                                                    {idx < arr.length - 1 && (
                                                        <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 10. Redesigned Need Help Section */}
                        <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-r from-deepBlue to-purple p-8 mb-8 shadow-2xl">
                            {/* Decorative Pichwai-inspired circles */}
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-saffron/10 rounded-full blur-3xl group-hover:bg-saffron/20 transition-colors"></div>
                            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>

                            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
                                <div className="space-y-1">
                                    <h3 className="font-display text-3xl font-bold text-white tracking-tight">Need Help with Planning?</h3>
                                    <p className="text-white/70 text-sm font-medium">Connect with our Yatra specialists for a customized experience.</p>
                                </div>
                                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-end gap-4 w-full lg:w-auto">
                                    <button
                                        onClick={() => setIsEnquiryModalOpen(true)}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-saffron text-white rounded-xl font-bold hover:bg-white hover:text-saffron transition-all transform hover:-translate-y-1 shadow-lg whitespace-normal break-words border-2 border-transparent hover:border-saffron"
                                    >
                                        <div className="bg-white/20 p-1 rounded-lg">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                        Plan Your Own Trip
                                    </button>
                                    <a
                                        href="tel:+918447470062"
                                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-white text-deepBlue rounded-xl font-bold hover:bg-saffron hover:text-white transition-all transform hover:-translate-y-1 shadow-lg whitespace-normal break-words"
                                    >
                                        <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        +91 8447470062
                                    </a>
                                    <a
                                        href="https://wa.me/918447470062"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#128C7E] transition-all transform hover:-translate-y-1 shadow-lg whitespace-normal break-words"
                                    >
                                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.397.015 12.035c0 2.123.554 4.197 1.604 6.04L0 24l6.108-1.603a11.83 11.83 0 005.937 1.606h.005c6.634 0 12.03-5.396 12.033-12.034a11.808 11.808 0 00-3.528-8.498" />
                                        </svg>
                                        WhatsApp Us
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* 4. Hotels Section */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
                            <div className="flex items-center justify-between px-8 mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-300">
                                        <span className="font-bold text-xl text-gray-500">H</span>
                                    </div>
                                    <span className="font-bold text-xl text-gray-400 tracking-wider">HOTELS</span>
                                    <span className="text-sm font-medium text-gray-500 italic ml-2">- Or similar 4 star hotel</span>
                                </div>
                                <div className="h-0.5 flex-grow bg-gray-200 mx-8"></div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 px-4">
                                {tour.hotels?.map((hotel: any, index: number) => (
                                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                                        <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                                            {hotel.image && <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-deepBlue">{hotel.name}</h4>
                                            <div className="flex text-yellow-400 text-sm mb-1">
                                                {'★'.repeat(hotel.rating || 4)}{'☆'.repeat(5 - (hotel.rating || 4))}
                                            </div>
                                            <p className="text-xs text-gray-600 line-clamp-2">{hotel.description}</p>
                                        </div>
                                    </div>
                                ))}
                                {(!tour.hotels || tour.hotels.length === 0) && (
                                    <div className="col-span-2 text-center text-gray-400 italic">Hotel details coming soon...</div>
                                )}
                            </div>
                        </div>


                        {/* 5. Itinerary */}
                        <div className="mb-10">
                            <TourItinerary itinerary={tour.itinerary || []} />
                        </div>

                        {/* 5.5. Calculate Price Section */}
                        <CalculatePriceContainer tour={tour} />

                        {/* 6. Inclusions & Exclusions */}
                        <div ref={inclusionsRef} id="inclusions-section" className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 relative mt-4">
                                <h3 className="absolute -top-4 left-6 bg-white px-2 font-handwriting text-xl text-green-600 font-bold">Inclusions:</h3>
                                <ul className="space-y-3 mt-2">
                                    {(tour.inclusions || []).map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 break-words">
                                            <span className="text-gray-400">•</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 relative mt-4">
                                <h3 className="absolute -top-4 left-6 bg-white px-2 font-handwriting text-xl text-red-600 font-bold">Exclusions:</h3>
                                <ul className="space-y-3 mt-2">
                                    {(tour.exclusions || []).map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 break-words">
                                            <span className="text-gray-400">•</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* 7. Do's & Don'ts */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 relative mt-4">
                                <h3 className="absolute -top-4 left-6 bg-white px-2 font-handwriting text-xl text-green-600 font-bold">Do's:</h3>
                                <ul className="space-y-2 mt-2">
                                    {(tour.dos || []).map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 break-words">
                                            <span className="text-gray-400">○</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 relative mt-4">
                                <h3 className="absolute -top-4 left-6 bg-white px-2 font-handwriting text-xl text-red-600 font-bold">Don'ts:</h3>
                                <ul className="space-y-2 mt-2">
                                    {(tour.donts || []).map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 break-words">
                                            <span className="text-gray-400">○</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* 8. Things To Carry */}
                        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 relative mb-8 mt-4">
                            <h3 className="absolute -top-4 left-6 bg-white px-2 font-handwriting text-xl text-deepBlue">Things To Carry:</h3>
                            <ul className="grid grid-cols-2 gap-2 mt-2">
                                {(tour.thingsToCarry || []).map((item: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700 break-words">
                                        <Luggage className="w-4 h-4 text-gray-400" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 10. Need Help Section */}
                        <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-r from-deepBlue to-purple p-8 mb-8 shadow-2xl">
                            {/* Decorative Pichwai-inspired circles */}
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-saffron/10 rounded-full blur-3xl group-hover:bg-saffron/20 transition-colors"></div>
                            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>

                            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                                <div className="space-y-1">
                                    <h3 className="font-display text-3xl font-bold text-white tracking-tight">Need Help with Planning?</h3>
                                    <p className="text-white/70 text-sm font-medium">Connect with our Yatra specialists for a customized experience.</p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                                    <a
                                        href="tel:+918447470062"
                                        className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-white text-deepBlue rounded-xl font-bold hover:bg-saffron hover:text-white transition-all transform hover:-translate-y-1 shadow-lg whitespace-normal break-words"
                                    >
                                        <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        +91 8447470062
                                    </a>
                                    <a
                                        href="https://wa.me/918447470062"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#128C7E] transition-all transform hover:-translate-y-1 shadow-lg whitespace-normal break-words"
                                    >
                                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.397.015 12.035c0 2.123.554 4.197 1.604 6.04L0 24l6.108-1.603a11.83 11.83 0 005.937 1.606h.005c6.634 0 12.03-5.396 12.033-12.034a11.808 11.808 0 00-3.528-8.498" />
                                        </svg>
                                        WhatsApp Us
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Sidebar */}
                    <div className="lg:col-span-1">
                        <TourPricingCard 
                            tour={tour} 
                            originalPrice={originalPrice} 
                            isEnquiryModalOpen={isEnquiryModalOpen}
                            setIsEnquiryModalOpen={setIsEnquiryModalOpen}
                        />
                    </div>

                </div>
            </div>

            {/* 11. "Others are also choosing" Section */}
            {otherTours.length > 0 && (
                <div className="bg-gray-50/50 py-16 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-display font-bold text-deepBlue mb-2">Others are also choosing..</h2>
                                <p className="text-gray-600 font-medium italic">Handpicked experiences from our most popular spiritual journeys.</p>
                            </div>
                            <div className="h-0.5 flex-grow bg-gradient-to-r from-gray-200 to-transparent hidden md:block ml-8 mb-4"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {otherTours.map((otherTour: any) => (
                                <div key={otherTour._id} className="h-full">
                                    <TourCard tour={otherTour} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
