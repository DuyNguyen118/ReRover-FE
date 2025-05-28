import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8080/', // Update this with your Spring Boot backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important: This is required for cookies to be sent with requests
});

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., session expired)
      window.location.href = '/login.html';
    }
    return Promise.reject(error);
  }
);

// API methods
export const get = async (url, params = {}) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('GET request failed:', error);
    throw error;
  }
};

export const post = async (url, data = {}) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    console.error('POST request failed:', error);
    throw error;
  }
};

export const put = async (url, data = {}) => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    console.error('PUT request failed:', error);
    throw error;
  }
};

export const remove = async (url) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    console.error('DELETE request failed:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return document.cookie.split(';').some((cookie) => cookie.trim().startsWith('JSESSIONID='));
};

export default api;