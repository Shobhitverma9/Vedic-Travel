'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Phone, Mail, Loader2, FileText, Download } from 'lucide-react';
import { inquiriesService } from '@/services/inquiries.service';
import { toast } from 'sonner';
import ReCaptcha from '../shared/ReCaptcha';

interface ItineraryDownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
    tourName: string;
    tourId: string;
    pdfUrl: string;
}

export default function ItineraryDownloadModal({ isOpen, onClose, tourName, tourId, pdfUrl }: ItineraryDownloadModalProps) {
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        acceptedPrivacy: false,
    });
    const [loading, setLoading] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    const handleDownload = () => {
        if (!pdfUrl) return;
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', `${tourName.replace(/\s+/g, '_')}_Itinerary.pdf`);
        link.setAttribute('target', '_blank'); // Open in new tab as fallback
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.acceptedPrivacy) {
            toast.error('Please accept the Privacy Policy to proceed');
            return;
        }
        
        if (!recaptchaToken) {
            toast.error('Please complete the reCAPTCHA verification');
            return;
        }

        setLoading(true);
        try {
            await inquiriesService.createInquiry({
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                tourId,
                tourName,
                message: `Itinerary Download Request: ${tourName}`,
                recaptchaToken,
                adults: 1,
                children: 0,
                infants: 0,
            });
            
            toast.success('Information submitted! Your download will start now.');
            
            // Trigger the download
            handleDownload();
            
            // Close modal after a short delay
            setTimeout(() => {
                onClose();
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    mobile: '',
                    acceptedPrivacy: false,
                });
                setRecaptchaToken(null);
            }, 500);
            
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            toast.error('Failed to process request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 py-8 sm:py-12 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative animate-slide-up">
                {/* Header Section */}
                <div className="bg-gradient-to-br from-deepBlue to-purple p-6 text-white relative rounded-t-xl">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-bold">Download Complete Itinerary</h2>
                    </div>
                    <p className="text-white/70 text-sm">Please provide your details to receive the detailed itinerary PDF.</p>
                </div>

                {/* Form Section */}
                <div className="p-6">
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-800 mb-1 leading-tight">{tourName}</h3>
                        <p className="text-[11px] text-gray-500 font-medium">Detailed daily plan, inclusions, exclusions, and travel tips.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Full Name*"
                                required
                                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-deepBlue focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        </div>

                        <div className="relative">
                            <input
                                type="tel"
                                placeholder="Contact Number (with +91 or country code)*"
                                required
                                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-deepBlue focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            />
                            <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        </div>

                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email Address*"
                                required
                                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-deepBlue focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        </div>

                        <div className="flex items-start gap-3 py-1">
                            <input
                                type="checkbox"
                                id="privacy-itinerary"
                                required
                                className="mt-1 w-4 h-4 text-deepBlue rounded border-gray-300 focus:ring-deepBlue"
                                checked={formData.acceptedPrivacy}
                                onChange={(e) => setFormData({ ...formData, acceptedPrivacy: e.target.checked })}
                            />
                            <label htmlFor="privacy-itinerary" className="text-[10px] text-gray-500 leading-tight">
                                I agree to receive information about travel packages and offers. 
                                By clicking submit, I accept the <span className="text-deepBlue underline cursor-pointer">Privacy Policy</span>.
                            </label>
                        </div>

                        <div className="scale-90 origin-left">
                            <ReCaptcha onChange={(token) => setRecaptchaToken(token)} />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-saffron hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Download className="w-5 h-5" />
                                    Download Itinerary PDF
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
