'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { Suspense } from 'react';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            toast.success('Successfully logged in with Google!');

            // Check if there was a return URL, otherwise go to cart
            const returnUrl = localStorage.getItem('auth_return_url') || '/cart';
            localStorage.removeItem('auth_return_url');

            router.push(returnUrl);
        } else {
            toast.error('Failed to log in with Google');
            router.push('/auth/signin');
        }
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-purple-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5722] mx-auto mb-4"></div>
                <h1 className="text-xl font-semibold text-gray-900">Verifying your login...</h1>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5722] mx-auto mb-4"></div>
                    <h1 className="text-xl font-semibold text-gray-900">Loading...</h1>
                </div>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
