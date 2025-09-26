import axios from 'axios';
import { get, remove } from './localStorage/secureStore'; // Assuming you have a secure store utility



// Create an instance
const jawwedHttpClient = axios.create({
  baseURL: 'https://jawwed-api.runasp.net/api/',
  timeout: 10000,
});

// Add a request interceptor
jawwedHttpClient.interceptors.request.use(
    async config => {
      const AuthToken = await get('userToken'); // Fetch the token from secure storage
        if (AuthToken) {
            config.headers.Authorization = `Bearer ${AuthToken}`;
        }
      return config;
    },
    error => Promise.reject(error)
  );
  
// Add a response interceptor
jawwedHttpClient.interceptors.response.use(
  response => {
    // you can transform data here
    return response;
  },
  error => {
    // global error handling
    if (error.response?.status === 401) {
      // force logout, refresh token, etc.
    }
    return Promise.reject(error);
  }
);

// Usage
jawwedHttpClient.get('/users')
   .then(res => console.log(res.data))
   .catch(err => console.error(err));


export default jawwedHttpClient;