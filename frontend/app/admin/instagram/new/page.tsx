'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { instagramService } from '@/services/instagram.service';
import Link from 'next/link';

export default function NewInstagramPostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        caption: '',
        instagramLink: '',
        videoUrl: '',
        thumbnailUrl: '',
        order: 0,
        isActive: true,
        views: 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'order' || name === 'views' ? parseInt(value) || 0 : value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    // Placeholder for file upload logic - will be replaced or integrated with MediaUpload component
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'image') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Construct validation
        if (type === 'video' && !file.type.startsWith('video/')) {
            alert('Please upload a valid video file');
            return;
        }
        if (type === 'image' && !file.type.startsWith('image/')) {
            alert('Please upload a valid image file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            // Direct fetch to specialized upload endpoint if needed, or stick to generic
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            setFormData(prev => ({
                ...prev,
                [type === 'image' ? 'thumbnailUrl' : 'videoUrl']: data.url
            }));
        } catch (error) {
            console.error('Upload error:', error);
            alert('File upload failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await instagramService.createPost(formData);
            router.push('/admin/instagram');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-deepBlue">Add New Instagram Post</h1>
                <Link href="/admin/instagram" className="text-gray-600 hover:text-deepBlue">
                    Back to List
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Thumbnail Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image *</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            {formData.thumbnailUrl ? (
                                <div className="relative aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={formData.thumbnailUrl}
                                        alt="Thumbnail preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, thumbnailUrl: '' }))}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="thumbnail-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-saffron hover:text-saffron/80 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input id="thumbnail-upload" name="thumbnail-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Video Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Video (Short Clip) *</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            {formData.videoUrl ? (
                                <div className="relative aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
                                    <video
                                        src={formData.videoUrl}
                                        className="w-full h-full object-cover"
                                        controls
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, videoUrl: '' }))}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="video-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-saffron hover:text-saffron/80 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input id="video-upload" name="video-upload" type="file" className="sr-only" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">MP4, WebM up to 50MB</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                        <input
                            type="text"
                            name="caption"
                            value={formData.caption}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-saffron focus:border-saffron"
                            placeholder="Enter caption..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Link *</label>
                        <input
                            type="url"
                            name="instagramLink"
                            required
                            value={formData.instagramLink}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-saffron focus:border-saffron"
                            placeholder="https://www.instagram.com/p/..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Views Count</label>
                            <input
                                type="number"
                                name="views"
                                value={formData.views}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-saffron focus:border-saffron"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-saffron focus:border-saffron"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isActive"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 text-saffron focus:ring-saffron border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                            Active (Visible on website)
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/instagram')}
                        className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 from-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-saffron text-white rounded-lg hover:bg-saffron/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Post'}
                    </button>
                </div>

            </form>
        </div>
    );
}
