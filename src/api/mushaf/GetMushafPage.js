import axios from 'axios';

const API_BASE_URL = 'http://jawwed-api.runasp.net/api/mushaf/pages';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

// Fetch a specific page
export const fetchPage = async (pageNumber) => {
  try {
    const response = await api.get(`/${pageNumber}`);
    //console.log("API GOT DATA");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
