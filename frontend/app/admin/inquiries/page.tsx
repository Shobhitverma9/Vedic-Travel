'use client';

import { useState, useEffect } from 'react';
import { inquiriesService } from '@/services/inquiries.service';
import { Mail, Phone, Building2, Users, Wallet } from 'lucide-react';

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
                                <tr key={inquiry._id} className={`hover:bg-gray-50 ${inquiry.isCorporate ? 'bg-orange-50/30' : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(inquiry.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="text-sm font-bold text-gray-900">{inquiry.name}</div>
                                            {inquiry.isCorporate && (
                                                <span className="px-2 py-0.5 bg-saffron text-white text-[10px] font-bold rounded uppercase tracking-tighter shadow-sm">
                                                    Corporate
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600 flex items-center gap-1">
                                            <Mail size={12} className="text-gray-400" /> {inquiry.email}
                                        </div>
                                        <div className="text-sm text-gray-600 flex items-center gap-1">
                                            <Phone size={12} className="text-gray-400" /> {inquiry.mobile}
                                        </div>
                                        
                                        {inquiry.isCorporate && (
                                            <div className="mt-3 p-3 bg-white border border-orange-100 rounded-lg shadow-sm space-y-1">
                                                <div className="text-xs font-bold text-deepBlue uppercase tracking-widest flex items-center gap-1">
                                                   <Building2 size={12} className="text-saffron" /> {inquiry.companyName}
                                                </div>
                                                <div className="text-[11px] text-gray-500 flex items-center gap-1">
                                                   <Users size={12} /> Team: {inquiry.teamSize}
                                                </div>
                                                <div className="text-[11px] text-gray-500 flex items-center gap-1">
                                                   <Wallet size={12} /> Budget: {inquiry.isCustomizable ? 'Flexible' : `₹${inquiry.budget}`}
                                                </div>
                                                <div className="text-[10px] text-gray-400 italic mt-1 line-clamp-1">
                                                   {inquiry.officeAddress}
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {inquiry.tourName ? (
                                            <div className="flex flex-col">
                                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border mb-1 ${
                                                    inquiry.isCorporate ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-blue-50 text-[#003580] border-blue-100'
                                                }`}>
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
