'use client';

import HeroSectionV1 from '@/components/home/HeroSectionV1';
import TrendingDestinations from '@/components/home/TrendingDestinations';
// import HeroSectionV2 from '@/components/home/HeroSectionV2'; // Ready for swap
import AllTimeFavorites from '@/components/home/AllTimeFavorites';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import YatraSection from '@/components/home/YatraSection';

import TalkToExpert from '@/components/home/TalkToExpert';
import InstagramFeedSection from '@/components/home/InstagramFeedSection';
import BlogSection from '@/components/home/BlogSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import VedicImprintsSection from '@/components/home/VedicImprintsSection';
import SectionDivider from '@/components/ui/SectionDivider';

export default function HomePage() {

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      {/* Hero Section - Switch between V1 and V2 here */}
      <HeroSectionV1 />
      {/* <HeroSectionV2 /> */}

      {/* Trending Destinations */}
      <TrendingDestinations />

      {/* All Time Favorites */}
      <AllTimeFavorites />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Yatras Section - Only trending yatras */}
      <YatraSection />

      {/* Vedic Imprints (International) Section */}
      <VedicImprintsSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Talk To Expert Section */}
      <TalkToExpert />

      {/* Blog Section */}
      <BlogSection />

      {/* Instagram Feed Section */}
      <InstagramFeedSection />
    </div>
  );
}
