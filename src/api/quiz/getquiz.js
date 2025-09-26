import  jawwedHttpClient from '../../utils/httpclient';

export const getQuiz = async () => {
  const url = 'Quiz';
  try {
    const { data } = await jawwedHttpClient.get(url);
    return data;
  } catch (error) {
    console.error('❌ Error fetching quiz:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};
