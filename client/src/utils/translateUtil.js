import axios from "axios";

const API_KEY = import.meta.env.VITE_TRANSLATE_API_KEY;
const BASE_URL = import.meta.env.VITE_TRANSLATE_API_URL;

const translate = async (text, targetLanguage) => {
  const response = await axios.post(BASE_URL, null, {
    params: {
      q: text,
      target: targetLanguage,
      key: API_KEY,
    },
  });

  return response.data.data.translations[0].translatedText;
};

export { translate };
