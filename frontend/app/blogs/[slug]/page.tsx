'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { blogsService, Blog } from '@/services/blogs.service';
import { useRouter } from 'next/navigation';

const BlogContentRenderer = dynamic(
    () => import('@/components/blog/blog-content-renderer'),
    { ssr: false, loading: () => <div className="animate-pulse space-y-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="h-4 bg-gray-200 rounded"></div><div className="h-4 bg-gray-200 rounded w-5/6"></div></div> }
);

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params;
            fetchBlog(resolvedParams.slug);
        };
        resolveParams();
    }, [params]);

    const fetchBlog = async (blogSlug: string) => {
        try {
            const data: Blog = await blogsService.getBySlug(blogSlug);
            setBlog(data);
            // Increment view count in background
            if (data._id) {
                blogsService.getById(data._id).catch(() => { });
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Blog Not Found</h1>
                <button onClick={() => router.push('/')} className="btn-primary">
                    Go Home
                </button>
            </div>
        );
    }

    const heroImage = blog.featuredImage || blog.image;

    return (
        <div className="min-h-screen bg-cream/30 pt-28 pb-12">
            <article className="container mx-auto px-4 max-w-4xl">
                {/* Hero Image */}
                {heroImage && (
                    <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl mb-8">
                        <img
                            src={heroImage}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                )}

                {/* Header */}
                <header className="bg-white rounded-xl p-8 shadow-sm mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-deepBlue mb-4 leading-tight">
                        {blog.title}
                    </h1>

                    <div className="flex items-center flex-wrap gap-4 text-gray-600 text-sm">
                        {blog.author && (
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2 text-saffron" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                {blog.author}
                            </div>
                        )}
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-saffron" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {new Date(blog.publishedDate || blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                        {blog.category && (
                            <span className="px-3 py-1 bg-saffron/10 text-saffron rounded-full text-xs font-medium">
                                {blog.category}
                            </span>
                        )}
                        {blog.views !== undefined && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {blog.views} views
                            </span>
                        )}
                    </div>

                    {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {blog.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-skyBlue/10 text-skyBlue rounded-full text-sm font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {/* Content */}
                <div className="bg-white rounded-xl p-8 shadow-sm">
                    {blog.excerpt && (
                        <p className="text-xl text-gray-700 font-medium mb-8 leading-relaxed border-b pb-6">
                            {blog.excerpt}
                        </p>
                    )}
                    <BlogContentRenderer data={blog.content} />
                </div>

                {/* Back Button */}
                <div className="mt-12 text-center">
                    <button
                        onClick={() => router.push('/')}
                        className="btn-outline"
                    >
                        ← Back to Home
                    </button>
                </div>
            </article>
        </div>
    );
}
