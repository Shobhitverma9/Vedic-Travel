import apiClient from '../lib/api-client';

export interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string; // HTML content
    image: string;
    author: string;
    tags: string[];
    isActive: boolean;
    publishedDate: string;
    createdAt: string;
    updatedAt: string;
}

export const blogsService = {
    getAll: async (params?: { limit?: number }) => {
        const response = await apiClient.get('/blogs', { params });
        return response.data;
    },

    getAllAdmin: async () => {
        const response = await apiClient.get('/blogs/admin');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/blogs/${id}`);
        return response.data;
    },

    getBySlug: async (slug: string) => {
        const response = await apiClient.get(`/blogs/slug/${slug}`);
        return response.data;
    },

    create: async (data: any) => {
        const response = await apiClient.post('/blogs', data);
        return response.data;
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.patch(`/blogs/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/blogs/${id}`);
        return response.data;
    },
};
