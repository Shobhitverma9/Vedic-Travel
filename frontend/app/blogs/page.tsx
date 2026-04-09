'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { blogsService, Blog } from '@/services/blogs.service';
import { BookOpen, Calendar, Clock, ChevronRight, Search, Sparkles, MapPin, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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

    const filteredBlogs = useMemo(() => {
        if (!searchQuery.trim()) return blogs;
        const query = searchQuery.toLowerCase();
        return blogs.filter(blog => 
            blog.title.toLowerCase().includes(query) || 
            blog.excerpt?.toLowerCase().includes(query) ||
            blog.category?.toLowerCase().includes(query) ||
            blog.tags?.some(tag => tag.toLowerCase().includes(query))
        );
    }, [blogs, searchQuery]);

    return (
        <div className="min-h-screen bg-cream/20 pb-20">
            {/* Hero Section */}
            <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
                {/* Background Image with Cinematic Overlay */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[3000ms] transform scale-110"
                    style={{ backgroundImage: "url('https://res.cloudinary.com/duuedlbxa/image/upload/v1775542979/blogs/varanasi-guide/varanasi_travel_guide_featured_image_1775542979326.png')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-deepBlue/40 via-deepBlue/60 to-deepBlue/90 backdrop-blur-[1px]"></div>
                </div>

                {/* Animated Mandala Background */}
                <motion.div 
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: 0.1, rotate: 360 }}
                    transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                    className="absolute -right-24 -top-24 w-96 h-96 text-gold pointer-events-none"
                >
                    <MandalaSVG />
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: 0.05, rotate: -360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    className="absolute -left-32 -bottom-32 w-[500px] h-[500px] text-saffron pointer-events-none"
                >
                    <MandalaSVG />
                </motion.div>
                
                <div className="relative z-10 text-center px-4 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center px-4 py-1.5 bg-saffron/20 backdrop-blur-md text-saffron-light text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-8 border border-saffron/30">
                            <Sparkles className="w-3 h-3 mr-2" />
                            Spiritual Insights & Travel Guides
                        </span>
                        
                        <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-6 drop-shadow-2xl tracking-tight leading-none">
                            Vedic <span className="font-script italic text-gold font-medium ml-2">Chronicles</span>
                        </h1>
                        
                        <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-10 font-sans italic">
                            &ldquo;Explore India's most ancient temples and sacred cities. Journey with purpose and discover the divinity of Bharat.&rdquo;
                        </p>

                        {/* Search Bar - Glassmorphism */}
                        <div className="max-w-xl mx-auto relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-saffron/50 to-gold/50 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-1.5 shadow-2xl overflow-hidden">
                                <Search className="w-5 h-5 text-white/50 ml-4" />
                                <input 
                                    type="text" 
                                    placeholder="Search stories, guides or destinations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none focus:ring-0 text-white placeholder-white/40 px-4 py-3 w-full text-base font-medium outline-none"
                                />
                                <button className="bg-saffron hover:bg-saffron-dark text-white px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-saffron/20 active:scale-95">
                                    Discover
                                </button>
                            </div>
                        </div>

                        {/* Stats / Trust Badges */}
                        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 opacity-60">
                            <div className="flex items-center text-white text-xs font-bold tracking-widest uppercase">
                                <BookOpen className="w-4 h-4 mr-2 text-gold" />
                                100+ Guides
                            </div>
                            <div className="w-1 h-1 bg-white/30 rounded-full hidden md:block"></div>
                            <div className="flex items-center text-white text-xs font-bold tracking-widest uppercase">
                                <MapPin className="w-4 h-4 mr-2 text-gold" />
                                50+ Sacred Cities
                            </div>
                            <div className="w-1 h-1 bg-white/30 rounded-full hidden md:block"></div>
                            <div className="flex items-center text-white text-xs font-bold tracking-widest uppercase">
                                <Users className="w-4 h-4 mr-2 text-gold" />
                                10k+ Readers
                            </div>
                        </div>
                    </motion.div>
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
                ) : filteredBlogs.length > 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
                    >
                        <AnimatePresence mode='popLayout'>
                            {filteredBlogs.map((blog) => (
                                <motion.div
                                    key={blog._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <BlogCard blog={blog} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
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

function MandalaSVG() {
    return (
        <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 2" />
            <path d="M50 20 L55 35 L70 35 L58 45 L62 60 L50 50 L38 60 L42 45 L30 35 L45 35 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <g key={i} transform={`rotate(${deg} 50 50)`}>
                    <path d="M50 10 C55 10 60 15 60 25 C60 35 55 40 50 40 C45 40 40 35 40 25 C40 15 45 10 50 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="5" r="1" />
                </g>
            ))}
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.2" />
        </svg>
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
