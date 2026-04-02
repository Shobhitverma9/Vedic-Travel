'use client';


import { useState, useEffect } from 'react';
import { toursService } from '@/services/tours.service';
import { notFound } from 'next/navigation';
import TourPageHero from '@/components/tours/TourPageHero';
import TourPricingCard from '@/components/tours/TourPricingCard';
import TourItinerary from '@/components/tours/TourItinerary';
import { Luggage, BedDouble, Utensils, Binoculars, Plane, FileCheck, Car, CheckCircle, Hotel, Camera } from 'lucide-react';
import CalculatePriceContainer from '@/components/tours/CalculatePrice/CalculatePriceContainer';

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
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="min-h-screen bg-white pb-20 font-sans">
            {/* 1. New Hero Section */}
            <div className="container mx-auto px-4 py-6 pt-24 md:pt-36">

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

                        {/* 3. Compact Info Strip */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:divide-x divide-gray-200">
                                {/* Duration */}
                                <div className="flex items-center gap-4 px-2 md:px-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                                        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Duration</p>
                                        <p className="font-bold text-gray-900 text-base">{nights}N / {tour.duration}D</p>
                                    </div>
                                </div>

                                {/* Places */}
                                <div className="flex items-center gap-4 px-2 md:px-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Places to Visit</p>
                                        <p className="font-bold text-gray-900 text-sm truncate" title={tour.placesToVisit || tour.locations?.join(' / ') || 'Multiple Cities'}>
                                            {tour.placesToVisit || tour.locations?.join(' / ') || 'Multiple Cities'}
                                        </p>
                                    </div>
                                </div>

                                {/* Includes */}
                                <div className="flex items-center gap-4 px-2 md:px-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Package Includes</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(tour.packageIncludes && tour.packageIncludes.length > 0 ? tour.packageIncludes : ['Hotel', 'Sightseeing', 'Transfer', 'Meals']).slice(0, 5).map((item: string) => (
                                                <div key={item} title={item} className="hover:scale-110 transition-transform">
                                                    {getIconForInclude(item)}
                                                </div>
                                            ))}
                                            {(tour.packageIncludes?.length > 5) && (
                                                <div className="bg-gray-100 p-1.5 rounded-full flex items-center justify-center border border-gray-200" title="More inclusions">
                                                    <span className="text-[9px] font-bold text-gray-600 w-4 h-4 flex items-center justify-center">+{tour.packageIncludes.length - 5}</span>
                                                </div>
                                            )}
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

                            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                                <div className="space-y-1">
                                    <h3 className="font-display text-3xl font-bold text-white tracking-tight">Need Help with Planning?</h3>
                                    <p className="text-white/70 text-sm font-medium">Connect with our Yatra specialists for a customized experience.</p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                                    <a
                                        href="tel:+918447470062"
                                        className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-white text-deepBlue rounded-xl font-bold hover:bg-saffron hover:text-white transition-all transform hover:-translate-y-1 shadow-lg whitespace-nowrap"
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
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#128C7E] transition-all transform hover:-translate-y-1 shadow-lg whitespace-nowrap"
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
                                                {'Γÿà'.repeat(hotel.rating || 4)}{'Γÿå'.repeat(5 - (hotel.rating || 4))}
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
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 relative mt-4">
                                <h3 className="absolute -top-4 left-6 bg-white px-2 font-handwriting text-xl text-green-600 font-bold">Inclusions:</h3>
                                <ul className="space-y-3 mt-2">
                                    {(tour.inclusions || []).map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <span className="text-gray-400">ΓÇó</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 relative mt-4">
                                <h3 className="absolute -top-4 left-6 bg-white px-2 font-handwriting text-xl text-red-600 font-bold">Exclusions:</h3>
                                <ul className="space-y-3 mt-2">
                                    {(tour.exclusions || []).map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <span className="text-gray-400">ΓÇó</span> {item}
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
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <span className="text-gray-400">Γùï</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 relative mt-4">
                                <h3 className="absolute -top-4 left-6 bg-white px-2 font-handwriting text-xl text-red-600 font-bold">Don'ts:</h3>
                                <ul className="space-y-2 mt-2">
                                    {(tour.donts || []).map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <span className="text-gray-400">Γùï</span> {item}
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
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                        <Luggage className="w-4 h-4 text-gray-400" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 9. Terms & Conditions */}
                        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 relative mb-8">
                            <h3 className="font-bold text-lg text-deepBlue mb-6 border-b pb-2 uppercase tracking-widest text-center">Terms & Conditions</h3>

                            <div className="space-y-6">
                                {/* --- DEFAULT STATIC POLICIES --- */}
                                {/* Easy Cancellation */}
                                <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                                    <h4 className="font-bold text-deepBlue mb-2">Easy Cancellation</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                        <li>Cancellation before 45 days from travel date - <span className="font-bold text-green-600">NO Cancellation Charges.</span></li>
                                        <li>Cancelled between 45-30 days - <span className="font-bold text-orange-500">25% Cancellation charges</span></li>
                                        <li>Cancelled between 30-15 days - <span className="font-bold text-orange-600">50% Cancellation charges</span></li>
                                        <li>Cancelled within 15 days - <span className="font-bold text-red-600">Non-Refundable</span></li>
                                    </ul>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Guaranteed Dates */}
                                    <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                                        <h4 className="font-bold text-deepBlue mb-2">Guaranteed Dates</h4>
                                        <p className="text-sm text-gray-700">
                                            Your selected travel dates are guaranteed. In the unlikely event of seats sold out, we guarantee +/- 1/2 days from your preferred dates.
                                        </p>
                                    </div>

                                    {/* High Season */}
                                    <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                                        <h4 className="font-bold text-deepBlue mb-2">High Season</h4>
                                        <p className="text-sm text-gray-700">
                                            Prices can fluctuate during peak season dates.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Travel Validity */}
                                    <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                                        <h4 className="font-bold text-deepBlue mb-2">Travel Validity</h4>
                                        <p className="text-sm text-gray-700">
                                            The deal is valid for travel till Wednesday, 31 December 2025.
                                        </p>
                                    </div>

                                    {/* Visa Easy */}
                                    <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                                        <h4 className="font-bold text-deepBlue mb-2">Visa Easy</h4>
                                        <p className="text-sm text-gray-700">
                                            Visa can be availed on arrival.
                                        </p>
                                    </div>
                                </div>

                                {/* Booking Policy */}
                                <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                                    <h4 className="font-bold text-deepBlue mb-2">Booking Policy</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                        <li>If booking is 30 days in advance: 25% package cost as advance</li>
                                        <li>If booking is 30 days to 15 days in advance: 50% package cost as advance</li>
                                        <li>Balance 50% before 15 days of travel date.</li>
                                        <li>If travel within 15 days, 100% payment required for booking confirmation.</li>
                                    </ul>
                                </div>

                                {/* Remarks */}
                                <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                                    <h4 className="font-bold text-deepBlue mb-2">Remarks</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                        <li>Limited Period Offer</li>
                                        <li>Early check-in and late checkout are subject to availability and charges.</li>
                                        <li>Need to Book at least 15 Days in Advance</li>
                                    </ul>
                                </div>

                                {/* --- DYNAMIC CANCELLATION POLICY --- */}
                                {tour.useDefaultCancellationPolicy !== false ? (
                                    <div className="bg-blue-50/50 rounded-lg p-6 border border-blue-100 mt-6 shadow-sm">
                                        <h4 className="font-bold text-deepBlue mb-4 border-b border-blue-200 pb-2 text-lg">Standard Cancellation Policy</h4>
                                        <div className="prose prose-sm max-w-none text-gray-700 space-y-4 leading-relaxed">
                                            <p>
                                                It is our most important aim that you enjoy your holiday and that we earn your trust. However, we are not responsible for any cancellation due to any industrial disputes, Technical failure of any type of transport we use, loss of earnings, late arrivals or force majeure, or any items beyond our control. After booking, if you wish to cancel your trip, you must notify Vedic Travel in writing. Once a Vedic Travel notice is received, cancellation will take effect subject to the following:
                                            </p>

                                            <ul className="list-disc pl-5 space-y-3">
                                                <li>
                                                    If cancellation takes place between 90 ΓÇô 150 days before your departure date, your full payment will be refunded, except the non-refundable deposit of USD 300 | INR 15000 for Kailash Mansarovar Yatra & USD 300 | INR 10000 or 20% of the package cost, whichever is higher for other destinations.
                                                </li>
                                                <li>
                                                    If cancellation takes place between 30-90 days before departure 75% of your payment will be refunded, except the non-refundable deposit.
                                                </li>
                                                <li>
                                                    If cancellation takes place less than 30 days prior to departure due to client's personal problems, all previously paid amount(s) will be forfeited.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    tour.cancellationPolicy && (
                                        <div className="bg-red-50/50 rounded-lg p-6 border border-red-200 mt-6 shadow-sm">
                                            <h4 className="font-bold text-red-800 mb-4 border-b border-red-200 pb-2 text-lg">Trip-Specific Cancellation Policy</h4>
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{tour.cancellationPolicy}</p>
                                        </div>
                                    )
                                )}
                                
                                {tour.termsAndConditions && (
                                    <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100 mt-6">
                                        <h4 className="font-bold text-deepBlue mb-2 border-b border-blue-200 pb-2">Additional Terms & Conditions</h4>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{tour.termsAndConditions}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 10. Footer / Need Help - Updated to matches redesigned style */}
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
                                        className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-white text-deepBlue rounded-xl font-bold hover:bg-saffron hover:text-white transition-all transform hover:-translate-y-1 shadow-lg whitespace-nowrap"
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
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#128C7E] transition-all transform hover:-translate-y-1 shadow-lg whitespace-nowrap"
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
                        <TourPricingCard tour={tour} originalPrice={originalPrice} />
                    </div>

                </div>
            </div>
        </div>
    );
}
