'use client';

import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';

interface AccordionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    variant?: 'default' | 'plus';
}

const Accordion: React.FC<AccordionProps> = ({ title, children, defaultOpen = false, variant = 'plus' }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-gray-100 rounded-xl overflow-hidden mb-3 shadow-sm transition-all hover:shadow-md">
            <button
                className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors ${
                    isOpen ? 'bg-blue-50/50' : 'bg-gray-50/30'
                }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`font-bold text-sm tracking-wide uppercase ${isOpen ? 'text-deepBlue' : 'text-gray-600'}`}>
                    {title}
                </span>
                <div className={`${isOpen ? 'rotate-180' : ''} transition-transform duration-300`}>
                    {variant === 'plus' ? (
                        isOpen ? (
                            <Minus className="w-5 h-5 text-deepBlue" />
                        ) : (
                            <Plus className="w-5 h-5 text-deepBlue" />
                        )
                    ) : (
                        <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-deepBlue' : 'text-gray-400'}`} />
                    )}
                </div>
            </button>
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-6 py-5 bg-white prose prose-sm max-w-none text-gray-700 leading-relaxed border-t border-gray-100">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Accordion;
