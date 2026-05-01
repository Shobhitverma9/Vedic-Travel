const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiServer = {
    getSetting: async (key: string) => {
        try {
            const response = await fetch(`${API_URL}/settings/${key}`, { 
                next: { revalidate: 60 } // Cache for 60 seconds
            });
            if (!response.ok) return null;
            return response.json();
        } catch (error) {
            console.error(`Error fetching setting ${key}:`, error);
            return null;
        }
    },

    getAllTours: async (params: Record<string, any> = {}) => {
        try {
            const url = new URL(`${API_URL}/tours`);
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    url.searchParams.append(key, String(value));
                }
            });

            const response = await fetch(url.toString(), { 
                next: { revalidate: 60 } // Cache for 60 seconds
            });
            if (!response.ok) return null;
            return response.json();
        } catch (error) {
            console.error('Error fetching tours:', error);
            return null;
        }
    }
};
