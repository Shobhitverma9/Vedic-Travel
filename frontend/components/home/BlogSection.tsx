'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { blogsService, Blog } from '@/services/blogs.service';

export default function BlogSection() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await blogsService.getAll({ limit: 10 });
                setBlogs(response || []);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 320; // Approx card width + gap
            const currentScroll = scrollContainerRef.current.scrollLeft;
            scrollContainerRef.current.scrollTo({
                left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (loading) return null;
    if (!blogs || blogs.length === 0) return null;

    return (
        <section className="py-10 bg-cream/30">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-deepBlue mb-4">
                        Latest <span className="font-sans italic text-skyBlue">Blogs</span>
                    </h2>
                    <p className="section-subtitle max-w-2xl mx-auto">
                        Explore Our Specially Curated Guides, Spiritual Blogs & Inspirational Stories
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative group/section px-4 md:px-12">
                    {/* Left Button */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white text-deepBlue rounded-full p-3 shadow-lg transition-all opacity-0 group-hover/section:opacity-100 disabled:opacity-0 hover:bg-gray-50 border border-gray-100"
                        disabled={!scrollContainerRef.current || scrollContainerRef.current.scrollLeft === 0}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Carousel */}
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide py-4 px-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {blogs.map((blog) => (
                            <div key={blog._id} className="min-w-[280px] md:min-w-[320px] snap-center h-full">
                                <BlogCard blog={blog} />
                            </div>
                        ))}
                    </div>

                    {/* Right Button */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white text-deepBlue rounded-full p-3 shadow-lg transition-all opacity-0 group-hover/section:opacity-100 hover:bg-gray-50 border border-gray-100"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}

function BlogCard({ blog }: { blog: Blog }) {
    return (
        <Link href={`/blogs/${blog.slug}`} className="block h-full group">
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/40 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-deepBlue text-lg mb-2 line-clamp-2 leading-tight group-hover:text-saffron transition-colors">
                        {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                        {blog.excerpt}
                    </p>
                    {/* <div className="text-xs text-gray-400 mt-auto">
                        {new Date(blog.publishedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div> */}
                </div>
            </div>
        </Link>
    );
}
