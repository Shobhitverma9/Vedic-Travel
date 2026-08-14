import apiClient from '../lib/api-client';

export const analyticsService = {
    getDashboardStats: async () => {
        const response = await apiClient.get('/admin/dashboard');
        return response.data;
    },
    getMonthlyAnalytics: async () => {
        const response = await apiClient.get('/admin/analytics/monthly');
        return response.data;
    }
};
