'use client';

import React, { useEffect, useState, use } from 'react';
import { yatrasService } from '@/services/yatras.service';
import YatraHero from '@/components/yatras/YatraHero';
import YatraPackages from '@/components/yatras/YatraPackages';
import YatraDetails from '@/components/yatras/YatraDetails';
import YatraFaqs from '@/components/yatras/YatraFaqs';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CustomEnquiryForm from '@/components/yatras/CustomEnquiryForm';
import Preloader from '@/components/shared/Preloader';

export default function YatraPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [yatra, setYatra] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchYatra = async () => {
            try {
                // Try fetching by slug first
                try {
                    const data = await yatrasService.getYatraBySlug(slug);
                    if (data) {
                        setYatra(data);
                        return;
                    }
                } catch (e) {
                    console.log('Slug fetch failed, trying ID...');
                }

                // If slug fetch fails and slug looks like an ID, try fetching by ID
                if (slug.match(/^[0-9a-fA-F]{24}$/)) {
                    const data = await yatrasService.getYatraById(slug);
                    setYatra(data);
                } else {
                    setYatra(null);
                }
            } catch (error) {
                console.error('Error fetching yatra:', error);
                setYatra(null);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchYatra();
    }, [slug]);

    if (loading) return <Preloader />;

    if (!yatra) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-3xl font-bold text-deepBlue mb-4">Yatra Not Found</h1>
            <p className="text-gray-600 mb-8">The yatra you are looking for might have been moved or doesn't exist.</p>
            <a href="/" className="bg-saffron text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all">
                Return to Home
            </a>
        </div>
    );

    return (
        <main>
            <YatraHero title={yatra.title} image={yatra.heroImage} thumbnailImages={yatra.thumbnailImages} />

            <YatraPackages packages={yatra.packages} title={yatra.title} />

            <YatraDetails title={yatra.title} description={yatra.longDescription} />

            <YatraFaqs faqs={yatra.faqs} />

            <div className="bg-white">
                <TestimonialsSection />
            </div>

            <CustomEnquiryForm yatraId={yatra._id} yatraName={yatra.title} />
        </main>
    );
}
