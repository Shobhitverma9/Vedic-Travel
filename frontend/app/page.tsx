import HeroSectionV1 from '@/components/home/HeroSectionV1';
import TrendingDestinations from '@/components/home/TrendingDestinations';
import AllTimeFavorites from '@/components/home/AllTimeFavorites';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import YatraSection from '@/components/home/YatraSection';
import TalkToExpert from '@/components/home/TalkToExpert';
import InstagramFeedSection from '@/components/home/InstagramFeedSection';
import BlogSection from '@/components/home/BlogSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import VedicImprintsSection from '@/components/home/VedicImprintsSection';
import { apiServer } from '@/lib/api-server';

export default async function HomePage() {
  // Fetch hero slider images
  const heroImagesData = await apiServer.getSetting('hero_slider_images');
  const initialHeroImages = heroImagesData?.value || null;

  // Fetch hero tours (for the animation cards)
  const heroToursData = await apiServer.getAllTours({ showInHero: true, isActive: true });
  const initialHeroTours = heroToursData?.tours || [];

  // Fetch trending tours
  const trendingToursData = await apiServer.getAllTours({ 
    isTrending: true, 
    isActive: true, 
    limit: 10, 
    sortBy: 'trendingRank', 
    order: 'asc' 
  });
  const initialTrendingTours = trendingToursData?.tours || [];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <HeroSectionV1 
        initialImages={initialHeroImages} 
        initialHeroTours={initialHeroTours} 
      />

      {/* Trending Destinations */}
      <TrendingDestinations initialTours={initialTrendingTours} />

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

