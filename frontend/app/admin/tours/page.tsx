'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toursService } from '@/services/tours.service';

export default function AdminToursList() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            setLoading(true);
            const response = await toursService.getAllTours({ limit: 100 }); // Fetch all
            setTours(response.tours || []);
        } catch (error) {
            console.error('Error fetching tours:', error);
        } finally {
            setLoading(false);
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
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tours.map((tour: any) => (
                            <tr key={tour._id} className="hover:bg-gray-50">
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
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/admin/tours/${tour._id}`} className="text-deepBlue hover:text-saffron mr-4">
                                        Edit
                                    </Link>
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
                {tours.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No tours found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
