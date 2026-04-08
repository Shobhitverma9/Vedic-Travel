'use client';

import React, { useState } from 'react';
import { Send, User, Phone, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { inquiriesService } from '@/services/inquiries.service';
import ReCaptcha from '../shared/ReCaptcha';
import { toast } from 'sonner';

interface CustomEnquiryFormProps {
    yatraId: string;
    yatraName: string;
}

export default function CustomEnquiryForm({ yatraId, yatraName }: CustomEnquiryFormProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        acceptedPrivacy: false,
    });

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
                yatraId,
                yatraName,
                tourName: `Custom: ${yatraName}`,
                tourId: 'custom',
                recaptchaToken,
                // Removed fields fallback
                adults: 1,
                children: 0,
                infants: 0,
                message: `Interested in a custom package for ${yatraName}`,
            });
            setSuccess(true);
            setRecaptchaToken(null);
            setFormData({
                name: '',
                email: '',
                mobile: '',
                acceptedPrivacy: false,
            });
        } catch (error) {
            console.error('Inquiry failed:', error);
            toast.error('Failed to send enquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        "Rated Best Travel Partner",
        "Most Experienced Tour Managers",
        "Choose from 1000+ Holiday Packages"
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-gray-100">
                    {/* Left Side: Thomas Cook inspired Info Section */}
                    <div className="lg:w-2/5 p-10 lg:p-16 bg-gradient-to-br from-[#003580] to-[#0052cc] text-white relative flex flex-col justify-center">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-6">
                                Get Exclusive Deals
                            </h2>
                            
                            <div className="space-y-4 mb-10">
                                {features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="bg-yellow-400 rounded-full p-0.5">
                                            <CheckCircle2 className="w-5 h-5 text-[#003580] fill-yellow-400 stroke-[#003580]" />
                                        </div>
                                        <span className="text-lg font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <p className="text-blue-100/80 text-sm font-medium border-t border-white/20 pt-8">
                                VedicTravel is committed to providing spiritual and professional travel experiences across the globe.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Simplified Form */}
                    <div className="lg:w-3/5 p-10 lg:p-16 bg-white flex flex-col justify-center">
                        {success ? (
                            <div className="text-center animate-fade-in">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Send className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">Request Sent!</h3>
                                <p className="text-gray-500 font-medium mb-8 max-w-md mx-auto">
                                    Thank you for reaching out. A VedicTravel expert will contact you within 24 hours to help plan your {yatraName} journey.
                                </p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="px-10 py-4 bg-[#003580] text-white rounded-xl font-bold uppercase tracking-wider hover:bg-[#002860] transition-all shadow-lg"
                                >
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Get an Instant Call Back From Our Holiday Expert</h3>
                                    <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-[#003580] text-sm font-bold rounded-full">
                                        Planning: {yatraName}
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-[#003580] focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-400"
                                            placeholder="Full Name*"
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="w-20 hidden sm:flex items-center justify-center bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-gray-500">
                                            +91
                                        </div>
                                        <div className="flex-1 relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                required
                                                value={formData.mobile}
                                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-[#003580] focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-400"
                                                placeholder="Mobile Number*"
                                            />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-[#003580] focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-400"
                                            placeholder="Email ID*"
                                        />
                                    </div>

                                    <div className="flex items-start gap-3 py-2">
                                        <input
                                            type="checkbox"
                                            id="custom-privacy"
                                            required
                                            className="mt-1 w-5 h-5 text-[#003580] rounded border-gray-300 focus:ring-[#003580]"
                                            checked={formData.acceptedPrivacy}
                                            onChange={(e) => setFormData({ ...formData, acceptedPrivacy: e.target.checked })}
                                        />
                                        <label htmlFor="custom-privacy" className="text-sm text-gray-500 leading-snug">
                                            I accept the <span className="text-blue-600 underline font-medium cursor-pointer">Privacy Policy</span> and authorize VedicTravel to contact me with details.
                                        </label>
                                    </div>

                                    <ReCaptcha onChange={(token) => setRecaptchaToken(token)} />

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-5 bg-[#003580] text-white rounded-xl font-bold uppercase tracking-widest shadow-xl hover:bg-[#002860] transition-all disabled:opacity-50 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Enquire Now'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
