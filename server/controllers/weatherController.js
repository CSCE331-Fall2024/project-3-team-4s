import axios from 'axios';

const getWeather = async (req, res) => {
  try {
    const { city } = req.query; // city name can be passed as a query parameter
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Weather data fetch failed" });
  }
};

export { getWeather };
