"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const CarouselBlock = dynamic(() => import('./carousel-block'), {
    loading: () => <div className="animate-pulse h-64 bg-gray-200 rounded-xl my-8"></div>,
    ssr: false
});

export function renderBlock(block: any) {
    switch (block.type) {
        case 'header':
            const Tag = `h${block.data.level}` as React.ElementType;
            return <Tag className="font-bold my-4" style={{ fontSize: `${1.5 + (6 - block.data.level) * 0.2}rem` }} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
        case 'paragraph':
            return <p className="mb-4 text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.data.text }} />;
        case 'list':
            const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
            return (
                <ListTag className="list-inside mb-4 pl-4 space-y-1">
                    {block.data.items.map((item: any, i: number) => {
                        const content = typeof item === 'string' ? item : item.content || "";
                        return <li key={i} className={block.data.style === 'ordered' ? "list-decimal" : "list-disc"} dangerouslySetInnerHTML={{ __html: content }} />
                    })}
                </ListTag>
            );
        case 'image':
            return (
                <figure className="my-6">
                    <img
                        src={block.data.file.url}
                        alt={block.data.caption || 'Blog image'}
                        className="w-full rounded-lg shadow-md"
                    />
                    {block.data.caption && <figcaption className="text-center text-sm text-gray-500 mt-2">{block.data.caption}</figcaption>}
                </figure>
            );
        case 'quote':
            return (
                <blockquote className="border-l-4 border-saffron pl-4 my-6 italic text-gray-700 bg-gray-50 p-4 rounded-r-lg">
                    <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                    {block.data.caption && <footer className="text-sm font-semibold mt-2 not-italic">- {block.data.caption}</footer>}
                </blockquote>
            );
        case 'table':
            return (
                <div className="overflow-x-auto my-6">
                    <table className="w-full border-collapse border border-gray-300">
                        <tbody>
                            {block.data.content.map((row: string[], rowIndex: number) => (
                                <tr key={rowIndex}>
                                    {row.map((cell: string, cellIndex: number) => {
                                        const CellTag = block.data.withHeadings && rowIndex === 0 ? 'th' : 'td';
                                        return (
                                            <CellTag key={cellIndex} className="border border-gray-300 p-2" dangerouslySetInnerHTML={{ __html: cell }} />
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        case 'html':
            return <div className="prose prose-lg max-w-none my-4" dangerouslySetInnerHTML={{ __html: block.data.html }} />;
        case 'delimiter':
            return <hr className="my-8 border-t-2 border-gray-200" />;
        case 'carousel':
            return <CarouselBlock data={block.data} />;
        case 'button':
            return (
                <div className="my-6 flex justify-center">
                    <a
                        href={block.data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-saffron text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        {block.data.text}
                    </a>
                </div>
            );
        default:
            return null;
    }
}

export default function BlogContentRenderer({ data }: { data: any }) {
    // Handle legacy string content (old blogs stored as HTML)
    if (typeof data === 'string') {
        return (
            <div
                className="blog-content prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: data }}
            />
        );
    }

    if (!data || !data.blocks) return null;

    return (
        <div className="blog-content">
            {data.blocks.map((block: any, index: number) => (
                <div key={index}>{renderBlock(block)}</div>
            ))}
        </div>
    );
}
