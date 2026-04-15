import api from './client';

export const registerDriver = (payload) => api.post('/api/auth/ambulance/register', payload);
export const registerUser = (payload) => api.post('/api/auth/user/register', payload);
export const login = (payload) => api.post('/api/auth/login', payload);
