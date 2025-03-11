import axios from 'axios';

/**
 * Fetches Tafsir text from the Jawwed API using Axios.
 * @param {string} verseKey - The verse key, e.g., "2:1"
 * @param {number} [mofasirID=1] - Tafsir source ID (default: 1)
 * @returns {Promise<string>} - The tafsir text from the API
 */
export default async function getTafsir(verseKey, mofasirID = 1) {
  try {

    const response = await axios.get(
      `https://jawwed-api.runasp.net/api/Tafsir/verse`,
      {
        params: {
          mofasirID, // Tafsir source (1, 2, or 3)
          chapter: verseKey, // Verse key
        },
        timeout: 5000, // Set timeout for network safety
      }
    );

    // Ensure the API response structure is valid
    if (response.status === 200 && response.data && response.data.text) {
        console.log(response.data.text);
      return response.data.text;
    }

    throw new Error('Invalid response format from Tafsir API');
  } catch (error) {
    console.error('getTafsir error:', error);
    return 'Error fetching Tafsir.';
  }
}
