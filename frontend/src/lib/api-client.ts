import axios from 'axios';

// Get base URL from environment or fallback to /api for MSW/relative requests
const baseURL = import.meta.env?.VITE_API_URL || '/api';

// Create axios instance
const apiClientInstance = axios.create({
    baseURL,
    withCredentials: true, // envoie les cookies (dont le refresh token HTTP-only) avec chaque requête
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to ensure URL has /v1/ prefix for backend compatibility
const ensureV1Prefix = (url: string): string => {
    if (url.startsWith('/api/')) {
        return url.replace('/api/', '/api/v1/');
    }
    if (url.startsWith('/')) {
        return `/api/v1${url}`;
    }
    return url;
};

// Intercept requests to add the Authorization token and ensure /v1/ prefix
apiClientInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ensure URL has /v1/ prefix for backend compatibility
    if (config.url) {
        config.url = ensureV1Prefix(config.url);
    }
    
    return config;
});

// Intercept responses to handle 401 token refresh mechanism
apiClientInstance.interceptors.response.use(
    (response) => {
        // Unwrap backend ApiResponse wrapper if present
        if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
            response.data = response.data.data;
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Le refresh token est dans le cookie HTTP-only, pas besoin de le lire depuis localStorage
                const response = await axios.post(`${baseURL}/api/v1/auth/refresh`, {}, {
                    withCredentials: true,
                });

                const { accessToken } = response.data;

                // Update local storage with new access token
                localStorage.setItem('accessToken', accessToken);

                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axios(originalRequest);

            } catch (refreshError) {
                // Failed refresh token logic -> clear and force logout
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const apiClient = apiClientInstance;
