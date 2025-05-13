import axios from 'axios';

const createReadingGoal = async () => {
  try {
    const goalData = {
      userId: null,
      title: "test mobile notifications",
      durationDays: 400,
      totalPages: 604,
      startPage: 1,
      reminderTime: "00:48:00"
    };

    const response = await axios.post(
      'https://jawwed-api.runasp.net/api/Goals',
      goalData,
      {
        headers: { 
          'Content-Type': 'application/json',
          // Add authorization header if needed:
          // 'Authorization': 'Bearer YOUR_TOKEN'
        },
        timeout: 5000
      }
    );

    console.log('Goal created successfully:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Failed to create goal:', error.response?.data || error.message);
    throw error;
  }
};

// Usage example:
// createReadingGoal().then(goal => console.log(goal)).catch(err => console.error(err));

export default createReadingGoal;