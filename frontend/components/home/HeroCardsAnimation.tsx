'use client';

import Link from 'next/link';


const cards = [
    {
        title: 'Char Dham Yatra by Helicopter',
        duration: '6D/5N',
        price: '₹2,30,000',
        image: 'https://res.cloudinary.com/duuedlbxa/image/upload/v1774947420/vedic-travel/uploads/nb2yzcyu1fis6tt3bspa.webp',
        link: '/package/char-dham-yatra-by-helicopter-2026',
    },
    {
        title: 'Do Dham by Road Ex-Delhi',
        duration: '8D/7N',
        price: '₹30,000',
        image: 'https://res.cloudinary.com/duuedlbxa/image/upload/v1775201222/vedic-travel/uploads/fd4jfpdmocg5w3fy6alm.jpg',
        link: '/package/dodham-yatra-by-road-ex-delhi-2026',
    },
    {
        title: 'Kailash Mansarovar By Helicopter',
        duration: '9D/8N',
        price: '₹2,80,000',
        image: 'https://res.cloudinary.com/duuedlbxa/image/upload/v1774947374/vedic-travel/uploads/kkmz0rbto4ljjf3djjfh.jpg',
        link: '/package/kailash-mansarovar-helicopter-yatra-2026',
    },
    {
        title: 'Vietnam Signature Journey',
        duration: '6D/5N',
        price: '₹59,999',
        image: 'https://res.cloudinary.com/duuedlbxa/image/upload/v1775288558/vedic-travel/uploads/aucdlxz9orfgjdptjvnn.webp',
        link: '/package/vietnam-signature-journey-2026',
    },
    {
        title: 'Spiritual Heritage Expedition',
        duration: '5D/4N',
        price: '₹21,000',
        image: 'https://res.cloudinary.com/duuedlbxa/image/upload/v1775308500/vedic-travel/uploads/fz3ysnzeupmmy96tyqzj.webp',
        link: '/package/spiritual-heritage-varanasi-prayagraj-ayodhya-2026',
    },
    {
        title: 'Heavenly Kashmir – Luxe Escape',
        duration: '6D/5N',
        price: '₹39,999',
        image: 'https://res.cloudinary.com/duuedlbxa/image/upload/v1775481135/vedic-travel/uploads/o0buxlvnzswoummjkqwi.jpg',
        link: '/package/heavenly-kashmir-curated-2026',
    },
    {
        title: 'Temple & Tides – Luxe Trail',
        duration: '5D/4N',
        price: '₹42,000',
        image: 'https://res.cloudinary.com/duuedlbxa/image/upload/v1775468943/vedic-travel/uploads/uqunu1uztyno8w4alaoc.jpg',
        link: '/package/temples-tides-rameshwarm-madurai-kanyakumari-2026',
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
