import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
  baseURL: 'http://10.0.2.2:5170/api/v1/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
  },
});

// Thêm interceptor để tự động thêm token vào mỗi request
instance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // Lấy token từ AsyncStorage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Thêm token vào header
      }
      return config;
    } catch (error) {
      console.log('Error getting token:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý response và lỗi
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.log('Error Response:', error.response.data);
      console.log('Error Status:', error.response.status);
      return Promise.reject(error);
    } else if (error.request) {
      console.log('No Response from server');
      return Promise.reject(new Error('No response from server'));
    } else {
      console.log('Request Error:', error.message);
      return Promise.reject(new Error(error.message));
    }
  }
);

export default instance;
