// /server/controllers/translateController.js
import { translate } from '../translateText.js';

const translateText = async (req, res) => {
  const { text, targetLanguage } = req.body;
  try {
    console.log('Translating text:', text); // Log the text to translate
    const translatedText = await translate(text, targetLanguage);
    res.json(translatedText);
  } catch (error) {
    console.error('Error translating text:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
};

export { translateText };