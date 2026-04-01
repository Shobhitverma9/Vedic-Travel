import api from '../lib/api-client';

export const instagramService = {
    getAllPosts: async (query: any = {}) => {
        const response = await api.get('/instagram', { params: query });
        return response.data;
    },

    getPostById: async (id: string) => {
        const response = await api.get(`/instagram/${id}`);
        return response.data;
    },

    createPost: async (data: any) => {
        const response = await api.post('/instagram', data);
        return response.data;
    },

    updatePost: async (id: string, data: any) => {
        const response = await api.put(`/instagram/${id}`, data);
        return response.data;
    },

    deletePost: async (id: string) => {
        const response = await api.delete(`/instagram/${id}`);
        return response.data;
    },
};
