import axios, { CanceledError } from 'axios';
import { RootState, store } from '../store';
import { logOut, selectCurrentToken } from '../features/authSlice';

const apiClient = axios.create({
    // baseURL: 'https://studyroom-app-latest.onrender.com',
    baseURL: 'http://localhost:8090',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const state: RootState = store.getState();
        const token = selectCurrentToken(state);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("Token from apiCLIent:", token);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        store.dispatch(logOut());
      }
      return Promise.reject(error);
    }
);

export default apiClient;
export { CanceledError }