'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2, X } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import Link from 'next/link';

interface BookingAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    returnUrl: string;
    onSuccess?: () => void;
}

export default function BookingAuthModal({ isOpen, onClose, returnUrl, onSuccess }: BookingAuthModalProps) {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await authService.login({
                email: loginEmail,
                password: loginPassword
            });
            toast.success('Successfully signed in!');
            if (onSuccess) onSuccess();
            else window.location.href = returnUrl;
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Invalid email or password';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass =
        'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5722] focus:border-[#FF5722] outline-none transition-all text-sm text-[#1A2332] bg-white';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-[#1A2332]/60 backdrop-blur-sm" 
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-[#1A2332] to-[#2C3E50] px-6 py-6">
                    <h2 className="text-white font-bold text-xl">Sign In to Continue</h2>
                    <p className="text-white/70 text-sm mt-1">
                        Sign in to proceed with your booking
                    </p>
                </div>

                <div className="p-6 md:p-8">
                    {/* Google Sign In */}
                    <div className="mb-5">
                        <GoogleLoginButton returnUrl={returnUrl} />
                    </div>

                    {/* Divider */}
                    <div className="relative mb-5 flex items-center">
                        <div className="flex-1 border-t border-gray-100" />
                        <span className="mx-4 text-xs text-gray-400 font-medium uppercase tracking-widest">or</span>
                        <div className="flex-1 border-t border-gray-100" />
                    </div>

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
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

                        {error && (
                            <p className="text-red-500 text-xs font-medium px-1">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0 text-sm tracking-wide flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In & Continue'
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link 
                            href={`/auth/signup?callbackUrl=${encodeURIComponent(returnUrl)}`}
                            className="font-semibold text-[#FF5722] hover:text-[#E64A19]"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
