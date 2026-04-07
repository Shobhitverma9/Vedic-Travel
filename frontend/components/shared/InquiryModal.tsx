'use client';

import { useState } from 'react';
import { inquiriesService } from '@/services/inquiries.service';
import ReCaptcha from './ReCaptcha';
import { toast } from 'sonner';

interface InquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    tourId: string;
    tourName: string;
    tourImage?: string;
}

export default function InquiryModal({ isOpen, onClose, tourId, tourName, tourImage }: InquiryModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!recaptchaToken) {
            toast.error('Please complete the reCAPTCHA verification');
            return;
        }

        setLoading(true);
        try {
            await inquiriesService.createInquiry({
                ...formData,
                tourId,
                tourName,
                recaptchaToken,
            });
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setFormData({ name: '', email: '', mobile: '' });
                setRecaptchaToken(null);
            }, 2000);
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            toast.error('Failed to submit inquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10 p-1"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-6">
                    <h2 className="text-xl font-display font-bold text-deepBlue mb-2 pr-8">{tourName}</h2>
                    {tourImage && (
                        <div className="w-full h-32 rounded-lg bg-gray-100 mb-6 overflow-hidden">
                            <img src={tourImage} alt={tourName} className="w-full h-full object-cover" />
                        </div>
                    )}

                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                            <p className="text-gray-600">We have received your inquiry and will contact you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                />
                            </div>
                            <ReCaptcha onChange={(token) => setRecaptchaToken(token)} />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors mt-2"
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
