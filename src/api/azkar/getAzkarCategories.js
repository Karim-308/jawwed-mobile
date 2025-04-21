// api/azkar.js
import axios from 'axios';

const API_BASE_URL = 'https://jawwed-api.runasp.net/api';

export const getAzkarCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Azkar/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Azkar categories:', error);
    throw error;
  }
};
