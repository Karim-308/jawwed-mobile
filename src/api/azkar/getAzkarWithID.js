// src/api/azkar/getAzkarWithID.js
import axios from 'axios';

const API_BASE_URL = 'https://jawwed-api.runasp.net/api';

export const getAzkarWithID = async (categoryId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Azkar/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Azkar for category ${categoryId}:`, error);
    throw error;
  }
};
