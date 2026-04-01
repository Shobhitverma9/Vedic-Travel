import apiClient from '../lib/api-client';

export interface WishlistItem {
    _id: string;
    title: string;
    slug: string;
    description: string;
    images: string[];
    price: number;
    duration: number;
    locations: string[];
}

export const wishlistService = {
    addToWishlist: async (tourId: string) => {
        const response = await apiClient.post(`/users/wishlist/add/${tourId}`);
        return response.data;
    },

    removeFromWishlist: async (tourId: string) => {
        const response = await apiClient.delete(`/users/wishlist/${tourId}`);
        return response.data;
    },

    getWishlist: async () => {
        const response = await apiClient.get('/users/wishlist');
        return response.data;
    },

    toggleWishlist: async (tourId: string) => {
        const response = await apiClient.post(`/users/wishlist/${tourId}`);
        return response.data;
    },
};
