'use client';

import Image from 'next/image';

interface Highlight {
    image: string;
    title: string;
}

interface TourHighlightCardsProps {
    highlights: (string | Highlight)[];
}

export default function TourHighlightCards({ highlights }: TourHighlightCardsProps) {
    if (!highlights || !Array.isArray(highlights) || highlights.length === 0) return null;

    // Normalize data: Handle both string[] and Highlight[]
    const normalizedHighlights: Highlight[] = highlights
        .filter(item => !!item)
        .map(item => {
            if (typeof item === 'string') {
                return { image: item, title: '' };
            }
            if (typeof item === 'object' && 'image' in item) {
                return item as Highlight;
            }
            return null;
        })
        .filter((item): item is Highlight => item !== null && !!item.image && item.image.trim().length > 0);

    if (normalizedHighlights.length === 0) return null;

    // Ensure enough items for scrolling by duplicating if needed
    const items = normalizedHighlights.length < 5
        ? [...normalizedHighlights, ...normalizedHighlights, ...normalizedHighlights]
        : normalizedHighlights;

    return (
        <div className="w-full overflow-hidden select-none relative z-20">
            <style jsx>{`
                @keyframes marquee-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-scroll {
                    animation: marquee-scroll 25s linear infinite;
                    width: max-content; 
                }
                .animate-marquee-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div
                className="relative mx-auto mt-4 px-4 overflow-hidden max-w-2xl"
                style={{
                    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                }}
            >
                <div className="flex animate-marquee-scroll py-4">
                    {/* First Set */}
                    <div className="flex shrink-0">
                        {items.map((item, index) => (
                            <HighlightCard key={`h1-${index}`} highlight={item} index={index} />
                        ))}
                    </div>
                    {/* Duplicate Set for Seamless Loop */}
                    <div className="flex shrink-0">
                        {items.map((item, index) => (
                            <HighlightCard key={`h2-${index}`} highlight={item} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function HighlightCard({ highlight, index }: { highlight: Highlight; index: number }) {
    // Staggered tilt and margin like home page
    const rotation = index % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]';
    const margin = index % 2 === 0 ? 'mt-0' : 'mt-4';

    return (
        <div
            className={`
                relative flex-shrink-0 w-32 h-20 bg-white rounded-lg shadow-lg border-2 border-white overflow-hidden 
                transform transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-2xl
                ${rotation} ${margin} mx-2.5 cursor-pointer group
            `}
        >
            <Image
                src={highlight.image}
                alt={highlight.title || "Highlight"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient Overlay for Title */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/40 transition-colors"></div>

            {highlight.title && (
                <div className="absolute bottom-1.5 left-2 right-2 text-center">
                    <span className="text-white text-[10px] font-bold uppercase tracking-widest drop-shadow-md">
                        {highlight.title}
                    </span>
                </div>
            )}
        </div>
    );
}
