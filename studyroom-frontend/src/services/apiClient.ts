import axios, { CanceledError } from 'axios';
import { RootState, store } from '../store';
import { logOut, selectCurrentToken } from '../features/authSlice';

const apiClient = axios.create({
    baseURL: 'https://studyroom-app-latest.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('authToken');
        const state: RootState = store.getState();
        const token = selectCurrentToken(state);
        if (token) {
            config.headers.Authorization = token;
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
        // localStorage.removeItem('authToken');
        store.dispatch(logOut());
      }
      return Promise.reject(error);
    }
);

export default apiClient;
export { CanceledError }