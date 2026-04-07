import apiClient from '../lib/api-client';

export const inquiriesService = {
    async createInquiry(data: {
        name: string;
        email: string;
        mobile: string;
        adults?: number;
        children?: number;
        infants?: number;
        message?: string;
        tourId?: string;
        tourName?: string;
        yatraId?: string;
        yatraName?: string;
        destination?: string;
        recaptchaToken?: string;
    }) {
        const response = await apiClient.post('/inquiries', data);
        return response.data;
    },

    async getAllInquiries() {
        const response = await apiClient.get('/inquiries');
        return response.data;
    }
};
