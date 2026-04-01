'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
    initialSeconds: number;
    onComplete?: () => void;
    onResend?: () => void;
    autoStart?: boolean;
}

export default function CountdownTimer({
    initialSeconds,
    onComplete,
    onResend,
    autoStart = true,
}: CountdownTimerProps) {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isActive, setIsActive] = useState(autoStart);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => {
                    if (prevSeconds <= 1) {
                        setIsActive(false);
                        onComplete?.();
                        return 0;
                    }
                    return prevSeconds - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, seconds, onComplete]);

    const handleResend = () => {
        setSeconds(initialSeconds);
        setIsActive(true);
        onResend?.();
    };

    const formatTime = (totalSeconds: number): string => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((initialSeconds - seconds) / initialSeconds) * 100;

    if (seconds === 0) {
        return (
            <button
                onClick={handleResend}
                className="text-saffron hover:text-saffron-dark font-semibold transition-colors duration-200 flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Resend OTP
            </button>
        );
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">{formatTime(seconds)}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-xs h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-saffron to-purple transition-all duration-1000 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <p className="text-xs text-gray-500">Resend available in {formatTime(seconds)}</p>
        </div>
    );
}
