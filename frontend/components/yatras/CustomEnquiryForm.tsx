'use client';

import React, { useState } from 'react';
import { Send, Users, MapPin, Calendar, User, Phone, Mail } from 'lucide-react';
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
        adults: 2,
        children: 0,
        infants: 0,
        message: '',
        destination: yatraName,
        acceptedPrivacy: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
        }));
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
                yatraId,
                yatraName,
                tourName: `Custom: ${yatraName}`,
                tourId: 'custom',
                recaptchaToken,
            });
            setSuccess(true);
            setRecaptchaToken(null);
            setFormData({
                name: '',
                email: '',
                mobile: '',
                adults: 2,
                children: 0,
                infants: 0,
                message: `Interested in a custom package for ${yatraName}`,
                destination: yatraName,
                acceptedPrivacy: false,
            });
        } catch (error) {
            console.error('Inquiry failed:', error);
            toast.error('Failed to send enquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-deepBlue rounded-[40px] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
                    {/* Left Side: Info */}
                    <div className="lg:w-2/5 p-12 lg:p-20 bg-[url('/images/pattern-bg.png')] bg-cover relative text-white">
                        <div className="absolute inset-0 bg-deepBlue/90 backdrop-blur-sm"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl font-black uppercase tracking-tight mb-6">
                                Haven't found what you're looking for?
                            </h2>
                            <p className="text-blue-100 text-lg mb-10 font-medium">
                                No worries! Our spiritual travel experts can customize a package just for you. Tell us your preferences and we'll create the perfect pilgrimage.
                            </p>

                            <ul className="space-y-6">
                                <li className="flex items-center space-x-4">
                                    <div className="bg-saffron p-3 rounded-2xl shadow-lg">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="font-bold text-lg">Custom Group Sizes</span>
                                </li>
                                <li className="flex items-center space-x-4">
                                    <div className="bg-saffron p-3 rounded-2xl shadow-lg">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="font-bold text-lg">Flexible Dates</span>
                                </li>
                                <li className="flex items-center space-x-4">
                                    <div className="bg-saffron p-3 rounded-2xl shadow-lg">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="font-bold text-lg">Personalized Itineraries</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="lg:w-3/5 p-12 lg:p-20 bg-white">
                        {success ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                    <Send className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tight">Enquiry Sent!</h3>
                                <p className="text-gray-500 font-medium mb-8">
                                    Thank you for reaching out. Our expert will contact you within 24 hours.
                                </p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="px-8 py-3 bg-saffron text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-saffron-dark transition-all"
                                >
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-saffron outline-none transition-all font-bold"
                                            placeholder="Your Full Name"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="mobile"
                                            required
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-saffron outline-none transition-all font-bold"
                                            placeholder="Mobile Number"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2">Adults (12+)</label>
                                        <input
                                            type="number"
                                            name="adults"
                                            min="1"
                                            value={formData.adults}
                                            onChange={handleChange}
                                            className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-saffron outline-none transition-all font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2">Children (2-12)</label>
                                        <input
                                            type="number"
                                            name="children"
                                            min="0"
                                            value={formData.children}
                                            onChange={handleChange}
                                            className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-saffron outline-none transition-all font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2">Infants (0-2)</label>
                                        <input
                                            type="number"
                                            name="infants"
                                            min="0"
                                            value={formData.infants}
                                            onChange={handleChange}
                                            className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-saffron outline-none transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <textarea
                                        name="message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full p-6 rounded-2xl border-2 border-gray-100 focus:border-saffron outline-none transition-all font-bold"
                                        placeholder="Tell us about your trip requirements..."
                                    ></textarea>
                                </div>

                                <div className="flex items-start gap-3 py-2">
                                    <input
                                        type="checkbox"
                                        name="acceptedPrivacy"
                                        id="custom-privacy"
                                        required
                                        className="mt-1 w-5 h-5 text-deepBlue rounded border-gray-300 focus:ring-deepBlue"
                                        checked={formData.acceptedPrivacy}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="custom-privacy" className="text-sm text-gray-500 leading-snug">
                                        I accept the <span className="text-blue-600 underline font-medium cursor-pointer">Privacy Policy</span> and authorize VedicTravel to contact me with details.
                                    </label>
                                </div>

                                <ReCaptcha onChange={(token) => setRecaptchaToken(token)} />

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-saffron text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-saffron-dark transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Sending...' : 'Get Personalized Quote'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
