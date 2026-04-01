import React from 'react';

const steps = [
    { number: 1, text: 'Choose a trip' },
    { number: 2, text: 'Book It Online' },
    { number: 3, text: 'Enjoy' },
];

export default function ProcessSteps() {
    return (
        <section className="py-8 bg-cream border-b border-gray-200">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                    {steps.map((step) => (
                        <div key={step.number} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border border-saffron flex items-center justify-center text-saffron text-sm font-medium">
                                {step.number}
                            </div>
                            <span className="font-sans text-lg text-deepBlue">{step.text}</span>
                        </div>
                    ))}
                </div>

                <button className="bg-deepBlue hover:bg-deepBlue/90 text-white px-6 py-3 rounded text-sm font-medium flex items-center transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    Watch How It Works!
                </button>
            </div>
        </section>
    );
}
