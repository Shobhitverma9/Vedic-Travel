'use client';

import React, { useState } from 'react';
import { inquiriesService } from '@/services/inquiries.service';
import { User, Mail, Phone, MessageSquare, Send, MessageCircle } from 'lucide-react';
import ReCaptcha from '../shared/ReCaptcha';
import { toast } from 'sonner';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        message: '',
        acceptedPrivacy: false
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as any;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
        });
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
                ...formData,
                tourId: 'contact-page',
                tourName: 'Contact Page Inquiry',
                recaptchaToken,
            });
            setStatus('success');
            setFormData({ name: '', email: '', mobile: '', message: '', acceptedPrivacy: false });
            setRecaptchaToken(null);
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-[#2D2244] p-8 rounded-xl text-white shadow-xl">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">Reach out to us</h3>
                    <p className="text-gray-300 text-sm">Have An Enquiry? Write To Us...</p>
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
                            onChange={handleChange}
                            className="w-full bg-white text-gray-800 pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron"
                        />
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
                            onChange={handleChange}
                            className="w-full bg-white text-gray-800 pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron"
                        />
                    </div>

                    <div className="relative flex">
                        <div className="bg-white border-r border-gray-200 px-3 flex items-center gap-1 text-gray-700 rounded-l-md">
                            <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-3" />
                            <span className="text-sm font-semibold">+91</span>
                        </div>
                        <input
                            type="tel"
                            name="mobile"
                            required
                            placeholder="Phone Number *"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="w-full bg-white text-gray-800 pr-4 py-3 rounded-r-md focus:outline-none focus:ring-2 focus:ring-saffron"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none text-gray-400">
                            <MessageSquare size={18} />
                        </div>
                        <textarea
                            name="message"
                            rows={4}
                            placeholder="Comment"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full bg-white text-gray-800 pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron resize-none"
                        ></textarea>
                    </div>

                    <div className="flex items-start gap-3 py-1 mb-4">
                        <input
                            type="checkbox"
                            name="acceptedPrivacy"
                            id="contact-privacy"
                            required
                            className="mt-1 w-4 h-4 text-saffron rounded border-gray-300 focus:ring-saffron"
                            checked={formData.acceptedPrivacy}
                            onChange={handleChange}
                        />
                        <label htmlFor="contact-privacy" className="text-[11px] text-gray-300 leading-tight">
                            I accept the <span className="text-blue-400 underline cursor-pointer">Privacy Policy</span> and authorize VedicTravel to contact me with details.
                        </label>
                    </div>

                    <ReCaptcha onChange={(token) => setRecaptchaToken(token)} theme="dark" />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md transition-all flex items-center justify-center gap-2 group shadow-lg"
                    >
                        {loading ? 'Sending...' : 'Submit'}
                        {!loading && <Send size={18} className="transition-transform group-hover:translate-x-1" />}
                    </button>

                    {status === 'success' && (
                        <p className="text-green-400 text-center text-sm mt-4 font-semibold">Message sent successfully!</p>
                    )}
                    {status === 'error' && (
                        <p className="text-red-400 text-center text-sm mt-4 font-semibold">Something went wrong. Please try again.</p>
                    )}
                </form>
            </div>

            {/* WhatsApp Banner */}
            <a
                href="https://wa.me/918510007751"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-white border border-red-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
            >
                <div className="flex items-center gap-4">
                    <div className="bg-green-500 p-2 rounded-full text-white">
                        <MessageCircle size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h4 className="font-bold text-deepBlue text-sm">Connect on WhatsApp</h4>
                        <p className="text-xs text-gray-500">Call on +91-8510007751 or WhatsApp</p>
                    </div>
                </div>
                <ChevronRight size={20} className="text-red-500 transition-transform group-hover:translate-x-1" />
            </a>
        </div>
    );
}

// Internal component for chevron used in WhatsApp Banner
function ChevronRight({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}
