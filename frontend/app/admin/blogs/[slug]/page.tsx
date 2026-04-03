'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { blogsService } from '@/services/blogs.service';
import ImageUpload from '@/components/common/ImageUpload';

// Load BlogEditor client-side only (Editor.js requires browser APIs)
const BlogEditor = dynamic(() => import('@/components/admin/blog-editor'), {
    ssr: false,
    loading: () => (
        <div className="border rounded-lg p-4 min-h-[400px] bg-white flex items-center justify-center text-gray-400">
            Loading editor...
        </div>
    ),
});

export default function BlogEditorPage({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [id, setId] = useState<string>('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [editorData, setEditorData] = useState<any>(undefined);

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        image: '',
        author: '',
        category: '',
        tags: [''],
        status: 'draft' as 'draft' | 'published',
        publishedDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params;
            setId(resolvedParams.slug);
            if (resolvedParams.slug !== 'new') {
                setIsEditMode(true);
                fetchBlog(resolvedParams.slug);
            } else {
                setInitialLoading(false);
            }
        };
        resolveParams();
    }, [params]);

    const fetchBlog = async (blogId: string) => {
        try {
            const blog = await blogsService.getById(blogId);
            setFormData({
                title: blog.title || '',
                excerpt: blog.excerpt || '',
                image: blog.image || blog.featuredImage || '',
                author: blog.author || '',
                category: blog.category || '',
                tags: blog.tags?.length ? blog.tags : [''],
                status: (blog.status as any) || (blog.isActive ? 'published' : 'draft'),
                publishedDate: blog.publishedDate
                    ? new Date(blog.publishedDate).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0],
            });
            // Set editor content — handle both JSON and legacy HTML string
            if (typeof blog.content === 'object' && blog.content !== null) {
                setEditorData(blog.content);
            } else if (typeof blog.content === 'string' && blog.content) {
                // Legacy HTML — wrap as a single html block for the editor
                setEditorData({
                    blocks: [{ type: 'html', data: { html: blog.content } }]
                });
            }
        } catch (error) {
            console.error('Failed to fetch blog:', error);
            alert('Error loading blog data');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTagChange = (index: number, value: string) => {
        const newTags = [...formData.tags];
        newTags[index] = value;
        setFormData({ ...formData, tags: newTags });
    };

    const addTag = () => {
        setFormData({ ...formData, tags: [...formData.tags, ''] });
    };

    const removeTag = (index: number) => {
        setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                content: editorData,
                featuredImage: formData.image,
                tags: formData.tags.filter(t => t.trim()),
                isActive: formData.status === 'published',
            };

            if (isEditMode) {
                await blogsService.update(id, payload);
            } else {
                await blogsService.create(payload);
            }
            router.push('/admin/blogs');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save blog. Please check the data.');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-16">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? 'Edit Blog' : 'Create New Blog'}
                </h1>
                <button
                    type="button"
                    onClick={() => router.push('/admin/blogs')}
                    className="text-sm text-gray-500 hover:text-gray-700"
                >
                    ← Back to Blogs
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field mt-1"
                            placeholder="The Role of Kedarnath Temple in Indian Mythology and Culture"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Excerpt</label>
                        <textarea
                            name="excerpt"
                            rows={2}
                            value={formData.excerpt}
                            onChange={handleChange}
                            className="input-field mt-1"
                            placeholder="Short summary for the blog card (2-3 sentences)"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Author</label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                className="input-field mt-1"
                                placeholder="e.g. VedicTravel Team"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="input-field mt-1"
                                placeholder="e.g. Spiritual, Travel Tips"
                            />
                        </div>
                    </div>
                </section>

                {/* Featured Image */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Featured Image</h2>
                    <ImageUpload
                        value={formData.image ? [formData.image] : []}
                        onChange={(urls) => setFormData({ ...formData, image: urls[0] || '' })}
                        maxFiles={1}
                    />
                </section>

                {/* Rich Text Editor */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Content</h2>
                    <p className="text-xs text-gray-500">
                        Use the toolbar to add headers, images, carousels, quotes, tables, buttons, and more.
                    </p>
                    <BlogEditor
                        data={editorData}
                        onChange={(data) => setEditorData(data)}
                    />
                </section>

                {/* Tags */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Tags</h2>
                    {formData.tags.map((tag, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={tag}
                                onChange={(e) => handleTagChange(index, e.target.value)}
                                className="input-field"
                                placeholder="e.g. Kedarnath, Mythology"
                            />
                            <button
                                type="button"
                                onClick={() => removeTag(index)}
                                className="text-red-500 hover:text-red-700 px-2"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addTag}
                        className="text-sm text-saffron hover:underline"
                    >
                        + Add Tag
                    </button>
                </section>

                {/* Publish Settings */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Publish Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="input-field mt-1"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Published Date</label>
                            <input
                                type="date"
                                name="publishedDate"
                                value={formData.publishedDate}
                                onChange={handleChange}
                                className="input-field mt-1"
                            />
                        </div>
                    </div>
                </section>

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/blogs')}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? 'Saving...' : isEditMode ? 'Update Blog' : 'Publish Blog'}
                    </button>
                </div>
            </form>
        </div>
    );
}
