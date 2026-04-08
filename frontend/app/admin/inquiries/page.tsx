'use client';

import { useState, useEffect } from 'react';
import { inquiriesService } from '@/services/inquiries.service';

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const data = await inquiriesService.getAllInquiries();
            setInquiries(data);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading inquiries...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">User Inquiries</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour Interest</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {inquiries.map((inquiry: any) => (
                                <tr key={inquiry._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(inquiry.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                                        <div className="text-sm text-gray-500">{inquiry.email}</div>
                                        <div className="text-sm text-gray-500">{inquiry.mobile}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {inquiry.tourName ? (
                                            <div className="flex flex-col">
                                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-[#003580] border border-blue-100 mb-1">
                                                    {inquiry.tourName}
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-mono">ID: {inquiry.tourId}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">General Inquiry</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${inquiry.status === 'new' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-800 border border-gray-200'
                                            }`}>
                                            {inquiry.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {inquiries.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No inquiries found yet.
                    </div>
                )}
            </div>
        </div>
    );
}
