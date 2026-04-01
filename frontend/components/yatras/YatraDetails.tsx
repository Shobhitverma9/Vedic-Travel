'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface YatraDetailsProps {
    title: string;
    description: string;
}

export default function YatraDetails({ title, description }: YatraDetailsProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!description) return null;

    return (
        <section className="py-16 bg-white border-y border-gray-100">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tight">
                    {title} Packages
                </h2>

                <div className={`relative overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[5000px]' : 'max-h-[200px]'}`}>
                    <div
                        className="text-gray-600 leading-relaxed text-lg prose max-w-none prose-orange"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                    {!isExpanded && (
                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
                    )}
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-6 inline-flex items-center text-red-500 font-black uppercase text-sm tracking-widest hover:text-red-600 transition-colors"
                >
                    {isExpanded ? (
                        <>Read Less <ChevronUp className="ml-1 w-4 h-4" /></>
                    ) : (
                        <>Read More <ChevronDown className="ml-1 w-4 h-4" /></>
                    )}
                </button>
            </div>
        </section>
    );
}
