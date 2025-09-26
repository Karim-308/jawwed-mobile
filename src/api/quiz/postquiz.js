// src/api/getquiz.js
import jawwedHttpClient from '../../utils/httpclient'; // Adjust the import path as necessary 

export const postQuiz = async (sessionId, answeredQuestionsObject) => {
  const url = 'Quiz/submit'; // Adjust the URL as necessary

  const requestBody = {
    quizSessionID: sessionId,
    answeredQuestions: answeredQuestionsObject
  };

  try {
    const { data } = await jawwedHttpClient.post(url, requestBody);
    //console.log('Quiz data retrieved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
};
