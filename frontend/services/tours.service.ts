import apiClient from '../lib/api-client';

export interface Tour {
    _id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    priceOriginal?: number;
    duration: number;
    maxGroupSize: number;
    category: string;
    destination?: string;
    packageType: string;
    images: string[];
    slideshowImages?: string[];
    locations: string[];
    placesHighlights?: any[];
    placesToVisit?: string;
    packageIncludes?: string[];
    hotels?: any[];
    itinerary?: any[];
    inclusions?: string[];
    exclusions?: string[];
    dos?: string[];
    donts?: string[];
    thingsToCarry?: string[];
    cancellationPolicy?: string;
    useDefaultCancellationPolicy?: boolean;
    termsAndConditions?: string;
    paymentTerms?: string;
    isActive: boolean;
    isFavorite?: boolean;
    favoriteSize?: string;
    isTrending?: boolean;
    trendingRank?: number;
    badge?: string;
    emiStartingFrom?: number;
    highlights?: {
        temples: string[];
        experiences: string[];
        spiritual: string[];
    };
    availableDates?: Date[];
    totalBookings?: number;
    rating?: number;
    reviewsCount?: number;
    departureCities?: {
        city: string;
        surcharge: number;
        isDefault: boolean;
        availabilityType: string;
        availableDates: Date[];
        weeklyDays: number[];
        blackoutDates: Date[];
    }[];
    advancePayment?: {
        amount: number;
        paymentType: string;
    };
    seo?: {
        title?: string;
        description?: string;
        keywords?: string;
    };
}

export const toursService = {
    getAllTours: async (params?: any) => {
        const response = await apiClient.get('/tours', { params });
        return response.data;
    },

    getTourById: async (id: string): Promise<Tour> => {
        const response = await apiClient.get(`/tours/${id}`);
        return response.data;
    },

    getTourBySlug: async (slug: string): Promise<Tour> => {
        const response = await apiClient.get(`/tours/slug/${slug}`);
        return response.data;
    },

    createTour: async (data: any) => {
        const response = await apiClient.post('/tours', data);
        return response.data;
    },

    updateTour: async (id: string, data: any) => {
        const response = await apiClient.put(`/tours/${id}`, data);
        return response.data;
    },

    deleteTour: async (id: string) => {
        const response = await apiClient.delete(`/tours/${id}`);
        return response.data;
    },
};
