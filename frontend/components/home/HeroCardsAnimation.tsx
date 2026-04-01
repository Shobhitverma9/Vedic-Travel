'use client';

const cards = [
    {
        title: 'Chardham Yatra',
        duration: '10D/9N',
        price: '₹25,999',
        image: '/images/cards/chardham.png',
    },
    {
        title: 'Varanasi',
        duration: '3D/2N',
        price: '₹8,499',
        image: '/images/cards/varanasi.png',
    },
    {
        title: 'Rishikesh',
        duration: '5D/4N',
        price: '₹12,999',
        image: '/images/cards/rishikesh.png',
    },
    {
        title: 'Golden Temple',
        duration: '3D/2N',
        price: '₹7,999',
        image: '/images/cards/goldentemple.png',
    },
    {
        title: 'Tirupati',
        duration: '2D/1N',
        price: '₹6,999',
        image: '/images/cards/tirupati.png',
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
    );
}
