'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { yatrasService } from '@/services/yatras.service';

export default function AdminYatrasPage() {
    const [yatras, setYatras] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchYatras();
    }, []);

    const fetchYatras = async () => {
        try {
            const data = await yatrasService.getAllYatras({ isActive: 'all' }); // Fetch all including hidden
            setYatras(data);
        } catch (error) {
            console.error('Error fetching yatras:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleVisibility = async (yatra: any) => {
        try {
            const newStatus = !yatra.isActive;
            await yatrasService.updateYatra(yatra._id, { isActive: newStatus });
            setYatras(yatras.map((y: any) => 
                y._id === yatra._id ? { ...y, isActive: newStatus } : y
            ));
        } catch (error) {
            console.error('Toggle visibility failed:', error);
            alert('Failed to update visibility');
        }
    };
        if (!confirm('Are you sure you want to delete this Yatra?')) return;
        try {
            await yatrasService.deleteYatra(id);
            setYatras(yatras.filter((y: any) => y._id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete yatra');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Manage Yatras</h1>
                <Link
                    href="/admin/yatras/new"
                    className="bg-saffron text-white px-4 py-2 rounded-lg hover:bg-saffron-dark transition-colors font-medium shadow-sm flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Yatra
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Packages</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visibility</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {yatras.map((yatra: any) => (
                                <tr key={yatra._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{yatra.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{yatra.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                            {yatra.packages?.length || 0} Packages
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleToggleVisibility(yatra)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${yatra.isActive ? 'bg-green-500' : 'bg-gray-300'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${yatra.isActive ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                            <span className="ml-2 text-xs font-medium text-gray-600">
                                                {yatra.isActive ? 'Visible' : 'Hidden'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            href={`/admin/yatras/${yatra._id}`}
                                            className="text-saffron hover:text-saffron-dark mr-4"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(yatra._id)}
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
                {yatras.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No yatras found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
