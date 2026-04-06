"use client";

import React from 'react';

interface GridBlockProps {
    data: {
        url?: string;
        text?: string;
        alignment?: 'left' | 'right';
        button?: {
            text?: string;
            url?: string;
        };
    };
}

export default function GridBlock({ data }: GridBlockProps) {
    const { url, text, alignment = 'left', button } = data;

    if (!url && !text) return null;

    const isRight = alignment === 'right';

    return (
        <div className="grid-block flow-root my-8">
            {/* Image Container with Float */}
            {url && (
                <div 
                    className={`
                        w-full md:w-1/2 
                        ${isRight ? 'md:float-right md:ml-6' : 'md:float-left md:mr-6'} 
                        mb-4 md:mb-2
                    `}
                >
                    <div className="aspect-video w-full relative rounded-xl overflow-hidden shadow-md">
                        <img 
                            src={url} 
                            alt="Section image" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Text Content */}
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {text && <div dangerouslySetInnerHTML={{ __html: text }} />}
                
                {button && button.text && button.url && (
                    <div className="mt-4 block clear-both">
                        <a 
                            href={button.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-6 py-2 bg-saffron text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            {button.text}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
