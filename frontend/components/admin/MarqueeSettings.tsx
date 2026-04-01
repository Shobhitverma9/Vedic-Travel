'use client';

import { useState, useEffect } from 'react';
import { settingsService } from '@/services/settings.service';

export default function MarqueeSettings() {
    const [enabled, setEnabled] = useState(false);
    const [text, setText] = useState('');
    const [link, setLink] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await settingsService.getSetting('marquee_config');
            if (data && data.value) {
                setEnabled(data.value.enabled);
                setText(data.value.text);
                setLink(data.value.link || '');
            }
        } catch (error) {
            console.error('Error fetching marquee settings:', error);
            // If not found, we can assume defaults or it's first run
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            const config = { enabled, text, link };
            // Upsert on save to ensure it exists
            await settingsService.upsertSetting('marquee_config', config, 'Configuration for top marquee');
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage('Error saving settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading settings...</div>;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl font-semibold text-deepBlue mb-4">Top Marquee Notification</h2>

            <div className="space-y-4">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="marqueeEnabled"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                        className="h-4 w-4 text-saffron focus:ring-saffron border-gray-300 rounded"
                    />
                    <label htmlFor="marqueeEnabled" className="ml-2 block text-sm text-gray-900">
                        Enable Marquee
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notification Text</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="e.g. Special Offer: 50% Off on Chardham Yatra!"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-saffron focus:border-saffron"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                    <input
                        type="text"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="e.g. /tours/chardham-yatra"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-saffron focus:border-saffron"
                    />
                </div>

                <div className="pt-2">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-deepBlue text-white px-6 py-2 rounded-lg hover:bg-deepBlue-light transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    {message && (
                        <span className={`ml-4 text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                            {message}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
