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
        "Best Travel Partner",
        "Experienced Tour Managers",
        "1000+ Holiday Packages"
    ];

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative animate-slide-up overflow-hidden">
                {/* Compact Header Section */}
                <div className="bg-gradient-to-br from-[#003580] to-[#0052cc] p-4 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <h2 className="text-xl font-bold mb-3 pr-8">Get Exclusive Deals</h2>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <div className="bg-yellow-400 rounded-full p-0.5">
                                    <CheckCircle2 className="w-3 h-3 text-[#003580] fill-yellow-400 stroke-[#003580]" />
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-wider">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Section */}
                <div className="p-6">
                    <div className="mb-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-0.5 leading-tight">Get an Instant Call Back From Our Holiday Expert</h3>
                        <p className="text-xs text-gray-500 font-medium truncate">Interested in: <span className="text-deepBlue">{tourName}</span></p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3.5">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Name*"
                                required
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003580] focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        </div>

                        <div className="flex gap-2">
                             <div className="w-16 px-2 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 font-bold flex items-center justify-center">
                                 +91
                             </div>
                            <div className="flex-1 relative">
                                <input
                                    type="tel"
                                    placeholder="Mobile*"
                                    required
                                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003580] focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                />
                                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email*"
                                required
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003580] focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        </div>

                        <div className="flex items-start gap-3 py-1">
                            <input
                                type="checkbox"
                                id="privacy"
                                required
                                className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                checked={formData.acceptedPrivacy}
                                onChange={(e) => setFormData({ ...formData, acceptedPrivacy: e.target.checked })}
                            />
                            <label htmlFor="privacy" className="text-[10px] text-gray-500 leading-tight">
                                I accept the <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span> and authorize VedicTravel to contact me with details.
                            </label>
                        </div>

                        <div className="scale-90 origin-left">
                            <ReCaptcha onChange={(token) => setRecaptchaToken(token)} />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#003580] hover:bg-[#002860] text-white font-bold py-3.5 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </form>

                    {/* Compact Assistance Section */}
                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">Support</span>
                            <a href="tel:18002099100" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                1800-2099-100
                            </a>
                        </div>
                        <div className="px-3 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] font-bold text-gray-500 uppercase">
                            Assistance
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
