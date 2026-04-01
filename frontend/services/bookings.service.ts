import apiClient from '../lib/api-client';

export const bookingsService = {
    createBooking: async (data: any) => {
        const response = await apiClient.post('/bookings', data);
        return response.data;
    },

    createFromCheckout: async (data: any) => {
        const response = await apiClient.post('/bookings/checkout', data);
        return response.data;
    },

    createGuestBooking: async (data: any) => {
        const response = await apiClient.post('/bookings/guest-checkout', data);
        return response.data;
    },

    getUserBookings: async (params?: any) => {
        const response = await apiClient.get('/bookings', { params });
        return response.data;
    },

    getBookingById: async (id: string) => {
        const response = await apiClient.get(`/bookings/${id}`);
        return response.data;
    },

    cancelBooking: async (id: string, reason: string) => {
        const response = await apiClient.put(`/bookings/${id}/cancel`, { reason });
        return response.data;
    },

    getAllBookings: async (params?: any) => {
        const response = await apiClient.get('/bookings/admin/all', { params });
        return response.data;
    },
};

