'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService, type SendOTPData, type VerifyOTPData } from '@/services/auth.service';
import { toast } from 'sonner';
import OTPInput from '@/components/auth/OTPInput';
import CountdownTimer from '@/components/auth/CountdownTimer';
import Slideshow from '@/components/auth/Slideshow';

type Step = 'details' | 'verify';

export default function SignUpPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('details');
    const [formData, setFormData] = useState<SendOTPData>({
        name: '',
        email: '',
        password: '',
        phone: '',
    });
    const [otpData, setOtpData] = useState({
        emailOtp: '',
        phoneOtp: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    // Redirect to dashboard if already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.replace('/dashboard');
        }
    }, [router]);

    const handleDetailsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.sendRegistrationOTP(formData);
            setOtpSent(true);
            setStep('verify');
            toast.success('OTP sent successfully');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to send OTP. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const isEmailOtpValid = otpData.emailOtp.length === 6;
        const isPhoneOtpValid = formData.phone && otpData.phoneOtp.length === 6;

        if (!isEmailOtpValid && !isPhoneOtpValid) {
            setError('Please enter either the 6-digit email OTP or phone OTP');
            return;
        }

        setLoading(true);

        try {
            const verifyData: VerifyOTPData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                // Only send OTPs if they are valid 6-digit codes
                ...(isEmailOtpValid && { emailOtp: otpData.emailOtp }),
                ...(isPhoneOtpValid && {
                    phone: formData.phone,
                    phoneOtp: otpData.phoneOtp,
                }),
            };

            await authService.verifyOTP(verifyData);
            toast.success('Account created successfully');
            router.push('/dashboard');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Verification failed. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError('');
        try {
            await authService.resendOTP({
                email: formData.email,
                phone: formData.phone,
                name: formData.name,
                purpose: 'registration',
            });
            setOtpData({ emailOtp: '', phoneOtp: '' }); // Clear OTPs
            toast.success('OTP resent successfully');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to resend OTP. Please try again.';
            setError(msg);
            toast.error(msg);
        }
    };

    const handleGoogleSignup = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    };

    const maskEmail = (email: string) => {
        const [username, domain] = email.split('@');
        return `${username.slice(0, 2)}${'*'.repeat(username.length - 2)}@${domain}`;
    };

    const maskPhone = (phone: string) => {
        return `${phone.slice(0, 3)}${'*'.repeat(phone.length - 6)}${phone.slice(-3)}`;
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 pt-32 lg:pt-40 overflow-y-auto">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                            {step === 'details' ? 'Create an account' : 'Verify your account'}
                        </h1>
                        <p className="text-gray-600">
                            {step === 'details'
                                ? 'Start your spiritual journey today.'
                                : 'We sent a verification code to your email.'}
                        </p>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${step === 'details' ? 'bg-saffron text-white' : 'bg-green-500 text-white'
                            }`}>
                            {step === 'verify' ? '✓' : '1'}
                        </div>
                        <div className={`h-1 flex-1 rounded-full transition-colors ${step === 'verify' ? 'bg-saffron' : 'bg-gray-100'
                            }`} />
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${step === 'verify' ? 'bg-saffron text-white' : 'bg-gray-100 text-gray-400'
                            }`}>
                            2
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {step === 'details' ? (
                        <form onSubmit={handleDetailsSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-colors"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-colors"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Phone Number (Optional)
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-colors"
                                        placeholder="+91 9876543210"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-colors"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-saffron hover:bg-saffron-dark text-white font-semibold rounded-lg shadow-lg shadow-saffron/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending OTP...' : 'Continue'}
                            </button>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleSignup}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Sign up with Google
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifySubmit} className="space-y-6">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-saffron/10 text-saffron mb-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Verify your identity</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    We sent a code to <span className="font-medium text-gray-900">{maskEmail(formData.email)}</span>
                                </p>
                            </div>

                            {/* At-least-one hint */}
                            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm text-center">
                                ✓ Verify using <strong>email</strong>{formData.phone ? <> or <strong>phone</strong></> : ''} — at least one is required
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                                    Email OTP
                                </label>
                                <p className="text-xs text-gray-400 text-center mb-3">Enter the code sent to your email</p>
                                <OTPInput
                                    value={otpData.emailOtp}
                                    onChange={(value) => setOtpData({ ...otpData, emailOtp: value })}
                                    autoFocus
                                    error={!!error && otpData.emailOtp.length === 6}
                                />
                            </div>

                            {/* Phone OTP (if provided) */}
                            {formData.phone && (
                                <div className="pt-4 border-t border-gray-100">
                                    <div className="text-center mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone OTP
                                        </label>
                                        <p className="text-xs text-gray-400 mb-2">Enter the code sent to <span className="font-medium text-gray-700">{maskPhone(formData.phone)}</span></p>
                                    </div>
                                    <OTPInput
                                        value={otpData.phoneOtp}
                                        onChange={(value) => setOtpData({ ...otpData, phoneOtp: value })}
                                        error={!!error && otpData.phoneOtp.length === 6}
                                    />
                                </div>
                            )}

                            {/* Countdown Timer */}
                            <div className="flex justify-center py-2">
                                <CountdownTimer
                                    initialSeconds={60}
                                    onResend={handleResendOTP}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep('details')}
                                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={loading}
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || (otpData.emailOtp.length !== 6 && (!formData.phone || otpData.phoneOtp.length !== 6))}
                                    className="flex-1 py-3 px-4 bg-saffron hover:bg-saffron-dark text-white font-semibold rounded-lg shadow-lg shadow-saffron/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/auth/signin" className="font-semibold text-saffron hover:text-saffron-dark">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Image/Slideshow */}
            <div className="hidden lg:block lg:w-1/2 relative bg-gray-900">
                <Slideshow />
            </div>
        </div>
    );
}
