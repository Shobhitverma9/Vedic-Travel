import apiClient from '../lib/api-client';

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface SendOTPData {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

export interface VerifyOTPData {
    name: string;
    email: string;
    emailOtp?: string;
    phone?: string;
    phoneOtp?: string;
    password: string;
}

export interface ResendOTPData {
    email: string;
    phone?: string;
    name: string;
    purpose: 'registration' | 'login';
}

export interface LoginWithOTPData {
    email: string;
    otp: string;
}

export const authService = {
    register: async (data: RegisterData) => {
        const response = await apiClient.post('/auth/register', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    // OTP-based registration flow
    sendRegistrationOTP: async (data: SendOTPData) => {
        const response = await apiClient.post('/auth/send-otp', data);
        return response.data;
    },

    verifyOTP: async (data: VerifyOTPData) => {
        const response = await apiClient.post('/auth/verify-otp', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    resendOTP: async (data: ResendOTPData) => {
        const response = await apiClient.post('/auth/resend-otp', data);
        return response.data;
    },

    login: async (data: LoginData) => {
        const response = await apiClient.post('/auth/login', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    // OTP-based login flow
    sendLoginOTP: async (email: string) => {
        const response = await apiClient.post('/auth/send-login-otp', { email });
        return response.data;
    },

    loginWithOTP: async (data: LoginWithOTPData) => {
        const response = await apiClient.post('/auth/login-with-otp', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    logout: async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            localStorage.removeItem('token');
        }
    },

    getCurrentUser: async () => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },

    googleLogin: (token: string) => {
        localStorage.setItem('token', token);
    },

    toggleWishlist: async (tourId: string) => {
        const response = await apiClient.post(`/users/wishlist/${tourId}`);
        return response.data;
    },

    updateProfile: async (data: any) => {
        const response = await apiClient.put('/users/profile', data);
        return response.data;
    },
};
