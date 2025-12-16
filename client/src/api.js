/apiimport axios from 'axios';

const API = axios.create({
  baseURL: 'https://blog-app-uf7w.onrender.com/api',
});

// Attach token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
