import apiClient from '../lib/api-client';

export const paymentsService = {
    initiatePayment: async (bookingId: string, amount?: number) => {
        const response = await apiClient.post('/payments/initiate', { bookingId, amount });
        return response.data;
    },

    verifyPayment: async (paymentData: any) => {
        const response = await apiClient.post('/payments/verify', paymentData);
        return response.data;
    },

    getEmiOptions: async (amount: number) => {
        const response = await apiClient.post('/payments/emi-options', { amount });
        return response.data;
    },
};
