'use client';

import { useState, useEffect } from 'react';
import HeroCardsAnimation from './HeroCardsAnimation';

const bgImages = [
    '/header-vt.png',
    '/images/cards/chardham.png',
];

// Cards for V2 - Image Only + Name Below
const v2Cards = [
    {
        title: 'Chardham Yatra',
        duration: '', // Hide details
        price: '', // Hide details
        image: '/images/cards/chardham.png',
    },
    {
        title: 'Varanasi',
        duration: '',
        price: '',
        image: '/images/cards/varanasi.png',
    },
    {
        title: 'Rishikesh',
        duration: '',
        price: '',
        image: '/images/cards/rishikesh.png',
    },
    {
        title: 'Golden Temple',
        duration: '',
        price: '',
        image: '/images/cards/goldentemple.png',
    },
    {
        title: 'Tirupati',
        duration: '',
        price: '',
        image: '/images/cards/tirupati.png',
    },
];


export default function HeroSectionV2() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % bgImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative flex flex-col items-center justify-center bg-deepBlue overflow-hidden" style={{ height: '60vh', minHeight: '600px' }}>
            {/* Background Image Slider */}
            {bgImages.map((img, index) => (
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

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center pt-10">

                {/* Text Content - Same as V1 */}
                <div className="text-center mb-6 animate-fade-in max-w-4xl mx-auto">
                    <h1 className="mb-2 leading-tight drop-shadow-lg">
                        <span className="font-sans italic text-2xl md:text-4xl text-white block mb-1 opacity-90">Rediscovering</span>
                        <span className="font-sans font-bold text-3xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight">Ancient Bharat</span>
                    </h1>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-full p-1.5 flex w-full max-w-xl mx-auto shadow-2xl relative z-20 mb-8 animate-slide-up">
                    <div className="flex-grow flex items-center px-4">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search Your Dream Pilgrimage!"
                            className="w-full py-2 focus:outline-none text-deepBlue placeholder-gray-400 text-sm"
                        />
                    </div>
                    <button className="bg-deepBlue hover:bg-deepBlue-light text-white px-6 py-2 rounded-full font-semibold text-sm transition-colors">
                        Search
                    </button>
                </div>

                {/* All Time Favorite Text */}
                <div className="text-center mb-4 relative z-20">
                    <h2 className="text-white font-sans italic text-2xl tracking-wide">All Time Favorite</h2>
                </div>


                {/* Modified Animation - Custom Logic for V2 looks */}
                {/* We reuse the container but need to pass custom cards or style. 
            Since HeroCardsAnimation is separate, I'll inline a variant here or accept props.
            For simplicity and speed, I will create a localized version of the card loop.
        */}
                <div className="w-full">
                    <V2CardCarousel />
                </div>
            </div>
        </section>
    );
}

function V2CardCarousel() {
    return (
        <>
            <style jsx>{`
                @keyframes marquee-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-scroll {
                    animation: marquee-scroll 25s linear infinite; /* Slower for V2 */
                    width: max-content; 
                }
                .animate-marquee-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div
                className="relative overflow-hidden select-none mx-auto"
                style={{
                    maxWidth: '900px',
                    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                }}
            >
                <div className="flex animate-marquee-scroll">
                    <div className="flex shrink-0">
                        {v2Cards.map((card, index) => <V2Card key={`v2-1-${index}`} card={card} />)}
                    </div>
                    <div className="flex shrink-0">
                        {v2Cards.map((card, index) => <V2Card key={`v2-2-${index}`} card={card} />)}
                    </div>
                </div>
            </div>
        </>
    );
}

function V2Card({ card }: { card: any }) {
    return (
        <div className="flex flex-col items-center mx-4 group cursor-pointer transition-transform hover:scale-105">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden border-2 border-white/50 shadow-lg mb-2 relative">
                <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                />
                {/* No overlay text, just clean image */}
            </div>
            <span className="text-white font-medium text-sm md:text-base drop-shadow-md tracking-wide">
                {card.title}
            </span>
        </div>
    )
}
