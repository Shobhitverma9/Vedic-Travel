'use client';

import MarqueeSettings from '@/components/admin/MarqueeSettings';

export default function SettingsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Site Settings</h1>
            <MarqueeSettings />
        </div>
    );
}
