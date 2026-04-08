'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { blogsService, Blog } from '@/services/blogs.service';
import { BookOpen, Calendar, Clock, ChevronRight } from 'lucide-react';

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                // Fetch all published blogs
                const response = await blogsService.getAll();
                setBlogs(response || []);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div className="min-h-screen bg-cream/20 pb-20">
            {/* Hero Section */}
            <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 transform hover:scale-105"
                    style={{ backgroundImage: "url('https://res.cloudinary.com/duuedlbxa/image/upload/v1775542979/blogs/varanasi-guide/varanasi_travel_guide_featured_image_1775542979326.png')" }}
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
                </div>
                
                <div className="relative z-10 text-center px-4 max-w-4xl animate-fade-in">
                    <span className="inline-block px-4 py-1.5 bg-saffron/90 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                        Spiritual Insights & Travel Guides
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
                        Vedic <span className="font-sans italic text-skyBlue">Chronicles</span>
                    </h1>
                    <p className="text-white/90 text-xl font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
                        Explore our curated guides for India's most ancient temples and sacred cities. Journey with purpose and discover the divinity of Bharat.
                    </p>
                </div>
            </section>

            {/* Blogs Listing Section */}
            <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse h-[450px]"></div>
                        ))}
                    </div>
                ) : blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {blogs.map((blog) => (
                            <BlogCard key={blog._id} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl shadow-sm border-2 border-dashed border-gray-100">
                        <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-deepBlue mb-2">No Chronicles Found</h2>
                        <p className="text-gray-500 max-w-xs mx-auto">
                            We're currently preparing new spiritual guides for you. Check back soon!
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}

function BlogCard({ blog }: { blog: Blog }) {
    return (
        <Link 
            href={`/blogs/${blog.slug}`} 
            className="group block h-full focus:outline-none"
        >
            <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 h-full flex flex-col transform hover:-translate-y-2">
                {/* Image & Overlay */}
                <div className="relative h-64 overflow-hidden">
                    <img
                        src={blog.featuredImage || blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-6 flex items-center space-x-4">
                         <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-wider border border-white/30">
                            {blog.category || 'Travel Guide'}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                    {/* Metadata Header */}
                    <div className="flex items-center text-gray-400 text-xs mb-4 space-x-4">
                        <span className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 text-saffron" />
                            {new Date(blog.publishedAt || blog.publishedDate || Date.now()).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                        <span className="flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1.5 text-saffron" />
                            5 min read
                        </span>
                    </div>

                    <h3 className="text-2xl font-bold text-deepBlue mb-4 line-clamp-2 leading-tight group-hover:text-saffron transition-colors duration-300">
                        {blog.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-8 leading-relaxed">
                        {blog.excerpt}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-saffron font-bold text-xs uppercase tracking-widest flex items-center">
                            Read More
                            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1.5" />
                        </span>
                        
                        <div className="flex -space-x-2">
                             {blog.tags?.slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="w-6 h-6 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-400">
                                    {tag.charAt(0).toUpperCase()}
                                </span>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
