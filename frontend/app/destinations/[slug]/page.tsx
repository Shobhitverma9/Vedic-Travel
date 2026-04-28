'use client';

import React, { useEffect, useState, use } from 'react';
import { notFound } from 'next/navigation';
import { toursService } from '@/services/tours.service';
import YatraHero from '@/components/yatras/YatraHero';
import YatraPackages from '@/components/yatras/YatraPackages';
import YatraDetails from '@/components/yatras/YatraDetails';
import YatraFaqs from '@/components/yatras/YatraFaqs';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CustomEnquiryForm from '@/components/yatras/CustomEnquiryForm';
import Preloader from '@/components/shared/Preloader';
import { destinationsData } from '@/data/destinations';

export default function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const destinationInfo = destinationsData[slug];

    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    if (!destinationInfo) {
        notFound();
    }

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                // Fetch tours where filtered by destination title (e.g., 'North India')
                const data = await toursService.getAllTours({ destination: destinationInfo.title });
                setPackages(data.tours || []);
            } catch (error) {
                console.error('Error fetching packages for destination:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, [destinationInfo.title]);

    return (
        <main>
            <YatraHero 
                title={destinationInfo.title} 
                image={destinationInfo.heroImage} 
                thumbnailImages={destinationInfo.thumbnailImages} 
            />

            {loading ? (
                <div className="py-20 min-h-[400px]">
                    <Preloader fullScreen={false} />
                </div>
            ) : (
                <YatraPackages packages={packages} title={destinationInfo.title} />
            )}

            <YatraDetails title={destinationInfo.title} description={destinationInfo.description} />

            <YatraFaqs faqs={destinationInfo.faqs} />

            <div className="bg-white">
                <TestimonialsSection />
            </div>

            {/* Reuse Enquiry Form - passing destination name as Yatra Name for context */}
            <CustomEnquiryForm yatraId={`dest-${slug}`} yatraName={`${destinationInfo.title} Page`} />
        </main>
    );
}
