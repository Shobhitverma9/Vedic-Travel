'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { Suspense } from 'react';
import Preloader from '@/components/shared/Preloader';

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

    return <Preloader />;
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <AuthCallbackContent />
        </Suspense>
    );
}
