import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const CITY = "College Station";
const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=imperial`;

/**
 * @module Utils
 */

/**
 * Fetches the current temperature in College Station
 * @async
 * @function currentWeather
 * @returns {Promise<number>} The current temperature in College Station
 */
const currentWeather = async () => {
  try {
    const response = await axios.get(BASE_URL);

    return response.data.main.temp.toFixed(0);
  } catch (error) {
    console.error(error);
  }
};

export { currentWeather };
