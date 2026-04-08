'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Phone, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { inquiriesService } from '@/services/inquiries.service';
import { toast } from 'sonner';
import ReCaptcha from '../shared/ReCaptcha';

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
        acceptedPrivacy: false,
    });
    const [loading, setLoading] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

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
                recaptchaToken,
                // These are removed from the form but might be expected by the schema
                adults: 1,
                children: 0,
                infants: 0,
            });
            toast.success('Inquiry submitted successfully! We will contact you soon.');
            onClose();
            // Reset form
            setFormData({
                name: '',
                email: '',
                mobile: '',
                acceptedPrivacy: false,
            });
            setRecaptchaToken(null);
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            toast.error('Failed to submit inquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        "Rated Best Travel Partner",
        "Most Experienced Tour Managers",
        "Choose from 1000+ Holiday Packages"
    ];

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative animate-slide-up overflow-hidden">
                {/* Header Section (Blue Gradient) */}
                <div className="bg-gradient-to-br from-[#003580] to-[#0052cc] p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <h2 className="text-2xl font-bold mb-4 pr-8">Get Exclusive Deals</h2>
                    
                    <div className="space-y-3">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="bg-yellow-400 rounded-full p-0.5">
                                    <CheckCircle2 className="w-4 h-4 text-[#003580] fill-yellow-400 stroke-[#003580]" />
                                </div>
                                <span className="text-sm font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Section */}
                <div className="p-8">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">Get an Instant Call Back From Our Holiday Expert</h3>
                        <p className="text-sm text-gray-500 font-medium truncate">Interested in: <span className="text-deepBlue">{tourName}</span></p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Name*"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003580] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="flex gap-2">
                             <div className="w-20 px-3 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 font-medium flex items-center justify-center">
                                 +91
                             </div>
                            <div className="flex-1 relative">
                                <input
                                    type="tel"
                                    placeholder="Mobile*"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003580] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                />
                                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Email*"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003580] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 py-2">
                            <input
                                type="checkbox"
                                id="privacy"
                                required
                                className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                checked={formData.acceptedPrivacy}
                                onChange={(e) => setFormData({ ...formData, acceptedPrivacy: e.target.checked })}
                            />
                            <label htmlFor="privacy" className="text-xs text-gray-500 leading-tight">
                                I accept the <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span> and authorize VedicTravel to contact me with details.
                            </label>
                        </div>

                        <ReCaptcha onChange={(token) => setRecaptchaToken(token)} />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#003580] hover:bg-[#002860] text-white font-bold py-4 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-center text-sm font-medium text-gray-600 mb-4">We're happy to help you on</p>
                        <div className="flex gap-3">
                            <a href="tel:+918447470062" className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                                <Phone className="w-4 h-4 text-blue-600" />
                                1800-2099-100
                            </a>
                            <div className="flex-1 flex items-center justify-center py-3 px-4 border border-gray-200 rounded-lg text-sm font-bold text-gray-700">
                                Assistance
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
