'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { settingsService } from '@/services/settings.service';

export default function Marquee() {
    const [config, setConfig] = useState({ enabled: false, text: '', link: '' });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const data = await settingsService.getSetting('marquee_config');
                if (data && data.value) {
                    setConfig(data.value);
                }
            } catch (error) {
                // Silently fail if not configured
            }
        };
        fetchConfig();
    }, []);

    if (!config.enabled || !config.text) return null;

    const content = (
        <div className="whitespace-nowrap inline-block animate-[marquee_20s_linear_infinite] px-4">
            <span className="mx-4">{config.text}</span>
            <span className="mx-4 text-saffron">•</span>
            <span className="mx-4">{config.text}</span>
            <span className="mx-4 text-saffron">•</span>
            <span className="mx-4">{config.text}</span>
            <span className="mx-4 text-saffron">•</span>
            <span className="mx-4">{config.text}</span>
            <span className="mx-4 text-saffron">•</span>
        </div>
    );

    return (
        <div className="bg-deepBlue-light text-white overflow-hidden py-1.5 relative z-50 shadow-sm text-sm font-medium tracking-wide">
            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
            <div className="flex w-fit">
                {config.link ? (
                    <Link href={config.link} className="hover:text-saffron transition-colors flex">
                        {content} {content}
                    </Link>
                ) : (
                    <div className="flex">
                        {content} {content}
                    </div>
                )}
            </div>
        </div>
    );
}
