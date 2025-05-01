// src/api/getquiz.js

import axios from 'axios';
import jawwedHttpClient from '../../utils/httpclient'; // Adjust the import path as necessary 

export const getQuiz = async () => {
  const url = 'Quiz'; // Adjust the URL as necessary
  try {
    const { data } = await jawwedHttpClient.request(url);
    console.log('Quiz data retrieved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
};
