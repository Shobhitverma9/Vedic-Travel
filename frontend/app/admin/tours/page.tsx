'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toursService } from '@/services/tours.service';

export default function AdminToursList() {
    const [tours, setTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        fetchTours();
    }, []);

    const sortTours = (toursList: any[]) => {
        return [...toursList].sort((a, b) => {
            const aActive = a.isActive !== false;
            const bActive = b.isActive !== false;
            
            // First Priority: Visibility
            if (aActive && !bActive) return -1;
            if (!aActive && bActive) return 1;
            
            // Second Priority: Trending Rank (for items with same visibility)
            // Smaller rank numbers (1, 2, 3...) come first
            // Undefined or null ranks come last in their section
            const aRank = (typeof a.trendingRank === 'number') ? a.trendingRank : 999999;
            const bRank = (typeof b.trendingRank === 'number') ? b.trendingRank : 999999;
            
            if (aRank !== bRank) return aRank - bRank;
            
            // Third Priority: Alphabetical by title
            return (a.title || '').localeCompare(b.title || '');
        });
    };

    const fetchTours = async () => {
        try {
            setLoading(true);
            const response = await toursService.getAllTours({ limit: 100, isActive: 'all' }); // Fetch all including hidden
            setTours(sortTours(response.tours || []));
        } catch (error) {
            console.error('Error fetching tours:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        // Required for Firefox
        if (e.dataTransfer.setData) {
            e.dataTransfer.setData("text/html", "");
        }
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) {
            setDraggedIndex(null);
            return;
        }

        const newTours = [...tours];
        const draggedItem = newTours[draggedIndex];
        newTours.splice(draggedIndex, 1);
        newTours.splice(index, 0, draggedItem);

        // Assign new ranks starting from 1
        const updatedTours = newTours.map((t, i) => ({
            ...t,
            trendingRank: i + 1
        }));

        setTours(updatedTours);
        setDraggedIndex(null);

        try {
            const updates = updatedTours.map(t => ({ id: t._id, trendingRank: t.trendingRank }));
            await toursService.reorderTours(updates);
        } catch (error) {
            console.error('Failed to reorder tours:', error);
            alert('Failed to save new order');
            fetchTours(); // Revert on failure
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this tour?')) return;

        try {
            await toursService.deleteTour(id);
            setTours(tours.filter((tour: any) => tour._id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete tour');
        }
    };

    const handleToggleVisibility = async (tour: any) => {
        try {
            const newStatus = !tour.isActive;
            await toursService.updateTour(tour._id, { isActive: newStatus });
            setTours(prevTours => sortTours(prevTours.map((t: any) => 
                t._id === tour._id ? { ...t, isActive: newStatus } : t
            )));
        } catch (error) {
            console.error('Toggle visibility failed:', error);
            alert('Failed to update visibility');
        }
    };
    
    const handleDuplicate = async (tour: any) => {
        if (!confirm(`Are you sure you want to duplicate "${tour.title}"?`)) return;

        try {
            setLoading(true);
            const fullTour = await toursService.getTourById(tour._id);
            
            const payload = {
                title: `${fullTour.title} (Copy)`,
                description: fullTour.description || '',
                price: Number(fullTour.price) || 0,
                priceOriginal: Number(fullTour.priceOriginal) || 0,
                duration: Number(fullTour.duration) || 0,
                maxGroupSize: fullTour.maxGroupSize ? Number(fullTour.maxGroupSize) : 1,
                trendingRank: Number(fullTour.trendingRank) || 0,
                emiStartingFrom: Number(fullTour.emiStartingFrom) || 0,
                packageType: fullTour.packageType || 'Land Only',
                category: fullTour.category || '',
                destination: fullTour.destination || '',
                images: fullTour.images || [],
                slideshowImages: fullTour.slideshowImages || [],
                locations: fullTour.locations || [],
                placesHighlights: fullTour.placesHighlights || [],
                placesToVisit: fullTour.placesToVisit || '',
                packageIncludes: fullTour.packageIncludes || [],
                inclusions: fullTour.inclusions || [],
                exclusions: fullTour.exclusions || [],
                dos: fullTour.dos || [],
                donts: fullTour.donts || [],
                thingsToCarry: fullTour.thingsToCarry || [],
                useDefaultCancellationPolicy: (fullTour as any).useDefaultCancellationPolicy ?? true,
                cancellationPolicy: (fullTour as any).cancellationPolicy || '',
                termsAndConditions: (fullTour as any).termsAndConditions || '',
                paymentTerms: (fullTour as any).paymentTerms || '',
                isActive: (fullTour as any).isActive ?? true,
                isTrending: (fullTour as any).isTrending || false,
                isFavorite: (fullTour as any).isFavorite || false,
                favoriteSize: (fullTour as any).favoriteSize || 'standard',
                badge: (fullTour as any).badge || '',
                departureCities: ((fullTour as any).departureCities || []).map(({ _id, id, ...rest }: any) => rest),
                hotels: ((fullTour as any).hotels || []).map(({ _id, id, ...rest }: any) => rest),
                itinerary: ((fullTour as any).itinerary || []).map(({ _id, id, ...rest }: any) => ({
                    ...rest,
                    items: (rest.items || []).map(({ _id, id, ...item }: any) => item)
                })),
                customBlocks: ((fullTour as any).customBlocks || []).map(({ _id, id, ...rest }: any) => rest),
                hasEasyCancellation: (fullTour as any).hasEasyCancellation ?? true,
                hasEasyVisa: (fullTour as any).hasEasyVisa || false,
            };

            await toursService.createTour(payload);
            await fetchTours(); // This will also set loading to false
        } catch (error) {
            console.error('Duplicate failed:', error);
            alert('Failed to duplicate tour');
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Manage Packages</h1>
                <Link
                    href="/admin/tours/new"
                    className="bg-saffron text-white px-4 py-2 rounded-lg hover:bg-saffron-dark transition-colors font-medium shadow-sm flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Package
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 w-10"></th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visibility</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tours.map((tour: any, index: number) => (
                            <tr 
                                key={tour._id} 
                                className={`hover:bg-gray-50 transition-colors ${draggedIndex === index ? 'bg-indigo-50/50 opacity-50' : ''}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDrop={(e) => handleDrop(e, index)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap cursor-move text-gray-400 hover:text-gray-600 transition-colors" title="Drag to reorder">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                    </svg>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="h-10 w-16 rounded overflow-hidden bg-gray-100 relative">
                                        {tour.images && tour.images[0] ? (
                                            <img
                                                src={tour.images[0]}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                        {tour.title}
                                        {tour.isTrending && (
                                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                Trends #{tour.trendingRank}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500">{tour.category}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ₹{tour.price.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {tour.duration} Days
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleToggleVisibility(tour)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${(tour.isActive !== false) ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(tour.isActive !== false) ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                    <span className="ml-2 text-xs font-medium text-gray-600">
                                        {(tour.isActive !== false) ? 'Visible' : 'Hidden'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/admin/tours/${tour._id}`} className="text-deepBlue hover:text-saffron mr-4">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDuplicate(tour)}
                                        className="text-green-600 hover:text-green-900 mr-4"
                                    >
                                        Duplicate
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tour._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                {tours.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No tours found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
