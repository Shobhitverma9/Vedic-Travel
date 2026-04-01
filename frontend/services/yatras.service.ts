import apiClient from '../lib/api-client';

export const yatrasService = {
    getAllYatras: async (params: any = {}) => {
        const response = await apiClient.get('/yatras', { params });
        return response.data;
    },

    getYatraById: async (id: string) => {
        const response = await apiClient.get(`/yatras/${id}`);
        return response.data;
    },

    createYatra: async (data: any) => {
        const response = await apiClient.post('/yatras', data);
        return response.data;
    },

    updateYatra: async (id: string, data: any) => {
        const response = await apiClient.put(`/yatras/${id}`, data);
        return response.data;
    },

    deleteYatra: async (id: string) => {
        const response = await apiClient.delete(`/yatras/${id}`);
        return response.data;
    },

    getYatraBySlug: async (slug: string) => {
        const response = await apiClient.get(`/yatras/slug/${slug}`);
        return response.data;
    }
};
