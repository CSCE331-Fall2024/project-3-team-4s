// /server/utils/apiClient.js
import axios from 'axios';


const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const BASE_URL = 'https://translation.googleapis.com/language/translate/v2';

const translate = async (text, targetLanguage) => {
  console.log('Sending request to Google Translate API'); // Log before the request
  const response = await axios.post(BASE_URL, null, {
    params: {
      q: text,
      target: targetLanguage,
      key: API_KEY,
    },
  });
  console.log('Google API response:', response.data); // Log the response
  return response.data.data.translations[0].translatedText;
};


export { translate };