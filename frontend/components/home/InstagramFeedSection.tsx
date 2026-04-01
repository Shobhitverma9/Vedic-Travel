'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { instagramService } from '@/services/instagram.service';

export default function InstagramFeedSection() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await instagramService.getAllPosts({ activeOnly: true });
                setPosts(response || []);
            } catch (error) {
                console.error('Error fetching Instagram posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            const currentScroll = scrollContainerRef.current.scrollLeft;
            scrollContainerRef.current.scrollTo({
                left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleMouseEnter = (id: string, videoUrl?: string) => {
        if (videoUrl) {
            setPlayingVideo(id);
            // Optional: Logic to play video if using a video tag ref
        }
    };

    const handleMouseLeave = () => {
        setPlayingVideo(null);
    };

    if (loading) return null;
    if (!posts || posts.length === 0) return null;

    return (
        <section className="py-10 bg-white overflow-hidden">
            <div className="container mx-auto px-4 relative">

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-saffron uppercase tracking-wide">
                        Latest From Instagram
                    </h2>
                </div>

                <div className="relative group/section">
                    {/* Left Button */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white text-deepBlue rounded-full p-3 shadow-lg transition-all opacity-0 group-hover/section:opacity-100 disabled:opacity-0 hover:bg-gray-50"
                        disabled={!scrollContainerRef.current || scrollContainerRef.current.scrollLeft === 0}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Carousel */}
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide py-4 px-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {posts.map((post) => (
                            <div
                                key={post._id}
                                className="min-w-[280px] md:min-w-[300px] snap-center relative rounded-2xl overflow-hidden shadow-xl aspect-[9/16] group cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                                onMouseEnter={() => handleMouseEnter(post._id, post.videoUrl)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <a
                                    href={post.instagramLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 z-20 block"
                                >
                                    <span className="sr-only">View on Instagram</span>
                                </a>

                                {/* Media */}
                                <div className="absolute inset-0 bg-black">
                                    {post.videoUrl && playingVideo === post._id ? (
                                        <video
                                            src={post.videoUrl}
                                            className="w-full h-full object-cover"
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                        />
                                    ) : (
                                        <img
                                            src={post.thumbnailUrl}
                                            alt={post.caption || 'Instagram Post'}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    )}
                                </div>

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                                {/* Top Right Icon */}
                                <div className="absolute top-4 right-4 z-10 text-white opacity-90">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </div>

                                {/* Center Play Button */}
                                {post.videoUrl && (
                                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-opacity duration-300 ${playingVideo === post._id ? 'opacity-0' : 'opacity-100'}`}>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/40">
                                            <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                )}

                                {/* Bottom Info */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
                                    <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-2">
                                        {post.caption}
                                    </h3>

                                    <div className="flex items-center text-sm text-gray-300 space-x-4">
                                        {post.views > 0 && (
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                                {post.views.toLocaleString()} Views
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Button */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white text-deepBlue rounded-full p-3 shadow-lg transition-all opacity-0 group-hover/section:opacity-100 hover:bg-gray-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* View All Button */}
                <div className="text-center mt-8">
                    <a
                        href="https://www.instagram.com/vedictravels/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-8 py-3 bg-saffron text-white rounded-full font-bold hover:bg-saffron/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        Follow Us on Instagram
                    </a>
                </div>
            </div>
        </section>
    );
}
