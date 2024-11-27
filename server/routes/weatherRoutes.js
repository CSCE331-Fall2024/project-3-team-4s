import express from 'express';
import { getWeather } from '../controllers/weatherController.js';

const router = express.Router();

router.get('/weather', getWeather); // Route to fetch weather data

export default router;
