'use client';

import ReCAPTCHA from 'react-google-recaptcha';
import { useRef, useEffect } from 'react';

interface ReCaptchaProps {
    onChange: (token: string | null) => void;
    theme?: 'light' | 'dark';
}

export default function ReCaptcha({ onChange, theme = 'light' }: ReCaptchaProps) {
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

    // If no site key is provided, show a warning in development
    useEffect(() => {
        if (!siteKey && process.env.NODE_ENV === 'development') {
            console.warn('Google reCAPTCHA Site Key is missing. Please add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to your .env.local file.');
        }
    }, [siteKey]);

    if (!siteKey) {
        return (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 text-sm">
                reCAPTCHA is currently unavailable (Missing Site Key).
            </div>
        );
    }

    return (
        <div className="flex justify-center my-4 overflow-hidden rounded-lg">
            <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={siteKey}
                onChange={onChange}
                theme={theme}
            />
        </div>
    );
}
