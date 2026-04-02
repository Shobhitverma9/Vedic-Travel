'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Plane,
    Car,
    Hotel,
    Utensils,
    Map,
    Camera,
    Info,
    ChevronDown
} from 'lucide-react';

interface ItineraryItem {
    type: string; // 'flight' | 'transfer' | 'hotel' | 'meal' | 'activity' | 'sightseeing'
    title?: string;
    description?: string;
    image?: string;
    time?: string;
    meta?: string;
}

interface ItineraryDay {
    day: number;
    title: string;
    description: string;
    activities?: string[];
    meals?: string[];
    items?: ItineraryItem[];
    included?: string[];
}

interface TourItineraryProps {
    itinerary: ItineraryDay[];
}

export default function TourItinerary({ itinerary }: TourItineraryProps) {
    const [activeDay, setActiveDay] = useState<number>(0);
    const sidebarRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const handleScroll = () => {
            const containerRect = scrollContainer.getBoundingClientRect();
            // Trigger 150px down from the top of the container
            const activeLineY = containerRect.top + 150;

            let currentActive = 0;
            for (let i = 0; i < itinerary.length; i++) {
                const element = document.getElementById(`day-section-${i}`);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // The last section that scrolled past the trigger line is active
                    if (rect.top <= activeLineY) {
                        currentActive = i;
                    }
                }
            }

            setActiveDay(currentActive);
        };

        scrollContainer.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, [itinerary.length]);

    // Scroll active sidebar item into view


    const scrollToDay = (index: number) => {
        const container = document.getElementById('itinerary-scroll-container');
        const element = document.getElementById(`day-section-${index}`);

        if (container && element) {
            // Calculate position relative to the scroll container's current scroll
            const containerTop = container.getBoundingClientRect().top;
            const elementTop = element.getBoundingClientRect().top;

            // Current scroll + distance of element from top of container - arbitrary offset
            const targetScrollPosition = container.scrollTop + (elementTop - containerTop) - 20;

            container.scrollTo({
                top: targetScrollPosition,
                behavior: 'smooth'
            });
            // State update will happen via scroll listener
            setActiveDay(index);
        }
    };

    if (!itinerary || itinerary.length === 0) {
        return <div className="text-gray-500 italic py-8 text-center bg-gray-50 rounded-lg border border-gray-200">No detailed itinerary available for this tour.</div>;
    }

    const getItemIcon = (type: string) => {
        const t = type.toLowerCase();
        if (t.includes('flight')) return <Plane className="w-5 h-5" />;
        if (t.includes('transfer') || t.includes('transport') || t.includes('cab')) return <Car className="w-5 h-5" />;
        if (t.includes('hotel') || t.includes('stay')) return <Hotel className="w-5 h-5" />;
        if (t.includes('meal') || t.includes('breakfast') || t.includes('dinner')) return <Utensils className="w-5 h-5" />;
        if (t.includes('sightseeing') || t.includes('activity')) return <Camera className="w-5 h-5" />;
        return <Info className="w-5 h-5" />;
    };

    const getDayInclusions = (day: ItineraryDay) => {
        if (day.included && day.included.length > 0) return day.included;

        const inc = [];
        if (day.items && day.items.length > 0) {
            if (day.items.some(i => i.type === 'hotel')) inc.push('Hotel');
            if (day.items.some(i => i.type === 'transfer')) inc.push('Transfer');
            if (day.items.some(i => i.type === 'meal')) inc.push('Meal');
            if (day.items.some(i => i.type === 'flight')) inc.push('Flight');
        } else {
            if (day.meals && day.meals.length > 0) inc.push('Meal');
            if (day.title.toLowerCase().includes('arrival') || day.description.toLowerCase().includes('transfer')) inc.push('Transfer');
            if (day.day < itinerary.length) inc.push('Hotel');
        }
        return inc;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row h-[600px] relative">
            {/* Sidebar Navigation */}
            <div className="hidden md:block w-64 md:w-72 flex-shrink-0 bg-gray-50 border-r border-gray-100 p-6 overflow-y-auto custom-scrollbar relative z-10">
                <h3 className="text-xl font-bold text-gray-700 mb-6 font-display">Day Plan</h3>
                <div className="space-y-0 relative border-l-2 border-gray-200 ml-3">
                    {itinerary.map((day, index) => (
                        <div key={index} className="relative">
                            {/* Dot */}
                            <div className={`absolute -left-[9px] top-6 w-4 h-4 rounded-full border-2 transition-all duration-300 z-10 ${activeDay === index
                                ? 'bg-deepBlue border-deepBlue scale-110'
                                : 'bg-gray-300 border-white'
                                }`}></div>

                            <button
                                ref={el => { sidebarRefs.current[index] = el }}
                                onClick={() => scrollToDay(index)}
                                className={`w-full text-left py-4 pl-6 pr-4 transition-all duration-300 rounded-r-lg group flex items-center justify-between ${activeDay === index
                                    ? 'bg-deepBlue text-white shadow-md -ml-0.5'
                                    : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <span className={`text-sm font-bold ${activeDay === index ? 'text-white' : 'text-gray-600'}`}>
                                    Day {day.day < 10 ? `0${day.day}` : day.day}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden w-full overflow-x-auto p-4 flex gap-2 no-scrollbar bg-gray-50 border-b border-gray-200 z-20 flex-shrink-0 shadow-sm relative">
                {itinerary.map((day, index) => (
                    <button
                        key={index}
                        onClick={() => scrollToDay(index)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold flex-shrink-0 transition-colors ${activeDay === index
                            ? 'bg-deepBlue text-white'
                            : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        Day {day.day}
                    </button>
                ))}
            </div>

            {/* Main Content Area (Scrollable) */}
            <div id="itinerary-scroll-container" ref={scrollContainerRef} className="flex-1 min-w-0 p-6 md:p-8 overflow-y-auto custom-scrollbar relative">
                <div className="space-y-8 pb-12">
                    {itinerary.map((day, index) => {
                        const inclusions = getDayInclusions(day);

                        return (
                            <div id={`day-section-${index}`} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ root: scrollContainerRef, once: true, margin: "-50px" }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8 transition-all duration-300 hover:shadow-md"
                                >
                                    {/* Day Header - Redesigned to match request more closely */}
                                    <div className="border-b border-gray-100 pb-6 mb-6">
                                        <div className="flex flex-col gap-4">
                                            {/* Top Row: Day and Title */}
                                            <div className="flex items-start gap-4 w-full">
                                                <span className="px-5 py-2 bg-saffron text-white rounded-full font-bold text-sm shadow-md whitespace-nowrap h-fit mt-1">
                                                    Day {day.day}
                                                </span>
                                                <h3 className="text-xl md:text-2xl font-bold text-deepBlue leading-tight flex-1">
                                                    {day.title}
                                                </h3>
                                            </div>

                                            {/* Bottom Row: Inclusions Compact - Now below the title for more space */}
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 bg-gray-50/50 md:bg-transparent p-3 md:p-0 rounded-xl border border-gray-100 md:border-0 ml-0 md:ml-[88px]">
                                                <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px] md:text-xs">INCLUDED:</span>
                                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                    {inclusions.map((inc, i) => (
                                                        <div key={i} className="flex items-center gap-2 font-medium text-gray-700 whitespace-nowrap">
                                                            {getItemIcon(inc)}
                                                            <span className="text-xs md:text-sm">{inc}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Items */}
                                    <div className="space-y-8 pl-2 md:pl-4 border-l-2 border-gray-100 ml-8 md:ml-6 pb-8">
                                        {/* Description */}
                                        <div className="relative">
                                            <div className="absolute -left-[25px] md:-left-[33px] top-0 w-4 h-4 bg-gray-200 rounded-full border-4 border-white"></div>
                                            <p 
                                                className="text-gray-600 leading-relaxed mb-6"
                                                dangerouslySetInnerHTML={{ __html: day.description }}
                                            />
                                        </div>

                                        {day.items && day.items.length > 0 ? (
                                            day.items.map((item, i) => (
                                                <div key={i} className="relative group">
                                                    {/* Timeline Icon */}
                                                    <div className="absolute -left-[35px] md:-left-[43px] top-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 z-10 group-hover:border-saffron group-hover:text-saffron transition-colors">
                                                        {getItemIcon(item.type)}
                                                    </div>

                                                    {/* Item Content */}
                                                    <div className="pb-2">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="font-bold text-deepBlue uppercase tracking-wide text-sm flex items-center gap-2">
                                                                {item.type}
                                                                {/* Accordion Arrow (Visual only for now) */}
                                                                <span className="text-gray-400"><ChevronDown className="w-4 h-4" /></span>
                                                            </h4>

                                                            {/* Actions */}

                                                        </div>

                                                        {/* Card */}
                                                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                                            <div className="flex flex-col md:flex-row gap-4">
                                                                {item.image && (
                                                                    <div className="w-full md:w-40 h-28 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                                        <img src={item.image} alt={item.title || item.type} className="w-full h-full object-cover" />
                                                                    </div>
                                                                )}
                                                                <div className="flex-1">
                                                                    {item.title && <h5 className="font-bold text-lg text-deepBlue mb-1">{item.title}</h5>}
                                                                    {item.description && (
                                                                        <p 
                                                                            className="text-sm text-gray-600 leading-relaxed mb-2"
                                                                            dangerouslySetInnerHTML={{ __html: item.description }}
                                                                        />
                                                                    )}
                                                                    {item.meta && (
                                                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                                                                            <Info className="w-3 h-3" />
                                                                            {item.meta}
                                                                        </div>
                                                                    )}
                                                                    {item.type === 'flight' && !item.title && (
                                                                        <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded border border-blue-100">
                                                                            Flight details to be confirmed.
                                                                            <div className="mt-1 text-xs font-bold">PLEASE NOTE: You need to reach {day.title} on your own.</div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            /* Legacy Data Support */
                                            <div className="space-y-6">
                                                {/* Activities */}
                                                {day.activities && day.activities.length > 0 && (
                                                    <div className="relative group">
                                                        <div className="absolute -left-[35px] md:-left-[43px] top-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 z-10">
                                                            <Camera className="w-4 h-4" />
                                                        </div>
                                                        <h4 className="font-bold text-deepBlue uppercase tracking-wide text-sm mb-2">Sightseeing</h4>
                                                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                                                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                                                {day.activities.map((act, i) => <li key={i}>{act}</li>)}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Meals */}
                                                {day.meals && day.meals.length > 0 && (
                                                    <div className="relative group">
                                                        <div className="absolute -left-[35px] md:-left-[43px] top-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 z-10">
                                                            <Utensils className="w-4 h-4" />
                                                        </div>
                                                        <h4 className="font-bold text-deepBlue uppercase tracking-wide text-sm mb-2">Meals</h4>
                                                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-sm text-gray-600">
                                                            {day.meals.join(', ')}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
