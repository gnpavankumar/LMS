import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    timeout: 10000,
});

// Request interceptor to proactively refresh the token
axiosInstance.interceptors.request.use(async (config) => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (accessToken) {
        const user = jwtDecode(accessToken);
        const isExpired = user.exp * 1000 < Date.now();

        if (isExpired && refreshToken) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/auth/token/refresh/', {
                    refresh: refreshToken,
                });
                const newAccessToken = response.data.access;

                // Update local storage with the new token
                localStorage.setItem("access_token", newAccessToken);

                // Update the request header with the new token
                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            } catch (refreshError) {
                // If refresh fails, log the user out
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        } else if (!isExpired) {
            // If the token is not expired, just attach it
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;