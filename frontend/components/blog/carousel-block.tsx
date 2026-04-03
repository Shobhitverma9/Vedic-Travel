"use client";

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselBlockProps {
    data: {
        files?: {
            url: string;
            caption?: string;
        }[];
    };
}

export default function CarouselBlock({ data }: CarouselBlockProps) {
    const [mounted, setMounted] = React.useState(false);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = React.useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    const onSelect = React.useCallback((emblaApi: any) => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, []);

    React.useEffect(() => {
        if (!emblaApi) return;

        onSelect(emblaApi);
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);

        return () => {
            if (emblaApi) emblaApi.off('select', onSelect);
        }
    }, [emblaApi, setScrollSnaps, onSelect]);

    if (!data.files || data.files.length === 0) return null;
    if (!mounted) return null;

    return (
        <div className="relative group my-8 rounded-xl overflow-hidden shadow-lg bg-black/5">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y touch-pinch-zoom backface-visible">
                    {data.files.map((file, index) => (
                        <div className="flex-[0_0_100%] min-w-0 relative" key={index}>
                            <div className="aspect-video relative">
                                <img
                                    src={file.url}
                                    alt={file.caption || `Slide ${index + 1}`}
                                    className="w-full h-full object-cover select-none"
                                />
                            </div>
                            {file.caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center text-sm backdrop-blur-sm">
                                    {file.caption}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-opacity opacity-0 group-hover:opacity-100 disabled:opacity-0"
                onClick={scrollPrev}
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-opacity opacity-0 group-hover:opacity-100 disabled:opacity-0"
                onClick={scrollNext}
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 pointer-events-none">
                {scrollSnaps.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2.5 h-2.5 rounded-full transition-all pointer-events-auto ${index === selectedIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/80'
                            }`}
                        onClick={() => scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
