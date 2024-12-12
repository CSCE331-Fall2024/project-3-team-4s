import axios from "axios";

const API_KEY = import.meta.env.VITE_TRANSLATE_API_KEY;
const BASE_URL = import.meta.env.VITE_TRANSLATE_API_URL;

/**
 * @module Utils
 */

/**
 * Translates text to a specified target language
 * @async
 * @function translate
 * @param {string} text - The text to be translated
 * @param {string} targetLanguage - The target language code (e.g., 'en' for English, 'es' for Spanish)
 * @returns {Promise<string>} The translated text
 */
const translate = async (text, targetLanguage) => {
  try {
    const response = await axios.post(BASE_URL, null, {
      params: {
        q: text,
        target: targetLanguage,
        key: API_KEY,
      },
    });

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error(error);
  }
};

export { translate };
