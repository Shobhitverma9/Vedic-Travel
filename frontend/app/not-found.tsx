'use client';

import Link from 'next/link';
import { useTours } from '@/hooks/useTours';
import TourCard from '@/components/shared/TourCard';

export default function NotFound() {
  const { data: trendingToursData, isLoading } = useTours({ 
    isTrending: true, 
    isActive: true, 
    limit: 3, // Reduced to 3 to keep it compact
    sortBy: 'trendingRank', 
    order: 'asc' 
  });
  
  const trendingTours = trendingToursData?.tours || [];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-6 py-12">
      <div className="max-w-6xl w-full text-center">
        {/* Compact Header */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-100 mb-2 leading-none">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-deepBlue mb-4">
            You may have <span className="text-saffron italic">lost the way</span>
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto mb-6">
            Meanwhile, you can explore our other popular destinations.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-deepBlue text-white font-bold rounded-xl hover:bg-deepBlue-dark transition-all text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Compact Trending Cards */}
        <div className="w-full">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-px bg-gray-200 w-12"></div>
            <h3 className="text-lg font-bold text-deepBlue uppercase tracking-widest">Trending Now</h3>
            <div className="h-px bg-gray-200 w-12"></div>
          </div>

          {isLoading ? (
            <div className="flex justify-center gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-[300px] h-64 bg-gray-50 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : trendingTours.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingTours.map((tour: any) => (
                <div key={tour._id} className="transform hover:-translate-y-1 transition-transform">
                  <TourCard tour={tour} isTrending={true} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 italic">
              Explore our full catalog of spiritual journeys.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
