import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const MEDIA_URL = API_URL.replace(/\/api\/?$/, '');

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Profile APIs
export const profileAPI = {
  upsertProfile: (data) => api.post('/profiles/upsert', data),
  getProfile: (userId) => api.get(`/profiles/${userId}`),
  getAllProfiles: (interests) => api.get('/profiles', { params: { interests } }),
};

// Connection APIs
export const connectionAPI = {
  sendRequest: (data) => api.post('/connections/send', data),
  acceptRequest: (data) => api.post('/connections/accept', data),
  rejectRequest: (data) => api.post('/connections/reject', data),
  getPending: () => api.get('/connections/pending'),
};

// Chat APIs
export const chatAPI = {
  getChatList: () => api.get('/chats/list'),
  getMessages: (chatId, skip = 0, limit = 50) =>
    api.get(`/chats/${chatId}/messages`, { params: { skip, limit } }),
  searchMessages: (chatId, query) =>
    api.get('/chats/search', { params: { chatId, query } }),
  saveMessage: (data) => api.post('/chats/message', data),
  clearMessages: (chatId) => api.post(`/chats/${chatId}/clear`),
};

export default api;
