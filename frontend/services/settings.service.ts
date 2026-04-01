import apiClient from '../lib/api-client';

export const settingsService = {
    getSetting: async (key: string) => {
        const response = await apiClient.get(`/settings/${key}`);
        return response.data;
    },

    updateSetting: async (key: string, value: any) => {
        const response = await apiClient.put(`/settings/${key}`, { value });
        return response.data;
    },

    upsertSetting: async (key: string, value: any, description?: string) => {
        const response = await apiClient.post(`/settings/upsert/${key}`, { value, description });
        return response.data;
    }
};
