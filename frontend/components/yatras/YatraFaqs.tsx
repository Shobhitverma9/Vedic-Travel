'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface YatraFaqsProps {
    faqs: { question: string; answer: string }[];
}

export default function YatraFaqs({ faqs }: YatraFaqsProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    if (!faqs || faqs.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">FAQs</h2>
                    <p className="text-gray-500 font-medium">Everything you need to know about the Yatra</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-lg font-bold text-gray-800">{faq.question}</span>
                                {activeIndex === index ? (
                                    <Minus className="w-5 h-5 text-saffron" />
                                ) : (
                                    <Plus className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                            {activeIndex === index && (
                                <div 
                                    className="px-6 pb-6 text-gray-600 leading-relaxed font-medium"
                                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
