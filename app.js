const express = require('express');
const axios = require('axios');
const redis = require('redis');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

dotenv.config();

// Initialize Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});
redisClient.connect().catch(console.error);

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX // 100 requests per window
});

const app = express();
app.use(limiter);
app.use(express.json());

// Weather endpoint
app.get('/weather/:location', async (req, res) => {
  const { location } = req.params;

  try {
    // Check cache
    const cachedData = await redisClient.get(location);
    if (cachedData) {
      console.log('Serving from cache');
      return res.json(JSON.parse(cachedData));
    }

    // Fetch from 3rd party API
    const response = await axios.get(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${process.env.API_KEY}`
    );

    // Cache with 12-hour expiration
    await redisClient.set(location, JSON.stringify(response.data), { EX: 43200 });

    res.json(response.data);
  } catch (error) {
    // Error handling
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
