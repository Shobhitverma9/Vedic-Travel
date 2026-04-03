'use client';

import MarqueeSettings from '@/components/admin/MarqueeSettings';
import GlobalOthersChoosingSettings from '@/components/admin/GlobalOthersChoosingSettings';

export default function SettingsPage() {
    return (
        <div className="space-y-10">
            <h1 className="text-3xl font-display font-bold text-gray-800 mb-6 border-b pb-4">Site Settings</h1>
            
            <section className="space-y-4">
                <MarqueeSettings />
            </section>

            <section className="space-y-4">
                <GlobalOthersChoosingSettings />
            </section>
        </div>
    );
}
