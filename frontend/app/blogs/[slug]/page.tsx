'use client';

import { useState, useEffect } from 'react';
import { blogsService, Blog } from '@/services/blogs.service';
import { useRouter } from 'next/navigation';

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [slug, setSlug] = useState('');

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params;
            setSlug(resolvedParams.slug);
            fetchBlog(resolvedParams.slug);
        };
        resolveParams();
    }, [params]);

    const fetchBlog = async (blogSlug: string) => {
        try {
            const data: Blog = await blogsService.getBySlug(blogSlug);
            setBlog(data);
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

    return (
        <div className="min-h-screen bg-cream/30 py-12">
            <article className="container mx-auto px-4 max-w-4xl">
                {/* Hero Image */}
                <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl mb-8">
                    <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Header */}
                <header className="bg-white rounded-xl p-8 shadow-sm mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-deepBlue mb-4 leading-tight">
                        {blog.title}
                    </h1>

                    <div className="flex items-center flex-wrap gap-4 text-gray-600 text-sm">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-saffron" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            {blog.author}
                        </div>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-saffron" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {new Date(blog.publishedDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
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
                <div className="bg-white rounded-xl p-8 shadow-sm prose prose-lg max-w-none">
                    <p className="text-xl text-gray-700 font-medium mb-6 leading-relaxed">
                        {blog.excerpt}
                    </p>
                    <div
                        className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
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
