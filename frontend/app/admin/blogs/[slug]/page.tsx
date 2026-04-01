'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { blogsService } from '@/services/blogs.service';
import ImageUpload from '@/components/common/ImageUpload';

export default function BlogEditorPage({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [id, setId] = useState<string>('');
    const [isEditMode, setIsEditMode] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        author: '',
        tags: [''],
        isActive: true,
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
                title: blog.title,
                excerpt: blog.excerpt,
                content: blog.content,
                image: blog.image,
                author: blog.author,
                tags: blog.tags || [''],
                isActive: blog.isActive,
                publishedDate: blog.publishedDate ? new Date(blog.publishedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            });
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
                tags: formData.tags.filter(t => t.trim()),
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

    if (initialLoading) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-16">
            <h1 className="text-2xl font-bold mb-6">
                {isEditMode ? 'Edit Blog' : 'Create New Blog'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                {/* Basic Info */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
                    <div className="grid grid-cols-1 gap-4">
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
                            <label className="block text-sm font-medium text-gray-700">Excerpt *</label>
                            <textarea
                                name="excerpt"
                                required
                                rows={2}
                                value={formData.excerpt}
                                onChange={handleChange}
                                className="input-field mt-1"
                                placeholder="Short summary for the blog card (2-3 sentences)"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Content *</label>
                            <textarea
                                name="content"
                                required
                                rows={12}
                                value={formData.content}
                                onChange={handleChange}
                                className="input-field mt-1"
                                placeholder="Full blog content... You can use HTML for formatting if needed."
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Author *</label>
                                <input
                                    type="text"
                                    name="author"
                                    required
                                    value={formData.author}
                                    onChange={handleChange}
                                    className="input-field mt-1"
                                    placeholder="e.g. VedicTravel Team"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Published Date *</label>
                                <input
                                    type="date"
                                    name="publishedDate"
                                    required
                                    value={formData.publishedDate}
                                    onChange={handleChange}
                                    className="input-field mt-1"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Image */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Featured Image</h2>
                    <ImageUpload
                        value={formData.image ? [formData.image] : []}
                        onChange={(urls) => setFormData({ ...formData, image: urls[0] || '' })}
                        maxFiles={1}
                    />
                </section>

                {/* Tags */}
                <section className="space-y-4">
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
                                className="text-red-500 hover:text-red-700"
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

                {/* Status */}
                <section className="space-y-4 pt-4 border-t">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Status</h2>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="isActive"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="h-4 w-4 text-saffron border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                            Active (Visible to public)
                        </label>
                    </div>
                </section>

                {/* Submit */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? 'Saving...' : 'Save Blog'}
                    </button>
                </div>
            </form>
        </div>
    );
}
