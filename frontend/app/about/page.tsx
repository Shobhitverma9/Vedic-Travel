'use client';

import Image from 'next/image';
import {
    Tag,
    Ticket,
    Compass,
    Headphones,
    Heart,
    Star,
} from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="bg-cream-light min-h-screen text-deepBlue">
            {/* Hero Section - More Dynamic & Branded */}
            <section className="relative h-[75vh] flex items-center justify-center overflow-hidden pt-28 md:pt-36">
                <Image
                    src="/header-vt.png"
                    alt="Ancient Temple"
                    fill
                    className="object-cover scale-105"
                    priority
                />
                {/* Complex Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-deepBlue/90 via-deepBlue/60 to-purple/40"></div>

                {/* Floating Mandala Pattern (Background) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                    <MandalaSVG size={800} />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="h-[2px] w-12 bg-saffron"></div>
                        <h2 className="font-sans italic text-saffron text-4xl md:text-5xl">Our Story</h2>
                        <div className="h-[2px] w-12 bg-saffron"></div>
                    </div>
                    <h1 className="font-sans text-white text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase">
                        Vedic <span className="text-saffron">Travel</span>
                    </h1>
                    <p className="text-white/80 text-lg md:text-2xl font-medium tracking-wide max-w-2xl mx-auto border-y border-white/20 py-4 italic">
                        "Bridging the Gap Between Ancient Wisdom and Modern Seekers"
                    </p>
                </div>

                {/* Bottom Wave decoration */}
                <div className="absolute bottom-0 left-0 w-full leading-[0] fill-cream-light">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]">
                        <path d="M321.39,56.44c58.1,0,119.8,22.1,178,22.1s119.9-22.1,178-22.1,119.8,22.1,178,22.1,119.9-22.1,178-22.1V120H0V56.44c58.1,0,119.1,22.1,178,22.1S263.29,56.44,321.39,56.44Z"></path>
                    </svg>
                </div>
            </section>

            {/* Intro Section - Decorative & Branded */}
            <section className="relative py-24 px-4 overflow-hidden">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 bg-pattern opacity-5 pointer-events-none"></div>

                <div className="container mx-auto max-w-5xl relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-saffron font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Welcome to Your Sacred Journey</span>
                        <h2 className="font-sans text-4xl md:text-6xl font-bold mb-8">
                            Experience the Divine with <br />
                            <span className="text-gradient font-black">Sanatan Dharma Heritage</span>
                        </h2>
                        <div className="flex justify-center mb-10">
                            <LotusSVG className="text-saffron w-16 h-16 opacity-30" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 text-lg text-gray-700 leading-relaxed font-medium text-justify">
                            <p className="first-letter:text-5xl first-letter:font-sans first-letter:font-bold first-letter:text-saffron first-letter:mr-3 first-letter:float-left">
                                At Vedic Travel, we believe a pilgrimage is not just a destination; it's a profound inward journey.
                                We are dedicated to providing a seamless bridge to the most sacred corners of Bharat, ensuring
                                that every seeker finds peace and fulfillment in their spiritual quests.
                            </p>
                            <p>
                                Born from a deep reverence for our ancient roots, our mission is to simplify the complexities of
                                religious travel. We handle the logistics of priority darshan, comfortable stays, and authentic
                                Vedic rituals, allowing you to immerse yourself fully in the divine energy of India's temples.
                            </p>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-saffron/10 rounded-[2rem] transform rotate-3 transition-transform group-hover:rotate-0"></div>
                            <div className="relative aspect-square rounded-[1.5rem] overflow-hidden shadow-2xl border-4 border-white">
                                <Image
                                    src="/images/cards/varanasi.png"
                                    alt="Temple Ritual"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {/* Decorative Corner Art */}
                            <div className="absolute -top-6 -right-6 w-24 h-24 text-gold opacity-40">
                                <MandalaSVG />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Gallery - Creative Layout */}
            <section className="py-20 bg-deepBlue text-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-xl">
                            <h2 className="font-sans text-4xl md:text-5xl font-bold mb-4">Capturing Eternal <span className="text-saffron">Visions</span></h2>
                            <p className="text-gray-400 text-lg">Every stone tells a story of devotion. Discover the architectural marvels and spiritual hubs we journey to.</p>
                        </div>
                        <div className="h-1 w-24 bg-gold mb-4"></div>
                    </div>

                    <div className="flex flex-wrap -mx-2">
                        {/* Custom Grid Layout */}
                        <div className="w-full md:w-1/3 px-2 mb-4">
                            <GalleryImage src="/images/tours/up_golden_triangle.png" size="tall" />
                        </div>
                        <div className="w-full md:w-2/3 px-2">
                            <div className="flex flex-wrap -mx-2">
                                <div className="w-full md:w-1/2 px-2 mb-4">
                                    <GalleryImage src="/images/tours/divine_south_india.png" size="square" />
                                </div>
                                <div className="w-full md:w-1/2 px-2 mb-4">
                                    <GalleryImage src="/images/tours/mahakaleshwar_omkareshwar.png" size="square" />
                                </div>
                                <div className="w-1/2 px-2 mb-4">
                                    <GalleryImage src="/images/tours/panch_jyotirlinga.png" size="wide" />
                                </div>
                                <div className="w-1/2 px-2 mb-4">
                                    <GalleryImage src="/images/tours/chardham_heli_yatra.png" size="wide" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What We Offer - Premium Cards */}
            <section className="py-32 bg-cream-light relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="font-sans text-5xl md:text-6xl font-black text-deepBlue mb-6"> Our <span className="text-saffron">Blessings</span> & Offerings</h2>
                        <div className="w-24 h-1.5 bg-saffron mx-auto mb-6"></div>
                        <p className="text-gray-600 text-xl italic font-medium">Providing comfort so your soul can seek divinity without distraction.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: <Tag />, title: "Authentic Experiences", desc: "Curated rituals and VIP darshan that respect traditional sanctity.", color: "saffron" },
                            { icon: <Ticket />, title: "Seamless Booking", desc: "Effortless planning with instant confirmation and transparent pricing.", color: "purple" },
                            { icon: <Compass />, title: "Expert Vedic Guides", desc: "Scholar-guides who bring the Puranas and history to life with passion.", color: "gold" },
                            { icon: <Headphones />, title: "Sacred Support", desc: "24/7 dedicated assistance to ensure a worry-free spiritual journey.", color: "deepBlue" },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-b-4 border-transparent hover:border-saffron transition-all duration-300 group hover:-translate-y-2">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white transition-all duration-300 group-hover:rotate-12 ${item.color === 'saffron' ? 'bg-saffron shadow-[0_10px_20px_rgba(255,87,34,0.3)]' :
                                    item.color === 'purple' ? 'bg-purple shadow-[0_10px_20px_rgba(123,44,191,0.3)]' :
                                        item.color === 'gold' ? 'bg-gold shadow-[0_10px_20px_rgba(212,175,55,0.3)]' :
                                            'bg-deepBlue shadow-[0_10px_20px_rgba(26,35,50,0.3)]'
                                    }`}>
                                    {item.icon}
                                </div>
                                <h4 className="text-2xl font-bold text-deepBlue mb-4 group-hover:text-saffron transition-colors">{item.title}</h4>
                                <p className="text-gray-600 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tagline - Sacred Seal Design */}
            <section className="py-24 px-4 bg-deepBlue relative">
                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <div className="relative px-6 py-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] overflow-hidden group">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-saffron scale-150 rotate-45 group-hover:rotate-90 transition-transform duration-1000">
                            <LotusSVG />
                        </div>
                        <div className="absolute bottom-0 left-0 p-8 opacity-10 text-gold scale-150 -rotate-45 group-hover:-rotate-90 transition-transform duration-1000">
                            <LotusSVG />
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-center gap-4 mb-8 text-saffron">
                                <div className="h-0.5 w-12 bg-saffron/30 my-auto"></div>
                                <Heart fill="currentColor" className="opacity-50" />
                                <div className="h-0.5 w-12 bg-saffron/30 my-auto"></div>
                            </div>
                            <h3 className="font-sans text-3xl md:text-5xl font-medium text-white italic leading-tight mb-10 px-4">
                                "In the heart of every seeker, <br className="hidden md:block" />
                                we ignite the lamp of <span className="text-saffron">Ancient Bharat</span>."
                            </h3>
                            <a href="/tours" className="bg-saffron hover:bg-saffron-dark text-white px-10 py-5 rounded-full inline-block font-bold text-xl transition-all shadow-2xl hover:scale-105 cursor-pointer uppercase tracking-widest no-underline">
                                Join Us On This Divine Path
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Snipet - Elegant & Detailed */}
            <section className="py-16 bg-cream">
                <div className="container mx-auto px-4 flex flex-col items-center">
                    <div className="bg-white px-12 py-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-10 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-saffron/10 rounded-full flex items-center justify-center text-saffron">
                                <Star fill="currentColor" />
                            </div>
                            <div>
                                <p className="text-deepBlue font-bold">Dedicated Journey Concierge</p>
                            </div>
                        </div>
                        <div className="h-12 w-[1px] bg-gray-200 hidden md:block"></div>
                        <div className="text-center md:text-left">
                            <p className="text-sm text-gray-500 mb-1">Send us an enquiry</p>
                            <p className="text-xl font-black text-deepBlue">bookings@vedictravel.com</p>
                        </div>
                        <div className="h-12 w-[1px] bg-gray-200 hidden md:block"></div>
                        <div className="text-center md:text-left">
                            <p className="text-sm text-gray-500 mb-1">Speak with our guides</p>
                            <p className="text-xl font-black text-deepBlue">+91-8447470062</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function GalleryImage({ src, size }: { src: string, size: 'tall' | 'square' | 'wide' }) {
    return (
        <div className={`relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg border-2 border-white/5 ${size === 'tall' ? 'aspect-[3/5.2]' : size === 'square' ? 'aspect-square' : 'aspect-[1.5/1.1]'
            }`}>
            <Image
                src={src}
                alt="Sacred Site"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-deepBlue/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 flex items-end">
                <div>
                    <div className="w-10 h-1 bg-saffron mb-4"></div>
                    <p className="text-white font-bold text-xl uppercase tracking-widest">Experience Now</p>
                </div>
            </div>
            {/* Subtle Inner Glow */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-deepBlue/20 to-transparent pointer-events-none"></div>
        </div>
    );
}

function MandalaSVG({ size = 100, className = "" }: { size?: number, className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
            <path d="M50 2L55 45L98 50L55 55L50 98L45 55L2 50L45 45L50 2Z" fill="currentColor" fillOpacity="0.1" />
            <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="50" r="10" fill="currentColor" />
            <path d="M50 0V100M0 50H100" stroke="currentColor" strokeWidth="0.2" />
            {/* Petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <path
                    key={angle}
                    d="M50 50C60 30 70 30 50 10C30 30 40 30 50 50Z"
                    fill="currentColor"
                    fillOpacity="0.2"
                    transform={`rotate(${angle} 50 50)`}
                />
            ))}
        </svg>
    );
}

function LotusSVG({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={className} fill="currentColor">
            <path d="M50 90c10-20 30-20 40-40-10-10-30-10-40 10-10-20-30-20-40 10 10 20 30 20 40 40z" opacity="0.4" />
            <path d="M50 95c15-25 45-25 50-50-15-15-40-15-50 15-10-30-35-30-50-15 5 25 35 25 50 50z" />
            <circle cx="50" cy="50" r="10" />
        </svg>
    );
}
