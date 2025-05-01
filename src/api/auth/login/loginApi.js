import axios from 'axios';
import { save } from '../../../utils/localStorage/secureStore'; // make sure this is using SecureStore correctly

const TOKEN_KEY = 'userToken';
const EMAIL_KEY = 'userEmail';
const NAME_KEY = 'userName';

export const loginWithGoogleToken = async (googleIdToken) => {
  try {
    const response = await axios.post(`https://jawwed-api.runasp.net/api/Auth/google-login`, {
      idToken: googleIdToken,
    });

    const { token, email, name } = response.data;

    // ✅ Save to SecureStore
    await save(TOKEN_KEY, token);
    await save(EMAIL_KEY, email);
    await save(NAME_KEY, name);

    console.log('✅ Saved to SecureStore:', { token, email, name });

    return { token, email, name };
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};
