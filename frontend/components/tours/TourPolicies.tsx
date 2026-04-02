'use client';

import React, { useState } from 'react';
import Accordion from '../ui/Accordion';

interface TourPoliciesProps {
    paymentTerms?: string;
    cancellationPolicy?: string;
    termsAndConditions?: string;
}

const TourPolicies: React.FC<TourPoliciesProps> = ({ paymentTerms, cancellationPolicy, termsAndConditions }) => {
    const [activeTab, setActiveTab] = useState<'payment' | 'cancellation' | 'terms'>('payment');

    const parseSections = (text: string | undefined, defaultTitle: string) => {
        if (!text) return [];

        // Split by double newlines or single newlines followed by a bold header or all-caps line
        // This is a heuristic parser for tour policy text
        const lines = text.split(/\r?\n/);
        const sections: { title: string; content: string[] }[] = [];
        let currentSection: { title: string; content: string[] } | null = null;

        const isHeader = (line: string) => {
            const trimmed = line.trim();
            if (!trimmed) return false;
            // Matches **Header**, <b>Header</b>, Header:, or ALL CAPS (at least 3 chars)
            return (
                (trimmed.startsWith('**') && trimmed.endsWith('**')) ||
                (trimmed.startsWith('<b>') && trimmed.endsWith('</b>')) ||
                (trimmed.endsWith(':') && trimmed.length < 60) ||
                (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && !/^\d+$/.test(trimmed)) ||
                (/^\d+\.\s/.test(trimmed) && trimmed.length < 60)
            );
        };

        lines.forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed) return;

            if (isHeader(trimmed)) {
                // Remove formatting markers for the title
                const title = trimmed.replace(/\*\*/g, '').replace(/<\/?b>/g, '').replace(/:$/, '');
                currentSection = { title, content: [] };
                sections.push(currentSection);
            } else {
                if (!currentSection) {
                    currentSection = { title: defaultTitle, content: [] };
                    sections.push(currentSection);
                }
                currentSection.content.push(line);
            }
        });

        return sections.length > 0 ? sections : [{ title: defaultTitle, content: [text] }];
    };

    const tabs = [
        { id: 'payment', label: 'Payment terms' },
        { id: 'cancellation', label: 'Cancellation Policy' },
        { id: 'terms', label: 'Terms & Conditions' }
    ] as const;

    const renderContent = () => {
        let text = '';
        let defaultTitle = '';

        switch (activeTab) {
            case 'payment':
                text = paymentTerms || 'Payment details coming soon...';
                defaultTitle = 'PAYMENTS';
                break;
            case 'cancellation':
                text = cancellationPolicy || 'Cancellation policy details coming soon...';
                defaultTitle = 'CANCELLATIONS';
                break;
            case 'terms':
                text = termsAndConditions || 'Terms & Conditions coming soon...';
                defaultTitle = 'REGISTRATION';
                break;
        }

        const sections = parseSections(text, defaultTitle);

        return (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {sections.map((section, idx) => (
                    <Accordion key={idx} title={section.title} defaultOpen={idx === 0}>
                        <div 
                            className="whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: section.content.join('\n') }}
                        />
                    </Accordion>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden mb-8">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-100 bg-gray-50/50">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-4 px-2 text-xs md:text-sm font-bold uppercase tracking-wider transition-all relative ${
                            activeTab === tab.id
                                ? 'text-blue-600 bg-white shadow-[0_-2px_0_inset_currentColor]'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                        }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 animate-in fade-in grow" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Body */}
            <div className="p-4 md:p-6 bg-white min-h-[300px]">
                {renderContent()}
            </div>
        </div>
    );
};

export default TourPolicies;
