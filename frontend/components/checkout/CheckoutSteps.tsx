'use client';

import { Check } from 'lucide-react';

interface CheckoutStepsProps {
    currentStep: number;
}

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
    const steps = [
        { number: 1, title: 'Review Booking' },
        { number: 2, title: 'Sign In' },
        { number: 3, title: 'Traveller Details' },
        { number: 4, title: 'Payment' },
    ];

    return (
        <div className="w-full bg-[#1A2332] border-b border-white/10 py-5 sticky top-0 z-40 shadow-lg">
            <div className="container mx-auto max-w-5xl px-4">
                {/* Step Label on top for mobile */}
                <p className="text-center text-xs text-white/50 mb-3 tracking-widest uppercase font-medium">
                    Step {currentStep} of {steps.length}
                </p>

                <div className="relative flex items-center justify-between w-full">
                    {/* Background Line */}
                    <div className="absolute left-0 top-4 w-full h-0.5 bg-white/10" />

                    {/* Active Line Progress */}
                    <div
                        className="absolute left-0 top-4 h-0.5 bg-gradient-to-r from-[#FF5722] to-[#D4AF37] transition-all duration-500"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />

                    {steps.map((step) => {
                        const isCompleted = currentStep > step.number;
                        const isActive = currentStep === step.number;

                        return (
                            <div key={step.number} className="flex flex-col items-center z-10 flex-1">
                                <div
                                    className={`
                                        w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                        transition-all duration-300 border-2
                                        ${isCompleted
                                            ? 'bg-[#FF5722] border-[#FF5722] text-white shadow-[0_0_12px_rgba(255,87,34,0.5)]'
                                            : isActive
                                                ? 'bg-[#1A2332] border-[#FF5722] text-[#FF5722] shadow-[0_0_12px_rgba(255,87,34,0.3)]'
                                                : 'bg-[#1A2332] border-white/20 text-white/30'
                                        }
                                    `}
                                >
                                    {isCompleted ? <Check size={15} strokeWidth={2.5} /> : step.number}
                                </div>
                                <span
                                    className={`
                                        text-[10px] mt-2 font-semibold tracking-wide text-center whitespace-nowrap
                                        ${isCompleted || isActive ? 'text-white' : 'text-white/30'}
                                    `}
                                >
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
