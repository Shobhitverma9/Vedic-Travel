'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { yatrasService } from '@/services/yatras.service';
import { toursService } from '@/services/tours.service';
import { filesService } from '@/services/files.service';

export default function YatraEditorPage({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [id, setId] = useState<string>('');
    const [isEditMode, setIsEditMode] = useState(false);

    // Data for selection
    const [availablePackages, setAvailablePackages] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        longDescription: '',
        heroImage: '',
        category: 'Pilgrimage Yatra Packages',
        isActive: true,
        isVedicImprint: false,
        rank: 0,
        packages: [] as string[], // Array of Package IDs
        faqs: [] as { question: string, answer: string }[],
        thumbnailImages: [] as string[],
    });

    useEffect(() => {
        const init = async () => {
            try {
                // Fetch packages (non-blocking - failure here should not stop yatra loading)
                try {
                    const toursData = await toursService.getAllTours({ limit: 200, isActive: 'all' });
                    setAvailablePackages(toursData.tours || []);
                } catch (toursError) {
                    console.warn('Could not load packages, continuing anyway:', toursError);
                }

                const resolvedParams = await params;
                setId(resolvedParams.slug);

                if (resolvedParams.slug !== 'new') {
                    setIsEditMode(true);
                    const yatra = await yatrasService.getYatraById(resolvedParams.slug);
                    setFormData({
                        title: yatra.title,
                        slug: yatra.slug || '',
                        description: yatra.description,
                        longDescription: yatra.longDescription || '',
                        heroImage: yatra.heroImage || '',
                        category: yatra.category || 'Pilgrimage Yatra Packages',
                        isActive: yatra.isActive,
                        isVedicImprint: yatra.isVedicImprint || false,
                        rank: yatra.rank || 0,
                        packages: yatra.packages ? yatra.packages.map((p: any) => typeof p === 'string' ? p : p._id) : [],
                        faqs: yatra.faqs || [],
                        thumbnailImages: yatra.thumbnailImages || [],
                    });
                }
            } catch (error: any) {
                console.error('Initialization error:', error);
                const message = error?.response?.data?.message || error?.message || 'Unknown error';
                alert(`Failed to load data: ${message}`);
            } finally {
                setInitialLoading(false);
            }
        };

        init();
    }, [params]);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    };

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const newData: any = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };

            // Auto-generate slug from title if in create mode and slug hasn't been manually edited
            if (name === 'title' && !isEditMode) {
                newData.slug = generateSlug(value);
            }

            return newData;
        });
    };

    const handlePackageToggle = (packageId: string) => {
        setFormData(prev => {
            const currentPackages = prev.packages;
            if (currentPackages.includes(packageId)) {
                return { ...prev, packages: currentPackages.filter(id => id !== packageId) };
            } else {
                return { ...prev, packages: [...currentPackages, packageId] };
            }
        });
    };

    const handleAddFaq = () => {
        setFormData(prev => ({
            ...prev,
            faqs: [...prev.faqs, { question: '', answer: '' }]
        }));
    };

    const handleRemoveFaq = (index: number) => {
        setFormData(prev => ({
            ...prev,
            faqs: prev.faqs.filter((_, i) => i !== index)
        }));
    };

    const handleFaqChange = (index: number, field: string, value: string) => {
        setFormData(prev => {
            const newFaqs = [...prev.faqs];
            newFaqs[index] = { ...newFaqs[index], [field]: value };
            return { ...prev, faqs: newFaqs };
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const result = await filesService.uploadImage(file);
            // Result URL might be directly returned or nested depending on backend interceptors
            const imageUrl = result.url || result.data?.url || result;
            if (typeof imageUrl === 'string') {
                setFormData(prev => ({ ...prev, heroImage: imageUrl }));
            } else {
                throw new Error('Could not resolve image URL from response');
            }
        } catch (error: any) {
            console.error('Image upload failed:', error);
            alert(`Failed to upload image: ${error.message || 'Unknown error'}`);
        }
    };

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            const fileArray = Array.from(files);
            const result = await filesService.uploadImages(fileArray);

            // Expected result to be an array of URLs or { urls: [...] }
            let urls: string[] = [];
            if (Array.isArray(result)) {
                urls = result.map(r => r.url || r);
            } else if (result.urls && Array.isArray(result.urls)) {
                urls = result.urls;
            } else if (result.data?.urls) {
                urls = result.data.urls;
            }

            if (urls.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    thumbnailImages: [...prev.thumbnailImages, ...urls].slice(0, 2) // Limit to 2 as per UI design
                }));
            }
        } catch (error: any) {
            console.error('Thumbnail upload failed:', error);
            alert(`Failed to upload thumbnail images: ${error.message || 'Unknown error'}`);
        }
    };

    const removeThumbnail = (index: number) => {
        setFormData(prev => ({
            ...prev,
            thumbnailImages: prev.thumbnailImages.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                rank: Number(formData.rank),
            };

            if (isEditMode) {
                await yatrasService.updateYatra(id, payload);
            } else {
                await yatrasService.createYatra(payload);
            }
            router.push('/admin/yatras');
        } catch (error: any) {
            console.error('Save failed:', error);
            const message = error?.response?.data?.message
                || error?.response?.data?.error
                || error?.message
                || 'Unknown error';
            alert(`Failed to save yatra: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-16">
            <h1 className="text-2xl font-bold mb-6">
                {isEditMode ? 'Edit Yatra' : 'Create New Yatra'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                {/* Basic Info */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="input-field mt-1"
                                placeholder="e.g. Char Dham Yatra"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Slug (URL)</label>
                            <input
                                type="text"
                                name="slug"
                                required
                                value={formData.slug}
                                onChange={handleChange}
                                className="input-field mt-1"
                                placeholder="e.g. char-dham-yatra"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Category (Header Menu Group)</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="input-field mt-1"
                        >
                            <option value="Trending Packages">Trending Packages</option>
                            <option value="Pilgrimage Yatra Packages">Pilgrimage Yatra Packages</option>
                            <option value="Yoga & Wellness Retreats">Yoga & Wellness Retreats</option>
                            <option value="Heritage and Cultural Tours">Heritage and Cultural Tours</option>
                            <option value="Adventure & Eco Tours">Adventure & Eco Tours</option>
                            <option value="Vedic Imprints">Vedic Imprints</option>
                            <option value="Customized Packages">Customized Packages</option>
                        </select>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Short Description (for cards)</label>
                        <textarea
                            name="description"
                            required
                            rows={2}
                            value={formData.description}
                            onChange={handleChange}
                            className="input-field mt-1"
                            placeholder="Brief description of the Yatra collection..."
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Long Description (Details section)</label>
                        <textarea
                            name="longDescription"
                            rows={6}
                            value={formData.longDescription}
                            onChange={handleChange}
                            className="input-field mt-1"
                            placeholder="Detailed description with HTML support if needed..."
                        ></textarea>
                    </div>
                </section>

                {/* Media */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Media</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
                        <div className="flex items-start space-x-4">
                            {formData.heroImage && (
                                <img
                                    src={formData.heroImage}
                                    alt="Hero Preview"
                                    className="w-32 h-20 object-cover rounded shadow-sm border"
                                />
                            )}
                            <div className="flex-1">
                                <input
                                    type="text"
                                    name="heroImage"
                                    value={formData.heroImage}
                                    onChange={handleChange}
                                    className="input-field mb-2"
                                    placeholder="Enter image URL or upload"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-saffron/10 file:text-saffron hover:file:bg-saffron/20 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Images (Up to 2 Float Images)</label>
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-wrap gap-4">
                                {formData.thumbnailImages.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="w-24 h-32 object-cover rounded shadow-sm border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeThumbnail(idx)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {formData.thumbnailImages.length < 2 && (
                                <div className="flex-1 max-w-sm">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleThumbnailUpload}
                                        className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-saffron/10 file:text-saffron hover:file:bg-saffron/20 cursor-pointer w-full"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Upload up to 2 vertical thumbnail images (e.g. 56x72 ratio)</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Package Selection */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Select Packages</h2>
                    <p className="text-sm text-gray-500 mb-4">Select the packages (tours) that belong to this Yatra.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200">
                        {availablePackages.map((pkg) => (
                            <label key={pkg._id} className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${formData.packages.includes(pkg._id)
                                ? 'bg-saffron/10 border-saffron'
                                : 'bg-white border-gray-200 hover:border-saffron/50'
                                }`}>
                                <input
                                    type="checkbox"
                                    checked={formData.packages.includes(pkg._id)}
                                    onChange={() => handlePackageToggle(pkg._id)}
                                    className="mt-1 h-4 w-4 text-saffron border-gray-300 rounded focus:ring-saffron"
                                />
                                <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">{pkg.title}</div>
                                    <div className="text-xs text-gray-500">
                                        {pkg.duration} Days | ₹{pkg.price.toLocaleString()}
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                </section>

                {/* FAQs */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-lg font-semibold text-gray-800">Frequently Asked Questions</h2>
                        <button
                            type="button"
                            onClick={handleAddFaq}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium transition-colors"
                        >
                            + Add FAQ
                        </button>
                    </div>

                    <div className="space-y-4">
                        {formData.faqs.map((faq, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100 relative group">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFaq(index)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 hidden group-hover:block"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Question"
                                        value={faq.question}
                                        onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                                        className="input-field text-sm font-semibold"
                                    />
                                    <textarea
                                        placeholder="Answer"
                                        rows={2}
                                        value={faq.answer}
                                        onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                                        className="input-field text-sm"
                                    ></textarea>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Status */}
                <section className="space-y-4 pt-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                Active (Visible)
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="isVedicImprint"
                                id="isVedicImprint"
                                checked={formData.isVedicImprint}
                                onChange={handleChange}
                                className="h-4 w-4 text-saffron border-gray-300 rounded"
                            />
                            <label htmlFor="isVedicImprint" className="text-sm font-medium text-gray-700">
                                Is Vedic Imprint?
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Display Rank</label>
                            <input
                                type="number"
                                name="rank"
                                value={formData.rank}
                                onChange={handleChange}
                                className="input-field mt-1"
                                placeholder="Order on page (0, 1, 2...)"
                            />
                        </div>
                    </div>
                </section>

                {/* Submit */}
                <div className="flex justify-end pt-4 space-x-4">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/yatras')}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary px-8"
                    >
                        {loading ? 'Saving...' : 'Save Yatra'}
                    </button>
                </div>
            </form>
        </div>
    );
}
