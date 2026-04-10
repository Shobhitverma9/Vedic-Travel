'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2, X, Mail, Key } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import Link from 'next/link';
import OTPInput from '@/components/auth/OTPInput';
import CountdownTimer from '@/components/auth/CountdownTimer';

interface BookingAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    returnUrl: string;
    onSuccess?: () => void;
}

type LoginMethod = 'password' | 'otp';

export default function BookingAuthModal({ isOpen, onClose, returnUrl, onSuccess }: BookingAuthModalProps) {
    const [loginMethod, setLoginMethod] = useState<LoginMethod>('password');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (loginMethod === 'password') {
                await authService.login({
                    email: loginEmail,
                    password: loginPassword
                });
                toast.success('Successfully signed in!');
                if (onSuccess) onSuccess();
                else window.location.href = returnUrl;
            } else {
                // Handle Send OTP
                await authService.sendLoginOTP(loginEmail);
                setOtpSent(true);
                toast.success('OTP sent to your email');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            const msg = err.response?.data?.message || 'Action failed. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOTPVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (otp.length !== 6) {
            setError('Please enter the 6-digit OTP');
            return;
        }

        setIsLoading(true);
        try {
            await authService.loginWithOTP({
                email: loginEmail,
                otp: otp
            });
            toast.success('Successfully signed in!');
            if (onSuccess) onSuccess();
            else window.location.href = returnUrl;
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Invalid OTP. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError('');
        try {
            await authService.sendLoginOTP(loginEmail);
            setOtp('');
            toast.success('OTP resent successfully');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to resend OTP';
            setError(msg);
            toast.error(msg);
        }
    };

    const inputClass =
        'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5722] focus:border-[#FF5722] outline-none transition-all text-sm text-[#1A2332] bg-white';

    const maskEmail = (emailStr: string) => {
        const [username, domain] = emailStr.split('@');
        if (!username || !domain) return emailStr;
        return `${username.slice(0, 2)}${'*'.repeat(Math.max(0, username.length - 2))}@${domain}`;
    };

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
                        {otpSent ? 'Verify your email to proceed' : 'Sign in to proceed with your booking'}
                    </p>
                </div>

                <div className="p-6 md:p-8">
                    {!otpSent && (
                        <>
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

                            {/* Login Method Tabs */}
                            <div className="flex gap-2 mb-6 bg-gray-50 p-1 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => { setLoginMethod('password'); setError(''); }}
                                    className={`flex-1 py-2 px-3 rounded-lg font-medium text-xs transition-all flex items-center justify-center gap-2 ${loginMethod === 'password' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                                >
                                    <Mail size={14} /> Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setLoginMethod('otp'); setError(''); }}
                                    className={`flex-1 py-2 px-3 rounded-lg font-medium text-xs transition-all flex items-center justify-center gap-2 ${loginMethod === 'otp' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                                >
                                    <Key size={14} /> One-Time OTP
                                </button>
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
                                
                                {loginMethod === 'password' && (
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
                                )}

                                {error && (
                                    <p className="text-red-500 text-xs font-medium px-1">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-sm tracking-wide flex items-center justify-center gap-2 ${loginMethod === 'otp' ? 'bg-[#1A2332] hover:bg-[#2C3E50] shadow-blue-100' : 'bg-[#FF5722] hover:bg-[#E64A19] shadow-orange-100'}`}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            {loginMethod === 'password' ? 'Signing in...' : 'Sending OTP...'}
                                        </>
                                    ) : (
                                        loginMethod === 'password' ? 'Sign In & Continue' : 'Send OTP code'
                                    )}
                                </button>
                            </form>
                        </>
                    )}

                    {otpSent && (
                        <form onSubmit={handleOTPVerify} className="space-y-6">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-[#1A2332] mb-4">
                                    <Mail size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-[#1A2332]">Check your email</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    We sent a 6-digit code to <span className="font-semibold text-gray-900">{maskEmail(loginEmail)}</span>
                                </p>
                            </div>

                            <OTPInput
                                value={otp}
                                onChange={setOtp}
                                autoFocus
                                error={!!error && otp.length === 6}
                            />

                            <div className="flex justify-center">
                                <CountdownTimer
                                    initialSeconds={60}
                                    onResend={handleResendOTP}
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-xs text-center font-medium">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading || otp.length !== 6}
                                className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify & Continue'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setOtpSent(false); setOtp(''); setError(''); }}
                                className="w-full text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
                            >
                                ← Use different email or password
                            </button>
                        </form>
                    )}

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
