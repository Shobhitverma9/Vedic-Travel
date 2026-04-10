import { useTours } from '@/hooks/useTours';
import Link from 'next/link';

export default function HeroCardsAnimation() {
    // 1. Fetch specifically selected Hero tours
    const { data: heroData, isLoading: heroLoading } = useTours({ showInHero: true, isActive: true });
    
    // 2. Fetch Trending tours as a dynamic fallback (always filtered by isActive)
    const { data: trendingData, isLoading: trendingLoading } = useTours({ 
        isTrending: true, 
        isActive: true, 
        limit: 10,
        sortBy: 'trendingRank',
        order: 'asc'
    });

    const isLoading = heroLoading || trendingLoading;

    // Determine which tours to show: Prefer showInHero, fallback to Trending
    const rawTours = (heroData?.tours?.length > 0) 
        ? heroData.tours 
        : (trendingData?.tours || []);

    // Map backend tours to card format
    const cards = rawTours.map((tour: any) => ({
        title: tour.title,
        duration: tour.duration ? `${tour.duration}D/${tour.duration - 1}N` : 'Curated Trip',
        price: `₹${tour.price?.toLocaleString('en-IN')}`,
        image: tour.images?.[0] || '/placeholder.png',
        link: `/package/${tour.slug}`,
    }));

    if (isLoading) {
        return (
            <div className="relative mt-8 overflow-hidden mx-auto w-full max-w-[1240px] h-64 flex items-center justify-center">
                <div className="flex gap-4 animate-pulse">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-44 h-52 md:h-60 bg-white/10 rounded-lg shrink-0" />
                    ))}
                </div>
            </div>
        );
    }

    if (cards.length === 0) return null;

    return (
        <>
            <style jsx>{`
                @keyframes marquee-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-scroll {
                    animation: marquee-scroll 40s linear infinite;
                    width: max-content; 
                }
                .animate-marquee-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div
                className="relative mt-8 overflow-hidden select-none mx-auto w-full"
                style={{
                    maxWidth: '1240px',
                    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                }}
            >
                <div className="flex animate-marquee-scroll">
                    {/* First Set */}
                    <div className="flex shrink-0">
                        {cards.map((card: any, index: number) => (
                            <Card key={`card1-${index}`} card={card} index={index} />
                        ))}
                    </div>
                    {/* Duplicate Set for Seamless Loop */}
                    <div className="flex shrink-0">
                        {cards.map((card: any, index: number) => (
                            <Card key={`card2-${index}`} card={card} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

function Card({ card, index }: { card: any; index: number }) {
    const rotation = index % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]';
    const margin = index % 2 === 0 ? 'mt-0' : 'mt-4';

    return (
        <Link href={card.link || '#'}>
            <div
                className={`
                    relative flex-shrink-0 w-44 h-52 md:h-60 bg-white rounded-lg shadow-lg border-2 border-white overflow-hidden 
                    transform transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-2xl
                    ${rotation} ${margin} mx-2.5 cursor-pointer group
                `}
            >
                <div className="h-28 md:h-36 w-full relative overflow-hidden">
                    <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-2.5 bg-white relative h-full">
                    <h3 className="font-sans font-bold text-sm text-deepBlue leading-tight mb-1 line-clamp-2">{card.title}</h3>
                    <p className="text-gray-500 text-[10px] mb-2">{card.duration}</p>

                    <div className="flex justify-between items-end border-t border-dashed border-gray-100 pt-1.5 absolute bottom-2.5 left-2.5 right-2.5 bg-white">
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
