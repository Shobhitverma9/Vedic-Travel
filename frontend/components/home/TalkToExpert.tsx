'use client';

import { useState } from 'react';
import { inquiriesService } from '@/services/inquiries.service';
import { ChevronDown } from 'lucide-react';
import { countries } from '@/data/countries';

export default function TalkToExpert() {
    const [mobile, setMobile] = useState('');
    const [dialCode, setDialCode] = useState('+91');
    const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.dial_code === '+91') || countries[0]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mobile) return;

        setLoading(true);
        setStatus('idle');

        try {
            await inquiriesService.createInquiry({
                name: 'Guest User',
                email: 'guest@example.com',
                mobile: `${dialCode}-${mobile}`,
                message: 'Requesting callback from expert',
                tourId: 'general-inquiry',
                tourName: 'General Inquiry',
            });
            setStatus('success');
            setMobile('');
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 pt-8 pb-16 lg:pt-12 lg:pb-24">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-orange-600 uppercase bg-orange-100 rounded-full">
                            Expert Guidance
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-sans font-bold text-gray-900 mb-6 leading-tight">
                            Tailor Your Journey with <span className="text-orange-600">Our Experts</span>
                        </h2>
                        <p className="text-gray-600 mb-10 text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            From sacred destinations to premium arrangements, every element is curated around you.
                        </p>

                        <form onSubmit={handleSubmit} className="max-w-lg mx-auto lg:mx-0 mb-10 bg-white p-2 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 sm:gap-0 relative">
                                <div className="pl-4 pr-3 py-3 flex items-center gap-2 border-r border-gray-200 shrink-0 relative cursor-pointer min-w-[90px]">
                                    {/* Visible representation */}
                                    <div className="flex items-center gap-2 w-full justify-between pointer-events-none">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl" aria-hidden="true">{selectedCountry.flag}</span>
                                            <span className="text-gray-600 font-medium">{dialCode}</span>
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                    {/* Invisible native select for interaction */}
                                    <select
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-base bg-white"
                                        value={dialCode}
                                        onChange={(e) => {
                                            const newDialCode = e.target.value;
                                            setDialCode(newDialCode);
                                            const country = countries.find(c => c.dial_code === newDialCode);
                                            if (country) setSelectedCountry(country);
                                        }}
                                        aria-label="Select country code"
                                    >
                                        {countries.map((country) => (
                                            <option key={`${country.code}-${country.dial_code}`} value={country.dial_code}>
                                                {country.flag} {country.name} ({country.dial_code})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Enter mobile number"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    className="w-full sm:flex-1 px-4 py-3 bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 font-medium min-w-[140px]"
                                    required
                                    pattern="[0-9]{10}"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 shadow-md shrink-0 whitespace-nowrap"
                                >
                                    {loading ? '...' : 'Request Call'}
                                </button>
                            </div>
                        </form>
                        {status === 'success' && (
                            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 text-center lg:text-left animate-fade-in">
                                Thank you! Our expert will call you soon.
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-center lg:text-left animate-fade-in">
                                Something went wrong. Please try again.
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-gray-600">
                            <span>Or call us directly at:</span>
                            <a href="tel:+918447470062" className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:text-orange-600 transition-colors">
                                <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </span>
                                +91-8447470062
                            </a>
                        </div>
                    </div>

                    {/* Image Side */}
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative pl-0 lg:pl-10">
                        <div className="relative z-10 w-full max-w-md">
                            <div className="absolute inset-0 bg-orange-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 transform translate-x-4 translate-y-4"></div>
                            <img
                                src="/contact-woman.png"
                                alt="Travel Expert"
                                className="relative z-10 w-full h-auto object-cover drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500 rounded-2xl"
                            />

                            {/* Floating Quote Card */}
                            <div className="absolute -bottom-6 -left-6 lg:-left-10 bg-white p-4 rounded-xl shadow-xl border border-gray-100 max-w-xs animate-float hidden sm:block z-20">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                                                <img src={`/images/users/user${i}.png`} alt="User" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700">10k+ Happy Yatris</span>
                                </div>
                                <div className="flex text-yellow-400 text-sm">
                                    {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
