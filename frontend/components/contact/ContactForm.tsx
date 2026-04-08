'use client';

import React, { useState } from 'react';
import { inquiriesService } from '@/services/inquiries.service';
import { User, Mail, Phone, Send, Loader2, CheckCircle2 } from 'lucide-react';
import ReCaptcha from '../shared/ReCaptcha';
import { toast } from 'sonner';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        acceptedPrivacy: false
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

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
                tourId: 'contact-page',
                tourName: 'Contact Page Inquiry',
                recaptchaToken,
                // Fallback for removed fields
                adults: 1,
                children: 0,
                infants: 0,
                message: 'Inquiry from Contact Page Call-Back form'
            });
            setStatus('success');
            setFormData({ name: '', email: '', mobile: '', acceptedPrivacy: false });
            setRecaptchaToken(null);
            toast.success('Your request has been sent! We will call you back soon.');
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
            toast.error('Something went wrong. Please try again.');
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
        <div className="space-y-6">
            <div className="bg-white p-0 rounded-2xl text-gray-800 shadow-2xl overflow-hidden border border-gray-100">
                {/* Thomas Cook style Header */}
                <div className="bg-gradient-to-br from-[#003580] to-[#0052cc] p-6 text-white">
                    <h3 className="text-xl font-bold mb-4">Get Exclusive Deals</h3>
                    <div className="space-y-2">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="bg-yellow-400 rounded-full p-0.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#003580] fill-yellow-400 stroke-[#003580]" />
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-wider">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 pt-8">
                    <div className="mb-6">
                        <h4 className="text-lg font-bold text-gray-900 leading-snug">Get an Instant Call Back From Our Holiday Expert</h4>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Name *"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white text-gray-800 pl-10 pr-4 py-3.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003580] outline-none placeholder:text-gray-400 font-medium"
                            />
                        </div>

                        <div className="relative flex gap-2">
                            <div className="bg-gray-50 border border-gray-200 px-3 flex items-center gap-2 text-gray-500 rounded-lg text-sm font-bold">
                                +91
                            </div>
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Phone size={18} />
                                </div>
                                <input
                                    type="tel"
                                    name="mobile"
                                    required
                                    placeholder="Mobile *"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    className="w-full bg-white text-gray-800 pl-10 pr-4 py-3.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003580] outline-none placeholder:text-gray-400 font-medium"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Email *"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white text-gray-800 pl-10 pr-4 py-3.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003580] outline-none placeholder:text-gray-400 font-medium"
                            />
                        </div>

                        <div className="flex items-start gap-3 py-1">
                            <input
                                type="checkbox"
                                id="contact-privacy"
                                required
                                className="mt-1 w-4 h-4 text-[#003580] rounded border-gray-300 focus:ring-[#003580]"
                                checked={formData.acceptedPrivacy}
                                onChange={(e) => setFormData({ ...formData, acceptedPrivacy: e.target.checked })}
                            />
                            <label htmlFor="contact-privacy" className="text-[11px] text-gray-500 leading-tight">
                                I accept the <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span> and authorize VedicTravel to contact me with details.
                            </label>
                        </div>

                        <ReCaptcha onChange={(token) => setRecaptchaToken(token)} />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#003580] hover:bg-[#002860] text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg uppercase tracking-wider"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Submit
                                    <Send size={18} className="transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Support Footer */}
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-center justify-between">
                 <div className="flex flex-col">
                     <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Support</span>
                     <span className="text-sm font-bold text-gray-700">1800-2099-100</span>
                 </div>
                 <div className="px-3 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-500 uppercase">
                     Assistance
                 </div>
            </div>
        </div>
    );
}
