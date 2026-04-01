'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Phone, Mail, MapPin, Loader2, Minus, Plus } from 'lucide-react';
import { inquiriesService } from '@/services/inquiries.service';
import { toast } from 'sonner';

interface PackageEnquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    tourName: string;
    tourId: string;
}

export default function PackageEnquiryModal({ isOpen, onClose, tourName, tourId }: PackageEnquiryModalProps) {
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        adults: 2,
        children: 0,
        infants: 0,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await inquiriesService.createInquiry({
                ...formData,
                tourId,
                tourName,
            });
            toast.success('Inquiry submitted successfully! We will contact you soon.');
            onClose();
            // Reset form
            setFormData({
                name: '',
                email: '',
                mobile: '',
                adults: 2,
                children: 0,
                infants: 0,
            });
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            toast.error('Failed to submit inquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateTravelers = (type: 'adults' | 'children' | 'infants', change: number) => {
        setFormData(prev => ({
            ...prev,
            [type]: Math.max(0, prev[type] + change)
        }));
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in pt-24 md:pt-32 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mb-12 relative animate-slide-up">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-8">
                    <h2 className="text-2xl font-display font-bold text-deepBlue mb-6 pr-8">
                        Want to Go For A Memorable Holiday?
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Package Name (Read-only) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Package Name</label>
                            <div className="relative">
                                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 font-medium pr-10 truncate">
                                    {tourName}
                                </div>
                                <MapPin className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Personal Details */}
                        <div>
                            <h3 className="text-lg font-bold text-deepBlue mb-4 flex items-center">
                                Personal Details
                                <div className="h-px bg-gray-200 flex-grow ml-4"></div>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            required
                                            className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                        <User className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Mobile No.</label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            placeholder="+91 Mobile No."
                                            required
                                            className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all"
                                            value={formData.mobile}
                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                        />
                                        <Phone className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Email ID</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Your E-Mail Address"
                                        required
                                        className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <Mail className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Travelers */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Adult</label>
                                <div className="flex items-center justify-between border border-gray-300 rounded-lg px-2 py-2">
                                    <button
                                        type="button"
                                        onClick={() => updateTravelers('adults', -1)}
                                        className="p-1 hover:bg-gray-100 rounded text-gray-500"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="font-bold text-deepBlue w-6 text-center">{formData.adults}</span>
                                    <button
                                        type="button"
                                        onClick={() => updateTravelers('adults', 1)}
                                        className="p-1 hover:bg-gray-100 rounded text-gray-500"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Child</label>
                                <div className="flex items-center justify-between border border-gray-300 rounded-lg px-2 py-2">
                                    <button
                                        type="button"
                                        onClick={() => updateTravelers('children', -1)}
                                        className="p-1 hover:bg-gray-100 rounded text-gray-500"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="font-bold text-deepBlue w-6 text-center">{formData.children}</span>
                                    <button
                                        type="button"
                                        onClick={() => updateTravelers('children', 1)}
                                        className="p-1 hover:bg-gray-100 rounded text-gray-500"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Infant</label>
                                <div className="flex items-center justify-between border border-gray-300 rounded-lg px-2 py-2">
                                    <button
                                        type="button"
                                        onClick={() => updateTravelers('infants', -1)}
                                        className="p-1 hover:bg-gray-100 rounded text-gray-500"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="font-bold text-deepBlue w-6 text-center">{formData.infants}</span>
                                    <button
                                        type="button"
                                        onClick={() => updateTravelers('infants', 1)}
                                        className="p-1 hover:bg-gray-100 rounded text-gray-500"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-saffron hover:bg-saffron-dark text-white font-bold py-3.5 rounded-full shadow-lg shadow-saffron/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Enquire Now'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
