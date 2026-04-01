'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Mail, Phone, MessageSquare, Send, MessageCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import PopularPackagesSidebar from '@/components/contact/PopularPackagesSidebar';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { inquiriesService } from '@/services/inquiries.service';

export default function CancellationPolicyPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        message: ''
    });
    const [expertMobile, setExpertMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const [expertLoading, setExpertLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [expertStatus, setExpertStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await inquiriesService.createInquiry({
                ...formData,
                tourId: 'cancellation-policy-page',
                tourName: 'Cancellation Policy Page Enquiry'
            });
            setStatus('success');
            setFormData({ name: '', email: '', mobile: '', message: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleExpertSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!expertMobile) return;
        setExpertLoading(true);
        try {
            await inquiriesService.createInquiry({
                name: 'Guest User',
                email: 'expert-callback@vedictravel.com',
                mobile: expertMobile,
                message: 'Requesting callback from expert (Cancellation Policy Page)',
                tourId: 'expert-callback',
                tourName: 'Expert Callback'
            });
            setExpertStatus('success');
            setExpertMobile('');
        } catch (error) {
            console.error('Error submitting expert inquiry:', error);
            setExpertStatus('error');
        } finally {
            setExpertLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[250px] md:h-[400px] w-full overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2000&auto=format&fit=crop"
                    alt="Cancellation Policy"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white">Cancellation Policy</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm">
                            <h2 className="text-3xl font-bold text-deepBlue mb-6 underline decoration-red-500 underline-offset-8">Cancellation Policy</h2>

                            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                                <p>
                                    It is our most important aim that you enjoy your holiday and that we earn your trust. However, we are not responsible for any cancellation due to any industrial disputes, Technical failure of any type of transport we use, loss of earnings, late arrivals or force majeure, or any items beyond our control. After booking, if you wish to cancel your trip, you must notify Vedic Travel in writing. Once a Vedic Travel notice is received, cancellation will take effect subject to the following:
                                </p>

                                <ul className="list-disc pl-5 space-y-4">
                                    <li>
                                        If cancellation takes place between 90 – 150 days before your departure date, your full payment will be refunded, except the non-refundable deposit of USD 300 | INR 15000 for Kailash Mansarovar Yatra & USD 300 | INR 10000 or 20% of the package cost, whichever is higher for other destinations.
                                    </li>
                                    <li>
                                        If cancellation takes place between 30-90 days before departure 75% of your payment will be refunded, except the non-refundable deposit.
                                    </li>
                                    <li>
                                        If cancellation takes place less than 30 days prior to departure due to client's personal problems, all previously paid amount(s) will be forfeited.
                                    </li>
                                </ul>

                                {/* Talk to Expert Section */}
                                <div className="mt-12 bg-white border border-gray-100 rounded-2xl p-8 shadow-md text-center">
                                    <h3 className="text-2xl font-bold text-deepBlue mb-2">Talk to Kailash Yatra Expert</h3>
                                    <p className="text-gray-600 mb-6">Submit your contact number. Kailash Yatra Expert will call you within 1 minute.</p>

                                    <form onSubmit={handleExpertSubmit} className="max-w-xl mx-auto">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-1 relative flex">
                                                <div className="bg-gray-50 border border-r-0 border-gray-300 px-4 flex items-center gap-2 text-gray-700 rounded-l-lg">
                                                    <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-3" />
                                                    <span className="font-semibold">+91</span>
                                                </div>
                                                <input
                                                    type="tel"
                                                    placeholder="Enter Mobile Number"
                                                    value={expertMobile}
                                                    onChange={(e) => setExpertMobile(e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={expertLoading}
                                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors whitespace-nowrap"
                                            >
                                                {expertLoading ? '...' : 'Submit'}
                                            </button>
                                        </div>
                                        {expertStatus === 'success' && (
                                            <p className="text-green-600 mt-4 text-sm font-semibold flex items-center justify-center gap-2">
                                                <CheckCircle2 size={16} /> Request submitted! We'll call you shortly.
                                            </p>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3 space-y-8">
                        {/* Reach out to us form */}
                        <div className="bg-[#1D102A] p-8 rounded-2xl text-white shadow-xl">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold mb-2">Reach out to us</h3>
                                <p className="text-gray-400 text-sm">Have An Enquiry? Write To Us...</p>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-4">
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
                                        className="w-full bg-white text-gray-800 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
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
                                        className="w-full bg-white text-gray-800 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
                                    />
                                </div>

                                <div className="relative flex">
                                    <div className="bg-white border-r border-gray-200 px-3 flex items-center gap-1 text-gray-700 rounded-l-lg">
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
                                        className="w-full bg-white text-gray-800 pr-4 py-3 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-saffron"
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
                                        className="w-full bg-white text-gray-800 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 group"
                                >
                                    {loading ? 'Sending...' : 'Submit'}
                                    {!loading && <Send size={18} className="transition-transform group-hover:translate-x-1" />}
                                </button>

                                {status === 'success' && (
                                    <p className="text-green-400 text-center text-sm mt-4 font-semibold flex items-center justify-center gap-2">
                                        <CheckCircle2 size={16} /> Inquiry sent successfully!
                                    </p>
                                )}
                                {status === 'error' && (
                                    <p className="text-red-400 text-center text-sm mt-4 font-semibold">Something went wrong. Please try again.</p>
                                )}
                            </form>
                        </div>

                        {/* WhatsApp Banner */}
                        <a
                            href="https://wa.me/918447470062"
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
                                    <p className="text-xs text-gray-500">Call on +91-8447470062 or WhatsApp</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-red-500 transition-transform group-hover:translate-x-1" />
                        </a>

                        <PopularPackagesSidebar />
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="mt-12">
                <TestimonialsSection />
            </div>
        </main>
    );
}
