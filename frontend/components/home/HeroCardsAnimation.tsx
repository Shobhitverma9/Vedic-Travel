'use client';

import Link from 'next/link';


const cards = [
    {
        title: 'Char Dham Yatra',
        duration: '10D/9N',
        price: '₹25,999',
        image: '/images/cards/chardham.png',
        link: '/tours/char-dham-yatra',
    },
    {
        title: 'Do Dham Yatra',
        duration: '6D/5N',
        price: '₹18,500',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop',
        link: '/tours/do-dham-yatra',
    },
    {
        title: 'Kailash Mansarovar',
        duration: '14D/13N',
        price: '₹1,65,000',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
        link: '/tours/kailash-mansarovar-yatra',
    },
    {
        title: 'Vietnam Spiritual',
        duration: '8D/7N',
        price: '₹62,000',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop',
        link: '/tours/vietnam-spiritual',
    },
    {
        title: 'Spiritual Heritage Exp.',
        duration: '6D/5N',
        price: '₹19,999',
        image: '/images/cards/varanasi.png',
        link: '/package/up-golden-triangle-yatra-6d5n',
    },
    {
        title: 'Heavenly Kashmir',
        duration: '6D/5N',
        price: '₹21,500',
        image: 'https://images.unsplash.com/photo-1598305077399-68475a305943?q=80&w=2070&auto=format&fit=crop',
        link: '/tours/heavenly-kashmir',
    },
    {
        title: 'Temple & Tides',
        duration: '5D/4N',
        price: '₹17,500',
        image: '/images/cards/tirupati.png',
        link: '/tours/tales-of-tamil-nadu',
    },
];


export default function HeroCardsAnimation() {
    return (
        <>
            <style jsx>{`
                @keyframes marquee-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-scroll {
                    animation: marquee-scroll 20s linear infinite;
                    width: max-content; 
                }
                .animate-marquee-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div
                className="relative mt-8 overflow-hidden select-none mx-auto"
                style={{
                    maxWidth: '850px', // Roughly 4 cards (180px + gaps)
                    maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                }}
            >
                <div className="flex animate-marquee-scroll">
                    {/* First Set */}
                    <div className="flex shrink-0">
                        {cards.map((card, index) => (
                            <Card key={`card1-${index}`} card={card} index={index} />
                        ))}
                    </div>
                    {/* Duplicate Set for Seamless Loop */}
                    <div className="flex shrink-0">
                        {cards.map((card, index) => (
                            <Card key={`card2-${index}`} card={card} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

function Card({ card, index }: { card: any; index: number }) {
    // Subtle tilt
    const rotation = index % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]';
    const margin = index % 2 === 0 ? 'mt-0' : 'mt-4';

    return (
        <Link href={card.link || '#'}>
            <div
                className={`
                    relative flex-shrink-0 w-44 h-60 bg-white rounded-lg shadow-lg border-2 border-white overflow-hidden 
                    transform transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-2xl
                    ${rotation} ${margin} mx-2.5 cursor-pointer group
                `}
            >
                <div className="h-36 w-full relative overflow-hidden">
                    <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-2.5 bg-white relative h-full">
                    <h3 className="font-sans font-bold text-sm text-deepBlue leading-tight mb-1 truncate">{card.title}</h3>
                    <p className="text-gray-500 text-[10px] mb-2">{card.duration}</p>

                    <div className="flex justify-between items-end border-t border-dashed border-gray-100 pt-1.5">
                        <div>
                            <p className="text-[8px] text-gray-400 uppercase font-semibold">From</p>
                            <p className="text-saffron font-bold text-sm">{card.price}</p>
                        </div>
                        <div className="bg-saffron/10 p-1 rounded-full text-saffron group-hover:bg-saffron group-hover:text-white transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );

}
