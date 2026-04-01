'use client';

import { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';

interface AuthStepProps {
    onContinue: (email: string, isGuest: boolean) => void;
}

export default function AuthStep({ onContinue }: AuthStepProps) {
    const [guestEmail, setGuestEmail] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [view, setView] = useState<'login' | 'guest'>('login');

    const handleGuestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onContinue(guestEmail, true);
    };

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onContinue(loginEmail, false);
    };

    const inputClass =
        'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5722] focus:border-[#FF5722] outline-none transition-all text-sm text-[#1A2332] bg-white';

    return (
        <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1A2332] to-[#2C3E50] px-6 py-5">
                    <h2 className="text-white font-bold text-xl">
                        {view === 'login' ? 'Sign In to Continue' : 'Continue as Guest'}
                    </h2>
                    <p className="text-white/50 text-xs mt-1">
                        {view === 'login'
                            ? 'Access your saved travellers & booking history'
                            : 'No account needed — just your email'}
                    </p>
                </div>

                <div className="p-6">
                    {/* Google Sign In */}
                    <button className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl p-3 hover:bg-gray-50 transition-colors mb-5 group">
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        <span className="font-medium text-gray-700 text-sm group-hover:text-[#1A2332]">
                            Continue with Google
                        </span>
                    </button>

                    {/* Divider */}
                    <div className="relative mb-5 flex items-center">
                        <div className="flex-1 border-t border-gray-100" />
                        <span className="mx-4 text-xs text-gray-400 font-medium uppercase tracking-widest">or</span>
                        <div className="flex-1 border-t border-gray-100" />
                    </div>

                    {view === 'login' ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-3">
                            <input
                                type="email"
                                required
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                placeholder="Email address"
                                className={inputClass}
                            />
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    required
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    placeholder="Password"
                                    className={inputClass + ' pr-10'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0 text-sm tracking-wide mt-1"
                            >
                                Sign In & Continue
                            </button>

                            <div className="text-center pt-2">
                                <button
                                    type="button"
                                    onClick={() => setView('guest')}
                                    className="text-sm text-[#1A2332]/50 hover:text-[#FF5722] font-medium transition-colors"
                                >
                                    Continue as Guest instead →
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleGuestSubmit} className="space-y-3">
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Your email address
                            </label>
                            <input
                                type="email"
                                required
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                                placeholder="name@example.com"
                                className={inputClass}
                            />
                            <p className="text-xs text-gray-400 flex items-center gap-1.5 pb-1">
                                <Shield size={12} className="text-[#FF5722]" />
                                Booking confirmation will be sent to this email
                            </p>

                            <button
                                type="submit"
                                className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0 text-sm tracking-wide"
                            >
                                Continue as Guest
                            </button>

                            <div className="text-center pt-2">
                                <button
                                    type="button"
                                    onClick={() => setView('login')}
                                    className="text-sm text-[#1A2332]/50 hover:text-[#FF5722] font-medium transition-colors"
                                >
                                    ← Back to Sign In
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
