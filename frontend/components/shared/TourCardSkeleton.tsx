'use client';

export default function TourCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full animate-pulse">
            {/* Image Area Skeleton */}
            <div className="h-40 bg-gray-200"></div>

            {/* Content Skeleton */}
            <div className="p-4 flex flex-col flex-grow text-left">
                {/* Title Skeleton */}
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>

                {/* Route Skeleton */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-gray-100"></div>
                    <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                </div>

                {/* Highlights Skeleton */}
                <div className="space-y-2 mb-6">
                    <div className="h-2.5 bg-gray-50 rounded w-full"></div>
                    <div className="h-2.5 bg-gray-50 rounded w-5/6"></div>
                    <div className="h-2.5 bg-gray-50 rounded w-4/5"></div>
                </div>

                {/* Footer Skeleton */}
                <div className="mt-auto flex items-end justify-between pt-3 border-t border-gray-100/50">
                    <div>
                        <div className="h-2 bg-gray-100 rounded w-12 mb-1.5"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                        <div className="h-3 bg-green-50 rounded w-24 mt-2"></div>
                    </div>

                    <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-100"></div>
                        <div className="w-24 h-8 rounded-lg bg-gray-200"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
