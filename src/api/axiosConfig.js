import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // La URL de tu Spring Boot
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para agregar el Token automáticamente si existe
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;