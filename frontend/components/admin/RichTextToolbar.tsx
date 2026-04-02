'use client';

import React, { useState, useEffect } from 'react';
import { Bold, Link as LinkIcon, Info } from 'lucide-react';

export default function RichTextToolbar() {
    const [activeElement, setActiveElement] = useState<HTMLTextAreaElement | HTMLInputElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleFocus = (e: FocusEvent) => {
            const target = e.target as HTMLElement;
            if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) {
                const input = target as HTMLTextAreaElement | HTMLInputElement;
                if (input.type === 'text' || input.tagName === 'TEXTAREA') {
                    setActiveElement(input);
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            } else {
                setIsVisible(false);
            }
        };

        const handleBlur = (e: FocusEvent) => {
            // Delay hiding to allow clicking toolbar buttons
            setTimeout(() => {
                if (document.activeElement?.tagName !== 'TEXTAREA' && 
                    document.activeElement?.tagName !== 'INPUT' &&
                    !document.activeElement?.closest('.rich-text-toolbar')) {
                    setIsVisible(false);
                }
            }, 200);
        };

        document.addEventListener('focusin', handleFocus);
        document.addEventListener('focusout', handleBlur);

        return () => {
            document.removeEventListener('focusin', handleFocus);
            document.removeEventListener('focusout', handleBlur);
        };
    }, []);

    const applyStyle = (type: 'bold' | 'link') => {
        if (!activeElement) return;

        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;
        const value = activeElement.value;

        if (start === null || end === null) return;

        let transformedText = '';
        const selectedText = value.substring(start, end);

        if (type === 'bold') {
            transformedText = `<b>${selectedText}</b>`;
        } else if (type === 'link') {
            const url = prompt('Enter URL (e.g., https://google.com):');
            if (url === null) return; // Cancelled
            transformedText = `<a href="${url}" target="_blank" style="color: #FF5722; text-decoration: underline; font-weight: bold;">${selectedText || 'link'}</a>`;
        }

        const newValue = value.substring(0, start) + transformedText + value.substring(end);
        
        // Update the element value
        activeElement.value = newValue;
        
        // Trigger React state update by dispatching an input event
        const event = new Event('input', { bubbles: true });
        activeElement.dispatchEvent(event);

        // Refocus and set selection
        activeElement.focus();
        const newCursorPos = start + transformedText.length;
        activeElement.setSelectionRange(newCursorPos, newCursorPos);
    };

    if (!isVisible) return null;

    return (
        <div className="rich-text-toolbar fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-white border border-gray-200 shadow-2xl rounded-full px-6 py-3 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 border-r border-gray-100 pr-4 mr-2">
                <div className="bg-orange-50 p-1.5 rounded-lg text-orange-600">
                    <Info className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">formatting</span>
            </div>
            
            <button
                type="button"
                onClick={() => applyStyle('bold')}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors group flex flex-col items-center gap-0.5"
                title="Bold (Selection)"
            >
                <Bold className="w-5 h-5 text-gray-700 group-hover:text-black" />
                <span className="text-[8px] font-bold text-gray-400">BOLD</span>
            </button>

            <button
                type="button"
                onClick={() => applyStyle('link')}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors group flex flex-col items-center gap-0.5"
                title="Hyperlink (Selection)"
            >
                <LinkIcon className="w-5 h-5 text-gray-700 group-hover:text-black" />
                <span className="text-[8px] font-bold text-gray-400">LINK</span>
            </button>
            
            <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>
            
            <div className="text-[9px] text-gray-400 max-w-[120px] leading-tight font-medium">
                Select text in any field to apply styling
            </div>
        </div>
    );
}
