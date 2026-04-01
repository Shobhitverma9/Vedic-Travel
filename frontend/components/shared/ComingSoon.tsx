'use client';

import React from 'react';
import Link from 'next/link';
import { Plane, Hotel, Landmark, Car, ShieldCheck, ArrowLeft } from 'lucide-react';

interface ComingSoonProps {
    title: string;
    description?: string;
    icon?: 'flight' | 'hotel' | 'visa' | 'cab' | 'insurance';
}

const ComingSoon: React.FC<ComingSoonProps> = ({
    title,
    description = "We're working hard to bring you the best travel experiences. This service will be available very soon!",
    icon
}) => {
    const renderIcon = () => {
        switch (icon) {
            case 'flight': return <Plane className="w-12 h-12 text-saffron" />;
            case 'hotel': return <Hotel className="w-12 h-12 text-saffron" />;
            case 'visa': return <Landmark className="w-12 h-12 text-saffron" />;
            case 'cab': return <Car className="w-12 h-12 text-saffron" />;
            case 'insurance': return <ShieldCheck className="w-12 h-12 text-saffron" />;
            default: return <Plane className="w-12 h-12 text-saffron" />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-cream">
            {/* Background with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')`,
                }}
            >
                <div className="absolute inset-0 bg-deepBlue/60 backdrop-blur-[2px]"></div>
            </div>

            <main className="flex-grow flex items-center justify-center px-4 relative z-10 py-32 md:py-40">
                <div className="max-w-2xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-fade-in">
                    <div className="p-8 md:p-12 text-center">
                        {/* Animated Icon Container */}
                        <div className="mb-6 flex justify-center">
                            <div className="p-4 bg-saffron/10 rounded-2xl animate-bounce-slow">
                                {renderIcon()}
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-display font-bold text-deepBlue mb-4">
                            {title}
                        </h1>

                        <div className="w-20 h-1.5 bg-saffron mx-auto mb-8 rounded-full"></div>

                        <p className="text-lg md:text-xl text-deepBlue/70 mb-10 leading-relaxed font-sans">
                            {description}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/"
                                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 group"
                            >
                                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                Back to Home
                            </Link>
                            <Link
                                href="/contact"
                                className="w-full sm:w-auto px-8 py-3 rounded-xl border-2 border-deepBlue/10 text-deepBlue font-semibold hover:bg-deepBlue hover:text-white transition-all duration-300"
                            >
                                Inquire Now
                            </Link>
                        </div>

                        {/* Newsletter Subscription or Progress info */}
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <p className="text-sm font-medium text-deepBlue/50 uppercase tracking-widest mb-4">
                                Stay Updated
                            </p>
                            <div className="flex gap-2 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-grow px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-saffron transition-colors"
                                />
                                <button className="bg-deepBlue text-white px-6 py-3 rounded-xl font-bold hover:bg-saffron transition-all duration-300 shadow-lg shadow-deepBlue/20">
                                    Notify Me
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Decorative Floating Elements */}
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-gold/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-32 h-32 bg-saffron/20 rounded-full blur-3xl animate-pulse delay-700"></div>

            <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default ComingSoon;
