import apiClient from '../lib/api-client';

export interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: any; // Editor.js JSON object (or legacy HTML string)
    image: string;        // legacy field
    featuredImage?: string; // new field
    author: string;
    tags: string[];
    category?: string;
    status?: 'draft' | 'published';
    isActive: boolean;
    publishedDate: string;
    publishedAt?: string;
    views?: number;
    likes?: number;
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

    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post<{ url: string }>('/blogs/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.url;
    },
};
