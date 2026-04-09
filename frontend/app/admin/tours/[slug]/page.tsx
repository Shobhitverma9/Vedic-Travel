'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toursService } from '@/services/tours.service';
import { yatrasService } from '@/services/yatras.service';
import ImageUpload from '@/components/common/ImageUpload';
import { Plus, Trash, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import RichTextToolbar from '@/components/admin/RichTextToolbar';

export default function TourEditorPage({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [id, setId] = useState<string>('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [draftRestored, setDraftRestored] = useState(false);
    const [saveDraftStatus, setSaveDraftStatus] = useState('');
    const [availableYatras, setAvailableYatras] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        price: '',
        priceOriginal: '',
        duration: '',
        maxGroupSize: '',
        category: 'pilgrimage',
        destination: 'North India',
        locations: [''],
        images: [] as string[], // Main Card Images
        slideshowImages: [] as string[],
        packageType: 'Land Only',
        placesHighlights: [] as string[],
        placesToVisit: '',
        joiningFrom: 'Joining Direct',
        packageIncludes: [] as string[], // Categories
        hotels: [] as { name: string; image: string; description: string; rating: number }[],
        itinerary: [] as {
            day: number;
            title: string;
            description: string;
            items: {
                type: 'hotel' | 'transfer' | 'meal' | 'activity' | 'flight' | 'checkout';
                title?: string;
                description?: string;
                image?: string;
                time?: string;
            }[]
        }[],
        inclusions: [''],
        exclusions: [''],
        dos: [''],
        donts: [''],
        thingsToCarry: [''],
        cancellationPolicy: '',
        useDefaultCancellationPolicy: true,
        termsAndConditions: '',
        paymentTerms: '',
        isActive: true,
        showInHero: false,
        isFavorite: false,
        favoriteSize: 'standard',
        isTrending: false,
        trendingRank: '',
        badge: '',
        emiStartingFrom: '',
        customBlocks: [] as any[],
        hasEasyCancellation: true,
        hasEasyVisa: false,
        hasHighSeason: false,
        hasTravelValidity: false,
        departureCities: [] as {
            city: string;
            surcharge: number;
            isDefault: boolean;
            availabilityType: 'specific_dates' | 'weekly' | 'daily' | 'monthly_dates';
            availableDates: Date[];
            weeklyDays: number[];
            monthlyDays: number[];
            blackoutDates: Date[];
        }[],
        seo: {
            title: '',
            description: '',
            keywords: '',
        },
    });

    useEffect(() => {
        const resolveParams = async () => {
            try {
                const yatrasData = await yatrasService.getAllYatras({ limit: 100 });
                setAvailableYatras(yatrasData.yatras || []);
            } catch (err) {
                console.error("Failed to load yatras", err);
            }

            const resolvedParams = await params;
            setId(resolvedParams.slug);
            if (resolvedParams.slug !== 'new') {
                setIsEditMode(true);
                fetchTour(resolvedParams.slug);
            } else {
                // Check local storage for draft
                try {
                    const savedDraft = localStorage.getItem('tour_draft_new');
                    if (savedDraft) {
                        const parsed = JSON.parse(savedDraft);
                        // Rehydrate Dates
                        if (parsed.departureCities) {
                            parsed.departureCities = parsed.departureCities.map((dc: any) => ({
                                ...dc,
                                availableDates: dc.availableDates ? dc.availableDates.map((d: any) => new Date(d)) : [],
                                blackoutDates: dc.blackoutDates ? dc.blackoutDates.map((d: any) => new Date(d)) : []
                            }));
                        }
                        setFormData(prev => ({
                            ...prev,
                            ...parsed,
                            seo: {
                                ...prev.seo,
                                ...(parsed.seo || {})
                            }
                        }));
                        setDraftRestored(true);
                    }
                } catch (e) {
                    console.error("Failed to parse draft from local storage", e);
                }
                setInitialLoading(false);
            }
        };
        resolveParams();
    }, [params]);

    // Auto-save draft to local storage
    useEffect(() => {
        if (!initialLoading && id === 'new') {
            try {
                localStorage.setItem('tour_draft_new', JSON.stringify(formData));
                setSaveDraftStatus('Draft saved locally');
                const timer = setTimeout(() => setSaveDraftStatus(''), 2000);
                return () => clearTimeout(timer);
            } catch (e) {
                console.error("Failed to save draft to local storage", e);
            }
        }
    }, [formData, initialLoading, id]);

    const fetchTour = async (tourId: string) => {
        try {
            const tour = await toursService.getTourById(tourId);
            setFormData({
                title: tour.title || '',
                slug: tour.slug || '',
                description: tour.description || '',
                packageType: tour.packageType || 'Land Only',
                price: tour.price?.toString() || '',
                priceOriginal: tour.priceOriginal?.toString() || '',
                duration: tour.duration?.toString() || '',
                maxGroupSize: tour.maxGroupSize?.toString() || '',
                category: tour.category || 'pilgrimage',
                destination: tour.destination || 'North India',
                locations: tour.locations || [''],
                images: tour.images || [],
                slideshowImages: tour.slideshowImages || [],
                placesHighlights: tour.placesHighlights || [],
                placesToVisit: tour.placesToVisit || '',
                joiningFrom: tour.joiningFrom || 'Joining Direct',
                packageIncludes: tour.packageIncludes || [],
                hotels: tour.hotels || [],
                itinerary: tour.itinerary || [],
                inclusions: tour.inclusions || [''],
                exclusions: tour.exclusions || [''],
                dos: tour.dos || [''],
                donts: tour.donts || [''],
                thingsToCarry: tour.thingsToCarry || [''],
                cancellationPolicy: tour.cancellationPolicy || '',
                useDefaultCancellationPolicy: tour.useDefaultCancellationPolicy !== undefined ? tour.useDefaultCancellationPolicy : true,
                termsAndConditions: tour.termsAndConditions || '',
                paymentTerms: tour.paymentTerms || '',
                hasEasyCancellation: (tour as any).hasEasyCancellation !== undefined ? (tour as any).hasEasyCancellation : true,
                hasEasyVisa: (tour as any).hasEasyVisa || false,
                hasHighSeason: (tour as any).hasHighSeason || false,
                hasTravelValidity: (tour as any).hasTravelValidity || false,
                customBlocks: (tour as any).customBlocks || [],
                isActive: tour.isActive,
                showInHero: (tour as any).showInHero || false,
                isFavorite: tour.isFavorite || false,
                favoriteSize: tour.favoriteSize || 'standard',
                isTrending: tour.isTrending || false,
                trendingRank: tour.trendingRank?.toString() || '',
                badge: tour.badge || '',
                emiStartingFrom: tour.emiStartingFrom?.toString() || '',
                departureCities: tour.departureCities?.map((dc: any) => ({
                    ...dc,
                    availabilityType: (dc.availabilityType || 'specific_dates') as 'specific_dates' | 'weekly' | 'daily' | 'monthly_dates',
                    weeklyDays: dc.weeklyDays || [],
                    monthlyDays: dc.monthlyDays || [],
                    availableDates: dc.availableDates?.map((d: any) => new Date(d)) || [],
                    blackoutDates: dc.blackoutDates?.map((d: any) => new Date(d)) || []
                })) || [],
                seo: {
                    title: tour.seo?.title || '',
                    description: tour.seo?.description || '',
                    keywords: tour.seo?.keywords || '',
                },
            });
        } catch (error) {
            console.error('Failed to fetch tour:', error);
            alert('Error loading tour data');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        
        if (name.startsWith('seo.')) {
            const seoField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                seo: {
                    ...prev.seo,
                    [seoField]: value
                }
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Helper for simple arrays (locations, dos, etc)
    const handleArrayChange = (index: number, value: string, field: 'locations' | 'inclusions' | 'exclusions' | 'dos' | 'donts' | 'thingsToCarry') => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayItem = (field: 'locations' | 'inclusions' | 'exclusions' | 'dos' | 'donts' | 'thingsToCarry') => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const removeArrayItem = (index: number, field: 'locations' | 'inclusions' | 'exclusions' | 'dos' | 'donts' | 'thingsToCarry') => {
        setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
    };

    // Helper for Hotels
    const addHotel = () => {
        setFormData({
            ...formData,
            hotels: [...formData.hotels, { name: '', image: '', description: '', rating: 4 }]
        });
    };

    const updateHotel = (index: number, field: string, value: any) => {
        const newHotels = [...formData.hotels];
        // @ts-ignore
        newHotels[index][field] = value;
        setFormData({ ...formData, hotels: newHotels });
    };

    const removeHotel = (index: number) => {
        setFormData({ ...formData, hotels: formData.hotels.filter((_, i) => i !== index) });
    };

    // Helper for Itinerary
    const addItineraryDay = () => {
        setFormData({
            ...formData,
            itinerary: [
                ...formData.itinerary,
                { day: formData.itinerary.length + 1, title: '', description: '', items: [] }
            ]
        });
    };

    const removeItineraryDay = (index: number) => {
        const newItinerary = formData.itinerary.filter((_, i) => i !== index);
        const renumbered = newItinerary.map((item, i) => ({ ...item, day: i + 1 }));
        setFormData({ ...formData, itinerary: renumbered });
    };

    const updateItineraryDay = (index: number, field: string, value: any) => {
        const newItinerary = [...formData.itinerary];
        // @ts-ignore
        newItinerary[index][field] = value;
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const addItineraryItem = (dayIndex: number) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[dayIndex].items = [
            ...(newItinerary[dayIndex].items || []),
            { type: 'activity', title: '', description: '' }
        ];
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const updateItineraryItem = (dayIndex: number, itemIndex: number, field: string, value: any) => {
        const newItinerary = [...formData.itinerary];
        // @ts-ignore
        newItinerary[dayIndex].items[itemIndex][field] = value;
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const removeItineraryItem = (dayIndex: number, itemIndex: number) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[dayIndex].items = newItinerary[dayIndex].items.filter((_, i) => i !== itemIndex);
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const togglePackageInclude = (value: string) => {
        const current = formData.packageIncludes;
        if (current.includes(value)) {
            setFormData({ ...formData, packageIncludes: current.filter(i => i !== value) });
        } else {
            setFormData({ ...formData, packageIncludes: [...current, value] });
        }
    };

    // Helper for Custom Blocks
    const addCustomBlock = () => {
        setFormData({
            ...formData,
            customBlocks: [...(formData.customBlocks || []), { title: '', content: '', isLink: false }]
        });
    };

    const updateCustomBlock = (index: number, field: string, value: any) => {
        const newBlocks = [...(formData.customBlocks || [])];
        // @ts-ignore
        newBlocks[index][field] = value;
        setFormData({ ...formData, customBlocks: newBlocks });
    };

    const removeCustomBlock = (index: number) => {
        setFormData({
            ...formData,
            customBlocks: (formData.customBlocks || []).filter((_, i) => i !== index)
        });
    };

    // Helper for Departure Cities
    const addDepartureCity = () => {
        setFormData({
            ...formData,
            departureCities: [
                ...formData.departureCities,
                { city: '', surcharge: 0, isDefault: formData.departureCities.length === 0, availabilityType: 'specific_dates', availableDates: [], weeklyDays: [], monthlyDays: [], blackoutDates: [] }
            ]
        });
    };

    const updateDepartureCity = (index: number, field: string, value: any) => {
        const newCities = [...formData.departureCities];
        if (field === 'isDefault' && value === true) {
            newCities.forEach(c => c.isDefault = false); // Only one default allowed
        }
        // @ts-ignore
        newCities[index][field] = value;
        setFormData({ ...formData, departureCities: newCities });
    };

    const removeDepartureCity = (index: number) => {
        setFormData({ ...formData, departureCities: formData.departureCities.filter((_, i) => i !== index) });
    };

    const handleWeeklyDayToggle = (cityIndex: number, dayIndex: number) => {
        const newCities = [...formData.departureCities];
        const days = newCities[cityIndex].weeklyDays;
        if (days.includes(dayIndex)) {
            newCities[cityIndex].weeklyDays = days.filter(d => d !== dayIndex);
        } else {
            newCities[cityIndex].weeklyDays = [...days, dayIndex];
        }
        setFormData({ ...formData, departureCities: newCities });
    };

    const handleMonthlyDayToggle = (cityIndex: number, dayNum: number) => {
        const newCities = [...formData.departureCities];
        const days = newCities[cityIndex].monthlyDays || [];
        if (days.includes(dayNum)) {
            newCities[cityIndex].monthlyDays = days.filter(d => d !== dayNum);
        } else {
            newCities[cityIndex].monthlyDays = [...days, dayNum].sort((a, b) => a - b);
        }
        setFormData({ ...formData, departureCities: newCities });
    };

    const addSpecificDate = (cityIndex: number, dateStr: string) => {
        if (!dateStr) return;
        const newCities = [...formData.departureCities];
        newCities[cityIndex].availableDates.push(new Date(dateStr));
        setFormData({ ...formData, departureCities: newCities });
    };

    const removeSpecificDate = (cityIndex: number, dateIndex: number) => {
        const newCities = [...formData.departureCities];
        newCities[cityIndex].availableDates = newCities[cityIndex].availableDates.filter((_, i) => i !== dateIndex);
        setFormData({ ...formData, departureCities: newCities });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                price: Number(formData.price) || 0,
                priceOriginal: Number(formData.priceOriginal) || 0,
                duration: Number(formData.duration) || 0,
                maxGroupSize: formData.maxGroupSize ? Number(formData.maxGroupSize) : 1,
                trendingRank: Number(formData.trendingRank) || 0,
                emiStartingFrom: Number(formData.emiStartingFrom) || 0,
                packageType: formData.packageType,
                locations: formData.locations.filter(l => l.trim()),
                inclusions: formData.inclusions.filter(i => i.trim()),
                exclusions: formData.exclusions.filter(e => e.trim()),
                dos: formData.dos.filter(d => d.trim()),
                donts: formData.donts.filter(d => d.trim()),
                thingsToCarry: formData.thingsToCarry.filter(t => t.trim()),
                departureCities: formData.departureCities
                    .filter(dc => dc.city.trim())
                    .map(({ _id, ...rest }: any) => rest),
                hotels: formData.hotels.map(({ _id, ...rest }: any) => rest),
                itinerary: formData.itinerary.map(({ _id, ...rest }: any) => ({
                    ...rest,
                    items: rest.items?.map(({ _id, ...item }: any) => item) || []
                })),
            };

            if (isEditMode) {
                await toursService.updateTour(id, payload);
            } else {
                await toursService.createTour(payload);
                localStorage.removeItem('tour_draft_new');
            }
            router.push('/admin/tours');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save tour. Please check the data.');
        } finally {
            setLoading(false);
        }
    };

    const handleDuplicateThisPackage = async () => {
        if (!confirm('Are you sure you want to duplicate this package?')) return;
        setLoading(true);

        try {
            const payload = {
                ...formData,
                title: `${formData.title} (Copy)`,
                slug: `${formData.slug}-copy`,
                price: Number(formData.price) || 0,
                priceOriginal: Number(formData.priceOriginal) || 0,
                duration: Number(formData.duration) || 0,
                maxGroupSize: formData.maxGroupSize ? Number(formData.maxGroupSize) : 1,
                trendingRank: Number(formData.trendingRank) || 0,
                emiStartingFrom: Number(formData.emiStartingFrom) || 0,
                packageType: formData.packageType,
                locations: formData.locations.filter(l => l.trim()),
                inclusions: formData.inclusions.filter(i => i.trim()),
                exclusions: formData.exclusions.filter(e => e.trim()),
                dos: formData.dos.filter(d => d.trim()),
                donts: formData.donts.filter(d => d.trim()),
                thingsToCarry: formData.thingsToCarry.filter(t => t.trim()),
                departureCities: formData.departureCities
                    .filter(dc => dc.city.trim())
                    .map(({ _id, ...rest }: any) => rest),
                hotels: formData.hotels.map(({ _id, ...rest }: any) => rest),
                itinerary: formData.itinerary.map(({ _id, ...rest }: any) => ({
                    ...rest,
                    items: rest.items?.map(({ _id, ...item }: any) => item) || []
                })),
            };

            await toursService.createTour(payload);
            router.push('/admin/tours');
        } catch (error) {
            console.error('Duplicate failed:', error);
            alert('Failed to duplicate tour. Please check the data.');
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="p-8">Loading...</div>;

    const commonIncludes = ['Hotel', 'Sightseeing', 'Transfer', 'Meals', 'Flight', 'Visa'];

    return (
        <div className="w-full max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">
                        {isEditMode ? 'Edit Package' : 'Create New Package'}
                    </h1>
                    {!isEditMode && draftRestored && (
                        <button 
                            type="button" 
                            onClick={() => {
                                if (confirm('Are you sure you want to clear the locally saved draft and start fresh?')) {
                                    localStorage.removeItem('tour_draft_new');
                                    window.location.reload();
                                }
                            }}
                            className="text-xs text-red-500 hover:text-red-700 underline bg-red-50 px-2 py-1 rounded"
                        >
                            Clear Draft
                        </button>
                    )}
                </div>
                {!isEditMode && saveDraftStatus && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        {saveDraftStatus}
                    </span>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* 1. Basic Information */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="label">Package Title</label>
                            <input type="text" name="title" required value={formData.title} onChange={handleChange} className="input-field" />
                        </div>
                        <div>
                            <label className="label">Slug (URL)</label>
                            <input type="text" name="slug" required value={formData.slug} onChange={handleChange} className="input-field" placeholder="e.g. char-dham-yatra" />
                        </div>
                        <div>
                            <label className="label">Badge Label</label>
                            <input type="text" name="badge" value={formData.badge} onChange={handleChange} className="input-field" placeholder="e.g. Popular, Best Seller" />
                        </div>
                        <div>
                            <label className="label">Category (Select Yatra)</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                                <option value="">None (Standalone Tour)</option>
                                {availableYatras.map((yatra) => (
                                    <option key={yatra._id} value={yatra._id}>{yatra.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label">Destination</label>
                            <select name="destination" value={formData.destination} onChange={handleChange} className="input-field">
                                <option value="North India">North India</option>
                                <option value="South India">South India</option>
                                <option value="East India">East India</option>
                                <option value="West India">West India</option>
                                <option value="Central India">Central India</option>
                                <option value="International">International</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Package Type</label>
                            <select name="packageType" value={formData.packageType} onChange={handleChange} className="input-field">
                                <option value="Land Only">Land Only</option>
                                <option value="Land & Air">Land & Air</option>
                                <option value="Air Only">Air Only</option>
                                <option value="Water Only">Water Only</option>
                                <option value="Land & Water">Land & Water</option>
                                <option value="Air & Water">Air & Water</option>
                                <option value="Land & Air & Water">Land & Air & Water</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Original Price (will be strikethrough) (₹)</label>
                            <input type="number" name="priceOriginal" value={formData.priceOriginal} onChange={handleChange} className="input-field" placeholder="e.g. 29999" />
                        </div>
                        <div>
                            <label className="label">Selling Price (Actual Price) (₹)</label>
                            <input type="number" name="price" required value={formData.price} onChange={handleChange} className="input-field" placeholder="e.g. 19999" />
                        </div>
                        <div>
                            <label className="label">EMI Starting From (₹/mo)</label>
                            <input type="number" name="emiStartingFrom" value={formData.emiStartingFrom} onChange={handleChange} className="input-field" placeholder="e.g. 1495" />
                        </div>
                        <div>
                            <label className="label">Duration (Days)</label>
                            <input type="number" name="duration" required value={formData.duration} onChange={handleChange} className="input-field" />
                        </div>
                        <div>
                            <label className="label">Group Size</label>
                            <input type="number" name="maxGroupSize" value={formData.maxGroupSize} onChange={handleChange} className="input-field" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label">Description</label>
                            <textarea name="description" required rows={3} value={formData.description} onChange={handleChange} className="input-field" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="label">Places to Visit (Short Text)</label>
                            <input type="text" name="placesToVisit" value={formData.placesToVisit} onChange={handleChange} className="input-field" placeholder="e.g. 2N Varanasi / 1N Ayodhya" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="label">Joining From (Ex-City)</label>
                            <input type="text" name="joiningFrom" value={formData.joiningFrom} onChange={handleChange} className="input-field" placeholder="e.g. Delhi, Mumbai, Joining Direct" />
                        </div>
                    </div>
                </div>

                {/* 1.5 SEO Information */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">SEO Metadata</h2>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="label">Meta Title</label>
                            <input 
                                type="text" 
                                name="seo.title" 
                                value={formData.seo.title} 
                                onChange={handleChange} 
                                className="input-field" 
                                placeholder="E.g. Best Char Dham Yatra Tour Package | Vedic Travel" 
                            />
                            <p className="text-xs text-gray-500 mt-1">Recommended length: 50-60 characters</p>
                        </div>
                        <div>
                            <label className="label">Meta Description</label>
                            <textarea 
                                name="seo.description" 
                                rows={2} 
                                value={formData.seo.description} 
                                onChange={handleChange} 
                                className="input-field" 
                                placeholder="E.g. Book our exclusive 11N/12D Char Dham Yatra. Get the best pricing with hotels, darshan, and dedicated transport included." 
                            />
                            <p className="text-xs text-gray-500 mt-1">Recommended length: 150-160 characters</p>
                        </div>
                        <div>
                            <label className="label">Meta Keywords</label>
                            <input 
                                type="text" 
                                name="seo.keywords" 
                                value={formData.seo.keywords} 
                                onChange={handleChange} 
                                className="input-field" 
                                placeholder="E.g. char dham package, kedarnath tour, badrinath booking, spiritual yatra" 
                            />
                            <p className="text-xs text-gray-500 mt-1">Comma-separated terms</p>
                        </div>
                    </div>
                </div>

                {/* 2. Media Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Media & Highlights</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="label mb-2 block">Slideshow Images (Top Banner)</label>
                            <ImageUpload
                                value={formData.slideshowImages}
                                onChange={(urls) => setFormData({ ...formData, slideshowImages: urls })}
                                maxFiles={10}
                            />
                        </div>

                        <div>
                            <label className="label mb-2 block">Places Highlights (Small Strip)</label>
                            <ImageUpload
                                value={formData.placesHighlights}
                                onChange={(urls) => setFormData({ ...formData, placesHighlights: urls })}
                                maxFiles={8}
                            />
                        </div>

                        <div>
                            <label className="label mb-2 block">Card Thumbnail (Listing Page)</label>
                            <ImageUpload
                                value={formData.images}
                                onChange={(urls) => setFormData({ ...formData, images: urls })}
                                maxFiles={1}
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Package Inclusions & Locations */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Inclusions & Locations</h2>

                    <div className="mb-6">
                        <label className="label mb-2 block">Package Includes Categories</label>
                        <div className="flex flex-wrap gap-3">
                            {commonIncludes.map(item => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => togglePackageInclude(item)}
                                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${formData.packageIncludes.includes(item)
                                        ? 'bg-deepBlue text-white border-deepBlue'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {formData.packageIncludes.includes(item) ? '✓ ' : '+ '}{item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="label mb-2 block">Locations Covered</label>
                        <div className="flex flex-wrap gap-2">
                            {formData.locations.map((loc, index) => (
                                <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                    <input
                                        type="text"
                                        value={loc}
                                        onChange={(e) => handleArrayChange(index, e.target.value, 'locations')}
                                        className="bg-transparent border-none focus:ring-0 p-0 text-sm w-32"
                                        placeholder="City Name"
                                    />
                                    <button type="button" onClick={() => removeArrayItem(index, 'locations')} className="text-red-500 hover:text-red-700">×</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addArrayItem('locations')} className="text-sm text-saffron underline">+ Add Location</button>
                        </div>
                    </div>
                </div>

                {/* 4. Hotels Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Hotel Details</h2>
                    <div className="space-y-4">
                        {formData.hotels.map((hotel, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
                                <button type="button" onClick={() => removeHotel(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash className="w-4 h-4" /></button>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="md:col-span-1">
                                        <label className="text-xs text-gray-500 block mb-1">Hotel Image</label>
                                        <ImageUpload
                                            value={hotel.image ? [hotel.image] : []}
                                            onChange={(urls) => updateHotel(index, 'image', urls[0])}
                                            maxFiles={1}
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Hotel Name"
                                                value={hotel.name}
                                                onChange={(e) => updateHotel(index, 'name', e.target.value)}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <textarea
                                                placeholder="Hotel Description (e.g. Location, Amenities)"
                                                value={hotel.description}
                                                onChange={(e) => updateHotel(index, 'description', e.target.value)}
                                                className="input-field"
                                                rows={2}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-600">Rating:</label>
                                            <input
                                                type="number"
                                                min="1" max="5"
                                                value={hotel.rating}
                                                onChange={(e) => updateHotel(index, 'rating', Number(e.target.value))}
                                                className="input-field w-20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addHotel} className="btn-secondary w-full border-dashed border-2 py-3 flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" /> Add Hotel
                        </button>
                    </div>
                </div>

                {/* 4.5 Departure Cities & Dates */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Departure Cities & Travel Dates</h2>
                    <div className="space-y-6">
                        {formData.departureCities.map((city, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
                                <button type="button" onClick={() => removeDepartureCity(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash className="w-4 h-4" /></button>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                    <div className="md:col-span-2">
                                        <label className="text-xs text-gray-500 block mb-1">City Name (e.g. Joining Direct, Delhi, Mumbai)</label>
                                        <input
                                            type="text"
                                            value={city.city}
                                            onChange={(e) => updateDepartureCity(index, 'city', e.target.value)}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">Price Surcharge (₹)</label>
                                        <input
                                            type="number"
                                            value={city.surcharge}
                                            onChange={(e) => updateDepartureCity(index, 'surcharge', Number(e.target.value))}
                                            className="input-field text-red-600 font-semibold"
                                        />
                                    </div>
                                    <div className="flex items-end pb-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={city.isDefault}
                                                onChange={(e) => updateDepartureCity(index, 'isDefault', e.target.checked)}
                                                className="w-4 h-4 text-saffron"
                                            />
                                            <span className="text-sm font-medium">Default City</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="bg-white p-3 rounded border border-gray-100">
                                    <label className="text-xs text-gray-500 block mb-2 font-bold uppercase tracking-wider">Availability Schedule</label>
                                    <div className="mb-4">
                                        <select
                                            value={city.availabilityType}
                                            onChange={(e) => updateDepartureCity(index, 'availabilityType', e.target.value)}
                                            className="input-field max-w-xs"
                                        >
                                            <option value="specific_dates">Specific Dates</option>
                                            <option value="monthly_dates">Same Date(s) Monthly</option>
                                            <option value="weekly">Selected Days Weekly</option>
                                            <option value="daily">Available Daily</option>
                                        </select>
                                    </div>

                                    {city.availabilityType === 'weekly' && (
                                        <div className="flex flex-wrap gap-2">
                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dayIdx) => (
                                                <button
                                                    key={dayIdx}
                                                    type="button"
                                                    onClick={() => handleWeeklyDayToggle(index, dayIdx)}
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${city.weeklyDays.includes(dayIdx) ? 'bg-deepBlue text-white border-deepBlue' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {city.availabilityType === 'specific_dates' && (
                                        <div>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {city.availableDates.map((d, dIdx) => (
                                                    <div key={dIdx} className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded flex items-center gap-1 border border-green-200">
                                                        {d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        <button type="button" onClick={() => removeSpecificDate(index, dIdx)} className="text-red-500 hover:text-red-700 ml-1">×</button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-2 max-w-xs">
                                                <input type="date" id={`date_picker_${index}`} className="input-field text-sm" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const el = document.getElementById(`date_picker_${index}`) as HTMLInputElement;
                                                        addSpecificDate(index, el.value);
                                                        el.value = '';
                                                    }}
                                                    className="btn-secondary px-3 py-1 text-sm whitespace-nowrap"
                                                >
                                                    Add Date
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {city.availabilityType === 'monthly_dates' && (
                                        <div>
                                            <p className="text-xs text-gray-500 mb-2">Select day(s) of the month — these dates will repeat every month automatically.</p>
                                            <div className="grid grid-cols-8 sm:grid-cols-11 gap-1">
                                                {Array.from({ length: 31 }, (_, i) => i + 1).map(dayNum => (
                                                    <button
                                                        key={dayNum}
                                                        type="button"
                                                        onClick={() => handleMonthlyDayToggle(index, dayNum)}
                                                        className={`w-9 h-9 rounded-lg text-xs font-bold border transition-all ${(city.monthlyDays || []).includes(dayNum)
                                                                ? 'bg-deepBlue text-white border-deepBlue shadow-sm'
                                                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-deepBlue hover:text-deepBlue'
                                                            }`}
                                                    >
                                                        {dayNum}
                                                    </button>
                                                ))}
                                            </div>
                                            {(city.monthlyDays || []).length > 0 && (
                                                <p className="text-xs text-green-700 font-medium mt-2">
                                                    ✓ Tours depart on the {(city.monthlyDays || []).map(d => `${d}${d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'}`).join(', ')} of every month
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addDepartureCity} className="btn-secondary w-full border-dashed border-2 py-3 flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" /> Add Departure City & Dates
                        </button>
                    </div>
                </div>

                {/* 5. Dynamic Itinerary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Detailed Itinerary</h2>
                    <div className="space-y-6">
                        {formData.itinerary.map((day, dayIndex) => (
                            <div key={dayIndex} className="border-2 border-gray-200 rounded-xl p-4 bg-white relative">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-deepBlue">Day {day.day}</h3>
                                    <button type="button" onClick={() => removeItineraryDay(dayIndex)} className="text-red-500 hover:text-red-700 text-sm">Remove Day</button>
                                </div>

                                <div className="grid grid-cols-1 gap-3 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Day Title (e.g. Arrival in Singapore)"
                                        value={day.title}
                                        onChange={(e) => updateItineraryDay(dayIndex, 'title', e.target.value)}
                                        className="input-field font-bold"
                                    />
                                    <textarea
                                        placeholder="Short Day Summary..."
                                        value={day.description}
                                        onChange={(e) => updateItineraryDay(dayIndex, 'description', e.target.value)}
                                        className="input-field text-sm"
                                        rows={2}
                                    />
                                </div>

                                {/* Dynamic Items within Day */}
                                <div className="space-y-3 pl-4 border-l-2 border-gray-100 ml-2">
                                    {day.items?.map((item, itemIndex) => (
                                        <div key={itemIndex} className="bg-gray-50 p-3 rounded border border-gray-200 relative text-sm">
                                            <button type="button" onClick={() => removeItineraryItem(dayIndex, itemIndex)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">×</button>

                                            <div className="grid grid-cols-12 gap-3">
                                                <div className="col-span-3">
                                                    <select
                                                        value={item.type}
                                                        onChange={(e) => updateItineraryItem(dayIndex, itemIndex, 'type', e.target.value)}
                                                        className="input-field text-xs uppercase font-bold"
                                                    >
                                                        <option value="flight">Flight</option>
                                                        <option value="transfer">Transfer</option>
                                                        <option value="hotel">Hotel Check-in</option>
                                                        <option value="activity">Activity</option>
                                                        <option value="meal">Meal</option>
                                                        <option value="checkout">Checkout</option>
                                                    </select>
                                                </div>
                                                <div className="col-span-9 space-y-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Title (e.g. Traditional Lunch)"
                                                        value={item.title}
                                                        onChange={(e) => updateItineraryItem(dayIndex, itemIndex, 'title', e.target.value)}
                                                        className="input-field"
                                                    />
                                                    <textarea
                                                        placeholder="Description..."
                                                        value={item.description}
                                                        onChange={(e) => updateItineraryItem(dayIndex, itemIndex, 'description', e.target.value)}
                                                        className="input-field text-xs"
                                                        rows={1}
                                                    />
                                                    {/* Optional Image for Item */}
                                                    <div className="mt-2">
                                                        <label className="text-[10px] text-gray-500 block mb-1">Item Image</label>
                                                        <ImageUpload
                                                            value={item.image ? [item.image] : []}
                                                            onChange={(urls) => updateItineraryItem(dayIndex, itemIndex, 'image', urls[0] || '')}
                                                            maxFiles={1}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addItineraryItem(dayIndex)}
                                        className="text-xs text-saffron font-bold hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Add Itinerary Item
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addItineraryDay} className="btn-secondary w-full py-3 flex justify-center items-center gap-2">
                            <Plus className="w-5 h-5" /> Add Day
                        </button>
                    </div>
                </div>

                {/* 6. Policies & Lists */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Policies & Guidelines</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="label mb-2 block text-green-700 font-bold">Inclusions</label>
                            {formData.inclusions.map((item, i) => (
                                <div key={i} className="flex gap-2 mb-2">
                                    <input type="text" value={item} onChange={(e) => handleArrayChange(i, e.target.value, 'inclusions')} className="input-field" placeholder="Add inclusion..." />
                                    <button type="button" onClick={() => removeArrayItem(i, 'inclusions')} className="text-red-500">×</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addArrayItem('inclusions')} className="text-sm text-green-600 font-bold">+ Add Inclusion</button>
                        </div>

                        <div>
                            <label className="label mb-2 block text-red-700 font-bold">Exclusions</label>
                            {formData.exclusions.map((item, i) => (
                                <div key={i} className="flex gap-2 mb-2">
                                    <input type="text" value={item} onChange={(e) => handleArrayChange(i, e.target.value, 'exclusions')} className="input-field" placeholder="Add exclusion..." />
                                    <button type="button" onClick={() => removeArrayItem(i, 'exclusions')} className="text-red-500">×</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addArrayItem('exclusions')} className="text-sm text-red-600 font-bold">+ Add Exclusion</button>
                        </div>

                        <div>
                            <label className="label mb-2 block text-green-700 font-bold">Do's</label>
                            {formData.dos.map((item, i) => (
                                <div key={i} className="flex gap-2 mb-2">
                                    <input type="text" value={item} onChange={(e) => handleArrayChange(i, e.target.value, 'dos')} className="input-field border-green-100 focus:border-green-500" placeholder="Keep passport safe..." />
                                    <button type="button" onClick={() => removeArrayItem(i, 'dos')} className="text-red-500">×</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addArrayItem('dos')} className="text-sm text-green-600 font-bold">+ Add Do's</button>
                        </div>

                        <div>
                            <label className="label mb-2 block text-red-700 font-bold">Don'ts</label>
                            {formData.donts.map((item, i) => (
                                <div key={i} className="flex gap-2 mb-2">
                                    <input type="text" value={item} onChange={(e) => handleArrayChange(i, e.target.value, 'donts')} className="input-field border-red-100 focus:border-red-500" placeholder="Don't litter..." />
                                    <button type="button" onClick={() => removeArrayItem(i, 'donts')} className="text-red-500">×</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addArrayItem('donts')} className="text-sm text-red-600 font-bold">+ Add Don'ts</button>
                        </div>

                        <div className="md:col-span-2">
                            <label className="label mb-2 block text-gray-700">Things To Carry</label>
                            {formData.thingsToCarry.map((item, i) => (
                                <div key={i} className="flex gap-2 mb-2">
                                    <input type="text" value={item} onChange={(e) => handleArrayChange(i, e.target.value, 'thingsToCarry')} className="input-field" placeholder="Sunscreen..." />
                                    <button type="button" onClick={() => removeArrayItem(i, 'thingsToCarry')} className="text-red-500">×</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addArrayItem('thingsToCarry')} className="text-sm text-gray-600">+ Add Item</button>
                        </div>
                        
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="label mb-0 block text-gray-700">Cancellation Policy</label>
                                <label className="flex items-center gap-2 cursor-pointer bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                    <input 
                                        type="checkbox" 
                                        name="useDefaultCancellationPolicy" 
                                        checked={formData.useDefaultCancellationPolicy} 
                                        onChange={handleChange} 
                                        className="w-4 h-4 text-deepBlue rounded" 
                                    />
                                    <span className="text-xs font-bold text-deepBlue">Use Default Policy</span>
                                </label>
                            </div>
                            
                            {!formData.useDefaultCancellationPolicy && (
                                <textarea
                                    name="cancellationPolicy"
                                    value={formData.cancellationPolicy}
                                    onChange={handleChange}
                                    className="input-field min-h-[100px] border-deepBlue/20 focus:border-deepBlue"
                                    placeholder="Enter specific cancellation policy details for this trip (e.g. for Helicopter/International tours)..."
                                />
                            )}
                            
                            {formData.useDefaultCancellationPolicy && (
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-500 italic">
                                    Global default cancellation policy will be shown for this package.
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="label mb-2 block text-gray-700">Payment Terms</label>
                            <textarea
                                name="paymentTerms"
                                value={formData.paymentTerms}
                                onChange={handleChange}
                                className="input-field min-h-[100px]"
                                placeholder="Enter specific payment terms..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="label mb-2 block text-gray-700">Terms & Conditions</label>
                            <textarea
                                name="termsAndConditions"
                                value={formData.termsAndConditions}
                                onChange={handleChange}
                                className="input-field min-h-[100px]"
                                placeholder="Enter terms and conditions..."
                            />
                        </div>
                    </div>
                </div>

                {/* 6.5. Feature Blocks */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Feature Blocks & Badges</h2>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-wrap gap-8">
                            <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="checkbox" name="hasEasyCancellation" checked={formData.hasEasyCancellation} onChange={handleChange} className="w-5 h-5 text-saffron rounded" />
                                <span className="font-bold text-gray-700">Has "Easy Cancellation" Badge</span>
                            </label>
                            
                            <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="checkbox" name="hasEasyVisa" checked={formData.hasEasyVisa} onChange={handleChange} className="w-5 h-5 text-saffron rounded" />
                                <span className="font-bold text-gray-700">Has "Easy Visa" Badge</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="checkbox" name="hasHighSeason" checked={formData.hasHighSeason} onChange={handleChange} className="w-5 h-5 text-saffron rounded" />
                                <span className="font-bold text-gray-700">Has "High Season" Badge</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <input type="checkbox" name="hasTravelValidity" checked={formData.hasTravelValidity} onChange={handleChange} className="w-5 h-5 text-saffron rounded" />
                                <span className="font-bold text-gray-700">Has "Travel Validity" Badge</span>
                            </label>
                        </div>
                        
                        <div className="border-t pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-800">Custom Dynamic Blocks</h3>
                                <button type="button" onClick={addCustomBlock} className="text-xs text-saffron font-bold hover:underline flex items-center gap-1">
                                    <Plus className="w-4 h-4" /> Add Custom Block
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {(formData.customBlocks || []).map((block: any, i: number) => (
                                    <div key={i} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                                        <button type="button" onClick={() => removeCustomBlock(i)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 w-6 h-6 flex items-center justify-center border border-red-200">
                                            ×
                                        </button>
                                        
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center justify-between gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Block Title (e.g., Registration Link)"
                                                    value={block.title}
                                                    onChange={(e) => updateCustomBlock(i, 'title', e.target.value)}
                                                    className="input-field flex-1 font-bold"
                                                />
                                                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={block.isLink} 
                                                        onChange={(e) => updateCustomBlock(i, 'isLink', e.target.checked)} 
                                                        className="w-4 h-4 text-blue-600 rounded" 
                                                    />
                                                    <span className="text-sm font-medium">Is this a link?</span>
                                                </label>
                                            </div>
                                            
                                            <input
                                                type={block.isLink ? 'url' : 'text'}
                                                placeholder={block.isLink ? 'URL (e.g., https://forms.gle/...)' : 'Block Content'}
                                                value={block.content}
                                                onChange={(e) => updateCustomBlock(i, 'content', e.target.value)}
                                                className="input-field w-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                                {(!formData.customBlocks || formData.customBlocks.length === 0) && (
                                    <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                                        No custom blocks added. Add one to show special links or notices on the package page.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 7. Settings */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Settings</h2>
                    <div className="flex flex-wrap gap-8">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 text-saffron rounded" />
                            <span className="font-medium">Active (Visible)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleChange} className="w-5 h-5 text-saffron rounded" />
                            <span className="font-medium">Trending</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer border-l pl-8 ml-4">
                            <input type="checkbox" name="showInHero" checked={formData.showInHero} onChange={handleChange} className="w-5 h-5 text-deepBlue rounded" />
                            <div className="flex flex-col">
                                <span className="font-bold text-deepBlue">Show in Hero Slider</span>
                                <span className="text-[10px] text-gray-400">Display this package in the homepage hero cards section</span>
                            </div>
                        </label>
                        {formData.isTrending && (
                            <input type="number" name="trendingRank" value={formData.trendingRank} onChange={handleChange} className="input-field w-24" placeholder="Rank" />
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    {isEditMode && (
                        <button type="button" onClick={handleDuplicateThisPackage} disabled={loading} className="px-6 py-3 mr-4 text-green-700 bg-green-50 font-bold hover:bg-green-100 rounded-lg">
                            Duplicate Package
                        </button>
                    )}
                    <button type="button" onClick={() => router.back()} className="px-6 py-3 mr-4 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button type="submit" disabled={loading} className="btn-primary px-8 py-3 text-lg">
                        {loading ? 'Saving Package...' : 'Save Complete Package'}
                    </button>
                </div>
            </form>
            <RichTextToolbar />
        </div>
    );
}
