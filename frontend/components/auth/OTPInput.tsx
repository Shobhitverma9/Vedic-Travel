'use client';

import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from 'react';

interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    autoFocus?: boolean;
    error?: boolean;
}

export default function OTPInput({
    length = 6,
    value,
    onChange,
    disabled = false,
    autoFocus = false,
    error = false,
}: OTPInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [otp, setOtp] = useState<string[]>(Array(length).fill(''));

    // Initialize from value prop
    useEffect(() => {
        const otpArray = value.split('').slice(0, length);
        while (otpArray.length < length) {
            otpArray.push('');
        }
        setOtp(otpArray);
    }, [value, length]);

    // Auto-focus first input
    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    const handleChange = (index: number, newValue: string) => {
        // Only allow digits
        if (newValue && !/^\d$/.test(newValue)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = newValue;
        setOtp(newOtp);
        onChange(newOtp.join(''));

        // Auto-focus next input
        if (newValue && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                // If current input is empty, move to previous and clear it
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
                onChange(newOtp.join(''));
                inputRefs.current[index - 1]?.focus();
            } else if (otp[index]) {
                // Clear current input
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
                onChange(newOtp.join(''));
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim();

        // Only allow digits
        const digits = pastedData.replace(/\D/g, '').slice(0, length);

        if (digits) {
            const newOtp = digits.split('');
            while (newOtp.length < length) {
                newOtp.push('');
            }
            setOtp(newOtp);
            onChange(digits);

            // Focus the last filled input or the first empty one
            const focusIndex = Math.min(digits.length, length - 1);
            inputRefs.current[focusIndex]?.focus();
        }
    };

    const handleFocus = (index: number) => {
        // Select the content when focused
        inputRefs.current[index]?.select();
    };

    return (
        <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    onFocus={() => handleFocus(index)}
                    disabled={disabled}
                    className={`
                        w-12 h-14 text-center text-2xl font-bold
                        border-2 rounded-lg
                        transition-all duration-200
                        focus:outline-none focus:ring-2
                        ${error
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:border-saffron focus:ring-saffron/20'
                        }
                        ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                        ${digit ? 'border-saffron' : ''}
                    `}
                    aria-label={`OTP digit ${index + 1}`}
                />
            ))}
        </div>
    );
}
