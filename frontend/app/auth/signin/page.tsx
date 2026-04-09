
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import OTPInput from '@/components/auth/OTPInput';
import CountdownTimer from '@/components/auth/CountdownTimer';
import Slideshow from '@/components/auth/Slideshow';

import { Suspense } from 'react';
import Preloader from '@/components/shared/Preloader';

type LoginMethod = 'password' | 'otp';

function SignInContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');
    const [loginMethod, setLoginMethod] = useState<LoginMethod>('password');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.replace(callbackUrl || '/dashboard');
        }
    }, [router, callbackUrl]);

    const handlePasswordLogin = async () => {
        try {
            const response = await authService.login({ email, password });
            if (response.isFirstLogin) {
                toast.success('Unlock tailored journeys designed around you');
            } else {
                toast.success('You’re one step closer to your next dream destination.');
            }
            router.push(callbackUrl || '/dashboard');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            setError(msg);
            toast.error(msg);
        }
    };

    const handleSendOTP = async () => {
        try {
            await authService.sendLoginOTP(email);
            setOtpSent(true);
            toast.success('OTP sent successfully');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to send OTP. Please try again.';
            setError(msg);
            toast.error(msg);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (loginMethod === 'password') {
                await handlePasswordLogin();
            } else {
                await handleSendOTP();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOTPLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (otp.length !== 6) {
            setError('Please enter the 6-digit OTP');
            return;
        }

        setLoading(true);

        try {
            const response = await authService.loginWithOTP({
                email,
                otp,
            });
            if (response.isFirstLogin) {
                toast.success('Unlock tailored journeys designed around you');
            } else {
                toast.success('You’re one step closer to your next dream destination.');
            }
            router.push(callbackUrl || '/dashboard');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError('');
        try {
            await authService.sendLoginOTP(email);
            setOtp('');
            toast.success('OTP resent successfully');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to resend OTP. Please try again.';
            setError(msg);
            toast.error(msg);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    };

    const maskEmail = (emailStr: string) => {
        const [username, domain] = emailStr.split('@');
        if (!username || !domain) return emailStr;
        return `${username.slice(0, 2)}${'*'.repeat(Math.max(0, username.length - 2))}@${domain}`;
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 pt-32 lg:pt-40 overflow-y-auto">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Welcome back</h1>
                        <p className="text-gray-600">Please enter your details to sign in.</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {!otpSent ? (
                        <>
                            {/* Login Method Tab */}
                            <div className="flex gap-2 mb-8 bg-gray-50 p-1 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setLoginMethod('password');
                                        setError('');
                                    }}
                                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${loginMethod === 'password'
                                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Email & Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setLoginMethod('otp');
                                        setError('');
                                    }}
                                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${loginMethod === 'otp'
                                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    One-Time Password
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-colors"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                {loginMethod === 'password' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-colors"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center cursor-pointer">
                                                <input type="checkbox" className="rounded border-gray-300 text-saffron focus:ring-saffron" />
                                                <span className="ml-2 text-sm text-gray-600">Remember for 30 days</span>
                                            </label>
                                            <Link href="/auth/forgot-password" className="text-sm font-medium text-saffron hover:text-saffron-dark">
                                                Forgot password?
                                            </Link>
                                        </div>
                                    </>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 px-4 text-white font-semibold rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${loginMethod === 'password' ? 'bg-saffron hover:bg-saffron-dark shadow-saffron/20' : 'bg-purple hover:bg-purple-dark shadow-purple/20'}`}
                                >
                                    {loading ? (loginMethod === 'password' ? 'Signing in...' : 'Sending OTP...') : (loginMethod === 'password' ? 'Sign In' : 'Send OTP')}
                                </button>
                            </form>
                        </>
                    ) : (
                        /* OTP Verification View - Replaces form content */
                        <form onSubmit={handleOTPLogin} className="space-y-6">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple/10 text-purple mb-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Check your email</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    We sent a code to <span className="font-medium text-gray-900">{maskEmail(email)}</span>
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

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="w-full py-3 px-4 bg-purple hover:bg-purple-dark text-white font-semibold rounded-lg shadow-lg shadow-purple/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Verifying...' : 'Verify & Sign In'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setOtpSent(false)}
                                className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium"
                            >
                                Update email address
                            </button>
                        </form>
                    )}

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign in with Google
                    </button>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/auth/signup" className="font-semibold text-saffron hover:text-saffron-dark">
                            Sign up for free
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

export default function SignInPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <SignInContent />
        </Suspense>
    );
}

