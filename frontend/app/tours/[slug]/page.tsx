'use client';

import React, { useEffect, useState, use } from 'react';
import { yatrasService } from '@/services/yatras.service';
import YatraHero from '@/components/yatras/YatraHero';
import YatraPackages from '@/components/yatras/YatraPackages';
import YatraDetails from '@/components/yatras/YatraDetails';
import YatraFaqs from '@/components/yatras/YatraFaqs';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CustomEnquiryForm from '@/components/yatras/CustomEnquiryForm';

export default function TourCollectionPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [yatra, setYatra] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchYatra = async () => {
            try {
                // Try fetching by slug - we use yatrasService because these collection pages 
                // represent a "Yatra" or "Tour Category" which we store in the Yatra model
                try {
                    const data = await yatrasService.getYatraBySlug(slug);
                    if (data) {
                        setYatra(data);
                        return;
                    }
                } catch (e) {
                    console.log('Slug fetch failed for tour category:', slug);
                }

                setYatra(null);
            } catch (error) {
                console.error('Error fetching tour category:', error);
                setYatra(null);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchYatra();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
        </div>
    );

    if (!yatra) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-24">
            <h1 className="text-3xl font-bold text-deepBlue mb-4">Tour Category Not Found</h1>
            <p className="text-gray-600 mb-8">The tour collection you are looking for might have been moved or doesn't exist.</p>
            <a href="/" className="bg-saffron text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all">
                Return to Home
            </a>
        </div>
    );

    return (
        <main>
            <YatraHero title={yatra.title} image={yatra.heroImage} />

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
