import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized
            localStorage.removeItem('token');

            // Do not force redirect if we are simply checking the current user status
            if (error.config?.url?.includes('/auth/me')) {
                return Promise.reject(error);
            }

            if (window.location.pathname.startsWith('/admin')) {
                window.location.href = '/admin/login';
            } else {
                // Preserve the current path so the user can be redirected back after logging in
                const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
                window.location.href = `/auth/signin?callbackUrl=${currentPath}`;
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
